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
        return getCookie(STATE_COOKIE_NAME) || localStorage.getItem(STATE_STORAGE_KEY) || null;
    };

    /**
     * Set user's state — persists to cookie + localStorage
     */
    window.setUserState = function(state) {
        const upperState = state?.toUpperCase();
        setCookie(STATE_COOKIE_NAME, upperState, COOKIE_EXPIRY_DAYS);
        localStorage.setItem(STATE_STORAGE_KEY, upperState);
        console.log('📍 User state set to:', upperState);
        validateCartForState(upperState);
        window.dispatchEvent(new CustomEvent('stateChanged', { detail: { state: upperState } }));
        return upperState;
    };

    window.shouldShowStateSelector = function() {
        return !window.getUserState();
    };

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

            // Validate each item against the catalog, merge duplicates by variantId
            const mergedMap = new Map();
            rawItems.forEach(item => {
                const valid = validateCartItem(item);
                if (!valid) return;
                const key = valid.variantId; // unique key = variant (handles sub vs non-sub)
                if (mergedMap.has(key)) {
                    mergedMap.get(key).quantity += valid.quantity;
                    recalculateItemPricing(mergedMap.get(key));
                } else {
                    mergedMap.set(key, valid);
                }
            });

            cartItems = Array.from(mergedMap.values());
            saveCart();
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

        const quantity       = Math.max(1, parseInt(item.quantity) || 1);
        const isSubscription = item.isSubscription === true;
        const pricingInfo    = window.getPricingTier(product.id, quantity, isSubscription);

        return {
            productId:      product.id,
            variantId:      pricingInfo.variantId,
            name:           product.name,
            price:          pricingInfo.price,
            quantity:       quantity,
            sku:            product.skus[pricingInfo.tierKey],
            tier:           pricingInfo.tier,             // 'retail' | 'wholesale'
            type:           product.type,                 // 'epa-usda' | 'usda-only'
            isSubscription: isSubscription,
            image:          product.image,
            addedAt:        item.addedAt || new Date().toISOString()
        };
    }

    /**
     * Re-prices an existing cart item in place.
     * Reads item.isSubscription so the subscription flag is never lost.
     *
     * @param {Object} cartItem - Item from cartItems array (mutated in place)
     */
    function recalculateItemPricing(cartItem) {
        const pricingInfo      = window.getPricingTier(cartItem.productId, cartItem.quantity, cartItem.isSubscription);
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

        // Geographic restriction check
        const userState = window.getUserState();
        if (userState && !window.isProductAvailableInState(productId, userState)) {
            window.showNotification(
                `${product.name} is only available in Utah. Please change your shipping state.`,
                'warning'
            );
            return false;
        }

        const pricingInfo = window.getPricingTier(product.id, quantity, isSubscription);

        // Match on variantId so retail + subscription are stored separately
        const existingIndex = cartItems.findIndex(item => item.variantId === pricingInfo.variantId);

        if (existingIndex !== -1) {
            const existing = cartItems[existingIndex];
            const wasWholesale = existing.isWholesale;
            existing.quantity += quantity;
            recalculateItemPricing(existing);
            if (!wasWholesale && existing.isWholesale) {
                window.showNotification(`🎉 Wholesale pricing activated for ${product.name}!`, 'success');
            }
        } else {
            cartItems.push({
                productId:      product.id,
                variantId:      pricingInfo.variantId,
                name:           product.name,
                price:          pricingInfo.price,
                quantity:       quantity,
                sku:            product.skus[pricingInfo.tierKey],
                tier:           pricingInfo.tier,
                type:           product.type,
                isSubscription: isSubscription,
                image:          product.image,
                addedAt:        new Date().toISOString()
            });
        }

        saveCart();
        updateCartBadge();

        const tierLabel = pricingInfo.isWholesale ? ' at Wholesale Price' : '';
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
     * Remove a specific variant line item (e.g. only the subscription entry).
     *
     * @param {string} variantId - Shopify variant ID
     */
    window.removeVariantFromCart = function(variantId) {
        const before = cartItems.length;
        cartItems = cartItems.filter(item => item.variantId !== variantId);
        if (cartItems.length < before) {
            saveCart();
            updateCartBadge();
            window.showNotification('Item removed from cart', 'info');
            return true;
        }
        return false;
    };

    /**
     * Update quantity for a specific variant.
     * Pass quantity ≤ 0 to remove the item.
     *
     * @param {string}  variantId - Shopify variant ID
     * @param {number}  quantity  - New total quantity
     */
    window.updateCartItemQuantity = function(variantId, quantity) {
        const item = cartItems.find(item => item.variantId === variantId);
        if (!item) return false;

        if (quantity <= 0) {
            return window.removeVariantFromCart(variantId);
        }

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
    window.updateCartItemSubscription = function(variantId, isSubscription) {
        const item = cartItems.find(item => item.variantId === variantId);
        if (!item) return false;

        item.isSubscription = isSubscription;
        recalculateItemPricing(item);

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
     * Uses shopify-client.js createCheckout() if available,
     * falls back to the direct /cart/ URL method.
     */
    window.proceedToCheckout = async function() {
        if (cartItems.length === 0) {
            window.showNotification('Your cart is empty', 'warning');
            return;
        }

        // Geo-validate before checkout
        const userState = window.getUserState();
        if (userState && !validateCartForState(userState)) {
            window.showNotification('Please review your cart — some items are not available in your state.', 'error');
            return;
        }

        // Re-check cart still has items after geo-validation
        if (cartItems.length === 0) {
            window.showNotification('No eligible items remain in your cart.', 'warning');
            return;
        }

        try {
            window.showNotification('Preparing your secure checkout…', 'info');

            // Preferred: Storefront API via shopify-client.js
            if (typeof window.createCheckout === 'function') {
                const lineItems   = buildLineItems();
                const checkoutUrl = await window.createCheckout(lineItems);

                if (checkoutUrl) {
                    console.log('🛒 Shopify Storefront checkout URL:', checkoutUrl);
                    window.showNotification('Opening secure checkout…', 'success');
                    setTimeout(() => { window.location.href = checkoutUrl; }, 600);
                    return;
                }
                // Fall through to URL method if createCheckout returned nothing
                console.warn('⚠️ createCheckout returned no URL — falling back to cart URL method');
            }

            // Fallback: direct Shopify cart URL (still passes correct variant IDs)
            const domain    = window.SHOPIFY_DOMAIN || 'npmv1h-8e.myshopify.com';
            const variantStr = cartItems
                .filter(item => item.variantId && !item.variantId.includes('undefined'))
                .map(item => `${item.variantId}:${item.quantity}`)
                .join(',');

            if (!variantStr) throw new Error('No valid variant IDs in cart');

            const fallbackUrl = `https://${domain}/cart/${variantStr}`;
            console.log('🛒 Fallback checkout URL:', fallbackUrl);
            window.showNotification('Opening secure checkout…', 'success');
            setTimeout(() => { window.location.href = fallbackUrl; }, 600);

        } catch (error) {
            console.error('Checkout error:', error);
            window.showNotification('Unable to proceed to checkout. Please try again.', 'error');
        }
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
        notification.innerHTML = `
            <i class="fas fa-${iconMap[type] || 'info-circle'}"></i>
            <div style="flex:1;">${message}</div>
            <button onclick="this.parentElement.remove()"
                    style="background:none;border:none;color:white;cursor:pointer;padding:0;">
                <i class="fas fa-times"></i>
            </button>
        `;
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
