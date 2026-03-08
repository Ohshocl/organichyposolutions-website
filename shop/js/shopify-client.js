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
 *   window.createCheckout(lineItems) — returns checkout URL string or null
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
 * Cart item format consumed by createCheckout:
 *   [{ variantId: 'gid://shopify/ProductVariant/XXXXXXX', quantity: N }, ...]
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
    var inventoryCache = {};
    var lastFetchTimestamp = 0;

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

        return fetch(ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type':                       'application/json',
                'X-Shopify-Storefront-Access-Token':  CONFIG.token
            },
            body: JSON.stringify(body)
        })
        .then(function (response) {
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

    // =========================================================================
    // CHECKOUT CREATION
    // =========================================================================

    /**
     * Create a Shopify checkout via the Storefront API and return the
     * checkout URL. The caller (cart.js → proceedToCheckout) redirects
     * the browser to this URL.
     *
     * @param {Array} lineItems — array of { variantId, quantity }
     *        variantId must be a full GID string:
     *        'gid://shopify/ProductVariant/XXXXXXX'
     * @returns {Promise<string|null>} — checkout web URL, or null on failure
     */
    window.createCheckout = function (lineItems) {
        if (!lineItems || lineItems.length === 0) {
            console.warn('shopify-client: createCheckout called with empty lineItems');
            return Promise.resolve(null);
        }

        // Validate every line item has a proper GID
        var validItems = lineItems.filter(function (item) {
            return item.variantId &&
                   item.variantId.indexOf('gid://shopify/ProductVariant/') === 0 &&
                   item.quantity > 0;
        });

        if (validItems.length === 0) {
            console.error('shopify-client: no valid line items after filtering', lineItems);
            return Promise.resolve(null);
        }

        console.log('🛒 shopify-client: creating checkout with', validItems.length, 'line items');

        var mutation = '\
            mutation checkoutCreate($input: CheckoutCreateInput!) {\
                checkoutCreate(input: $input) {\
                    checkout {\
                        id\
                        webUrl\
                        totalPriceV2 {\
                            amount\
                            currencyCode\
                        }\
                        lineItems(first: 25) {\
                            edges {\
                                node {\
                                    title\
                                    quantity\
                                    variant {\
                                        id\
                                        title\
                                        priceV2 {\
                                            amount\
                                            currencyCode\
                                        }\
                                    }\
                                }\
                            }\
                        }\
                    }\
                    checkoutUserErrors {\
                        code\
                        field\
                        message\
                    }\
                }\
            }\
        ';

        var input = {
            lineItems: validItems.map(function (item) {
                return {
                    variantId: item.variantId,
                    quantity:  item.quantity
                };
            })
        };

        return storefrontFetch(mutation, { input: input })
            .then(function (data) {
                var result = data.data && data.data.checkoutCreate;

                if (!result) {
                    console.error('shopify-client: unexpected response shape', data);
                    return null;
                }

                // Check for user errors (invalid variant, out of stock, etc.)
                if (result.checkoutUserErrors && result.checkoutUserErrors.length > 0) {
                    result.checkoutUserErrors.forEach(function (err) {
                        console.error('Checkout error:', err.code, err.message, err.field);
                    });
                    // Surface the first error to the caller
                    var firstErr = result.checkoutUserErrors[0];
                    throw new Error('Checkout failed: ' + firstErr.message);
                }

                if (result.checkout && result.checkout.webUrl) {
                    console.log('✅ Checkout created:', result.checkout.webUrl);
                    console.log('💰 Total:', result.checkout.totalPriceV2.amount,
                                result.checkout.totalPriceV2.currencyCode);
                    return result.checkout.webUrl;
                }

                console.warn('shopify-client: checkout created but no webUrl returned');
                return null;
            })
            .catch(function (err) {
                console.error('shopify-client: createCheckout failed —', err);
                return null;
            });
    };

    // =========================================================================
    // INVENTORY FETCHING
    // =========================================================================

    /**
     * Fetch inventory for products from the Storefront API.
     * Results are cached in-memory for 5 minutes (not localStorage).
     *
     * @param {Array<string>} [productIds] — Shopify Product IDs to query.
     *        If omitted, queries ALL active products from PRODUCT_CATALOG.
     * @returns {Promise<Object>} — keyed by product ID:
     *          { [id]: { totalInventory, availableForSale, variants: { [variantId]: { available, quantity, sku } } } }
     */
    window.fetchInventory = function (productIds) {
        // Return cache if still fresh
        var now = Date.now();
        if ((now - lastFetchTimestamp) < CACHE_TTL_MS && Object.keys(inventoryCache).length > 0) {
            console.log('📦 shopify-client: returning cached inventory (' +
                        Math.round((now - lastFetchTimestamp) / 1000) + 's old)');
            return Promise.resolve(inventoryCache);
        }

        // Build list of GIDs to query
        if (!productIds || productIds.length === 0) {
            if (typeof window.PRODUCT_CATALOG === 'undefined') {
                console.warn('shopify-client: PRODUCT_CATALOG not loaded — cannot fetch inventory');
                return Promise.resolve({});
            }
            productIds = Object.values(window.PRODUCT_CATALOG)
                .filter(function (p) { return p.id && p.status !== 'coming-soon'; })
                .map(function (p) { return p.id; });
        }

        if (productIds.length === 0) {
            console.log('shopify-client: no product IDs to fetch inventory for');
            return Promise.resolve({});
        }

        var gids = productIds.map(function (id) {
            return 'gid://shopify/Product/' + id;
        });

        console.log('🔄 shopify-client: fetching inventory for', gids.length, 'products…');

        var query = '\
            query getInventory($ids: [ID!]!) {\
                nodes(ids: $ids) {\
                    ... on Product {\
                        id\
                        title\
                        availableForSale\
                        totalInventory\
                        variants(first: 20) {\
                            edges {\
                                node {\
                                    id\
                                    title\
                                    availableForSale\
                                    quantityAvailable\
                                    sku\
                                }\
                            }\
                        }\
                    }\
                }\
            }\
        ';

        return storefrontFetch(query, { ids: gids })
            .then(function (data) {
                var newCache = {};

                if (!data.data || !data.data.nodes) {
                    console.warn('shopify-client: unexpected inventory response', data);
                    return inventoryCache; // keep old cache
                }

                data.data.nodes.forEach(function (product) {
                    if (!product || !product.id) return;

                    var shopifyId = product.id.replace('gid://shopify/Product/', '');

                    var variantData = {};
                    if (product.variants && product.variants.edges) {
                        product.variants.edges.forEach(function (edge) {
                            var v = edge.node;
                            var vId = v.id.replace('gid://shopify/ProductVariant/', '');
                            variantData[vId] = {
                                available: v.availableForSale,
                                quantity:  v.quantityAvailable,
                                sku:       v.sku
                            };
                        });
                    }

                    newCache[shopifyId] = {
                        title:            product.title,
                        totalInventory:   product.totalInventory,
                        availableForSale: product.availableForSale,
                        variants:         variantData
                    };
                });

                inventoryCache    = newCache;
                lastFetchTimestamp = Date.now();

                console.log('✅ shopify-client: inventory cached for',
                            Object.keys(newCache).length, 'products');

                return inventoryCache;
            })
            .catch(function (err) {
                console.error('❌ shopify-client: inventory fetch failed —', err);
                return inventoryCache; // return stale cache on error
            });
    };

    // =========================================================================
    // INVENTORY STATUS HELPER
    // =========================================================================

    /**
     * Get a human-readable inventory status object for a single product.
     * Used by products.html to render stock badges.
     *
     * @param {string} productId — Shopify Product ID
     * @returns {Object} — { status, message, quantity, canPurchase, badgeClass, badgeText }
     */
    window.getInventoryStatus = function (productId) {
        var inventory = inventoryCache[productId];

        if (!inventory) {
            return {
                status:     'unknown',
                message:    '',
                quantity:   null,
                canPurchase: true,
                badgeClass: '',
                badgeText:  ''
            };
        }

        var qty = inventory.totalInventory;

        if (!inventory.availableForSale || qty <= 0) {
            return {
                status:     'out-of-stock',
                message:    'Out of Stock',
                quantity:   0,
                canPurchase: false,
                badgeClass: 'bg-danger',
                badgeText:  'Out of Stock'
            };
        }

        if (qty <= 5) {
            return {
                status:     'low-stock',
                message:    'Only ' + qty + ' left!',
                quantity:   qty,
                canPurchase: true,
                badgeClass: 'bg-warning text-dark',
                badgeText:  'Only ' + qty + ' left!'
            };
        }

        if (qty <= 20) {
            return {
                status:     'limited',
                message:    qty + ' in stock',
                quantity:   qty,
                canPurchase: true,
                badgeClass: 'bg-info',
                badgeText:  qty + ' in stock'
            };
        }

        return {
            status:     'in-stock',
            message:    'In Stock',
            quantity:   qty,
            canPurchase: true,
            badgeClass: 'bg-success',
            badgeText:  'In Stock'
        };
    };

    // =========================================================================
    // FORCE REFRESH (bypass cache)
    // =========================================================================

    /**
     * Force a fresh inventory fetch, ignoring the cache TTL.
     * @returns {Promise<Object>} — fresh inventory cache
     */
    window.refreshInventory = function () {
        lastFetchTimestamp = 0;
        return window.fetchInventory();
    };

    // =========================================================================
    // VARIANT AVAILABILITY CHECK
    // =========================================================================

    /**
     * Check whether a specific variant is available for purchase.
     * Useful for disabling "Add to Cart" on sold-out variants.
     *
     * @param {string} productId — Shopify Product ID
     * @param {string} variantId — Shopify Variant ID (numeric, not GID)
     * @returns {boolean}
     */
    window.isVariantAvailable = function (productId, variantId) {
        var inventory = inventoryCache[productId];
        if (!inventory || !inventory.variants) return true; // assume available if unknown

        var variant = inventory.variants[variantId];
        if (!variant) return true; // assume available if variant not in cache

        return variant.available && variant.quantity > 0;
    };

    // =========================================================================
    // READY FLAG
    // =========================================================================

    window.SHOPIFY_CLIENT_READY = true;

    console.log('✅ shopify-client.js loaded');
    console.log('🏪 Store:', CONFIG.domain);
    console.log('📡 API version:', CONFIG.apiVersion);
    console.log('🔑 Token configured: ✅');

})();
