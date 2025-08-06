/**
 * ORGANIC HYPOSOLUTIONS - ENHANCED SHOPIFY CLIENT
 * ================================================================
 * File: /shop/js/shopify-client.js
 * 
 * This is an enhanced version of the Shopify client with
 * better error handling and CORS workarounds.
 */

class EnhancedShopifyClient {
  constructor(config = {}) {
    this.domain = config.domain || '';
    this.storefrontAccessToken = config.storefrontAccessToken || '';
    this.maxRetries = config.maxRetries || 5;
    this.retryDelay = config.retryDelay || 1000;
    this.debug = config.debug || false;
    
    // Bind methods
    this.fetchWithRetry = this.fetchWithRetry.bind(this);
    this.getProducts = this.getProducts.bind(this);
    this.createCheckout = this.createCheckout.bind(this);
    this.updateCart = this.updateCart.bind(this);
    
    if (this.debug) {
      console.log('Enhanced Shopify Client initialized');
    }
  }
  
  async fetchWithRetry(url, options = {}, retryCount = 0) {
    try {
      // Try direct API call first
      const response = await fetch(url, {
        ...options,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      if (this.debug) {
        console.warn(`API request failed (attempt ${retryCount + 1}):`, error);
      }
      
      // If we've hit max retries, try the proxy approach
      if (retryCount >= this.maxRetries) {
        if (this.debug) {
          console.log('Trying proxy approach after max retries');
        }
        
        // Use our proxy endpoint
        try {
          const proxyResponse = await fetch('/api/proxy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              targetUrl: url,
              method: options.method || 'GET',
              body: options.body ? JSON.parse(options.body) : undefined,
              headers: options.headers
            })
          });
          
          if (!proxyResponse.ok) {
            throw new Error(`Proxy HTTP error! Status: ${proxyResponse.status}`);
          }
          
          return await proxyResponse.json();
        } catch (proxyError) {
          console.error('Proxy approach also failed:', proxyError);
          
          // Last resort: Use local cart data
          if (url.includes('cart') || url.includes('checkout')) {
            return this.getLocalCartFallback();
          }
          
          throw proxyError;
        }
      }
      
      // If we haven't hit max retries, wait and try again
      const delay = this.retryDelay * Math.pow(2, retryCount);
      if (this.debug) {
        console.log(`Retrying in ${delay}ms...`);
      }
      
      await new Promise(resolve => setTimeout(resolve, delay));
      return this.fetchWithRetry(url, options, retryCount + 1);
    }
  }
  
  // Fallback for when all remote approaches fail
  getLocalCartFallback() {
    try {
      // Try to get cart data from localStorage
      const cartData = localStorage.getItem('ohs_cart');
      if (cartData) {
        return JSON.parse(cartData);
      }
    } catch (e) {
      console.error('Error accessing local cart data:', e);
    }
    
    // Return empty cart if nothing found
    return { 
      items: [], 
      total: 0,
      currency: 'USD',
      item_count: 0,
      _isLocalFallback: true
    };
  }
  
  // Store cart data locally as backup
  saveLocalCartBackup(cartData) {
    try {
      localStorage.setItem('ohs_cart', JSON.stringify(cartData));
    } catch (e) {
      console.error('Error saving local cart data:', e);
    }
  }
  
  // Get products with fallback mechanisms
  async getProducts(options = {}) {
    try {
      return await this.fetchWithRetry('/api/shopify/get-products', {
        method: 'GET',
        headers: options.headers
      });
    } catch (error) {
      console.error('Failed to get products:', error);
      // Return empty products array as fallback
      return { products: [], success: false, error: error.message };
    }
  }
  
  // Create checkout with fallback mechanisms
  async createCheckout(cartItems) {
    try {
      // Save cart data locally first
      this.saveLocalCartBackup({ items: cartItems, total: this.calculateTotal(cartItems) });
      
      // Then try to create checkout
      return await this.fetchWithRetry('/api/shopify/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lineItems: cartItems })
      });
    } catch (error) {
      console.error('Failed to create checkout:', error);
      
      // Fallback: Return local cart data with checkout URL
      if (this.domain) {
        // Redirect to Shopify store directly as last resort
        return {
          success: false,
          checkout: {
            webUrl: `https://${this.domain}/cart`,
            _isLocalFallback: true
          },
          error: error.message
        };
      }
      
      throw error;
    }
  }
  
  // Helper to calculate cart total
  calculateTotal(items) {
    return items.reduce((total, item) => {
      return total + (parseFloat(item.price) * item.quantity);
    }, 0).toFixed(2);
  }
  
  // Update cart with better error handling
  async updateCart(cartData) {
    // Always save a local backup
    this.saveLocalCartBackup(cartData);
    
    try {
      return await this.fetchWithRetry('/api/shopify/update-cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cartData)
      });
    } catch (error) {
      console.error('Failed to update cart on server:', error);
      // Return the local cart data instead
      return { 
        ...cartData, 
        success: false, 
        _isLocalFallback: true 
      };
    }
  }
}

// CORS workaround for fetch operations
const originalFetch = window.fetch;
window.fetch = function(url, options) {
  // Only apply CORS workaround to specific endpoints
  if (url && (url.includes('/api/shopify/') || url.includes('checkout') || url.includes('cart'))) {
    console.log('📊 Using CORS-safe fetch for:', url);
    
    return originalFetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    }).catch(error => {
      console.warn('Initial fetch failed, trying without credentials...', error);
      
      // Try again without credentials
      return originalFetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers
        }
      }).catch(fallbackError => {
        console.error('All fetch methods failed:', fallbackError);
        
        // For checkout or cart operations, return a special error object that
        // the application code can detect and handle with local data
        if (url.includes('checkout') || url.includes('cart')) {
          return {
            ok: false,
            status: 0,
            statusText: 'CORS or Network Error',
            json: async () => ({ 
              error: 'CORS Error',
              _isLocalFallback: true
            })
          };
        }
        
        throw fallbackError;
      });
    });
  }
  
  // Use original fetch for all other URLs
  return originalFetch(url, options);
};

// Initialize ShopifyClient with enhanced version
window.ShopifyClient = EnhancedShopifyClient;

// Replace existing instance with enhanced version
document.addEventListener('DOMContentLoaded', function() {
  // If there's an existing client instance, upgrade it
  if (window.shopifyClient) {
    const config = {
      domain: window.shopifyClient.domain,
      storefrontAccessToken: window.shopifyClient.storefrontAccessToken,
      debug: true
    };
    window.shopifyClient = new EnhancedShopifyClient(config);
    console.log('🛒 Upgraded Shopify client with enhanced version');
  } else {
    // Otherwise create a new instance
    window.shopifyClient = new EnhancedShopifyClient({
      domain: 'organichyposolutions.myshopify.com',
      storefrontAccessToken: '', // Will be fetched from server
      debug: true
    });
    console.log('🛒 Created new enhanced Shopify client');
  }
  
  // Global error handler for CORS issues
  window.addEventListener('error', function(event) {
    if (event.message && event.message.includes('CORS')) {
      console.warn('CORS error detected, activating fallback mechanisms');
      // Force using local data
      if (window.shopifyClient) {
        window.shopifyClient.debug = true;
      }
    }
  });
});
