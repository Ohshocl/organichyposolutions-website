// ===================================================================
// ORGANIC HYPOSOLUTIONS - CART.JS - SHOPIFY READY
// Updated for full product catalog and new cart.html integration
// ===================================================================

// Consistent localStorage key across all pages
const CART_STORAGE_KEY = 'ohsCart';

// FULL PRODUCT CATALOG - From your complete catalog
const PRODUCT_CATALOG = {
    // === USDA ORGANIC LINE (OHS) ===
    'ohs-3oz-disinfectant': {
        id: 'ohs-3oz-disinfectant',
        shopifyHandle: '3oz-organic-multi-surface-disinfectant',
        name: '3oz Organic Multi-Surface Disinfectant - USDA Certified Organic',
        description: 'Professional-grade hypochlorous acid (HOCl) disinfectant in convenient 3oz travel size.',
        sku: 'OHS-3OZ-DISINFECTANT',
        weight: 0.3,
        category: 'Personal Care',
        certifications: ['USDA Organic', 'EPA Registered'],
        pricing: {
            retail: 12.97,
            retailSubscription: 11.96,
            wholesale: 9.59,
            wholesaleSubscription: 8.83
        },
        wholesaleThreshold: 50,
        minOrder: 1000,
        type: 'organic',
        emoji: '🧴'
    },
    'ohs-32oz-cleaner': {
        id: 'ohs-32oz-cleaner',
        shopifyHandle: '32oz-organic-ready-to-use-cleaner',
        name: '32oz Organic Ready-to-Use Cleaner - USDA Certified Organic',
        description: 'Professional USDA Certified Organic hypochlorous acid cleaner for immediate use.',
        sku: 'OHS-32OZ-CLEANER',
        weight: 2.2,
        category: 'Ready-to-Use Products',
        certifications: ['USDA Organic', 'Health & Safety'],
        pricing: {
            retail: 21.80,
            retailSubscription: 20.10,
            wholesale: 16.13,
            wholesaleSubscription: 14.85
        },
        wholesaleThreshold: 50,
        minOrder: 500,
        type: 'organic',
        emoji: '🧽'
    },
    'ohs-1gal-solution': {
        id: 'ohs-1gal-solution',
        shopifyHandle: '1-gallon-organic-ready-to-use-solution',
        name: '1 Gallon Organic Ready-to-Use Solution - USDA Certified Organic',
        description: 'Large format USDA Certified Organic solution for professional applications.',
        sku: 'OHS-1GAL-SOLUTION',
        weight: 8.8,
        category: 'Ready-to-Use Products',
        certifications: ['USDA Organic', 'Professional Grade'],
        pricing: {
            retail: 37.28,
            retailSubscription: 34.37,
            wholesale: 27.57,
            wholesaleSubscription: 25.39
        },
        wholesaleThreshold: 50,
        minOrder: 440,
        type: 'organic',
        emoji: '🛢️'
    },
    'ohs-pet-solution': {
        id: 'ohs-pet-solution',
        shopifyHandle: '32oz-organic-pet-equine-solution',
        name: '32oz Organic 500ppm Pet+ & Equine Solution - USDA Certified Organic',
        description: 'Professional-grade organic solution safe for pets and equine care.',
        sku: 'OHS-32OZ-PET-SOLUTION',
        weight: 2.2,
        category: 'Pet Care',
        certifications: ['USDA Organic', 'Pet Safe'],
        pricing: {
            retail: 24.59,
            retailSubscription: 22.68,
            wholesale: 18.20,
            wholesaleSubscription: 16.76
        },
        wholesaleThreshold: 50,
        minOrder: 500,
        type: 'organic',
        emoji: '🐾'
    },
    'ohs-laundry-booster': {
        id: 'ohs-laundry-booster',
        shopifyHandle: '32oz-organic-laundry-booster',
        name: '32oz Organic Laundry Booster - USDA Certified Organic',
        description: 'Professional grade laundry sanitizer with USDA Organic certification.',
        sku: 'OHS-32OZ-LAUNDRY',
        weight: 2.2,
        category: 'Laundry Care',
        certifications: ['USDA Organic', 'Cleaning Supplies'],
        pricing: {
            retail: 23.86,
            retailSubscription: 22.00,
            wholesale: 17.64,
            wholesaleSubscription: 16.26
        },
        wholesaleThreshold: 50,
        minOrder: 500,
        type: 'organic',
        emoji: '👕'
    },
    // === EPA PREMIUM LINE (Hypo Company) ===
    'hc-premium-wipes': {
        id: 'hc-premium-wipes',
        shopifyHandle: 'professional-disinfecting-wipes',
        name: 'Professional Disinfecting Wipes - EPA Registered',
        description: 'EPA registered professional-grade cleaning wipes for commercial use.',
        sku: 'HC-WIPES-PRO',
        weight: 1.8,
        category: 'Cleaning Supplies',
        certifications: ['EPA Registered', 'Commercial Grade'],
        pricing: {
            retail: 28.45,
            retailSubscription: 26.18,
            wholesale: 24.29,
            wholesaleSubscription: 22.35
        },
        wholesaleThreshold: 25,
        minOrder: 300,
        type: 'premium',
        emoji: '🧻'
    },
    // === BUNDLE PRODUCTS ===
    'ohs-rtu-value-bundle': {
        id: 'ohs-rtu-value-bundle',
        shopifyHandle: 'ohs-organic-ready-to-use-value-bundle',
        name: 'OHS Organic Ready-to-Use Value Bundle - USDA Certified Organic',
        description: 'Complete organic cleaning bundle with convenient ready-to-use products.',
        sku: 'OHS-RTU-VALUE-BUNDLE',
        weight: 7.5,
        category: 'Bundle Kits',
        certifications: ['USDA Organic', 'Bundle Savings'],
        pricing: {
            retail: 73.92,
            retailSubscription: 68.18,
            wholesale: 54.70,
            wholesaleSubscription: 50.38
        },
        wholesaleThreshold: 12,
        minOrder: 300,
        type: 'organic',
        emoji: '📦'
    }
};

// PRICING & MARGIN CALCULATIONS (from your pricing sheet)
const PRICING_RULES = {
    volumeDiscount: 0.15, // 15% volume discount
    utahTaxRate: 0.0775,  // Utah tax rate 7.75%
    freeShippingThreshold: 50,
    subscriptionDiscounts: {
        monthly: 0.08,    // 8% monthly subscription discount
        quarterly: 0.10   // 10% quarterly subscription discount
    },
    wholesaleMargins: {
        organic: 0.286,   // 28.6% wholesale margin for organic line
        premium: 0.341    // 34.1% wholesale margin for premium line
    }
};

// ENHANCED CART FUNCTIONS
function saveCart() {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        updateCartBadge();
        console.log('💾 Cart saved:', cart);
    } catch (error) {
        console.error('❌ Error saving cart:', error);
    }
}

function loadCart() {
    try {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('❌ Error loading cart:', error);
        return [];
    }
}

function updateCartBadge() {
    const cartItems = loadCart();
    const badges = document.querySelectorAll('#cartBadge, [id*="cartBadge"]');
    const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
    
    badges.forEach(badge => {
        if (badge) {
            if (totalItems > 0) {
                badge.textContent = totalItems;
                badge.style.display = 'inline-block';
            } else {
                badge.style.display = 'none';
            }
        }
    });
    
    // Update item count text if exists
    const itemCount = document.getElementById('itemCount');
    if (itemCount) {
        itemCount.textContent = `${totalItems} items`;
    }
    
    console.log('🏷️ Cart badge updated:', totalItems);
}

// ENHANCED ADD TO CART - HANDLES BOTH LEGACY AND NEW FORMATS
function addToCart(productId, quantity = 1, productData = null) {
    let cart = loadCart();
    
    // Handle different input formats
    let itemToAdd;
    
    if (typeof productId === 'object') {
        // Called from products.html with full product data
        itemToAdd = productId;
        quantity = productId.quantity || 1;
    } else if (productData) {
        // Called with separate parameters
        itemToAdd = { ...productData, productId, quantity };
    } else if (PRODUCT_CATALOG[productId]) {
        // Called with catalog product ID
        const catalogProduct = PRODUCT_CATALOG[productId];
        itemToAdd = {
            productId: productId,
            name: catalogProduct.name,
            price: catalogProduct.pricing.retail,
            quantity: quantity,
            type: catalogProduct.type,
            emoji: catalogProduct.emoji,
            description: catalogProduct.description,
            certifications: catalogProduct.certifications,
            sku: catalogProduct.sku,
            fromCatalog: true
        };
    } else {
        // Fallback for legacy format
        itemToAdd = {
            productId: productId,
            quantity: quantity,
            name: 'Unknown Product',
            price: 0,
            type: 'unknown'
        };
    }
    
    // Find existing item
    const existingItemIndex = cart.findIndex(item => 
        item.productId === itemToAdd.productId || 
        (item.name && item.name === itemToAdd.name)
    );
    
    if (existingItemIndex >= 0) {
        // Update existing item
        cart[existingItemIndex].quantity += itemToAdd.quantity;
        console.log('📝 Updated existing cart item:', cart[existingItemIndex]);
    } else {
        // Add new item
        cart.push(itemToAdd);
        console.log('➕ Added new cart item:', itemToAdd);
    }
    
    // Save and update displays
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartBadge();
    
    // Trigger cart page update if on cart page
    if (typeof updateDisplay === 'function') {
        updateDisplay();
    }
    
    // Show notification if function exists
    if (typeof showCartNotification === 'function') {
        showCartNotification(itemToAdd.name, itemToAdd.quantity);
    }
    
    return cart;
}

// REMOVE FROM CART
function removeFromCart(productId) {
    let cart = loadCart();
    const originalLength = cart.length;
    
    cart = cart.filter(item => 
        item.productId !== productId && 
        item.name !== productId // Handle legacy format
    );
    
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartBadge();
    
    // Trigger cart page update if on cart page
    if (typeof updateDisplay === 'function') {
        updateDisplay();
    }
    
    console.log('🗑️ Removed from cart:', productId, 'Items removed:', originalLength - cart.length);
    return cart;
}

// UPDATE CART ITEM QUANTITY
function updateCartQuantity(productId, change) {
    let cart = loadCart();
    const item = cart.find(item => 
        item.productId === productId || 
        item.name === productId
    );
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            return removeFromCart(productId);
        }
        
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        updateCartBadge();
        
        // Trigger cart page update if on cart page
        if (typeof updateDisplay === 'function') {
            updateDisplay();
        }
        
        console.log('🔄 Updated quantity:', productId, 'new quantity:', item.quantity);
    }
    
    return cart;
}

// CLEAR ENTIRE CART
function clearCart() {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([]));
    updateCartBadge();
    
    // Trigger cart page update if on cart page
    if (typeof updateDisplay === 'function') {
        updateDisplay();
    }
    
    console.log('🧹 Cart cleared');
}

// CALCULATE CART TOTALS (using your pricing rules)
function calculateCartTotals() {
    const cart = loadCart();
    let subtotal = 0;
    let savings = 0;
    
    cart.forEach(item => {
        const itemTotal = (item.price || 0) * (item.quantity || 0);
        subtotal += itemTotal;
        
        // Calculate volume savings if from catalog
        if (item.fromCatalog && PRODUCT_CATALOG[item.productId]) {
            const catalogProduct = PRODUCT_CATALOG[item.productId];
            if (item.quantity >= catalogProduct.wholesaleThreshold) {
                const wholesalePrice = catalogProduct.pricing.wholesale;
                const retailPrice = catalogProduct.pricing.retail;
                savings += (retailPrice - wholesalePrice) * item.quantity;
            }
        }
    });
    
    const volumeDiscount = subtotal * PRICING_RULES.volumeDiscount;
    const finalDiscount = Math.max(volumeDiscount, savings);
    const taxableAmount = subtotal - finalDiscount;
    const tax = taxableAmount * PRICING_RULES.utahTaxRate;
    const total = subtotal - finalDiscount + tax;
    const shipping = subtotal >= PRICING_RULES.freeShippingThreshold ? 0 : 9.95;
    
    return {
        subtotal: subtotal,
        discount: finalDiscount,
        tax: tax,
        shipping: shipping,
        total: total + shipping,
        itemCount: cart.reduce((sum, item) => sum + (item.quantity || 0), 0)
    };
}

// GET CART SUMMARY FOR DISPLAY
function getCartSummary() {
    const cart = loadCart();
    const totals = calculateCartTotals();
    
    return {
        items: cart,
        totals: totals,
        isEmpty: cart.length === 0
    };
}

// SHOPIFY INTEGRATION HELPERS
function prepareShopifyCheckout(orderType = 'one-time') {
    const cart = loadCart();
    const checkoutData = {
        items: cart.map(item => ({
            variant_id: item.shopifyProductId || '', // To be populated when Shopify products are created
            quantity: item.quantity,
            properties: {
                'Order Type': orderType,
                'SKU': item.sku || item.productId,
                'Source': 'Website Cart'
            }
        })),
        note: `Order Type: ${orderType}`,
        attributes: {
            'source': 'website-cart',
            'order_type': orderType,
            'cart_created': new Date().toISOString()
        }
    };
    
    console.log('🛍️ Shopify checkout data prepared:', checkoutData);
    return checkoutData;
}

// SUBSCRIPTION HANDLING
function applySubscriptionPricing(type = 'monthly') {
    let cart = loadCart();
    const discount = PRICING_RULES.subscriptionDiscounts[type] || 0;
    
    cart = cart.map(item => {
        if (item.fromCatalog && PRODUCT_CATALOG[item.productId]) {
            const catalogProduct = PRODUCT_CATALOG[item.productId];
            const subscriptionPrice = catalogProduct.pricing.retailSubscription || 
                                    (catalogProduct.pricing.retail * (1 - discount));
            return {
                ...item,
                price: subscriptionPrice,
                originalPrice: catalogProduct.pricing.retail,
                subscriptionType: type
            };
        }
        return item;
    });
    
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartBadge();
    
    if (typeof updateDisplay === 'function') {
        updateDisplay();
    }
    
    console.log('📅 Subscription pricing applied:', type);
}

// SHOW CART NOTIFICATION (Enhanced)
function showCartNotification(productName, quantity) {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.cart-notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = 'alert alert-success position-fixed cart-notification';
    notification.style.cssText = `
        top: 20px; 
        left: 50%; 
        transform: translateX(-50%);
        z-index: 9999; 
        min-width: 350px; 
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        border: none;
        border-radius: 12px;
    `;
    
    const totals = calculateCartTotals();
    
    notification.innerHTML = `
        <div class="d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center">
                <i class="fas fa-check-circle me-2 text-success" style="font-size: 1.5rem;"></i>
                <div>
                    <strong>Added to cart!</strong><br>
                    <small>${productName} (${quantity}x) • ${totals.itemCount} items total</small>
                </div>
            </div>
            <div class="text-end">
                <div class="fw-bold">$${totals.total.toFixed(2)}</div>
                <a href="cart.html" class="btn btn-primary btn-sm mt-1">View Cart</a>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(-50%) translateY(-20px)';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// INITIALIZE CART ON PAGE LOAD
function initializeCart() {
    updateCartBadge();
    
    // Listen for storage changes (cart updates from other tabs)
    window.addEventListener('storage', function(e) {
        if (e.key === CART_STORAGE_KEY) {
            updateCartBadge();
            
            if (typeof updateDisplay === 'function') {
                updateDisplay();
            }
        }
    });
    
    console.log('✅ Cart system initialized');
    console.log('📦 Product catalog loaded:', Object.keys(PRODUCT_CATALOG).length, 'products');
}

// EXPOSE FUNCTIONS GLOBALLY
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.clearCart = clearCart;
window.getCartSummary = getCartSummary;
window.calculateCartTotals = calculateCartTotals;
window.prepareShopifyCheckout = prepareShopifyCheckout;
window.applySubscriptionPricing = applySubscriptionPricing;
window.showCartNotification = showCartNotification;
window.PRODUCT_CATALOG = PRODUCT_CATALOG;

// AUTO-INITIALIZE
document.addEventListener('DOMContentLoaded', function() {
    initializeCart();
});

console.log('✅ Enhanced cart.js loaded with full product catalog integration!');
