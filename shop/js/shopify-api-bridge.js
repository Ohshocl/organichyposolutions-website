// Shopify API Bridge - Connects your existing cart.js to Shopify
// This file integrates with your existing cart logic WITHOUT modifying cart.js

class ShopifyBridge {
    constructor() {
        this.shopifyCart = [];
        this.customerType = 'retail'; // default
        this.isInitialized = false;
        
        // Wait for your existing cart system to load
        this.waitForCartSystem().then(() => {
            this.initialize();
        });
    }

    // Wait for your existing cart.js to be ready
    async waitForCartSystem() {
        return new Promise((resolve) => {
            const checkCartSystem = () => {
                if (window.PRODUCT_CATALOG && window.calculateWholesaleRate) {
                    resolve();
                } else {
                    setTimeout(checkCartSystem, 100);
                }
            };
            checkCartSystem();
        });
    }

    // Initialize the bridge
    initialize() {
        console.log('🛒 Shopify Bridge initialized');
        this.isInitialized = true;
        
        // Monitor your existing cart for changes
        this.monitorCartChanges();
        
        // Override your existing checkout to use Shopify
        this.overrideCheckoutFlow();
    }

    // Monitor your existing cart.js for wholesale threshold changes
    monitorCartChanges() {
        // Watch for cart updates in localStorage
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = (key, value) => {
            if (key === 'cart') {
                this.onCartChange(JSON.parse(value));
            }
            originalSetItem.call(localStorage, key, value);
        };

        // Initial cart check
        const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
        if (existingCart.length > 0) {
            this.onCartChange(existingCart);
        }
    }

    // Handle cart changes and check wholesale eligibility
    async onCartChange(cartItems) {
        console.log('🔄 Cart changed:', cartItems);
        
        // Use your existing wholesale logic
        const newCustomerType = this.determineCustomerType(cartItems);
        
        if (newCustomerType !== this.customerType) {
            console.log(`👤 Customer type changed: ${this.customerType} → ${newCustomerType}`);
            this.customerType = newCustomerType;
            
            // Tag customer in Shopify if needed
            if (newCustomerType === 'wholesale') {
                await this.tagCustomerAsWholesale();
            }
        }

        // Sync cart with Shopify
        await this.syncCartWithShopify(cartItems);
    }

    // Use your existing wholesale threshold logic
    determineCustomerType(cartItems) {
        // Replicate your calculateWholesaleRate logic
        for (const item of cartItems) {
            const product = window.PRODUCT_CATALOG[item.id];
            if (product && item.quantity >= (product.wholesaleThreshold || 6)) {
                return 'wholesale';
            }
        }
        return 'retail';
    }

    // Convert your cart.js format to Shopify format
    async syncCartWithShopify(cartItems) {
        this.shopifyCart = [];

        for (const item of cartItems) {
            const variantId = this.getShopifyVariantId(item.id, this.customerType);
            if (variantId) {
                this.shopifyCart.push({
                    merchandiseId: variantId,
                    quantity: item.quantity
                });
            }
        }

        console.log('🔄 Synced with Shopify:', this.shopifyCart);
    }

    // Get correct Shopify variant ID based on customer type
    getShopifyVariantId(productSku, customerType) {
        const config = window.SHOPIFY_CONFIG;
        if (config && config.variantMapping && config.variantMapping[productSku]) {
            return config.variantMapping[productSku][customerType];
        }
        console.warn(`⚠️ No Shopify variant found for ${productSku}-${customerType}`);
        return null;
    }

    // Create Shopify checkout
    async createShopifyCheckout() {
        if (this.shopifyCart.length === 0) {
            alert('Your cart is empty');
            return;
        }

        try {
            console.log('🛒 Creating Shopify checkout...');
            
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
                    lineItems: this.shopifyCart
                }
            };

            const response = await this.callShopifyAPI(mutation, variables);
            
            if (response.data.checkoutCreate.checkoutUserErrors.length > 0) {
                console.error('Checkout errors:', response.data.checkoutCreate.checkoutUserErrors);
                alert('Error creating checkout. Please try again.');
                return;
            }

            const checkoutUrl = response.data.checkoutCreate.checkout.webUrl;
            console.log('✅ Checkout created:', checkoutUrl);
            
            // Redirect to Shopify checkout
            window.location.href = checkoutUrl;

        } catch (error) {
            console.error('❌ Checkout error:', error);
            alert('Error creating checkout. Please try again.');
        }
    }

    // Tag customer as wholesale in Shopify (requires Admin API)
    async tagCustomerAsWholesale() {
        // Note: This requires Admin API access token
        // For now, just log - implement when you have Admin API set up
        console.log('🏷️ Should tag customer as wholesale');
    }

    // Call Shopify Storefront API
    async callShopifyAPI(query, variables = {}) {
        const config = window.SHOPIFY_CONFIG;
        
        const response = await fetch(config.storefrontApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': config.storefrontAccessToken
            },
            body: JSON.stringify({
                query,
                variables
            })
        });

        if (!response.ok) {
            throw new Error(`API call failed: ${response.status}`);
        }

        return await response.json();
    }

    // Override your existing checkout flow
    overrideCheckoutFlow() {
        // Replace your existing checkout button functionality
        const originalCheckout = window.proceedToCheckout;
        window.proceedToCheckout = () => {
            console.log('🔄 Redirecting to Shopify checkout...');
            this.createShopifyCheckout();
        };

        // Also handle direct checkout calls
        window.shopifyCheckout = () => {
            this.createShopifyCheckout();
        };
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (window.SHOPIFY_CONFIG) {
        window.shopifyBridge = new ShopifyBridge();
    } else {
        console.error('❌ SHOPIFY_CONFIG not found. Please check shopify-config.js');
    }
});
