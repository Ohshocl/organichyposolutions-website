/**
 * ORGANIC HYPOSOLUTIONS - GET PRODUCTS API ENDPOINT
 * ================================================================
 * File: /api/shopify/get-products.js
 * Purpose: Fetch products from Shopify using cart.js PRODUCT_CATALOG as source
 * Dependencies: /api/_utils/shopify-client.js, cart.js PRODUCT_CATALOG
 * Method: GET
 * 
 * HYBRID SYSTEM: Uses cart.js PRODUCT_CATALOG + fresh Shopify inventory
 * 
 * HOW IT WORKS:
 * 1. References your cart.js PRODUCT_CATALOG (57 products with shopifyVariants)
 * 2. Fetches fresh inventory/availability data from Shopify
 * 3. Returns cart.js products enhanced with real-time Shopify data
 * 4. Preserves ALL your existing pricing, categories, shopifyVariants
 * 
 * SETUP REQUIRED:
 * - Your cart.js must be loaded/accessible with window.PRODUCT_CATALOG
 * - Each product must have shopifyVariants: { retail, wholesale, retailSubscription, wholesaleSubscription }
 * 
 * Query Parameters:
 * ?customerType=wholesale    - Show wholesale or retail pricing from cart.js
 * ?limit=50                  - Number of products (max 250)
 * ?category=sanitizer        - Filter by category
 * ?available=true            - Only available products
 * ?search=gallon             - Search products
 * ?nocache=true              - Bypass cache
 * 
 * Response Format (Enhanced Cart.js):
 * {
 *   success: true,
 *   products: [
 *     {
 *       // ALL your existing cart.js data preserved
 *       id: 'hc-32oz-pet-cleaner',
 *       name: '32oz Pet Cleaner and Deodorizer',
 *       pricing: { retail: 23.82, wholesale: 17.30, ... },
 *       shopifyVariants: { retail: "123", wholesale: "456", ... },
 *       category: 'Pet Care',
 *       certifications: ['EPA Certified', 'Pet Safe'],
 *       
 *       // PLUS fresh Shopify data
 *       inStock: true,
 *       inventory: 47,
 *       currentPrice: 23.82  // Based on customerType
 *     }
 *   ]
 * }
 * ================================================================
 */

import { getProducts, getWholesaleThreshold } from '../_utils/shopify-client.js';

// =================================================================
// CART.JS INTEGRATION
// =================================================================

/**
 * Load cart.js PRODUCT_CATALOG for reference
 * This references your exact cart.js structure with 57 products
 */
function loadCartJsProducts() {
    try {
        // Option 1: If cart.js is already loaded globally (recommended)
        if (typeof global !== 'undefined' && global.PRODUCT_CATALOG) {
            return global.PRODUCT_CATALOG;
        }
        
        // Option 2: If you can import it directly
        // const { HYPO_COMPANY_PRODUCTS, OHS_PRODUCTS } = require('../../shop/js/cart.js');
        // return { ...HYPO_COMPANY_PRODUCTS, ...OHS_PRODUCTS };
        
        // Option 3: Load from JSON file (if you export cart.js as JSON)
        // const fs = require('fs');
        // const cartData = JSON.parse(fs.readFileSync('./cart-products.json', 'utf8'));
        // return cartData;
        
        // Option 4: Set this in your app initialization
        // Make sure to set: global.PRODUCT_CATALOG = { ...HYPO_COMPANY_PRODUCTS, ...OHS_PRODUCTS };
        
        console.warn('⚠️ Cart.js PRODUCT_CATALOG not found. Set global.PRODUCT_CATALOG in your app startup.');
        return {};
        
    } catch (error) {
        console.error('❌ Failed to load cart.js products:', error);
        return {};
    }
}

/**
 * Initialize cart.js product reference
 * This ensures your 57 products with shopifyVariants are available
 */
function initializeCartJsReference() {
    if (!global.CART_JS_PRODUCTS) {
        global.CART_JS_PRODUCTS = loadCartJsProducts();
        const productCount = Object.keys(global.CART_JS_PRODUCTS).length;
        console.log(`📦 Loaded ${productCount} cart.js products for reference`);
        
        if (productCount === 57) {
            console.log('✅ All 57 products loaded (38 Hypo Company + 19 OHS)');
        } else {
            console.warn(`⚠️ Expected 57 products, found ${productCount}`);
        }
    }
}

// =================================================================
// CACHING SYSTEM
// =================================================================

const productCache = new Map();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes
const CACHE_KEY_PREFIX = 'ohs_products';

function getCacheKey(params) {
    return `${CACHE_KEY_PREFIX}:${JSON.stringify(params)}`;
}

function getFromCache(key) {
    const cached = productCache.get(key);
    if (!cached || Date.now() - cached.timestamp > CACHE_TTL) {
        productCache.delete(key);
        return null;
    }
    return cached.data;
}

function setCache(key, data) {
    productCache.set(key, {
        data,
        timestamp: Date.now()
    });
}

// =================================================================
// PRODUCT FORMATTING FOR CART.JS COMPATIBILITY
// =================================================================

/**
 * Convert Shopify product to enhanced cart.js format using existing cart.js data
 */
function formatProductForCartJs(shopifyProduct, customerType = 'retail') {
    const wholesaleThreshold = getWholesaleThreshold();
    
    // Extract cart.js compatible ID
    const cartJsId = extractCartJsId(shopifyProduct);
    
    // Get the existing cart.js product data
    const existingCartJsProduct = global.CART_JS_PRODUCTS?.[cartJsId] || null;
    
    // Get current variant info from Shopify for inventory/availability
    const variants = shopifyProduct.variants?.edges || [];
    const defaultVariant = variants[0]?.node;
    
    // If we have existing cart.js product, enhance it with fresh Shopify data
    if (existingCartJsProduct) {
        // Determine current pricing based on customer type and your cart.js structure
        const currentPrice = customerType === 'wholesale' ? 
            existingCartJsProduct.pricing.wholesale : 
            existingCartJsProduct.pricing.retail;
            
        // Create enhanced product preserving ALL cart.js data
        return {
            // PRESERVE ALL existing cart.js data exactly as-is
            ...existingCartJsProduct,
            
            // ADD/UPDATE only fresh Shopify data
            inStock: shopifyProduct.availableForSale,
            availableForSale: shopifyProduct.availableForSale,
            inventory: defaultVariant?.quantityAvailable || 0,
            
            // Customer-specific enhancements
            currentPrice: currentPrice,
            customerType: customerType,
            
            // Fresh Shopify references
            shopifyId: shopifyProduct.id,
            handle: shopifyProduct.handle,
            
            // Fresh images from Shopify (if available)
            images: shopifyProduct.images?.edges?.map(edge => ({
                id: edge.node.id,
                url: edge.node.url,
                altText: edge.node.altText || existingCartJsProduct.name
            })) || [],
            mainImage: shopifyProduct.images?.edges?.[0]?.node?.url || null,
            
            // Updated timestamps
            updatedAt: shopifyProduct.updatedAt,
            
            // Add convenience fields for frontend
            isRetail: customerType === 'retail',
            isWholesale: customerType === 'wholesale',
            price: currentPrice, // Convenience field matching cart.js expectations
            
            // Preserve original cart.js structure markers
            _enhanced: true,
            _enhancedAt: new Date().toISOString()
        };
    }
    
    // Fallback: Product not found in cart.js (shouldn't happen)
    console.warn(`⚠️ Product ${cartJsId} not found in cart.js catalog`);
    console.warn(`   Shopify product: ${shopifyProduct.title}`);
    console.warn(`   Available cart.js IDs: ${Object.keys(global.CART_JS_PRODUCTS || {}).slice(0, 5).join(', ')}...`);
    
    // Create minimal fallback product
    return {
        // Basic identifiers
        id: cartJsId,
        shopifyId: shopifyProduct.id,
        handle: shopifyProduct.handle,
        
        // Basic info from Shopify
        name: shopifyProduct.title,
        title: shopifyProduct.title,
        description: shopifyProduct.description || '',
        
        // Fallback pricing structure (matches cart.js format)
        pricing: {
            cost: parseFloat(defaultVariant?.priceV2?.amount || 0) * 0.6,
            retail: parseFloat(defaultVariant?.priceV2?.amount || 0),
            wholesale: parseFloat(defaultVariant?.priceV2?.amount || 0) * 0.75,
            wholesaleMonthly: parseFloat(defaultVariant?.priceV2?.amount || 0) * 0.73,
            wholesaleQuarterly: parseFloat(defaultVariant?.priceV2?.amount || 0) * 0.71,
            retailMonthly: parseFloat(defaultVariant?.priceV2?.amount || 0) * 0.93,
            retailQuarterly: parseFloat(defaultVariant?.priceV2?.amount || 0) * 0.91
        },
        
        // Current price for customer
        currentPrice: parseFloat(defaultVariant?.priceV2?.amount || 0),
        price: parseFloat(defaultVariant?.priceV2?.amount || 0),
        
        // Fallback categorization
        category: categorizeProduct(shopifyProduct),
        productLine: 'premium', // Default fallback
        emoji: inferEmoji(shopifyProduct),
        
        // Availability
        inStock: shopifyProduct.availableForSale,
        availableForSale: shopifyProduct.availableForSale,
        inventory: defaultVariant?.quantityAvailable || 0,
        
        // Additional info
        vendor: shopifyProduct.vendor || 'Organic HypoSolutions',
        certifications: ['Product Not in Cart.js'],
        useCase: ['fallback'],
        
        // Images
        images: shopifyProduct.images?.edges?.map(edge => ({
            id: edge.node.id,
            url: edge.node.url,
            altText: edge.node.altText || shopifyProduct.title
        })) || [],
        mainImage: shopifyProduct.images?.edges?.[0]?.node?.url || null,
        
        // Customer info
        customerType: customerType,
        wholesaleThreshold: wholesaleThreshold,
        
        // Warning flags
        _isFallback: true,
        _warning: 'Product not found in cart.js PRODUCT_CATALOG',
        
        // Timestamps
        createdAt: shopifyProduct.createdAt,
        updatedAt: shopifyProduct.updatedAt
    };
}

/**
 * Extract cart.js style ID from Shopify product
 * Maps to your specific cart.js ID patterns: hc-* and ohs-*
 */
function extractCartJsId(shopifyProduct) {
    // Method 1: Look for cart.js ID in tags (most reliable)
    const cartJsTag = shopifyProduct.tags?.find(tag => tag.startsWith('cartjs-id:'));
    if (cartJsTag) {
        return cartJsTag.replace('cartjs-id:', '');
    }
    
    // Method 2: Use handle if it matches your cart.js patterns
    const handle = shopifyProduct.handle;
    if (handle && (handle.startsWith('hc-') || handle.startsWith('ohs-'))) {
        return handle;
    }
    
    // Method 3: Try to derive from shopifyHandle in your cart.js
    // Look through cart.js products to find matching shopifyHandle
    const cartJsProducts = global.CART_JS_PRODUCTS || {};
    for (const [cartId, product] of Object.entries(cartJsProducts)) {
        if (product.shopifyHandle === handle) {
            return cartId;
        }
    }
    
    // Method 4: Try to match by title similarity
    const title = shopifyProduct.title?.toLowerCase() || '';
    for (const [cartId, product] of Object.entries(cartJsProducts)) {
        const productName = product.name?.toLowerCase() || '';
        if (title.includes(productName) || productName.includes(title)) {
            console.log(`📍 Matched by title: "${title}" → ${cartId}`);
            return cartId;
        }
    }
    
    // Method 5: Try to construct ID from title patterns
    if (title.includes('organic')) {
        // OHS product pattern
        let constructedId = 'ohs-';
        if (title.includes('3oz')) constructedId += '3oz-';
        else if (title.includes('8oz')) constructedId += '8oz-';
        else if (title.includes('32oz')) constructedId += '32oz-';
        else if (title.includes('16oz')) constructedId += '16oz-';
        else if (title.includes('100ml')) constructedId += '100ml-';
        else if (title.includes('1 gallon') || title.includes('gallon')) constructedId += '1gal-';
        
        if (title.includes('disinfectant')) constructedId += 'organic-disinfectant';
        else if (title.includes('skin health')) constructedId += 'organic-skin-health-mist';
        else if (title.includes('cleaner')) constructedId += 'organic-cleaner';
        else if (title.includes('pet')) constructedId += 'pet-safe-cleaner';
        else if (title.includes('500ppm')) constructedId += '500ppm-pet-equine';
        else if (title.includes('veterinary')) constructedId += '500ppm-veterinary';
        else if (title.includes('equine') && title.includes('gel')) constructedId += 'organic-equine-healing-gel';
        else if (title.includes('laundry')) constructedId += 'organic-laundry-booster';
        else if (title.includes('wipes')) constructedId += 'organic-all-in-one-wipes';
        else if (title.includes('healing') && title.includes('serum')) constructedId += 'organic-healing-skin-serum';
        else if (title.includes('diaper')) constructedId += 'organic-diaper-rash-gel';
        
        return constructedId;
    } else {
        // HC product pattern
        let constructedId = 'hc-';
        if (title.includes('3oz')) constructedId += '3oz-';
        else if (title.includes('8oz')) constructedId += '8oz-';
        else if (title.includes('32oz')) constructedId += '32oz-';
        else if (title.includes('16oz')) constructedId += '16oz-';
        else if (title.includes('100ml')) constructedId += '100ml-';
        else if (title.includes('1 gallon') || title.includes('gallon')) constructedId += '1gal-';
        else if (title.includes('150 gallon')) constructedId += '150gal-';
        else if (title.includes('300 gallon')) constructedId += '300gal-';
        else if (title.includes('500 gallon')) constructedId += '500gal-';
        else if (title.includes('1000 gallon')) constructedId += '1000gal-';
        else if (title.includes('3000 gallon')) constructedId += '3000gal-';
        else if (title.includes('5000 gallon')) constructedId += '5000gal-';
        
        if (title.includes('disinfectant')) constructedId += 'disinfectant';
        else if (title.includes('skin health')) constructedId += 'skin-health-mist';
        else if (title.includes('cleaner') && title.includes('ready')) constructedId += 'cleaner-rtu';
        else if (title.includes('cleaner') && title.includes('epa')) constructedId += 'cleaner-epa';
        else if (title.includes('ready to use') && title.includes('epa')) constructedId += 'ready-to-use-epa';
        else if (title.includes('ready to use')) constructedId += 'ready-to-use';
        else if (title.includes('pet cleaner')) constructedId += 'pet-cleaner';
        else if (title.includes('500ppm')) constructedId += '500ppm-pet';
        else if (title.includes('equine') && title.includes('gel')) constructedId += 'equine-healing-gel';
        else if (title.includes('laundry')) constructedId += 'laundry-booster';
        else if (title.includes('wipes')) constructedId += 'all-in-one-wipes';
        else if (title.includes('healing') && title.includes('serum')) constructedId += 'healing-skin-serum';
        else if (title.includes('diaper')) constructedId += 'diaper-rash-gel';
        else if (title.includes('fda')) constructedId += 'fda';
        else if (title.includes('organic') && title.includes('epa')) constructedId += 'organic-epa';
        
        return constructedId;
    }
    
    // Final fallback: use handle or generate from title
    console.warn(`⚠️ Could not determine cart.js ID for: ${title}`);
    return handle || `shopify-${shopifyProduct.id.split('/').pop()}`;
}

/**
 * Extract numeric variant ID from Shopify GID
 */
function extractVariantId(shopifyGid) {
    if (!shopifyGid) return null;
    return shopifyGid.split('/').pop();
}

/**
 * Categorize product based on title and type
 */
function categorizeProduct(product) {
    const title = product.title?.toLowerCase() || '';
    const type = product.productType?.toLowerCase() || '';
    const tags = product.tags?.map(t => t.toLowerCase()) || [];
    
    if (title.includes('organic') || tags.includes('organic')) {
        return 'Organic Line';
    }
    
    if (title.includes('premium') || tags.includes('premium')) {
        return 'Premium Line';
    }
    
    // Fallback based on product type
    if (type.includes('sanitizer')) return 'Sanitizers';
    if (type.includes('cleaner')) return 'Cleaners';
    if (type.includes('disinfectant')) return 'Disinfectants';
    
    return 'Premium Line'; // Default
}

/**
 * Infer emoji for product
 */
function inferEmoji(product) {
    const title = product.title?.toLowerCase() || '';
    
    if (title.includes('spray')) return '💨';
    if (title.includes('wipe')) return '🧽';
    if (title.includes('gallon')) return '🪣';
    if (title.includes('bottle')) return '🧴';
    if (title.includes('sanitizer')) return '🧼';
    if (title.includes('cleaner')) return '🧽';
    if (title.includes('32oz') || title.includes('16oz')) return '🧴';
    
    return '🧴'; // Default
}

/**
 * Extract size from title
 */
function extractSize(title) {
    if (!title) return null;
    
    const sizeMatch = title.match(/(\d+)\s*(oz|gallon|gal|liter|l|ml)/i);
    if (sizeMatch) {
        return `${sizeMatch[1]}${sizeMatch[2].toLowerCase()}`;
    }
    
    return null;
}

// =================================================================
// FILTERING AND SORTING
// =================================================================

function filterProducts(products, filters) {
    return products.filter(product => {
        // Category filter
        if (filters.category && !product.category.toLowerCase().includes(filters.category.toLowerCase())) {
            return false;
        }
        
        // Vendor filter
        if (filters.vendor && product.vendor.toLowerCase() !== filters.vendor.toLowerCase()) {
            return false;
        }
        
        // Availability filter
        if (filters.available === 'true' && !product.availableForSale) {
            return false;
        }
        
        // Search filter
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            const searchableText = `${product.name} ${product.description} ${product.tags.join(' ')}`.toLowerCase();
            if (!searchableText.includes(searchTerm)) {
                return false;
            }
        }
        
        return true;
    });
}

function sortProducts(products, sortBy = 'name') {
    const sorted = [...products];
    
    switch (sortBy) {
        case 'price-asc':
            return sorted.sort((a, b) => a.price - b.price);
        case 'price-desc':
            return sorted.sort((a, b) => b.price - a.price);
        case 'name':
        case 'title':
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        case 'category':
            return sorted.sort((a, b) => a.category.localeCompare(b.category));
        case 'updated':
            return sorted.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        default:
            return sorted;
    }
}

// =================================================================
// MAIN API HANDLER
// =================================================================

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    if (req.method !== 'GET') {
        return res.status(405).json({
            success: false,
            error: 'Method not allowed'
        });
    }
    
    try {
        // Initialize cart.js product reference
        initializeCartJsReference();
        
        // Extract query parameters
        const {
            customerType = 'retail',
            limit = '100',
            category = null,
            vendor = null,
            available = null,
            search = null,
            sortBy = 'name',
            nocache = 'false',
            after = null
        } = req.query;
        
        const parsedLimit = Math.min(parseInt(limit) || 100, 250);
        const shouldBypassCache = nocache === 'true';
        
        console.log(`🛍️ Fetching products for ${customerType} customer (limit: ${parsedLimit})`);
        
        // Check cache first
        const cacheKey = getCacheKey({
            customerType, limit: parsedLimit, category, vendor, available, search, sortBy, after
        });
        
        if (!shouldBypassCache) {
            const cachedData = getFromCache(cacheKey);
            if (cachedData) {
                console.log('✅ Returning cached products');
                return res.status(200).json({
                    ...cachedData,
                    meta: { ...cachedData.meta, cached: true }
                });
            }
        }
        
        // Fetch from Shopify
        console.log('🔄 Fetching fresh products from Shopify...');
        const shopifyResult = await getProducts(parsedLimit, after);
        
        if (!shopifyResult.success) {
            console.error('❌ Shopify fetch failed:', shopifyResult.errors);
            return res.status(500).json({
                success: false,
                error: 'Failed to fetch products from Shopify',
                details: shopifyResult.errors
            });
        }
        
        // Format products for cart.js
        console.log(`🔄 Converting ${shopifyResult.products.length} products to cart.js format...`);
        let products = shopifyResult.products.map(product => 
            formatProductForCartJs(product, customerType)
        );
        
        // Apply filters
        const filters = { category, vendor, available, search };
        products = filterProducts(products, filters);
        
        // Apply sorting
        products = sortProducts(products, sortBy);
        
        console.log(`✅ Returning ${products.length} products for ${customerType} customers`);
        
        // Prepare response
        const response = {
            success: true,
            products: products,
            pagination: {
                hasNextPage: shopifyResult.pageInfo?.hasNextPage || false,
                hasPreviousPage: shopifyResult.pageInfo?.hasPreviousPage || false,
                startCursor: shopifyResult.pageInfo?.startCursor || null,
                endCursor: shopifyResult.pageInfo?.endCursor || null
            },
            meta: {
                total: products.length,
                customerType: customerType,
                wholesaleThreshold: getWholesaleThreshold(),
                filters: filters,
                sortBy: sortBy,
                cached: false,
                timestamp: new Date().toISOString()
            }
        };
        
        // Cache the response
        if (!shouldBypassCache) {
            setCache(cacheKey, response);
            console.log('💾 Products cached successfully');
        }
        
        res.status(200).json(response);
        
    } catch (error) {
        console.error('❌ Get products error:', error);
        
        let statusCode = 500;
        let errorMessage = 'Internal server error';
        
        if (error.message.includes('GraphQL')) {
            statusCode = 400;
            errorMessage = 'Shopify API error';
        } else if (error.message.includes('Network')) {
            statusCode = 503;
            errorMessage = 'Service temporarily unavailable';
        }
        
        res.status(statusCode).json({
            success: false,
            error: errorMessage,
            details: [error.message],
            timestamp: new Date().toISOString()
        });
    }
}

// =================================================================
// EXPORT CONFIGURATION
// =================================================================

export const config = {
    runtime: 'nodejs18.x',
    maxDuration: 30
};

// =================================================================
// USAGE EXAMPLES
// =================================================================

/*
Frontend Usage Examples for Cart.js Integration:

// 1. Initialize: Set your cart.js PRODUCT_CATALOG in app startup
// In your main app initialization (before calling API):
global.PRODUCT_CATALOG = {
    ...HYPO_COMPANY_PRODUCTS,
    ...OHS_PRODUCTS
}; // From your cart.js file

// 2. Load enhanced products (your cart.js data + fresh Shopify inventory)
async function loadEnhancedProducts() {
    const response = await fetch('/api/shopify/get-products?limit=57');
    const data = await response.json();
    
    if (data.success) {
        // Replace window.PRODUCT_CATALOG with enhanced versions
        window.PRODUCT_CATALOG = {};
        data.products.forEach(product => {
            window.PRODUCT_CATALOG[product.id] = product;
        });
        
        console.log(`✅ Loaded ${data.products.length} enhanced products`);
        console.log('   - All cart.js data preserved');
        console.log('   - Fresh Shopify inventory added');
        return data.products;
    }
}

// 3. Get products for wholesale customers (uses your cart.js pricing.wholesale)
async function loadWholesaleProducts() {
    const response = await fetch('/api/shopify/get-products?customerType=wholesale&available=true');
    const data = await response.json();
    
    // Products will have currentPrice = pricing.wholesale from your cart.js
    return data.products;
}

// 4. Search products (searches your cart.js names/descriptions + fresh inventory)
async function searchProducts(query) {
    const response = await fetch('/api/shopify/get-products?' + new URLSearchParams({
        search: query,
        customerType: 'retail',
        available: 'true'
    }));
    const data = await response.json();
    return data.products;
}

// 5. Your existing cart.js functions work exactly the same!
// After loading enhanced products:
addToCart('hc-32oz-pet-cleaner', 2);           // ✅ Works with enhanced data
updateCartBadge();                             // ✅ Works unchanged
calculateWholesaleRate('ohs-32oz-organic-cleaner', 25); // ✅ Works unchanged

// 6. Enhanced checkout with your exact shopifyVariants
function proceedToEnhancedCheckout() {
    const cartItems = getCartItems(); // Your existing cart.js function
    const lineItems = cartItems.map(item => {
        const product = window.PRODUCT_CATALOG[item.productId];
        
        // Use YOUR exact shopifyVariants from cart.js
        const customerType = item.quantity >= product.wholesaleThreshold ? 'wholesale' : 'retail';
        const variantId = product.shopifyVariants[customerType]; // From your cart.js!
        
        return {
            variantId: `gid://shopify/ProductVariant/${variantId}`,
            quantity: item.quantity
        };
    });
    
    // Use your create-checkout endpoint
    fetch('/api/shopify/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lineItems })
    }).then(response => response.json())
      .then(data => {
          if (data.success) {
              window.location.href = data.checkoutUrl;
          }
      });
}

// 7. Real-time inventory checks
function checkProductAvailability(productId) {
    const product = window.PRODUCT_CATALOG[productId];
    return {
        inStock: product.inStock,
        inventory: product.inventory,
        lastUpdated: product.updatedAt
    };
}

// 8. Category filtering (uses your cart.js categories)
async function getProductsByCategory(category) {
    const response = await fetch('/api/shopify/get-products?' + new URLSearchParams({
        category: category, // e.g., "Pet Care", "Personal Care", etc.
        available: 'true'
    }));
    const data = await response.json();
    return data.products;
}

// 9. Benefits of this integration:
// ✅ ALL your cart.js data preserved (pricing, categories, shopifyVariants, etc.)
// ✅ Fresh inventory levels from Shopify  
// ✅ Real-time availability status
// ✅ Existing cart functions work unchanged
// ✅ Checkout uses your exact variant mapping
// ✅ 57 products (38 HC + 19 OHS) enhanced with Shopify data
// ✅ Customer-specific pricing (retail/wholesale) from your cart.js
*/
