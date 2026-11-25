/**
 * ORGANIC HYPOSOLUTIONS — SHOPIFY STOREFRONT API CLIENT
 * File: /shop/js/shopify-client.js
 *
 * Centralized Storefront API wrapper. All Shopify communication flows through
 * this file. No other file should contain the Storefront token or make direct
 * Storefront API calls.
 *
 * Exports (on window):
 *   window.SHOPIFY_DOMAIN            — store domain string
 *   window.SHOPIFY_CLIENT_READY      — boolean, true once this file loads
 *   window.fetchInventory([ids])     — returns inventory cache object
 *   window.getInventoryStatus(id)    — returns status object for one product
 *   window.refreshInventory()        — force-refresh, bypasses cache
 *
 * Dependencies:
 *   - product-catalog.js must load BEFORE this file
 *     (provides window.PRODUCT_CATALOG, window.findProduct)
 *
 * Load order on cart pages:
 *   product-catalog.js → cart.js → shopify-client.js
 *
 * Load order on product pages:
 *   product-catalog.js → shopify-client.js
 *
 * Last Updated: 2026-03-08
 */

(function () {
    'use strict';

    // =========================================================================
    // CONFIGURATION
    // =========================================================================

    var CONFIG = {
        domain:     'npmv1h-8e.myshopify.com',
        token:      'e12e77295aa67c71613b6c8fb8a64bcd',
        apiVersion: '2025-10'
    };

    var ENDPOINT = 'https://' + CONFIG.domain + '/api/' + CONFIG.apiVersion + '/graphql.json';

    // Inventory cache — 5-minute TTL (per project instructions)
    var CACHE_TTL_MS = 5 * 60 * 1000;

    // A Storefront request that hasn't answered after this long counts as failed,
    // so the cart's stock check can never leave checkout stuck on
    // "Checking availability…" (unknown stock never blocks; Shopify confirms).
    var REQUEST_TIMEOUT_MS = 8000;
    function requestTimeout() {
        var t = Number(window.OHS_STOREFRONT_TIMEOUT_MS);   // test hook
        return isFinite(t) && t > 0 ? t : REQUEST_TIMEOUT_MS;
    }
    var inventoryCache = {};

    // Expose domain globally (cart.js fallback uses this)
    window.SHOPIFY_DOMAIN = CONFIG.domain;

    // =========================================================================
    // INTERNAL: GraphQL fetch helper
    // =========================================================================

    /**
     * Send a GraphQL query to the Storefront API.
     * @param {string} query   — GraphQL query or mutation string
     * @param {Object} [variables] — query variables
     * @returns {Promise<Object>} — parsed JSON response
     */
    function storefrontFetch(query, variables) {
        var body = { query: query };
        if (variables) {
            body.variables = variables;
        }

        var controller = typeof AbortController === 'function' ? new AbortController() : null;
        var timer;
        var timeout = new Promise(function (_, reject) {
            timer = setTimeout(function () {
                if (controller) { try { controller.abort(); } catch (e) { /* ignore */ } }
                reject(new Error('Storefront API timed out after ' + requestTimeout() + ' ms'));
            }, requestTimeout());
        });
        var request = fetch(ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type':                       'application/json',
                'X-Shopify-Storefront-Access-Token':  CONFIG.token
            },
            body: JSON.stringify(body),
            signal: controller ? controller.signal : undefined
        });

        return Promise.race([request, timeout])
        .then(function (response) {
            clearTimeout(timer);
            if (!response.ok) {
                throw new Error('Storefront API HTTP ' + response.status);
            }
            return response.json();
        })
        .then(function (json) {
            if (json.errors && json.errors.length) {
                console.error('Storefront GraphQL errors:', json.errors);
                throw new Error('Storefront GraphQL error: ' + json.errors[0].message);
            }
            return json;
        });
    }

    // Checkout: the old window.createCheckout (Storefront "checkoutCreate") was
    // removed Nov 2026 - Shopify retired that API in April 2025 and nothing calls
    // it. Checkout uses Shopify's cart link, built in cart.js proceedToCheckout().
    // Real subscriptions will need the Storefront Cart API (cartCreate) with
    // selling plans once the Shopify Subscriptions app is installed.

    // =========================================================================
    // INVENTORY (audit R04/R05) — the ONE stock client for the whole site
    // =========================================================================
    //
    // Cache: per product, with its own fetch time. Asking for products that
    // aren't cached (or are older than 5 minutes) fetches just those.
    //
    // Stock is judged per VARIANT (retail, retail subscription, wholesale,
    // wholesale subscription each have their own count in Shopify).
    //   availableForSale  true when Shopify will sell it: in stock, not tracked,
    //                     or "continue selling when out of stock" (backorder)
    //   quantityAvailable may be null (not tracked / not shared), or <= 0 while
    //                     still availableForSale (= backorder)
    //
    // Every answer says how sure it is:
    //   state: 'loading' | 'available' | 'low' | 'backorder' | 'unavailable'
    //          | 'unknown' (never fetched / fetch failed) | 'stale' (old data,
    //          refresh failed)
    // Unknown or stale never blocks a purchase; Shopify confirms at checkout.

    var inventoryState = { inFlight: null, lastError: null };

    function ttl() {
        var t = Number(window.OHS_INVENTORY_TTL_MS);   // test hook; normally 5 min
        return isFinite(t) && t >= 0 ? t : CACHE_TTL_MS;
    }
    function isFresh(entry) { return entry && !entry.failed && (Date.now() - entry.fetchedAt) < ttl(); }

    function variantsQuery() {
        return 'query getInventory($ids: [ID!]!) {\
            nodes(ids: $ids) {\
                ... on Product {\
                    id title availableForSale totalInventory\
                    variants(first: 100) {\
                        pageInfo { hasNextPage }\
                        edges { node { id title availableForSale quantityAvailable currentlyNotInStock sku } }\
                    }\
                }\
            }\
        }';
    }

    /**
     * Fetch stock for the given product IDs (default: every active catalog
     * product). Only missing or old entries are requested. Never rejects:
     * on failure, old entries are kept and marked stale.
     * @returns {Promise<Object>} the whole cache, keyed by product ID
     */
    window.fetchInventory = function (productIds) {
        if (!productIds || productIds.length === 0) {
            if (typeof window.PRODUCT_CATALOG === 'undefined') return Promise.resolve(inventoryCache);
            productIds = Object.values(window.PRODUCT_CATALOG)
                .filter(function (p) { return p.id && p.status !== 'coming-soon'; })
                .map(function (p) { return String(p.id); });
        }
        var wanted = productIds.map(String).filter(function (id) { return !isFresh(inventoryCache[id]); });
        if (!wanted.length) return Promise.resolve(inventoryCache);

        var gids = wanted.map(function (id) { return 'gid://shopify/Product/' + id; });
        var request = storefrontFetch(variantsQuery(), { ids: gids })
            .then(function (data) {
                if (!data || !data.data || !Array.isArray(data.data.nodes)) throw new Error('unexpected inventory response');
                var seen = {};
                data.data.nodes.forEach(function (product) {
                    if (!product || !product.id) return;
                    var id = product.id.replace('gid://shopify/Product/', '');
                    var variants = {};
                    ((product.variants && product.variants.edges) || []).forEach(function (edge) {
                        var v = edge && edge.node; if (!v || !v.id) return;
                        variants[v.id.replace('gid://shopify/ProductVariant/', '')] = {
                            available: v.availableForSale === true,
                            quantity:  typeof v.quantityAvailable === 'number' ? v.quantityAvailable : null,
                            sku:       v.sku || ''
                        };
                    });
                    inventoryCache[id] = {
                        title: product.title,
                        availableForSale: product.availableForSale === true,
                        totalInventory: typeof product.totalInventory === 'number' ? product.totalInventory : null,
                        variants: variants,
                        complete: !(product.variants && product.variants.pageInfo && product.variants.pageInfo.hasNextPage),
                        fetchedAt: Date.now(),
                        failed: false
                    };
                    seen[id] = true;
                });
                // Products Shopify didn't return are unknown, not "available"
                wanted.forEach(function (id) { if (!seen[id]) inventoryCache[id] = { missing: true, fetchedAt: Date.now(), failed: false, variants: {} }; });
                inventoryState.lastError = null;
                return inventoryCache;
            })
            .catch(function (err) {
                console.warn('shopify-client: stock check failed —', err && err.message);
                inventoryState.lastError = err && err.message || 'failed';
                wanted.forEach(function (id) { if (inventoryCache[id]) inventoryCache[id].failed = true; });
                return inventoryCache;
            })
            .then(function (cache) { inventoryState.inFlight = null; return cache; });
        inventoryState.inFlight = request;
        return request;
    };

    /** Force a fresh fetch of everything (or the given IDs), ignoring the 5-minute cache. */
    window.refreshInventory = function (productIds) {
        (productIds && productIds.length ? productIds.map(String) : Object.keys(inventoryCache)).forEach(function (id) {
            if (inventoryCache[id]) inventoryCache[id].fetchedAt = 0;
        });
        return window.fetchInventory(productIds);
    };

    function certainty(entry) {
        if (!entry) return inventoryState.inFlight ? 'loading' : 'unknown';
        if (entry.missing) return 'unknown';
        if (entry.failed || (Date.now() - entry.fetchedAt) >= ttl()) return 'stale';
        return 'fresh';
    }

    /**
     * Stock for ONE variant, optionally for a requested quantity.
     * @returns {{state, available, quantity, backorder, enough, known, message}}
     *   known: false when unknown/stale/loading (never block on that)
     *   enough: false only when we KNOW the quantity can't be filled
     */
    window.getVariantStatus = function (productId, variantId, requestedQty) {
        var entry = inventoryCache[String(productId)];
        var sure = certainty(entry);
        var v = entry && entry.variants ? entry.variants[String(variantId)] : null;
        var want = Number(requestedQty) || 1;
        if (sure === 'loading' || sure === 'unknown' || !v) {
            return { state: sure === 'loading' ? 'loading' : 'unknown', known: false, available: null, quantity: null, backorder: false, enough: true, message: '' };
        }
        var stale = sure === 'stale';
        var backorder = v.available && v.quantity !== null && v.quantity <= 0;
        var state, enough = true, message = '';
        if (!v.available) { state = 'unavailable'; enough = false; message = 'Out of stock'; }
        else if (backorder) { state = 'backorder'; message = 'Available to order'; }
        else if (v.quantity !== null && want > v.quantity) { state = v.quantity <= 5 ? 'low' : 'available'; enough = false; message = 'Only ' + v.quantity + ' available'; }
        else if (v.quantity !== null && v.quantity <= 5) { state = 'low'; message = 'Only ' + v.quantity + ' left'; }
        else { state = 'available'; }
        if (stale) return { state: 'stale', known: false, available: v.available, quantity: v.quantity, backorder: backorder, enough: true, lastKnown: state, message: '' };
        return { state: state, known: true, available: v.available, quantity: v.quantity, backorder: backorder, enough: enough, message: message };
    };

    /**
     * Badge-level status for a product card (uses its RETAIL one-time variant,
     * which is what a single "Add to Cart" buys). Same shape the pages used
     * before: { status, canPurchase, badgeClass, badgeText, quantity, message }.
     */
    window.getInventoryStatus = function (productId) {
        var product = window.findProduct ? window.findProduct(productId) : null;
        var variantId = product && product.shopifyVariants ? product.shopifyVariants.retail : null;
        var s = window.getVariantStatus(productId, variantId, 1);
        var base = { quantity: s.quantity, message: s.message, state: s.state };
        switch (s.state) {
            case 'unavailable': return Object.assign(base, { status: 'out-of-stock', canPurchase: false, badgeClass: 'bg-danger', badgeText: 'Out of Stock', quantity: 0 });
            case 'low':         return Object.assign(base, { status: 'low-stock', canPurchase: true, badgeClass: 'bg-warning text-dark', badgeText: 'Only ' + s.quantity + ' left!' });
            case 'backorder':   return Object.assign(base, { status: 'backorder', canPurchase: true, badgeClass: 'bg-info', badgeText: 'Available to order' });
            case 'available':   return Object.assign(base, { status: 'in-stock', canPurchase: true, badgeClass: 'bg-success', badgeText: 'In Stock' });
            default:            return Object.assign(base, { status: 'unknown', canPurchase: true, badgeClass: '', badgeText: '' });   // loading / unknown / stale: no badge, don't block
        }
    };

    /** True unless we KNOW the variant can't be sold (unknown counts as available). */
    window.isVariantAvailable = function (productId, variantId) {
        var s = window.getVariantStatus(productId, variantId, 1);
        return s.state !== 'unavailable';
    };

    /** Last stock-check error (null if the last check worked). */
    window.getInventoryError = function () { return inventoryState.lastError; };

    // =========================================================================
    // READY FLAG
    // =========================================================================

    window.SHOPIFY_CLIENT_READY = true;

    console.log('✅ shopify-client.js loaded');
    console.log('🏪 Store:', CONFIG.domain);
    console.log('📡 API version:', CONFIG.apiVersion);
    console.log('🔑 Token configured: ✅');

})();
