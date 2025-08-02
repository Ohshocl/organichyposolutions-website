/**
 * ORGANIC HYPOSOLUTIONS - FRONTEND SHOPIFY CLIENT
 * ================================================================
 * File: /shop/js/shopify-client.js
 * Purpose: Frontend API client for Shopify integration
 * Dependencies: Your API endpoints (/api/shopify/*)
 * Security: NO credentials - only calls your secure API endpoints
 * 
 * MUST LOAD AFTER: cart.js
 * Used by: Cart system checkout functionality
 * ================================================================
 */

// =================================================================
// FRONTEND SHOPIFY CLIENT CLASS
// =================================================================

/**
 * Frontend Shopify Client - Communicates with your API endpoints only
 * NO secrets or API keys stored in frontend code
 */
class ShopifyClient {
    constructor() {
        this.apiBase = '/api/shopify';
        this.isInitialized = false;
        this.retryConfig = {
            maxRetries: 3,
            retryDelay: 1000,
            backoffMultiplier: 2
        };
        
        console.log('🛍️ Shopify client initialized (Frontend)');
        this.initialize();
    }

    /**
     * Initialize the client and verify API connectivity
     */
    async initialize() {
        try {
            // Basic connectivity test
            const testResponse = await this.makeRequest('/api/shopify/get-products?limit=1');
            if (testResponse.success || testResponse.products) {
                console.log('✅ Shopify API connectivity verified');
                this.isInitialized = true;
            } else {
                console.warn('⚠️ Shopify API may not be fully available');
            }
        } catch (error) {
            console.warn('⚠️ Shopify API connectivity test failed:', error.message);
            console.log('   This is normal if the API endpoints are not deployed yet');
        }
    }

    /**
     * Create checkout using your API endpoint
     * @param {Array} lineItems - Array of {variantId, quantity} objects
     * @param {Object} options - Additional checkout options
     */
    async createCheckout(lineItems, options = {}) {
        if (!lineItems || lineItems.length === 0) {
            throw new Error('No items provided for checkout');
        }

        console.log('🛒 Creating checkout with items:', lineItems);

        // Validate line items format
        const validatedItems = lineItems.map((item, index) => {
            if (!item.variantId || !item.quantity) {
                throw new Error(`Invalid line item ${index + 1}: missing variantId or quantity`);
            }
            
            // Ensure variantId is clean (remove gid:// prefix if present)
            const cleanVariantId = item.variantId.toString().replace('gid://shopify/ProductVariant/', '');
            
            return {
                variantId: cleanVariantId,
                quantity: parseInt(item.quantity)
            };
        });

        const requestBody = {
            lineItems: validatedItems,
            ...options
        };

        try {
            const response = await this.makeRequest('/api/shopify/create-checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.success) {
                throw new Error(response.error || 'Checkout creation failed');
            }

            if (!response.checkoutUrl) {
                throw new Error('Invalid checkout response - no URL provided');
            }

            console.log('✅ Checkout created successfully');
            console.log(`🔗 Checkout URL: ${response.checkoutUrl}`);
            
            return response;

        } catch (error) {
            console.error('❌ Checkout creation failed:', error);
            throw this.enhanceError(error);
        }
    }

    /**
     * Get products using your API endpoint (optional - you have the catalog in cart.js)
     * @param {Object} options - Query options
     */
    async getProducts(options = {}) {
        const queryParams = new URLSearchParams();
        
        // Add supported query parameters
        if (options.limit) queryParams.append('limit', options.limit);
        if (options.customerType) queryParams.append('customerType', options.customerType);
        if (options.category) queryParams.append('category', options.category);
        if (options.available) queryParams.append('available', options.available);
        if (options.search) queryParams.append('search', options.search);
        if (options.sortBy) queryParams.append('sortBy', options.sortBy);

        const url = `/api/shopify/get-products${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        
        try {
            console.log('📦 Fetching products from API...');
            const response = await this.makeRequest(url);

            if (!response.success) {
                throw new Error(response.error || 'Product fetch failed');
            }

            console.log(`✅ Fetched ${response.products?.length || 0} products`);
            return response;

        } catch (error) {
            console.error('❌ Product fetch failed:', error);
            throw this.enhanceError(error);
        }
    }

    /**
     * Enhanced fetch with retry logic and error handling
     * @param {string} url - API endpoint URL
     * @param {Object} options - Fetch options
     */
    async makeRequest(url, options = {}) {
        const { maxRetries, retryDelay, backoffMultiplier } = this.retryConfig;
        let lastError;

        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                console.log(`🔄 API Request (attempt ${attempt + 1}): ${url}`);
                
                const response = await fetch(url, {
                    ...options,
                    headers: {
                        'Content-Type': 'application/json',
                        ...options.headers
                    }
                });

                // Handle non-JSON responses
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    const text = await response.text();
                    throw new Error(`Invalid response format: ${response.status} - ${text.substring(0, 100)}`);
                }

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(`API Error ${response.status}: ${data.error || data.message || 'Unknown error'}`);
                }

                console.log(`✅ API Request successful (${response.status})`);
                return data;

            } catch (error) {
                lastError = error;
                console.warn(`⚠️ API Request failed (attempt ${attempt + 1}):`, error.message);

                // Don't retry on certain errors
                if (error.message.includes('400') || error.message.includes('401') || error.message.includes('403')) {
                    break;
                }

                // Wait before retrying
                if (attempt < maxRetries) {
                    const delay = retryDelay * Math.pow(backoffMultiplier, attempt);
                    console.log(`⏳ Retrying in ${delay}ms...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }

        throw lastError;
    }

    /**
     * Enhance error messages for better user experience
     * @param {Error} error - Original error
     */
    enhanceError(error) {
        const message = error.message.toLowerCase();
        
        if (message.includes('network') || message.includes('fetch')) {
            return new Error('Network error. Please check your connection and try again.');
        }
        
        if (message.includes('500')) {
            return new Error('Server error. Please try again in a moment.');
        }
        
        if (message.includes('400')) {
            return new Error('Invalid request. Please refresh the page and try again.');
        }
        
        if (message.includes('401') || message.includes('403')) {
            return new Error('Authentication error. Please refresh the page.');
        }
        
        if (message.includes('timeout')) {
            return new Error('Request timed out. Please try again.');
        }
        
        // Return original error if no specific enhancement applies
        return error;
    }

    /**
     * Health check for API availability
     */
    async healthCheck() {
        try {
            const response = await this.makeRequest('/api/shopify/get-products?limit=1');
            return response.success || response.products !== undefined;
        } catch (error) {
            console.warn('API health check failed:', error.message);
            return false;
        }
    }

    /**
     * Get client status and configuration
     */
    getStatus() {
        return {
            initialized: this.isInitialized,
            apiBase: this.apiBase,
            retryConfig: this.retryConfig,
            timestamp: new Date().toISOString()
        };
    }
}

// =================================================================
// GLOBAL INITIALIZATION
// =================================================================

/**
 * Initialize Shopify client when DOM is ready
 */
function initializeShopifyClient() {
    // Ensure cart is loaded first
    if (!window.cart) {
        console.warn('⚠️ Cart not found - make sure cart.js loads before shopify-client.js');
    }

    // Create global client instance
    window.shopifyClient = new ShopifyClient();
    
    // Add to cart system if available
    if (window.cart) {
        window.cart.shopifyClient = window.shopifyClient;
        console.log('✅ Shopify client connected to cart system');
    }

    // Debug logging for development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.debugShopify = function() {
            console.log('🔍 Shopify Client Debug Info:');
            console.log('   Status:', window.shopifyClient.getStatus());
            console.log('   Cart Items:', window.cart?.items || 'No cart');
            console.log('   Product Catalog:', Object.keys(window.PRODUCT_CATALOG || {}).length, 'products');
        };
        
        console.log('🛠️ Development mode: Use debugShopify() for debug info');
    }
}

// =================================================================
// DOM READY INITIALIZATION
// =================================================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeShopifyClient);
} else {
    initializeShopifyClient();
}

// =================================================================
// EXPORT FOR MODULES (if needed)
// =================================================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ShopifyClient;
}

// =================================================================
// FINAL LOGGING
// =================================================================

console.log('🔌 Shopify Frontend Client Loaded');
console.log('   Endpoints: /api/shopify/create-checkout, /api/shopify/get-products');
console.log('   Security: No credentials in frontend - API calls only');
console.log('   Integration: Ready for cart.checkout() calls');
