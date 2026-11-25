/**
 * ORGANIC HYPOSOLUTIONS - SHOPPING CART SYSTEM
 * File: /shop/js/cart.js
 *
 * Features:
 * - Works with product-catalog.js (must be loaded first)
 * - Geographic restrictions (EPA products Utah-only)
 * - Automatic wholesale pricing at quantity thresholds
 * - Subscription variant support (all 4 tiers: retail, retailSub, wholesale, wholesaleSub)
 * - Shopify checkout via Storefront API (shopify-client.js)
 * - Cross-tab synchronization
 * - State validation with cookie persistence
 *
 * Dependencies:
 * - product-catalog.js (must load before this file)
 * - shopify-client.js (must load before this file for checkout)
 *
 * Cart item format:
 * { productId, variantId, name, price, quantity, sku, tier, type, isSubscription, image }
 *
 * Storage key: ohsCart (array format — NEVER cartItems, NEVER object format)
 *
 * Last Updated: 2026-03-05
 */

(function() {
    'use strict';

    // =============================================================================
    // CONFIGURATION
    // =============================================================================

    const CART_STORAGE_KEY   = 'ohsCart';           // NEVER cartItems
    const STATE_STORAGE_KEY  = 'ohsUserState';      // matches geo-filter modal
    const STATE_COOKIE_NAME  = 'ohs_user_state';
    const COOKIE_EXPIRY_DAYS = 365;

    // =============================================================================
    // CART STATE
    // =============================================================================

    let cartItems = [];  // Always an array of cart item objects
    let removedInactive = [];  // names of saved-cart items dropped because they aren't for sale

    // =============================================================================
    // INITIALIZATION
    // =============================================================================

    function initCart() {
        console.log('🛒 Initializing OHS Cart System...');

        if (!window.PRODUCT_CATALOG) {
            console.error('❌ CRITICAL: product-catalog.js must be loaded before cart.js!');
            return;
        }

        loadCart();
        updateCartBadge();
        window.addEventListener('storage', handleStorageChange);

        console.log('✅ Cart system initialized with', cartItems.length, 'items');
    }

    // =============================================================================
    // COOKIE HELPERS
    // =============================================================================

    function setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    }

    function getCookie(name) {
        const nameEQ = name + '=';
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length);
        }
        return null;
    }

    // =============================================================================
    // STATE MANAGEMENT
    // =============================================================================

    /**
     * Get user's state from cookie or localStorage (ohsUserState key)
     */
    window.getUserState = function() {
        // Shared state module (global-scripts.js, audit R09) when the page has it
        if (window.OHSState) return window.OHSState.get();
        // Every state picker on the site (menu, homepage, products page) saves to
        // localStorage, so it wins. The cookie is kept in sync and only used as a fallback.
        let saved = null;
        try { saved = localStorage.getItem(STATE_STORAGE_KEY); } catch (e) { /* storage blocked */ }
        if (saved) {
            if (getCookie(STATE_COOKIE_NAME) !== saved) setCookie(STATE_COOKIE_NAME, saved, COOKIE_EXPIRY_DAYS);
            return saved;
        }
        return getCookie(STATE_COOKIE_NAME) || null;
    };

    /**
     * Set user's state — persists to cookie + localStorage
     */
    window.setUserState = function(state) {
        // Shared state module saves + fires 'stateChanged'; the listener below re-checks the cart
        if (window.OHSState) return window.OHSState.set(state);
        const upperState = state?.toUpperCase();
        setCookie(STATE_COOKIE_NAME, upperState, COOKIE_EXPIRY_DAYS);
        localStorage.setItem(STATE_STORAGE_KEY, upperState);
        validateCartForState(upperState);
        window.dispatchEvent(new CustomEvent('stateChanged', { detail: { state: upperState } }));
        return upperState;
    };

    // Whichever picker changed the state (menu, homepage, products page, another tab),
    // re-check the cart right away so Utah-only items are flagged immediately (audit R09).
    window.addEventListener('stateChanged', function(e) {
        if (!window.OHSState) return;   // the fallback path above already validated
        const state = e.detail && e.detail.state;
        if (state) { validateCartForState(state); updateCartBadge(); }
    });

    window.shouldShowStateSelector = function() {
        return !window.getUserState();
    };

    // =============================================================================
    // CART LINES — stable identity + quantity rules (audit R01, R07, R08)
    // A cart line is one product in one purchase mode (one-time or subscription).
    // Its lineId never changes; tier (retail/wholesale), variant and price are
    // always derived from the line's total quantity. Before, lines were matched by
    // variant ID, which changes when a wholesale threshold is crossed, so lines split
    // (e.g. 20 + 4 + 1 gave 24 wholesale + 1 retail instead of 25 wholesale).
    // =============================================================================

    const MAX_LINE_QTY = 999;   // same cap the cart page input uses

    function lineKey(productId, isSubscription) {
        return String(productId) + ':' + (isSubscription ? 'sub' : 'once');
    }

    /** Whole number 1..MAX_LINE_QTY, or null if invalid (0, negative, fraction, NaN, Infinity, text) */
    function parseQuantity(value) {
        if (typeof value === 'string' && value.trim() === '') return null;
        const n = Number(value);
        if (!Number.isFinite(n) || !Number.isInteger(n) || n < 1) return null;
        return n;
    }

    /** Find a line by lineId, then variantId, then productId (first line of that product) */
    function findLine(id) {
        if (id === undefined || id === null) return null;
        const key = String(id);
        return cartItems.find(item => item.lineId === key)
            || cartItems.find(item => String(item.variantId) === key)
            || cartItems.find(item => String(item.productId) === key)
            || null;
    }

    // =============================================================================
    // CART PERSISTENCE
    // =============================================================================

    function loadCart() {
        try {
            const stored = localStorage.getItem(CART_STORAGE_KEY);
            if (!stored) { cartItems = []; return; }

            const parsed = JSON.parse(stored);

            // Normalise to array — guard against any legacy object format
            const rawItems = Array.isArray(parsed)
                ? parsed
                : Object.entries(parsed).map(([productId, data]) => ({ productId, ...data }));

            // Validate each item against the catalog, merge duplicates by stable line key
            // (product + one-time/subscription), so old carts split by tier are rejoined
            const mergedMap = new Map();
            rawItems.forEach(item => {
                const valid = validateCartItem(item);
                if (!valid) return;
                const key = valid.lineId;
                if (mergedMap.has(key)) {
                    const line = mergedMap.get(key);
                    line.quantity = Math.min(MAX_LINE_QTY, line.quantity + valid.quantity);
                    recalculateItemPricing(line);
                } else {
                    mergedMap.set(key, valid);
                }
            });

            cartItems = Array.from(mergedMap.values());
            saveCart();
            if (removedInactive.length) {
                const names = removedInactive.splice(0);
                setTimeout(() => {
                    if (window.showNotification) window.showNotification(`${names.join(', ')} ${names.length > 1 ? 'are' : 'is'} not available right now and was removed from your cart.`, 'warning');
                }, 0);
            }
            console.log('📦 Loaded', cartItems.length, 'items from cart');

        } catch (error) {
            console.error('Error loading cart:', error);
            cartItems = [];
        }
    }

    function saveCart() {
        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }

    // =============================================================================
    // CART ITEM VALIDATION & NORMALISATION
    // =============================================================================

    /**
     * Validates an item against the product catalog and returns a normalised cart item.
     * Preserves isSubscription so subscriptions survive a page reload.
     *
     * @param {Object} item - Raw item from localStorage
     * @returns {Object|null} - Normalised cart item or null if invalid
     */
    function validateCartItem(item) {
        if (!item || typeof item !== 'object') return null;

        const identifier = item.productId || item.id || item.name;
        if (!identifier) return null;

        const product = window.findProduct(identifier);
        if (!product) {
            console.warn('Product not found in catalog:', identifier);
            return null;
        }
        // A product that is no longer (or not yet) for sale is dropped from a saved cart
        if (window.isProductActive && !window.isProductActive(product)) {
            removedInactive.push(product.name);
            return null;
        }

        // Bad stored quantities are recovered safely: whole number 1..999, else 1
        const parsedQty      = parseQuantity(Math.floor(Number(item.quantity)));
        const quantity       = Math.min(MAX_LINE_QTY, parsedQty || 1);
        const isSubscription = item.isSubscription === true;
        return buildLine(product, quantity, isSubscription, item.addedAt);
    }

    /** A complete cart line (every field set, so savings and badges work after reload) */
    function buildLine(product, quantity, isSubscription, addedAt) {
        const line = {
            lineId:         lineKey(product.id, isSubscription),
            productId:      product.id,
            name:           product.name,
            quantity:       quantity,
            type:           product.type,                 // 'epa' | 'usda-only' | 'non-registered'
            isSubscription: isSubscription,
            image:          product.image,
            addedAt:        addedAt || new Date().toISOString()
        };
        recalculateItemPricing(line);   // sets variantId, price, tier, tierKey, isWholesale, sku
        return line;
    }

    /**
     * Re-prices an existing cart item in place.
     * Reads item.isSubscription so the subscription flag is never lost.
     *
     * @param {Object} cartItem - Item from cartItems array (mutated in place)
     */
    function recalculateItemPricing(cartItem) {
        const pricingInfo      = window.getPricingTier(cartItem.productId, cartItem.quantity, cartItem.isSubscription);
        cartItem.lineId        = lineKey(cartItem.productId, cartItem.isSubscription);
        cartItem.price         = pricingInfo.price;
        cartItem.tier          = pricingInfo.tier;
        cartItem.tierKey       = pricingInfo.tierKey;
        cartItem.variantId     = pricingInfo.variantId;
        cartItem.isWholesale   = pricingInfo.isWholesale;

        // Keep SKU in sync with tier
        const product = window.findProduct(cartItem.productId);
        if (product) cartItem.sku = product.skus[pricingInfo.tierKey];
    }

    // =============================================================================
    // PUBLIC CART API
    // =============================================================================

    /**
     * Add a product to the cart.
     *
     * @param {string}  productId      - Shopify product ID
     * @param {number}  quantity       - Units to add (default 1)
     * @param {boolean} isSubscription - true if Subscribe & Save selected (default false)
     */
    window.addToCart = function(productId, quantity = 1, isSubscription = false) {
        const product = window.findProduct(productId);
        if (!product) {
            console.error('Product not found:', productId);
            window.showNotification('Product not found', 'error');
            return false;
        }

        // Only products that are for sale (status active + fully set up)
        if (window.isProductActive && !window.isProductActive(product)) {
            window.showNotification(`${product.name} is not available yet.`, 'warning');
            return false;
        }

        // Geographic restriction check
        const userState = window.getUserState();
        if (userState && !window.isProductAvailableInState(productId, userState)) {
            window.showNotification(
                `${product.name} is only available in Utah. Please change your shipping state.`,
                'warning'
            );
            return false;
        }

        const qty = parseQuantity(quantity);
        if (qty === null) {
            window.showNotification('Please enter a quantity of 1 or more.', 'warning');
            return false;
        }
        isSubscription = isSubscription === true;

        // One line per product + purchase mode; tier and variant follow the total quantity
        const key  = lineKey(product.id, isSubscription);
        let line   = cartItems.find(item => item.lineId === key);
        let wasWholesale = false;

        if (line) {
            wasWholesale = line.isWholesale === true;
            const total = line.quantity + qty;
            if (total > MAX_LINE_QTY) {
                window.showNotification(`The most we can take online is ${MAX_LINE_QTY} of one product. For larger orders, request a quote.`, 'warning');
                return false;
            }
            line.quantity = total;
            recalculateItemPricing(line);
        } else {
            if (qty > MAX_LINE_QTY) {
                window.showNotification(`The most we can take online is ${MAX_LINE_QTY} of one product. For larger orders, request a quote.`, 'warning');
                return false;
            }
            line = buildLine(product, qty, isSubscription);
            cartItems.push(line);
        }
        quantity = qty;

        saveCart();
        updateCartBadge();

        if (!wasWholesale && line.isWholesale && line.quantity > qty) {
            window.showNotification(`🎉 Wholesale pricing activated for ${product.name}!`, 'success');
        }
        const tierLabel = line.isWholesale ? ' at Wholesale Price' : '';
        const subLabel  = isSubscription ? ' (Subscribe & Save)' : '';
        window.showNotification(`Added ${quantity}x ${product.name}${tierLabel}${subLabel} to cart!`, 'success');

        return true;
    };

    /**
     * Remove ALL line items for a given productId from the cart.
     * If you need to remove a specific variant only, use removeVariantFromCart().
     */
    window.removeFromCart = function(productId) {
        const product = window.findProduct(productId);
        const id = product ? product.id : productId;

        const before = cartItems.length;
        cartItems = cartItems.filter(item => item.productId !== id);

        if (cartItems.length < before) {
            saveCart();
            updateCartBadge();
            window.showNotification('Item removed from cart', 'info');
            return true;
        }
        return false;
    };

    /**
     * Remove ONE cart line (audit R13). Accepts a lineId, or a variantId / productId
     * for older callers. Other lines of the same product are kept.
     */
    window.removeCartLine = function(lineIdOrVariant) {
        const line = findLine(lineIdOrVariant);
        if (!line) return false;
        cartItems = cartItems.filter(item => item !== line);
        saveCart();
        updateCartBadge();
        window.showNotification('Item removed from cart', 'info');
        return true;
    };

    /** Older name, kept for compatibility: removes the one line matching the id */
    window.removeVariantFromCart = function(variantId) {
        return window.removeCartLine(variantId);
    };

    /**
     * Update quantity for a specific variant.
     * Pass quantity ≤ 0 to remove the item.
     *
     * @param {string}  variantId - Shopify variant ID
     * @param {number}  quantity  - New total quantity
     */
    window.updateCartItemQuantity = function(lineIdOrVariant, quantity) {
        const item = findLine(lineIdOrVariant);
        if (!item) return false;

        // 0 (or a negative whole number) removes the line; anything else must be 1..999
        const n = Number(quantity);
        if (Number.isInteger(n) && n <= 0) {
            return window.removeCartLine(item.lineId);
        }
        if (parseQuantity(quantity) === null || n > MAX_LINE_QTY) {
            window.showNotification(`Please enter a quantity from 1 to ${MAX_LINE_QTY}.`, 'warning');
            return false;
        }
        quantity = n;

        const wasWholesale = item.isWholesale;
        item.quantity = quantity;
        recalculateItemPricing(item);

        if (!wasWholesale && item.isWholesale) {
            window.showNotification(`🎉 Wholesale pricing activated for ${item.name}!`, 'success');
        } else if (wasWholesale && !item.isWholesale) {
            const product = window.findProduct(item.productId);
            const threshold = product ? product.wholesaleThreshold : 25;
            window.showNotification(
                `Wholesale pricing removed. Add ${threshold - quantity} more for wholesale pricing.`,
                'warning'
            );
        }

        saveCart();
        updateCartBadge();
        return true;
    };

    /**
     * Toggle subscribe & save on a cart line item.
     * Swaps the variantId and reprices accordingly.
     *
     * @param {string}  variantId      - Current Shopify variant ID
     * @param {boolean} isSubscription - New subscription state
     */
    window.updateCartItemSubscription = function(lineIdOrVariant, isSubscription) {
        const item = findLine(lineIdOrVariant);
        if (!item) return false;
        isSubscription = isSubscription === true;

        // If a line already exists in the target mode, merge into it (one line per mode)
        const target = cartItems.find(other => other !== item && other.lineId === lineKey(item.productId, isSubscription));
        if (target) {
            target.quantity = Math.min(MAX_LINE_QTY, target.quantity + item.quantity);
            recalculateItemPricing(target);
            cartItems = cartItems.filter(other => other !== item);
        } else {
            item.isSubscription = isSubscription;
            recalculateItemPricing(item);
        }

        saveCart();
        updateCartBadge();

        const label = isSubscription ? 'Subscription activated' : 'Switched to one-time purchase';
        window.showNotification(label, 'info');
        return true;
    };

    window.clearCart = function() {
        cartItems = [];
        saveCart();
        updateCartBadge();
        window.showNotification('Cart cleared', 'info');
    };

    /** Returns a shallow copy of the cart array */
    window.getCartItems = function() { return [...cartItems]; };

    window.getCartTotal = function() {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    window.getCartItemCount = function() {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    window.getCartWholesaleSavings = function() {
        return cartItems.reduce((total, item) => {
            if (item.isWholesale) {
                const product = window.findProduct(item.productId);
                if (product) {
                    return total + (product.pricing.retail - item.price) * item.quantity;
                }
            }
            return total;
        }, 0);
    };

    // =============================================================================
    // GEOGRAPHIC RESTRICTIONS
    // =============================================================================

    /**
     * Validate entire cart against a state code.
     * Removes any EPA products if the state is not Utah.
     * Returns true if cart is clean, false if items were removed.
     *
     * @param {string} state - Two-letter state code
     */
    function validateCartForState(state) {
        if (!state) return true;

        const before       = cartItems.length;
        const removedNames = [];

        cartItems = cartItems.filter(item => {
            const available = window.isProductAvailableInState(item.productId, state);
            if (!available) removedNames.push(item.name);
            return available;
        });

        if (cartItems.length < before) {
            saveCart();
            updateCartBadge();
            window.showNotification(
                `${removedNames.length} item(s) removed — not available for shipping to ${state}`,
                'warning'
            );
            return false;
        }
        return true;
    }

    window.validateCartForState = validateCartForState;

    // =============================================================================
    // SHOPIFY CHECKOUT (via Storefront API)
    // =============================================================================

    /**
     * Build line items array for the Storefront API checkoutCreate mutation.
     * Each line item uses the correct variantId for the selected tier + subscription.
     */
    function buildLineItems() {
        return cartItems
            .filter(item => item.variantId && !item.variantId.includes('undefined'))
            .map(item => ({
                variantId: `gid://shopify/ProductVariant/${item.variantId}`,
                quantity:  item.quantity
            }));
    }

    /**
     * Proceed to Shopify checkout.
     *
     * Opens Shopify's secure checkout in a NEW TAB so the OHS site stays open.
     * Pass a tab opened earlier in the click handler (checkoutTab) so pop-up
     * blockers allow it; if no tab can be opened, checkout opens in this tab.
     *
     * Uses Shopify's cart permalink (https://<store>/cart/<variant>:<qty>,...).
     * The old Storefront checkoutCreate call was removed: Shopify retired that
     * API in April 2025, so it always failed and fell back to this same link.
     *
     * @returns {boolean} true if checkout was opened
     */
    window.proceedToCheckout = function(checkoutTab) {
        const closeTab = () => { try { if (checkoutTab && !checkoutTab.closed) checkoutTab.close(); } catch (e) {} };

        if (cartItems.length === 0) {
            window.showNotification('Your cart is empty', 'warning');
            closeTab();
            return false;
        }

        // Utah-only (EPA) items need a shipping state before checkout
        const userState = window.getUserState();
        const hasUtahOnly = cartItems.some(item => {
            const product = window.findProduct(item.productId);
            return product && product.type === 'epa';
        });
        if (!userState && hasUtahOnly) {
            window.showNotification('Please choose your shipping state. Some items in your cart ship to Utah only.', 'warning');
            if (typeof window.showStateModal === 'function') window.showStateModal();
            closeTab();
            return false;
        }

        // Geo-validate before checkout
        if (userState && !validateCartForState(userState)) {
            window.showNotification('Please review your cart — some items are not available in your state.', 'error');
            closeTab();
            return false;
        }

        // Re-check cart still has items after geo-validation
        if (cartItems.length === 0) {
            window.showNotification('No eligible items remain in your cart.', 'warning');
            closeTab();
            return false;
        }

        const domain     = window.SHOPIFY_DOMAIN || 'npmv1h-8e.myshopify.com';
        const variantStr = cartItems
            .filter(item => item.variantId && !String(item.variantId).includes('undefined'))
            .map(item => `${item.variantId}:${item.quantity}`)
            .join(',');

        if (!variantStr) {
            window.showNotification('Unable to proceed to checkout. Please try again.', 'error');
            closeTab();
            return false;
        }

        const checkoutUrl = `https://${domain}/cart/${variantStr}`;
        console.log('🛒 Checkout URL:', checkoutUrl);

        if (checkoutTab && !checkoutTab.closed) {
            try { checkoutTab.opener = null; } catch (e) { /* ignore */ }   // audit R06
            checkoutTab.location.href = checkoutUrl;
            window.showNotification('Secure checkout opened in a new tab. Your cart is still here if you need it.', 'success');
        } else {
            window.showNotification('Opening secure checkout…', 'success');
            setTimeout(() => { window.location.href = checkoutUrl; }, 600);
        }
        return true;
    };

    // =============================================================================
    // CART BADGE
    // =============================================================================

    function updateCartBadge() {
        const badges    = document.querySelectorAll('#cartBadge, .cart-badge');
        const itemCount = window.getCartItemCount();

        badges.forEach(badge => {
            if (itemCount > 0) {
                badge.textContent    = itemCount;
                badge.style.display  = 'inline-block';
            } else {
                badge.style.display = 'none';
            }
        });
    }

    // Expose so global-scripts.js can call it after nav template loads
    window.updateCartBadge = updateCartBadge;

    // =============================================================================
    // NOTIFICATIONS
    // =============================================================================

    window.showNotification = function(message, type = 'info') {
        let container = document.getElementById('notificationContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notificationContainer';
            container.style.cssText = 'position:fixed;top:100px;right:20px;z-index:9999;';
            document.body.appendChild(container);
        }

        const colorMap = {
            success: 'linear-gradient(135deg, #22C55E, #16A34A)',
            error:   'linear-gradient(135deg, #EF4444, #DC2626)',
            warning: 'linear-gradient(135deg, #F59E0B, #D97706)',
            info:    'linear-gradient(135deg, #3B82F6, #2563EB)'
        };
        const iconMap = {
            success: 'check-circle',
            error:   'times-circle',
            warning: 'exclamation-triangle',
            info:    'info-circle'
        };

        const notification = document.createElement('div');
        notification.style.cssText = `
            background:${colorMap[type] || colorMap.info};
            color:white;padding:1rem 1.5rem;border-radius:12px;
            box-shadow:0 8px 25px rgba(0,0,0,0.15);margin-bottom:10px;
            min-width:300px;max-width:400px;
            transform:translateX(450px);transition:transform 0.3s ease;
            display:flex;align-items:center;gap:10px;
        `;
        // Build with DOM nodes; the message is shown as plain text (any HTML is stripped)
        const icon = document.createElement('i');
        icon.className = `fas fa-${iconMap[type] || 'info-circle'}`;
        const text = document.createElement('div');
        text.style.flex = '1';
        text.textContent = String(message == null ? '' : message).replace(/<[^>]*>/g, '').trim();
        const close = document.createElement('button');
        close.type = 'button';
        close.setAttribute('aria-label', 'Close');
        close.style.cssText = 'background:none;border:none;color:white;cursor:pointer;padding:0;';
        close.innerHTML = '<i class="fas fa-times"></i>';
        close.addEventListener('click', () => notification.remove());
        notification.append(icon, text, close);
        container.appendChild(notification);

        setTimeout(() => { notification.style.transform = 'translateX(0)'; }, 10);
        setTimeout(() => {
            notification.style.transform = 'translateX(450px)';
            setTimeout(() => { if (notification.parentNode) notification.parentNode.removeChild(notification); }, 300);
        }, 5000);
    };

    // =============================================================================
    // CROSS-TAB SYNC
    // =============================================================================

    function handleStorageChange(e) {
        if (e.key === CART_STORAGE_KEY) {
            loadCart();
            updateCartBadge();
            window.dispatchEvent(new Event('cartUpdated'));
        }
    }

    // =============================================================================
    // AUTO-INITIALIZE
    // =============================================================================

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCart);
    } else {
        initCart();
    }

    console.log('✅ cart.js loaded successfully');

})();
