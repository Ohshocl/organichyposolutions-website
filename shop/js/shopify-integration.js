// ===================================================================
// SHOPIFY UNIFIED INTEGRATION - COMPLETE SOLUTION FOR OHS CART SYSTEM
// ===================================================================

// ===================================================================
// CONFIGURATION SECTION
// ===================================================================
const SHOPIFY_CONFIG = {
    // STORE SETTINGS - LOADED FROM GITHUB SECRETS VIA CONFIG FILE
    shopifyDomain: window.SHOPIFY_DOMAIN || 'organichyposolutions.myshopify.com',
    storefrontAccessToken: window.SHOPIFY_STOREFRONT_TOKEN || null,
    apiVersion: '2023-10',
    
    // CUSTOMER SETTINGS
    wholesaleThreshold: 25, // Minimum quantity for wholesale pricing
    customerGroups: {
        retail: 'retail',
        wholesale: 'wholesale'
    },
    
    // VARIANT SELECTION RULES
    variantSelection: {
        retail: 'retail',
        wholesale: 'wholesale',
        // Future: subscription variants available if needed
        retailSubscription: 'retailSubscription',
        wholesaleSubscription: 'wholesaleSubscription'
    },
    
    // ERROR MESSAGES
    messages: {
        initError: 'Failed to connect to Shopify. Please try again.',
        emptyCart: 'Your cart is empty. Please add some products first.',
        checkoutError: 'Sorry, there was an error processing your checkout. Please try again.',
        productMissing: 'Product information missing. Please refresh and try again.',
        connectionError: 'Unable to connect to checkout system. Please check your internet connection.',
        loadingCheckout: 'Creating secure checkout...',
        processingPayment: 'Processing...',
        configError: 'Shopify configuration not loaded. Please refresh the page.'
    },
    
    // DEBUGGING - Automatically set based on environment
    debug: window.SHOPIFY_DEBUG !== undefined ? window.SHOPIFY_DEBUG : true
};

// ===================================================================
// CONFIGURATION VALIDATION
// ===================================================================
function validateShopifyConfig() {
    const errors = [];
    
    if (!SHOPIFY_CONFIG.shopifyDomain) {
        errors.push('Shopify domain not configured');
    }
    
    if (!SHOPIFY_CONFIG.storefrontAccessToken) {
        errors.push('Storefront access token not configured');
    }
    
    if (!window.SHOPIFY_DOMAIN) {
        errors.push('SHOPIFY_DOMAIN not loaded from config');
    }
    
    if (!window.SHOPIFY_STOREFRONT_TOKEN) {
        errors.push('SHOPIFY_STOREFRONT_TOKEN not loaded from config');
    }
    
    if (errors.length > 0) {
        console.warn('⚠️ Shopify Configuration Issues:', errors);
        if (SHOPIFY_CONFIG.debug) {
            console.error('🚨 Configuration Error - Make sure shopify-config.js is loaded first!');
            alert('Shopify configuration error. Please contact support if this persists.');
        }
        return false;
    }
    
    if (SHOPIFY_CONFIG.debug) {
        console.log('✅ Shopify configuration validated');
        console.log('🏪 Store:', SHOPIFY_CONFIG.shopifyDomain);
        console.log('🔑 Token configured:', SHOPIFY_CONFIG.storefrontAccessToken ? '✅' : '❌');
    }
    return true;
}

// ===================================================================
// SHOPIFY INTEGRATION CLASS
// ===================================================================
class ShopifyIntegration {
    constructor(config = SHOPIFY_CONFIG) {
        this.config = config;
        this.shopifyDomain = config.shopifyDomain;
        this.storefrontAccessToken = config.storefrontAccessToken;
        this.apiVersion = config.apiVersion;
        this.isInitialized = false;
        this.customerType = 'retail';
        
        if (config.debug) {
            console.log('🔧 Shopify Integration initialized');
        }
    }
    
    // Initialize Shopify connection
    async initializeShopifyIntegration() {
        try {
            if (this.config.debug) {
                console.log('🔄 Initializing Shopify integration...');
            }
            
            // Validate configuration first
            if (!validateShopifyConfig()) {
                throw new Error('Configuration validation failed');
            }
            
            // Update config with loaded values
            this.shopifyDomain = window.SHOPIFY_DOMAIN;
            this.storefrontAccessToken = window.SHOPIFY_STOREFRONT_TOKEN;
            
            // Test API connection
            const response = await this.testConnection();
            const responseData = await response.json();
            
            if (response.ok && responseData.data && responseData.data.shop) {
                this.isInitialized = true;
                if (this.config.debug) {
                    console.log('✅ Shopify integration ready');
                    console.log('🏪 Connected to store:', responseData.data.shop.name);
                }
                return true;
            } else {
                throw new Error('Failed to connect to Shopify API');
            }
        } catch (error) {
            console.error('❌ Shopify initialization failed:', error);
            alert(this.config.messages.initError);
            return false;
        }
    }
    
    // Test Shopify API connection
    async testConnection() {
        const query = `
            query {
                shop {
                    name
                    currencyCode
                }
            }
        `;
        return await this.makeGraphQLRequest(query);
    }
    
    // Determine customer type from existing cart.js logic
    getCustomerType() {
        // Use existing cart.js functions to determine wholesale eligibility
        if (typeof checkWholesaleThresholds === 'function') {
            const isWholesale = checkWholesaleThresholds();
            if (this.config.debug) {
                console.log(`🏷️ Customer type (from cart.js): ${isWholesale ? 'wholesale' : 'retail'}`);
            }
            this.customerType = isWholesale ? 'wholesale' : 'retail';
            return this.customerType;
        }
        
        // Fallback: check cart quantities manually using config threshold
        const cart = this.getCartItems();
        const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
        const isWholesale = totalQuantity >= this.config.wholesaleThreshold;
        
        if (this.config.debug) {
            console.log(`🏷️ Customer type (fallback): ${isWholesale ? 'wholesale' : 'retail'} (${totalQuantity} items)`);
        }
        
        this.customerType = isWholesale ? 'wholesale' : 'retail';
        return this.customerType;
    }
    
    // Get cart items from existing cart.js system
    getCartItems() {
        try {
            const stored = localStorage.getItem('ohsCart');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading cart:', error);
            return [];
        }
    }
    
    // Convert cart.js format to Shopify format
    convertCartForShopify(cartItems) {
        const customerType = this.getCustomerType();
        
        if (this.config.debug) {
            console.log(`🛒 Converting ${cartItems.length} cart items for ${customerType} customer`);
        }
        
        const convertedItems = cartItems.map(item => {
            const product = PRODUCT_CATALOG[item.productId];
            if (!product) {
                console.warn(`⚠️ Product ${item.productId} not found in catalog`);
                return null;
            }
            
            if (!product.shopifyVariants) {
                console.warn(`⚠️ Product ${item.productId} missing Shopify variants`);
                return null;
            }
            
            // Select appropriate variant using config rules
            const variantKey = this.config.variantSelection[customerType];
            const variantId = product.shopifyVariants[variantKey];
            
            if (!variantId) {
                console.warn(`⚠️ Product ${item.productId} missing ${variantKey} variant ID`);
                return null;
            }
            
            if (this.config.debug) {
                console.log(`📦 ${product.name}: ${item.quantity}x variant ${variantId} (${customerType})`);
            }
            
            return {
                variantId: variantId,
                quantity: item.quantity
            };
        }).filter(item => item !== null);
        
        if (this.config.debug) {
            console.log(`✅ Converted ${convertedItems.length} valid items for Shopify`);
        }
        
        return convertedItems;
    }
    
    // Create Shopify checkout
    async createCheckout(cartItems) {
        const lineItems = this.convertCartForShopify(cartItems);
        
        if (lineItems.length === 0) {
            throw new Error('No valid items for checkout');
        }
        
        const mutation = `
            mutation checkoutCreate($input: CheckoutCreateInput!) {
                checkoutCreate(input: $input) {
                    checkout {
                        id
                        webUrl
                        totalPriceV2 {
                            amount
                            currencyCode
                        }
                        lineItems(first: 250) {
                            edges {
                                node {
                                    title
                                    quantity
                                }
                            }
                        }
                    }
                    checkoutUserErrors {
                        field
                        message
                    }
                }
            }
        `;
        
        const variables = {
            input: {
                lineItems: lineItems
            }
        };
        
        return await this.makeGraphQLRequest(mutation, variables);
    }
    
    // Make GraphQL request to Shopify
    async makeGraphQLRequest(query, variables = {}) {
        const url = `https://${this.shopifyDomain}/api/${this.apiVersion}/graphql.json`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': this.storefrontAccessToken
            },
            body: JSON.stringify({ query, variables })
        });
        
        return response;
    }
    
    // Enhanced checkout function (replaces existing checkout)
    async proceedToShopifyCheckout() {
        try {
            // Update UI to show loading state
            this.updateCheckoutButtonState('loading');
            
            if (!this.isInitialized) {
                const initialized = await this.initializeShopifyIntegration();
                if (!initialized) {
                    throw new Error(this.config.messages.initError);
                }
            }
            
            if (this.config.debug) {
                console.log('🛒 Processing checkout...');
            }
            
            // Get cart items from existing cart.js functions
            const cartItems = this.getCartItems();
            if (cartItems.length === 0) {
                alert(this.config.messages.emptyCart);
                this.updateCheckoutButtonState('error');
                return;
            }
            
            // Apply wholesale pricing logic and create checkout
            const response = await this.createCheckout(cartItems);
            const responseData = await response.json();
            
            if (responseData.data && responseData.data.checkoutCreate.checkout) {
                const checkoutUrl = responseData.data.checkoutCreate.checkout.webUrl;
                if (this.config.debug) {
                    console.log('✅ Checkout created, redirecting to Shopify...');
                    console.log('🔗 Checkout URL:', checkoutUrl);
                }
                
                // Redirect to Shopify checkout
                window.location.href = checkoutUrl;
            } else {
                const errors = responseData.data?.checkoutCreate?.checkoutUserErrors || [];
                throw new Error(`Checkout creation failed: ${errors.map(e => e.message).join(', ')}`);
            }
        } catch (error) {
            console.error('❌ Checkout failed:', error);
            alert(this.config.messages.checkoutError);
            this.updateCheckoutButtonState('error');
        }
    }
    
    // Update checkout button state
    updateCheckoutButtonState(state) {
        const checkoutBtn = document.getElementById('shopify-checkout-btn');
        if (!checkoutBtn) return;
        
        switch (state) {
            case 'loading':
                checkoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>' + this.config.messages.processingPayment;
                checkoutBtn.disabled = true;
                checkoutBtn.classList.add('btn-secondary');
                checkoutBtn.classList.remove('btn-primary');
                break;
            case 'error':
                checkoutBtn.innerHTML = '<i class="fas fa-lock me-2"></i>Secure Checkout with Shopify';
                checkoutBtn.disabled = false;
                checkoutBtn.classList.add('btn-primary');
                checkoutBtn.classList.remove('btn-secondary');
                break;
            default:
                checkoutBtn.innerHTML = '<i class="fas fa-lock me-2"></i>Secure Checkout with Shopify';
                checkoutBtn.disabled = false;
                checkoutBtn.classList.add('btn-primary');
                checkoutBtn.classList.remove('btn-secondary');
        }
    }
    
    // Calculate wholesale savings for display
    calculateWholesaleSavings() {
        const cartItems = this.getCartItems();
        let totalSavings = 0;
        let hasWholesaleItems = false;
        
        cartItems.forEach(item => {
            const product = PRODUCT_CATALOG[item.productId];
            if (product && item.quantity >= (product.wholesaleThreshold || this.config.wholesaleThreshold)) {
                hasWholesaleItems = true;
                const retailTotal = product.pricing.retail * item.quantity;
                const wholesaleTotal = product.pricing.wholesale * item.quantity;
                totalSavings += (retailTotal - wholesaleTotal);
            }
        });
        
        return {
            totalSavings: totalSavings,
            hasWholesaleItems: hasWholesaleItems,
            formatted: `$${totalSavings.toFixed(2)}`
        };
    }
}

// ===================================================================
// GLOBAL FUNCTIONS FOR INTEGRATION
// ===================================================================

// Global instance with configuration
let shopifyIntegration;

// Initialize with configuration
function initializeShopifyWithConfig() {
    // Wait for config to be loaded
    if (!window.SHOPIFY_DOMAIN || !window.SHOPIFY_STOREFRONT_TOKEN) {
        console.warn('⚠️ Waiting for Shopify config to load...');
        return false;
    }
    
    if (validateShopifyConfig()) {
        shopifyIntegration = new ShopifyIntegration(SHOPIFY_CONFIG);
        return true;
    }
    return false;
}

// Enhanced add to cart function (for product pages)
function addToEnhancedCart(productId) {
    if (SHOPIFY_CONFIG.debug) {
        console.log(`📦 Adding product ${productId} to enhanced cart`);
    }
    
    // Use existing cart.js function first
    if (typeof addToCartFromProducts === 'function') {
        addToCartFromProducts(productId);
    } else if (typeof addToCart === 'function') {
        addToCart(productId);
    } else {
        console.warn('No cart function found, using fallback');
        // Fallback add to cart logic here if needed
    }
    
    // Update wholesale indicators after adding
    if (typeof updateWholesaleIndicators === 'function') {
        updateWholesaleIndicators();
    }
    
    // Update wholesale savings display
    updateWholesaleSavingsDisplay();
    
    if (SHOPIFY_CONFIG.debug) {
        console.log(`✅ Product ${productId} added to enhanced cart`);
    }
}

// Enhanced quick add function (for homepage)
function handleQuickAddWithShopify(productId) {
    // Use existing cart.js logic
    addToEnhancedCart(productId);
    
    // Show success message
    const product = PRODUCT_CATALOG[productId];
    if (product) {
        alert(`✅ ${product.name} added to cart!`);
        if (SHOPIFY_CONFIG.debug) {
            console.log(`🏠 Quick add successful: ${product.name}`);
        }
    }
}

// Global checkout function (for cart page)
function proceedToShopifyCheckout() {
    if (shopifyIntegration) {
        shopifyIntegration.proceedToShopifyCheckout();
    } else {
        console.error('Shopify integration not initialized');
        alert(SHOPIFY_CONFIG.messages.connectionError);
    }
}

// Update wholesale savings display
function updateWholesaleSavingsDisplay() {
    if (!shopifyIntegration) return;
    
    const savings = shopifyIntegration.calculateWholesaleSavings();
    const savingsDisplay = document.getElementById('wholesale-savings-display');
    const savingsAmount = document.getElementById('wholesale-savings-amount');
    
    if (savingsDisplay && savingsAmount) {
        if (savings.hasWholesaleItems && savings.totalSavings > 0) {
            savingsAmount.textContent = `You're saving ${savings.formatted}!`;
            savingsDisplay.style.display = 'block';
        } else {
            savingsDisplay.style.display = 'none';
        }
    }
}

// Enhanced checkout function with UI updates
function enhancedCheckoutHandler() {
    const checkoutBtn = document.getElementById('shopify-checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processing...';
        checkoutBtn.disabled = true;
    }
    
    // Call the Shopify integration
    if (typeof proceedToShopifyCheckout === 'function') {
        proceedToShopifyCheckout();
    } else {
        console.error('Shopify integration not loaded');
        alert('Error: Checkout system not available. Please refresh and try again.');
        if (checkoutBtn) {
            checkoutBtn.innerHTML = '<i class="fas fa-lock me-2"></i>Secure Checkout with Shopify';
            checkoutBtn.disabled = false;
        }
    }
}

// ===================================================================
// INITIALIZATION AND SETUP
// ===================================================================

// Wait for configuration to load
function waitForShopifyConfig() {
    return new Promise((resolve, reject) => {
        let attempts = 0;
        const maxAttempts = 50;
        
        const checkConfig = () => {
            if (window.SHOPIFY_DOMAIN && window.SHOPIFY_STOREFRONT_TOKEN) {
                resolve(true);
            } else if (attempts >= maxAttempts) {
                reject(new Error('Shopify configuration failed to load'));
            } else {
                attempts++;
                setTimeout(checkConfig, 100);
            }
        };
        
        checkConfig();
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (SHOPIFY_CONFIG.debug) {
        console.log('🔄 Shopify unified integration script loaded');
    }
    
    // Wait for config to load, then initialize
    waitForShopifyConfig().then(() => {
        if (initializeShopifyWithConfig()) {
            // Auto-initialize if we're on a cart-related page
            if (window.location.pathname.includes('/cart') || 
                window.location.pathname.includes('/products')) {
                shopifyIntegration.initializeShopifyIntegration();
            }
            
            // Update wholesale savings display on cart page
            if (window.location.pathname.includes('/cart')) {
                setTimeout(updateWholesaleSavingsDisplay, 500);
            }
        }
    }).catch(error => {
        console.error('❌ Shopify config loading failed:', error);
        alert('Configuration error. Please refresh the page.');
    });
});

// ===================================================================
// CART PAGE SPECIFIC ENHANCEMENTS
// ===================================================================

// Wait for cart system to be ready
function waitForCartSystem() {
    return new Promise((resolve, reject) => {
        let attempts = 0;
        const maxAttempts = 50;
        
        const checkCart = () => {
            if (typeof PRODUCT_CATALOG !== 'undefined' && PRODUCT_CATALOG) {
                resolve(true);
            } else if (attempts >= maxAttempts) {
                reject(new Error('Cart system failed to load'));
            } else {
                attempts++;
                setTimeout(checkCart, 100);
            }
        };
        
        checkCart();
    });
}

// Enhanced cart initialization for cart page
if (window.location.pathname.includes('/cart')) {
    Promise.all([waitForShopifyConfig(), waitForCartSystem()]).then(() => {
        if (SHOPIFY_CONFIG.debug) {
            console.log('🛒 Cart page enhanced with Shopify integration');
        }
        updateWholesaleSavingsDisplay();
    }).catch(error => {
        console.error('❌ Cart system initialization failed:', error);
    });
}

// Make configuration globally accessible for easy updates
window.SHOPIFY_CONFIG = SHOPIFY_CONFIG;
window.shopifyIntegration = shopifyIntegration;

console.log('🎉 Shopify Unified Integration Script Loaded Successfully');
