/**
 * ORGANIC HYPOSOLUTIONS - SHOPPING CART SYSTEM
 * File: /shop/js/cart.js
 * 
 * Features:
 * - Works with product-catalog.js (must be loaded first)
 * - Geographic restrictions (EPA products Utah-only)
 * - Automatic wholesale pricing at quantity thresholds
 * - Shopify checkout integration
 * - Cross-tab synchronization
 * - State validation with cookie persistence
 * 
 * Dependencies:
 * - product-catalog.js (must load before this file)
 * 
 * Last Updated: 2025-02-03
 */

(function() {
    'use strict';
    
    // =============================================================================
    // CONFIGURATION
    // =============================================================================
    
    const CART_STORAGE_KEY = 'ohsCart';
    const STATE_STORAGE_KEY = 'userState';
    const STATE_COOKIE_NAME = 'ohs_user_state';
    const COOKIE_EXPIRY_DAYS = 365;
    
    // =============================================================================
    // CART STATE
    // =============================================================================
    
    let cartItems = [];
    
    // =============================================================================
    // INITIALIZATION
    // =============================================================================
    
    /**
     * Initialize cart system when page loads
     */
    function initCart() {
        console.log('🛒 Initializing OHS Cart System...');
        
        // Check dependencies
        if (!window.PRODUCT_CATALOG) {
            console.error('❌ CRITICAL: product-catalog.js must be loaded before cart.js!');
            return;
        }
        
        // Load cart from localStorage
        loadCart();
        
        // Update UI
        updateCartBadge();
        
        // Listen for storage events (cross-tab sync)
        window.addEventListener('storage', handleStorageChange);
        
        console.log('✅ Cart system initialized with', cartItems.length, 'items');
    }
    
    // =============================================================================
    // COOKIE HELPERS
    // =============================================================================
    
    /**
     * Set a cookie
     */
    function setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    }
    
    /**
     * Get a cookie value
     */
    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
    
    // =============================================================================
    // STATE MANAGEMENT
    // =============================================================================
    
    /**
     * Get user's state from cookie, localStorage, or return null
     */
    window.getUserState = function() {
        // Try cookie first (more persistent)
        let state = getCookie(STATE_COOKIE_NAME);
        
        // Fall back to localStorage
        if (!state) {
            state = localStorage.getItem(STATE_STORAGE_KEY);
        }
        
        return state || null;
    };
    
    /**
     * Set user's state (both cookie and localStorage)
     */
    window.setUserState = function(state) {
        const upperState = state?.toUpperCase();
        
        // Save to cookie (persistent across sessions)
        setCookie(STATE_COOKIE_NAME, upperState, COOKIE_EXPIRY_DAYS);
        
        // Also save to localStorage (backup)
        localStorage.setItem(STATE_STORAGE_KEY, upperState);
        
        console.log('📍 User state set to:', upperState);
        
        // Validate cart for new state
        validateCartForState(upperState);
        
        // Dispatch event for UI updates
        window.dispatchEvent(new CustomEvent('stateChanged', { detail: { state: upperState } }));
        
        return upperState;
    };
    
    /**
     * Check if state selector should be shown
     */
    window.shouldShowStateSelector = function() {
        return !window.getUserState();
    };
    
    // =============================================================================
    // CART MANAGEMENT FUNCTIONS
    // =============================================================================
    
    /**
     * Load cart from localStorage
     */
    function loadCart() {
        try {
            const stored = localStorage.getItem(CART_STORAGE_KEY);
            if (!stored) {
                cartItems = [];
                return;
            }
            
            const parsed = JSON.parse(stored);
            
            // Handle different cart formats
            if (Array.isArray(parsed)) {
                cartItems = parsed;
            } else if (typeof parsed === 'object') {
                // Convert object format to array
                cartItems = Object.entries(parsed).map(([productId, data]) => ({
                    productId: productId,
                    ...data
                }));
            } else {
                cartItems = [];
            }
            
            // Validate all items and merge duplicates
            const mergedItems = new Map();
            
            cartItems.forEach(item => {
                const validatedItem = validateCartItem(item);
                if (validatedItem) {
                    const existingItem = mergedItems.get(validatedItem.productId);
                    if (existingItem) {
                        existingItem.quantity += validatedItem.quantity;
                        recalculateItemPricing(existingItem);
                    } else {
                        mergedItems.set(validatedItem.productId, validatedItem);
                    }
                }
            });
            
            cartItems = Array.from(mergedItems.values());
            
            // Save merged cart
            saveCart();
            
            console.log('📦 Loaded', cartItems.length, 'items from cart');
            
        } catch (error) {
            console.error('Error loading cart:', error);
            cartItems = [];
        }
    }
    
    /**
     * Save cart to localStorage
     */
    function saveCart() {
        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
            
            // Trigger storage event for cross-tab sync
            window.dispatchEvent(new Event('cartUpdated'));
            
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }
    
    /**
     * Validate and normalize cart item
     */
    function validateCartItem(item) {
        if (!item || typeof item !== 'object') {
            return null;
        }
        
        // Try to find the product
        const identifier = item.productId || item.id || item.name;
        if (!identifier) return null;
        
        const product = window.findProduct(identifier);
        if (!product) {
            console.warn('Product not found in catalog:', identifier);
            return null;
        }
        
        const quantity = Math.max(1, parseInt(item.quantity) || 1);
        const pricingInfo = window.getPricingTier(product.id, quantity);
        
        return {
            productId: product.id,
            name: product.name,
            price: pricingInfo.price,
            quantity: quantity,
            variantId: pricingInfo.variantId,
            tier: pricingInfo.tier,
            isWholesale: pricingInfo.isWholesale,
            wholesaleThreshold: product.wholesaleThreshold,
            emoji: product.emoji,
            image: product.image,
            type: product.type,
            addedAt: item.addedAt || new Date().toISOString()
        };
    }
    
    /**
     * Add item to cart or update quantity if exists
     */
    window.addToCart = function(productId, quantity = 1) {
        const product = window.findProduct(productId);
        if (!product) {
            console.error('Product not found:', productId);
            window.showNotification('Product not found', 'error');
            return false;
        }
        
        // Check geographic restrictions
        const userState = window.getUserState();
        if (userState && !window.isProductAvailableInState(productId, userState)) {
            window.showNotification(
                `${product.name} is only available in Utah. Please change your shipping state.`,
                'warning'
            );
            return false;
        }
        
        // Find existing item
        const existingIndex = cartItems.findIndex(item => item.productId === product.id);
        
        if (existingIndex !== -1) {
            // Update existing item
            cartItems[existingIndex].quantity += quantity;
            recalculateItemPricing(cartItems[existingIndex]);
            
            // Check if wholesale activated
            const wasWholesale = cartItems[existingIndex].isWholesale;
            if (!wasWholesale && cartItems[existingIndex].isWholesale) {
                window.showNotification(
                    `🎉 Wholesale pricing activated for ${product.name}!`,
                    'success'
                );
            }
        } else {
            // Add new item
            const pricingInfo = window.getPricingTier(product.id, quantity);
            
            const cartItem = {
                productId: product.id,
                name: product.name,
                price: pricingInfo.price,
                quantity: quantity,
                variantId: pricingInfo.variantId,
                tier: pricingInfo.tier,
                isWholesale: pricingInfo.isWholesale,
                wholesaleThreshold: product.wholesaleThreshold,
                emoji: product.emoji,
                image: product.image,
                type: product.type,
                addedAt: new Date().toISOString()
            };
            
            cartItems.push(cartItem);
        }
        
        saveCart();
        updateCartBadge();
        
        const pricingInfo = window.getPricingTier(product.id, quantity);
        const tierLabel = pricingInfo.isWholesale ? ' at Wholesale Price' : '';
        window.showNotification(`Added ${quantity}x ${product.name}${tierLabel} to cart!`, 'success');
        
        return true;
    };
    
    /**
     * Remove item from cart
     */
    window.removeFromCart = function(productId) {
        const product = window.findProduct(productId);
        const id = product ? product.id : productId;
        
        const initialLength = cartItems.length;
        cartItems = cartItems.filter(item => item.productId !== id);
        
        if (cartItems.length < initialLength) {
            saveCart();
            updateCartBadge();
            window.showNotification('Item removed from cart', 'info');
            return true;
        }
        
        return false;
    };
    
    /**
     * Update item quantity
     */
    window.updateCartItemQuantity = function(productId, quantity) {
        const product = window.findProduct(productId);
        const id = product ? product.id : productId;
        
        const item = cartItems.find(item => item.productId === id);
        if (!item) return false;
        
        if (quantity <= 0) {
            return window.removeFromCart(id);
        }
        
        const wasWholesale = item.isWholesale;
        item.quantity = quantity;
        recalculateItemPricing(item);
        
        // Notify about wholesale status change
        if (!wasWholesale && item.isWholesale) {
            window.showNotification(`🎉 Wholesale pricing activated for ${item.name}!`, 'success');
        } else if (wasWholesale && !item.isWholesale) {
            window.showNotification(`Wholesale pricing removed. Add ${item.wholesaleThreshold - quantity} more for wholesale.`, 'warning');
        }
        
        saveCart();
        updateCartBadge();
        
        return true;
    };
    
    /**
     * Clear entire cart
     */
    window.clearCart = function() {
        cartItems = [];
        saveCart();
        updateCartBadge();
        window.showNotification('Cart cleared', 'info');
    };
    
    /**
     * Get cart items
     */
    window.getCartItems = function() {
        return [...cartItems]; // Return copy to prevent external modification
    };
    
    /**
     * Get cart total
     */
    window.getCartTotal = function() {
        return cartItems.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    };
    
    /**
     * Get cart item count
     */
    window.getCartItemCount = function() {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };
    
    /**
     * Get total wholesale savings
     */
    window.getCartWholesaleSavings = function() {
        return cartItems.reduce((total, item) => {
            if (item.isWholesale) {
                const product = window.findProduct(item.productId);
                if (product) {
                    const savings = (product.pricing.retail - product.pricing.wholesale) * item.quantity;
                    return total + savings;
                }
            }
            return total;
        }, 0);
    };
    
    // =============================================================================
    // PRICING CALCULATIONS
    // =============================================================================
    
    /**
     * Recalculate item pricing based on quantity
     */
    function recalculateItemPricing(cartItem) {
        const pricingInfo = window.getPricingTier(cartItem.productId, cartItem.quantity);
        
        cartItem.price = pricingInfo.price;
        cartItem.tier = pricingInfo.tier;
        cartItem.variantId = pricingInfo.variantId;
        cartItem.isWholesale = pricingInfo.isWholesale;
    }
    
    // =============================================================================
    // GEOGRAPHIC RESTRICTIONS
    // =============================================================================
    
    /**
     * Validate cart against user's state
     * Removes items that can't ship to user's state
     */
    function validateCartForState(state) {
        if (!state) return true;
        
        const initialLength = cartItems.length;
        const removedItems = [];
        
        cartItems = cartItems.filter(item => {
            const available = window.isProductAvailableInState(item.productId, state);
            if (!available) {
                removedItems.push(item.name);
            }
            return available;
        });
        
        if (cartItems.length < initialLength) {
            saveCart();
            updateCartBadge();
            
            window.showNotification(
                `${removedItems.length} item(s) removed: Not available for shipping to ${state}`,
                'warning'
            );
            return false;
        }
        
        return true;
    }
    
    window.validateCartForState = validateCartForState;
    
    // =============================================================================
    // SHOPIFY CHECKOUT
    // =============================================================================
    
    /**
     * Proceed to Shopify checkout
     */
    window.proceedToCheckout = async function() {
        if (cartItems.length === 0) {
            window.showNotification('Your cart is empty', 'warning');
            return;
        }
        
        // Validate cart against user's state
        const userState = window.getUserState();
        if (userState && !validateCartForState(userState)) {
            window.showNotification('Please review your cart and try again', 'error');
            return;
        }
        
        // Build Shopify checkout URL
        try {
            const checkoutUrl = buildShopifyCheckoutUrl();
            console.log('🛒 Redirecting to Shopify checkout:', checkoutUrl);
            
            window.showNotification('Opening secure checkout...', 'success');
            
            // Open in new tab
            setTimeout(() => {
                window.open(checkoutUrl, '_blank');
            }, 500);
            
        } catch (error) {
            console.error('Error creating checkout:', error);
            window.showNotification('Unable to proceed to checkout. Please try again.', 'error');
        }
    };
    
    /**
     * Build Shopify checkout URL from cart items
     * Format: https://store.myshopify.com/cart/VARIANT_ID:QUANTITY,VARIANT_ID:QUANTITY
     */
    function buildShopifyCheckoutUrl() {
        const variants = cartItems.map(item => {
            return `${item.variantId}:${item.quantity}`;
        }).filter(v => v && !v.includes('undefined'));
        
        if (variants.length === 0) {
            throw new Error('No valid variants in cart');
        }
        
        const domain = window.SHOPIFY_DOMAIN || 'npmv1h-8e.myshopify.com';
        return `https://${domain}/cart/${variants.join(',')}`;
    }
    
    // =============================================================================
    // UI UPDATES
    // =============================================================================
    
    /**
     * Update cart badge in navigation
     */
    function updateCartBadge() {
        const badges = document.querySelectorAll('#cartBadge, .cart-badge');
        const itemCount = window.getCartItemCount();
        
        badges.forEach(badge => {
            if (itemCount > 0) {
                badge.textContent = itemCount;
                badge.style.display = 'inline-block';
            } else {
                badge.style.display = 'none';
            }
        });
    }
    
    // =============================================================================
    // NOTIFICATIONS
    // =============================================================================
    
    /**
     * Show notification to user
     */
    window.showNotification = function(message, type = 'info') {
        // Check for existing notification container
        let container = document.getElementById('notificationContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notificationContainer';
            container.style.cssText = 'position: fixed; top: 100px; right: 20px; z-index: 9999;';
            document.body.appendChild(container);
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const iconMap = {
            success: 'check-circle',
            error: 'times-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        
        const colorMap = {
            success: 'linear-gradient(135deg, #22C55E, #16A34A)',
            error: 'linear-gradient(135deg, #EF4444, #DC2626)',
            warning: 'linear-gradient(135deg, #F59E0B, #D97706)',
            info: 'linear-gradient(135deg, #3B82F6, #2563EB)'
        };
        
        notification.style.cssText = `
            background: ${colorMap[type] || colorMap.info};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            margin-bottom: 10px;
            min-width: 300px;
            max-width: 400px;
            transform: translateX(450px);
            transition: transform 0.3s ease;
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        
        notification.innerHTML = `
            <i class="fas fa-${iconMap[type] || 'info-circle'}"></i>
            <div style="flex: 1;">${message}</div>
            <button onclick="this.parentElement.remove()" style="background: none; border: none; color: white; cursor: pointer; padding: 0;">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        container.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(450px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    };
    
    // =============================================================================
    // EVENT HANDLERS
    // =============================================================================
    
    /**
     * Handle storage changes (cross-tab sync)
     */
    function handleStorageChange(e) {
        if (e.key === CART_STORAGE_KEY) {
            loadCart();
            updateCartBadge();
            
            // Dispatch event for cart page to update
            window.dispatchEvent(new Event('cartUpdated'));
        }
    }
    
    // =============================================================================
    // AUTO-INITIALIZE
    // =============================================================================
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCart);
    } else {
        initCart();
    }
    
    console.log('✅ Cart.js loaded successfully');
    
})();
