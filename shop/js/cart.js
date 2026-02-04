/**
 * ORGANIC HYPOSOLUTIONS - SHOPPING CART SYSTEM
 * File: /shop/js/cart.js
 * 
 * Features:
 * - Works with product-catalog.js (must be loaded first)
 * - Geographic restrictions (EPA products Utah-only)
 * - Automatic wholesale pricing (25+ units for 32oz, 10+ for 1gal)
 * - Shopify checkout integration
 * - Cross-tab synchronization
 * - State validation
 * 
 * Dependencies:
 * - product-catalog.js (must load before this file)
 * 
 * Last Updated: 2025-02-04
 */

(function() {
    'use strict';
    
    // =============================================================================
    // CONFIGURATION
    // =============================================================================
    
    const CART_STORAGE_KEY = 'ohsCart';
    const STATE_STORAGE_KEY = 'userState';
    const SHOPIFY_DOMAIN = 'organichyposolutions.myshopify.com'; // Update with your actual domain
    
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
            
            // Validate all items
            cartItems = cartItems.filter(item => validateCartItem(item));
            
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
            window.dispatchEvent(new Event('storage'));
            
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }
    
    /**
     * Validate cart item has required fields
     */
    function validateCartItem(item) {
        if (!item || !item.productId) {
            console.warn('Invalid cart item (no productId):', item);
            return false;
        }
        
        const product = window.PRODUCT_CATALOG[item.productId];
        if (!product) {
            console.warn('Product not found in catalog:', item.productId);
            return false;
        }
        
        return true;
    }
    
    /**
     * Add item to cart or update quantity if exists
     */
    window.addToCart = function(productId, quantity = 1) {
        const product = window.PRODUCT_CATALOG[productId];
        if (!product) {
            console.error('Product not found:', productId);
            showNotification('Product not found', 'error');
            return false;
        }
        
        // Check geographic restrictions
        const userState = getUserState();
        if (!isProductAvailableInState(productId, userState)) {
            showNotification(
                `${product.name} is only available in Utah. Please change your shipping state.`,
                'warning'
            );
            return false;
        }
        
        // Find existing item
        const existingIndex = cartItems.findIndex(item => item.productId === productId);
        
        if (existingIndex !== -1) {
            // Update existing item
            cartItems[existingIndex].quantity += quantity;
            recalculateItemPricing(cartItems[existingIndex]);
        } else {
            // Add new item
            const cartItem = {
                productId: productId,
                name: product.name,
                quantity: quantity,
                addedAt: new Date().toISOString()
            };
            
            recalculateItemPricing(cartItem);
            cartItems.push(cartItem);
        }
        
        saveCart();
        updateCartBadge();
        
        const pricingInfo = getPricingTier(product, quantity);
        const tierLabel = pricingInfo.isWholesale ? ' at Wholesale Price' : '';
        showNotification(`Added ${quantity}x ${product.name}${tierLabel} to cart!`, 'success');
        
        return true;
    };
    
    /**
     * Remove item from cart
     */
    window.removeFromCart = function(productId) {
        const initialLength = cartItems.length;
        cartItems = cartItems.filter(item => item.productId !== productId);
        
        if (cartItems.length < initialLength) {
            saveCart();
            updateCartBadge();
            showNotification('Item removed from cart', 'info');
            return true;
        }
        
        return false;
    };
    
    /**
     * Update item quantity
     */
    window.updateCartItemQuantity = function(productId, quantity) {
        const item = cartItems.find(item => item.productId === productId);
        if (!item) return false;
        
        if (quantity <= 0) {
            return removeFromCart(productId);
        }
        
        item.quantity = quantity;
        recalculateItemPricing(item);
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
        showNotification('Cart cleared', 'info');
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
    
    // =============================================================================
    // PRICING CALCULATIONS
    // =============================================================================
    
    /**
     * Recalculate item pricing based on quantity
     * Updates price, tier, variantId, and wholesale status
     */
    function recalculateItemPricing(cartItem) {
        const product = window.PRODUCT_CATALOG[cartItem.productId];
        if (!product) return;
        
        const pricingInfo = getPricingTier(product, cartItem.quantity);
        
        cartItem.price = pricingInfo.price;
        cartItem.tier = pricingInfo.tier;
        cartItem.variantId = pricingInfo.variantId;
        cartItem.isWholesale = pricingInfo.isWholesale;
        cartItem.wholesaleThreshold = product.wholesaleThreshold;
    }
    
    /**
     * Get pricing tier for a product based on quantity
     * Returns: { price, tier, variantId, isWholesale, savingsPerUnit }
     */
    function getPricingTier(product, quantity) {
        const threshold = product.wholesaleThreshold || 25;
        const isWholesale = quantity >= threshold;
        
        const price = isWholesale ? product.pricing.wholesale : product.pricing.retail;
        const tier = isWholesale ? 'wholesale' : 'retail';
        const variantId = product.shopifyVariants[tier];
        
        const savingsPerUnit = isWholesale 
            ? product.pricing.retail - product.pricing.wholesale 
            : 0;
        
        return {
            price: price,
            tier: tier,
            variantId: variantId,
            isWholesale: isWholesale,
            savingsPerUnit: savingsPerUnit
        };
    }
    
    // =============================================================================
    // GEOGRAPHIC RESTRICTIONS
    // =============================================================================
    
    /**
     * Get user's state from localStorage or prompt
     */
    function getUserState() {
        let state = localStorage.getItem(STATE_STORAGE_KEY);
        
        if (!state) {
            // Prompt user for state
            state = promptForState();
            if (state) {
                localStorage.setItem(STATE_STORAGE_KEY, state);
            }
        }
        
        return state || 'UNKNOWN';
    }
    
    /**
     * Prompt user to select their state
     */
    function promptForState() {
        // This would ideally be a modal, but for now use prompt
        const state = prompt('Please select your shipping state (2-letter code, e.g., UT, CA):');
        return state ? state.toUpperCase() : null;
    }
    
    /**
     * Check if product is available in given state
     */
    function isProductAvailableInState(productId, state) {
        if (typeof window.isProductAvailableInState === 'function') {
            // Use helper from product-catalog.js
            return window.isProductAvailableInState(productId, state);
        }
        
        // Fallback implementation
        const product = window.PRODUCT_CATALOG[productId];
        if (!product) return false;
        if (!product.restrictions) return true;
        if (!product.restrictions.states) return true;
        
        return product.restrictions.states.includes(state);
    }
    
    /**
     * Validate cart against user's state
     * Removes items that can't ship to user's state
     */
    window.validateCartForState = function(state) {
        const initialLength = cartItems.length;
        
        cartItems = cartItems.filter(item => {
            const available = isProductAvailableInState(item.productId, state);
            if (!available) {
                console.log('Removing restricted item:', item.name, 'for state:', state);
            }
            return available;
        });
        
        if (cartItems.length < initialLength) {
            saveCart();
            updateCartBadge();
            const removed = initialLength - cartItems.length;
            showNotification(
                `${removed} item(s) removed: Not available for shipping to ${state}`,
                'warning'
            );
            return false;
        }
        
        return true;
    };
    
    // =============================================================================
    // SHOPIFY CHECKOUT
    // =============================================================================
    
    /**
     * Proceed to Shopify checkout
     */
    window.proceedToCheckout = async function() {
        if (cartItems.length === 0) {
            showNotification('Your cart is empty', 'warning');
            return;
        }
        
        // Validate cart against user's state
        const userState = getUserState();
        if (!validateCartForState(userState)) {
            showNotification('Please review your cart and try again', 'error');
            return;
        }
        
        // Build Shopify checkout URL
        try {
            const checkoutUrl = buildShopifyCheckoutUrl();
            console.log('Redirecting to Shopify checkout:', checkoutUrl);
            
            // Redirect to Shopify
            window.location.href = checkoutUrl;
            
        } catch (error) {
            console.error('Error creating checkout:', error);
            showNotification('Unable to proceed to checkout. Please try again.', 'error');
        }
    };
    
    /**
     * Build Shopify checkout URL from cart items
     * Format: https://store.myshopify.com/cart/VARIANT_ID:QUANTITY,VARIANT_ID:QUANTITY
     */
    function buildShopifyCheckoutUrl() {
        const variants = cartItems.map(item => {
            return `${item.variantId}:${item.quantity}`;
        }).join(',');
        
        return `https://${SHOPIFY_DOMAIN}/cart/${variants}`;
    }
    
    // =============================================================================
    // UI UPDATES
    // =============================================================================
    
    /**
     * Update cart badge in navigation
     */
    function updateCartBadge() {
        const badge = document.getElementById('cartBadge');
        if (!badge) return;
        
        const itemCount = getCartItemCount();
        
        if (itemCount > 0) {
            badge.textContent = itemCount;
            badge.style.display = 'inline-block';
        } else {
            badge.style.display = 'none';
        }
    }
    
    /**
     * Display cart on cart.html page
     */
    window.displayCart = function() {
        const container = document.getElementById('cartContainer');
        if (!container) return;
        
        if (cartItems.length === 0) {
            container.innerHTML = `
                <div class="empty-cart text-center py-5">
                    <i class="fas fa-shopping-cart fa-4x mb-3 text-muted"></i>
                    <h3>Your cart is empty</h3>
                    <p class="text-muted">Add some products to get started!</p>
                    <a href="/products.html" class="btn btn-primary mt-3">Shop Products</a>
                </div>
            `;
            return;
        }
        
        let html = '<div class="cart-items">';
        let subtotal = 0;
        
        cartItems.forEach(item => {
            const product = window.PRODUCT_CATALOG[item.productId];
            if (!product) return;
            
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            const tierBadge = item.isWholesale 
                ? '<span class="badge bg-success">Wholesale</span>' 
                : '<span class="badge bg-primary">Retail</span>';
            
            html += `
                <div class="cart-item mb-3 p-3 border rounded">
                    <div class="row align-items-center">
                        <div class="col-md-6">
                            <h5>${item.name}</h5>
                            <p class="text-muted mb-1">${tierBadge} $${item.price.toFixed(2)} each</p>
                            ${item.isWholesale ? `<p class="text-success small mb-0">Wholesale pricing activated!</p>` : ''}
                        </div>
                        <div class="col-md-3">
                            <div class="input-group">
                                <button class="btn btn-outline-secondary" onclick="updateCartItemQuantity('${item.productId}', ${item.quantity - 1})">
                                    <i class="fas fa-minus"></i>
                                </button>
                                <input type="number" class="form-control text-center" value="${item.quantity}" 
                                       onchange="updateCartItemQuantity('${item.productId}', parseInt(this.value))" min="1">
                                <button class="btn btn-outline-secondary" onclick="updateCartItemQuantity('${item.productId}', ${item.quantity + 1})">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                            ${!item.isWholesale && item.wholesaleThreshold ? 
                                `<small class="text-muted">${item.wholesaleThreshold - item.quantity} more for wholesale</small>` : ''}
                        </div>
                        <div class="col-md-2 text-end">
                            <strong>$${itemTotal.toFixed(2)}</strong>
                        </div>
                        <div class="col-md-1 text-end">
                            <button class="btn btn-sm btn-danger" onclick="removeFromCart('${item.productId}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        
        // Add cart summary
        html += `
            <div class="cart-summary mt-4 p-4 bg-light rounded">
                <div class="d-flex justify-content-between mb-3">
                    <h4>Subtotal:</h4>
                    <h4>$${subtotal.toFixed(2)}</h4>
                </div>
                <p class="text-muted small">Shipping and taxes calculated at checkout</p>
                <button class="btn btn-primary btn-lg w-100" onclick="proceedToCheckout()">
                    Proceed to Checkout
                </button>
            </div>
        `;
        
        container.innerHTML = html;
    };
    
    // =============================================================================
    // NOTIFICATIONS
    // =============================================================================
    
    /**
     * Show notification to user
     */
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
    
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
            
            // Refresh cart display if on cart page
            if (typeof window.displayCart === 'function') {
                window.displayCart();
            }
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
