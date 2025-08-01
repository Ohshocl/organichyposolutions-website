/**
 * OHS Global Scripts - Core JavaScript functionality for all pages
 * File: /assets/js/global-scripts.js
 * Dependencies: Bootstrap 5.3.0, Font Awesome 6.0.0
 * Shopify Integration: Ready for API integration with shopify-client.js
 * Last Updated: August 2025
 * 
 * SHOPIFY INTEGRATION FEATURES:
 * - Compatible with existing cart.js and shopify-client.js
 * - Supports variant IDs and SKUs for Shopify products
 * - Automatic wholesale threshold detection (25+ items)
 * - GraphQL checkout creation through API endpoints
 * - Cross-browser cart synchronization
 * - Analytics tracking for Shopify events
 * - Fallback to local cart if Shopify unavailable
 */

console.log('🚀 OHS Global Scripts Loading... (Shopify-Ready Version)');

// ==========================================================================
// GLOBAL VARIABLES AND CONFIGURATION
// ==========================================================================

// Cart configuration
const CART_STORAGE_KEY = 'ohsCart';
const CART_BADGE_ID = 'cartBadge';

// Animation configuration
const ANIMATION_CONFIG = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

// ==========================================================================
// CART MANAGEMENT FUNCTIONS - SHOPIFY COMPATIBLE
// ==========================================================================

/**
 * Updates the cart badge count in the navigation
 * Compatible with both localStorage cart and Shopify cart structures
 */
function updateCartBadge() {
    const cartBadge = document.getElementById(CART_BADGE_ID);
    if (!cartBadge) return;

    try {
        // Try to get cart from multiple sources for compatibility
        let cart = {};
        let totalItems = 0;
        
        // Check for OHS cart format (current)
        const ohsCart = localStorage.getItem(CART_STORAGE_KEY);
        if (ohsCart) {
            cart = JSON.parse(ohsCart);
            // Calculate total items in OHS cart format
            for (const productId in cart) {
                if (cart[productId] && cart[productId].quantity) {
                    totalItems += cart[productId].quantity;
                }
            }
        }
        
        // Also check for legacy cartItems format for backward compatibility
        const legacyCart = localStorage.getItem('cartItems');
        if (legacyCart && !ohsCart) {
            const cartItems = JSON.parse(legacyCart);
            totalItems = Array.isArray(cartItems) ? cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0) : 0;
        }
        
        if (totalItems > 0) {
            cartBadge.textContent = totalItems;
            cartBadge.style.display = 'inline-block';
        } else {
            cartBadge.style.display = 'none';
        }
    } catch (error) {
        console.error('Error updating cart badge:', error);
        cartBadge.style.display = 'none';
    }
}

/**
 * Adds item to cart with Shopify-compatible structure
 * Supports both local cart and Shopify integration
 * @param {string} productId - Product identifier (handle or variant ID)
 * @param {string} productName - Product display name
 * @param {number} price - Product price
 * @param {string} emoji - Product emoji
 * @param {number} quantity - Quantity to add (default: 1)
 * @param {string} variantId - Shopify variant ID (optional)
 * @param {string} sku - Product SKU (optional)
 */
function addToCart(productId, productName, price, emoji = '🧽', quantity = 1, variantId = null, sku = null) {
    try {
        const cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || {};
        
        // Create Shopify-compatible cart item structure
        const cartItem = {
            name: productName,
            price: price,
            quantity: quantity,
            emoji: emoji,
            // Shopify-specific fields
            variantId: variantId || productId, // Use variantId if provided, fallback to productId
            sku: sku,
            handle: productId,
            // Additional metadata for wholesale logic
            originalPrice: price,
            addedAt: new Date().toISOString()
        };
        
        if (cart[productId]) {
            // Update existing item
            cart[productId].quantity += quantity;
            cart[productId].addedAt = new Date().toISOString(); // Update timestamp
        } else {
            // Add new item
            cart[productId] = cartItem;
        }
        
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        updateCartBadge();
        
        // Show success notification
        showNotification(`${emoji} ${productName} added to cart!`, 'success');
        
        // Track analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'add_to_cart', {
                'event_category': 'E-commerce',
                'event_label': productName,
                'value': price,
                'items': [{
                    'item_id': variantId || productId,
                    'item_name': productName,
                    'quantity': quantity,
                    'price': price
                }]
            });
        }
        
        // Trigger cart update event for other scripts
        window.dispatchEvent(new CustomEvent('cartUpdated', { 
            detail: { 
                productId, 
                cartItem, 
                totalItems: Object.values(cart).reduce((sum, item) => sum + item.quantity, 0) 
            } 
        }));
        
        console.log('Product added to cart:', productId, cartItem);
        return true;
    } catch (error) {
        console.error('Error adding to cart:', error);
        showNotification('Error adding item to cart', 'error');
        return false;
    }
}

/**
 * Get cart total for wholesale threshold checking
 * @return {number} Total quantity of items in cart
 */
function getCartTotalQuantity() {
    try {
        const cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || {};
        return Object.values(cart).reduce((sum, item) => sum + (item.quantity || 0), 0);
    } catch (error) {
        console.error('Error calculating cart total:', error);
        return 0;
    }
}

/**
 * Check if cart qualifies for wholesale pricing
 * @param {number} threshold - Wholesale threshold (default: 25)
 * @return {boolean} True if cart qualifies for wholesale
 */
function isWholesaleEligible(threshold = 25) {
    return getCartTotalQuantity() >= threshold;
}

/**
 * Get cart contents in Shopify-compatible format
 * @return {Array} Array of cart items formatted for Shopify
 */
function getShopifyCartItems() {
    try {
        const cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || {};
        return Object.entries(cart).map(([productId, item]) => ({
            variantId: item.variantId || productId,
            quantity: item.quantity || 1,
            properties: {
                productHandle: item.handle || productId,
                sku: item.sku,
                originalPrice: item.originalPrice
            }
        }));
    } catch (error) {
        console.error('Error getting Shopify cart items:', error);
        return [];
    }
}

// ==========================================================================
// BANNER MANAGEMENT
// ==========================================================================

/**
 * Closes the promotional banner with animation
 */
function closeBanner() {
    const banner = document.getElementById('promoBanner');
    if (!banner) return;
    
    banner.style.transform = 'translateY(-100%)';
    setTimeout(() => {
        banner.style.display = 'none';
    }, 300);
    
    // Store in localStorage so it stays closed for the session
    localStorage.setItem('promoBannerClosed', 'true');
    
    // Track banner close
    if (typeof gtag !== 'undefined') {
        gtag('event', 'banner_close', {
            'event_category': 'User Interaction',
            'event_label': 'Promotional Banner'
        });
    }
}

/**
 * Checks if banner should be shown on page load
 */
function checkBanner() {
    const banner = document.getElementById('promoBanner');
    if (banner && localStorage.getItem('promoBannerClosed') === 'true') {
        banner.style.display = 'none';
    }
}

// ==========================================================================
// NAVIGATION AND SCROLLING
// ==========================================================================

/**
 * Initializes smooth scrolling for anchor links
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Mobile menu toggle functionality
 */
function initMobileMenu() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        // Close mobile menu when clicking on nav links
        navbarCollapse.addEventListener('click', function(e) {
            if (e.target.classList.contains('nav-link')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                    toggle: false
                });
                bsCollapse.hide();
            }
        });
    }
}

// ==========================================================================
// ANIMATIONS AND VISUAL EFFECTS
// ==========================================================================

/**
 * Initializes scroll-based animations using Intersection Observer
 */
function initAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('animate-in');
            }
        });
    }, ANIMATION_CONFIG);

    // Observe all cards and elements for animation
    const animatedElements = document.querySelectorAll(`
        .service-card, 
        .standard-card, 
        .process-step, 
        .product-line-card,
        .card,
        .hero-stats,
        .feature-card
    `);
    
    animatedElements.forEach(element => {
        // Set initial state for animation
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        observer.observe(element);
    });
}

// ==========================================================================
// NOTIFICATION SYSTEM
// ==========================================================================

/**
 * Shows a notification to the user
 * @param {string} message - Message to display
 * @param {string} type - Type of notification (success, error, info, warning)
 * @param {number} duration - Duration in milliseconds (default: 3000)
 */
function showNotification(message, type = 'info', duration = 3000) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.ohs-notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `ohs-notification alert alert-${type === 'error' ? 'danger' : type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        max-width: 400px;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    // Set icon based on type
    let icon = '';
    switch (type) {
        case 'success':
            icon = '<i class="fas fa-check-circle me-2"></i>';
            break;
        case 'error':
            icon = '<i class="fas fa-exclamation-triangle me-2"></i>';
            break;
        case 'warning':
            icon = '<i class="fas fa-exclamation-circle me-2"></i>';
            break;
        default:
            icon = '<i class="fas fa-info-circle me-2"></i>';
    }
    
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            ${icon}
            <span>${message}</span>
            <button type="button" class="btn-close ms-auto" aria-label="Close"></button>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Auto remove
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, duration);
    
    // Manual close
    notification.querySelector('.btn-close').addEventListener('click', () => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
}

// ==========================================================================
// SHOPIFY INTEGRATION FUNCTIONS
// ==========================================================================

/**
 * Initialize Shopify integration if available
 * Works with existing shopify-client.js and API endpoints
 */
function initShopifyIntegration() {
    // Check if Shopify client is available
    if (typeof window.shopifyIntegration !== 'undefined') {
        console.log('🛍️ Shopify integration detected and ready');
        
        // Listen for Shopify-specific events
        window.addEventListener('shopifyCheckoutReady', function(event) {
            console.log('✅ Shopify checkout ready:', event.detail);
        });
        
        window.addEventListener('shopifyError', function(event) {
            console.error('❌ Shopify error:', event.detail);
            showNotification('Shopify service temporarily unavailable', 'warning');
        });
        
        return true;
    } else {
        console.log('📦 Running in local cart mode (Shopify not connected)');
        return false;
    }
}

/**
 * Enhanced add to cart function that works with Shopify API
 * Falls back to local storage if Shopify is not available
 * @param {string} productId - Product handle
 * @param {string} productName - Product name
 * @param {number} price - Product price
 * @param {string} emoji - Product emoji
 * @param {number} quantity - Quantity to add
 * @param {Object} options - Additional options (variantId, sku, etc.)
 */
function addToCartWithShopify(productId, productName, price, emoji = '🧽', quantity = 1, options = {}) {
    // Try Shopify integration first if available
    if (typeof window.shopifyIntegration !== 'undefined' && typeof window.addToCartFromProducts === 'function') {
        try {
            // Use existing Shopify cart function
            const result = window.addToCartFromProducts(productId, productName, price, quantity, options.variantId);
            
            if (result) {
                // Also update local cart for consistency
                addToCart(productId, productName, price, emoji, quantity, options.variantId, options.sku);
                return true;
            }
        } catch (error) {
            console.warn('Shopify add to cart failed, falling back to local cart:', error);
        }
    }
    
    // Fallback to local cart
    return addToCart(productId, productName, price, emoji, quantity, options.variantId, options.sku);
}

/**
 * Proceed to checkout - Shopify or local
 * Automatically chooses between Shopify checkout and local cart page
 */
function proceedToCheckout() {
    try {
        // Check if Shopify checkout is available
        if (typeof window.shopifyIntegration !== 'undefined' && typeof window.proceedToCheckout === 'function') {
            console.log('🛍️ Redirecting to Shopify checkout...');
            
            // Track checkout initiation
            if (typeof gtag !== 'undefined') {
                const cartItems = getShopifyCartItems();
                const totalValue = cartItems.reduce((sum, item) => sum + (item.properties.originalPrice * item.quantity), 0);
                
                gtag('event', 'begin_checkout', {
                    'currency': 'USD',
                    'value': totalValue,
                    'items': cartItems.map(item => ({
                        'item_id': item.variantId,
                        'item_name': item.properties.productHandle,
                        'quantity': item.quantity,
                        'price': item.properties.originalPrice
                    }))
                });
            }
            
            return window.proceedToCheckout();
        } else {
            // Fallback to local cart page
            console.log('📦 Redirecting to local cart page...');
            window.location.href = '/shop/cart.html';
            return true;
        }
    } catch (error) {
        console.error('Error proceeding to checkout:', error);
        showNotification('Error accessing checkout. Please try again.', 'error');
        
        // Ultimate fallback
        window.location.href = '/shop/cart.html';
        return false;
    }
}

/**
 * Get cart for display purposes
 * Returns cart in a consistent format regardless of storage method
 */
function getDisplayCart() {
    try {
        const cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || {};
        const cartArray = Object.entries(cart).map(([productId, item]) => ({
            id: productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            emoji: item.emoji || '🧽',
            variantId: item.variantId,
            sku: item.sku,
            total: item.price * item.quantity
        }));
        
        const totalQuantity = cartArray.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = cartArray.reduce((sum, item) => sum + item.total, 0);
        const isWholesale = isWholesaleEligible();
        
        return {
            items: cartArray,
            totalQuantity,
            totalPrice,
            isWholesale,
            wholesaleThreshold: 25
        };
    } catch (error) {
        console.error('Error getting display cart:', error);
        return {
            items: [],
            totalQuantity: 0,
            totalPrice: 0,
            isWholesale: false,
            wholesaleThreshold: 25
        };
    }
}

// ==========================================================================
// SERVICE BOOKING FUNCTIONS - ENHANCED
// ==========================================================================

/**
 * Opens residential service booking form with enhanced tracking
 */
function bookResidentialService() {
    try {
        // Enhanced analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'book_residential_service', {
                'event_category': 'Service Booking',
                'event_label': 'Residential Service',
                'custom_parameters': {
                    'cart_items': getCartTotalQuantity(),
                    'is_wholesale': isWholesaleEligible(),
                    'page_url': window.location.href
                }
            });
        }
        
        // Check if user has items in cart for upselling
        const cartQuantity = getCartTotalQuantity();
        let formUrl = 'https://docs.google.com/forms/d/1zSq8EoZG8xcQHYtjt5pBovLA3zitegR1aU_tcniZy40/viewform?entry.service_type=Residential&entry.source=Website';
        
        if (cartQuantity > 0) {
            formUrl += `&entry.cart_items=${cartQuantity}`;
            if (isWholesaleEligible()) {
                formUrl += '&entry.customer_type=Wholesale';
            }
        }
        
        // Open form
        window.open(formUrl, '_blank');
        
        // Show confirmation
        showNotification('🏠 Opening residential service booking form...', 'info', 2000);
        
    } catch (error) {
        console.error('Error opening residential booking form:', error);
        showNotification('Error opening booking form. Please try again.', 'error');
    }
}

/**
 * Opens commercial service booking form with enhanced tracking
 */
function bookCommercialService() {
    try {
        // Enhanced analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'book_commercial_service', {
                'event_category': 'Service Booking',
                'event_label': 'Commercial Service',
                'custom_parameters': {
                    'cart_items': getCartTotalQuantity(),
                    'is_wholesale': isWholesaleEligible(),
                    'page_url': window.location.href
                }
            });
        }
        
        // Check if user has items in cart for upselling
        const cartQuantity = getCartTotalQuantity();
        let formUrl = 'https://docs.google.com/forms/d/1zSq8EoZG8xcQHYtjt5pBovLA3zitegR1aU_tcniZy40/viewform?entry.service_type=Commercial&entry.source=Website';
        
        if (cartQuantity > 0) {
            formUrl += `&entry.cart_items=${cartQuantity}`;
            formUrl += '&entry.customer_type=Commercial'; // Commercial customers are typically wholesale
        }
        
        // Open form
        window.open(formUrl, '_blank');
        
        // Show confirmation
        showNotification('🏢 Opening commercial service booking form...', 'info', 2000);
        
    } catch (error) {
        console.error('Error opening commercial booking form:', error);
        showNotification('Error opening booking form. Please try again.', 'error');
    }
}

/**
 * Initiates phone call
 */
function callNow() {
    try {
        // Track call intent
        if (typeof gtag !== 'undefined') {
            gtag('event', 'phone_call', {
                'event_category': 'Contact',
                'event_label': 'Phone Call Initiated'
            });
        }
        
        window.open('tel:+18017125663');
    } catch (error) {
        console.error('Error initiating phone call:', error);
    }
}

// ==========================================================================
// FORM ENHANCEMENT
// ==========================================================================

/**
 * Enhances forms with validation and UX improvements
 */
function initFormEnhancements() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Add loading states to submit buttons
        form.addEventListener('submit', function(e) {
            const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Submitting...';
                
                // Re-enable after 5 seconds (fallback)
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }, 5000);
            }
        });
        
        // Add floating labels effect
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            if (input.placeholder) {
                input.addEventListener('focus', function() {
                    this.classList.add('focused');
                });
                
                input.addEventListener('blur', function() {
                    if (!this.value) {
                        this.classList.remove('focused');
                    }
                });
            }
        });
    });
}

// ==========================================================================
// UTILITY FUNCTIONS
// ==========================================================================

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @param {boolean} immediate - Execute immediately
 */
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

/**
 * Throttle function to limit function calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Check if element is in viewport
 * @param {Element} element - Element to check
 * @return {boolean} - True if element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ==========================================================================
// PERFORMANCE MONITORING
// ==========================================================================

/**
 * Log performance metrics
 */
function logPerformanceMetrics() {
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('🚀 Page Load Performance:', {
                    'DNS Lookup': perfData.domainLookupEnd - perfData.domainLookupStart,
                    'Connection': perfData.connectEnd - perfData.connectStart,
                    'Response': perfData.responseEnd - perfData.responseStart,
                    'DOM Complete': perfData.domComplete - perfData.navigationStart,
                    'Load Complete': perfData.loadEventEnd - perfData.navigationStart
                });
            }, 0);
        });
    }
}

// ==========================================================================
// INITIALIZATION
// ==========================================================================

/**
 * Initialize all global functionality including Shopify integration
 */
function initializeGlobalScripts() {
    console.log('🔧 Initializing OHS Global Scripts...');
    
    // Core functionality
    updateCartBadge();
    checkBanner();
    initSmoothScrolling();
    initMobileMenu();
    initAnimations();
    initFormEnhancements();
    
    // Initialize Shopify integration if available
    initShopifyIntegration();
    
    // Performance monitoring (development only)
    if (window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1')) {
        logPerformanceMetrics();
    }
    
    console.log('✅ OHS Global Scripts Initialized Successfully');
}

// ==========================================================================
// EVENT LISTENERS - ENHANCED FOR SHOPIFY
// ==========================================================================

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeGlobalScripts);

// Listen for cart updates from multiple sources
window.addEventListener('storage', function(e) {
    if (e.key === CART_STORAGE_KEY || e.key === 'cartItems') {
        updateCartBadge();
    }
});

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        updateCartBadge(); // Refresh cart badge when page becomes visible
    }
});

// Listen for custom cart events from Shopify integration
window.addEventListener('cartUpdated', function(e) {
    console.log('🛒 Cart updated:', e.detail);
    updateCartBadge();
});

// Listen for Shopify integration events
window.addEventListener('shopifyReady', function(e) {
    console.log('🛍️ Shopify integration ready:', e.detail);
    updateCartBadge(); // Sync cart badge with Shopify cart
});

// Handle window resize for responsive adjustments
window.addEventListener('resize', debounce(function() {
    // Recalculate any responsive elements if needed
    console.log('Window resized, adjusting responsive elements...');
}, 250));

// Listen for checkout completion (if user returns from Shopify)
window.addEventListener('focus', function() {
    // Check if cart should be cleared (user might have completed checkout)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('checkout') === 'success') {
        // Clear local cart after successful checkout
        localStorage.removeItem(CART_STORAGE_KEY);
        updateCartBadge();
        showNotification('🎉 Order completed successfully!', 'success', 5000);
    }
});

// ==========================================================================
// GLOBAL FUNCTION EXPOSURE - ENHANCED
// ==========================================================================

// Expose functions to global scope for use in inline scripts and other files
window.OHS = window.OHS || {};

// Core functions
window.OHS.updateCartBadge = updateCartBadge;
window.OHS.addToCart = addToCart;
window.OHS.addToCartWithShopify = addToCartWithShopify;
window.OHS.proceedToCheckout = proceedToCheckout;
window.OHS.getDisplayCart = getDisplayCart;
window.OHS.getCartTotalQuantity = getCartTotalQuantity;
window.OHS.isWholesaleEligible = isWholesaleEligible;
window.OHS.getShopifyCartItems = getShopifyCartItems;

// UI functions
window.OHS.closeBanner = closeBanner;
window.OHS.showNotification = showNotification;

// Service booking
window.OHS.bookResidentialService = bookResidentialService;
window.OHS.bookCommercialService = bookCommercialService;
window.OHS.callNow = callNow;

// Utility functions
window.OHS.debounce = debounce;
window.OHS.throttle = throttle;
window.OHS.isInViewport = isInViewport;

// Shopify integration
window.OHS.initShopifyIntegration = initShopifyIntegration;

// Legacy function names for backward compatibility with existing code
window.updateCartBadge = updateCartBadge;
window.addToCart = addToCart;
window.addToCartWithShopify = addToCartWithShopify;
window.proceedToCheckout = proceedToCheckout;
window.closeBanner = closeBanner;
window.bookResidentialService = bookResidentialService;
window.bookCommercialService = bookCommercialService;
window.callNow = callNow;

// Enhanced cart functions for integration
window.getDisplayCart = getDisplayCart;
window.getCartTotalQuantity = getCartTotalQuantity;
window.isWholesaleEligible = isWholesaleEligible;

console.log('🎉 OHS Global Scripts Loaded Successfully - Shopify Integration Ready');
