cat > api/shopify/get-products.js << 'EOF'
/**
 * ORGANIC HYPOSOLUTIONS - GET PRODUCTS API ENDPOINT (COMMONJS COMPATIBLE)
 * ================================================================
 * File: /api/shopify/get-products.js
 * Purpose: Fetch products directly from Shopify
 * FIXED: Changed to CommonJS for Vercel compatibility
 * ================================================================
 */

const ShopifyClient = require('../_utils/shopify-client');

module.exports = async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');

    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ 
            error: 'Method Not Allowed',
            message: 'Only GET requests are supported'
        });
    }

    try {
        console.log('GET /api/shopify/get-products - Starting request');
        
        // Parse query parameters
        const { limit = '20', vendor, productType, tags } = req.query;
        const productLimit = Math.min(parseInt(limit) || 20, 100); // Cap at 100
        
        console.log('Request parameters:', { productLimit, vendor, productType, tags });

        // Initialize Shopify client
        const shopify = new ShopifyClient();
        
        // Fetch products from Shopify
        const products = await shopify.getProducts(productLimit);
        
        console.log(`Successfully fetched ${products.length} products from Shopify`);

        // Apply additional filters if specified
        let filteredProducts = products;
        
        if (vendor) {
            filteredProducts = filteredProducts.filter(product => 
                product.vendor && product.vendor.toLowerCase().includes(vendor.toLowerCase())
            );
        }
        
        if (productType) {
            filteredProducts = filteredProducts.filter(product => 
                product.productType && product.productType.toLowerCase().includes(productType.toLowerCase())
            );
        }
        
        if (tags) {
            const searchTags = tags.toLowerCase().split(',').map(tag => tag.trim());
            filteredProducts = filteredProducts.filter(product => 
                product.tags && product.tags.some(tag => 
                    searchTags.some(searchTag => tag.toLowerCase().includes(searchTag))
                )
            );
        }

        // Transform products for frontend
        const transformedProducts = filteredProducts.map(product => ({
            id: product.id,
            title: product.title,
            handle: product.handle,
            description: product.description,
            vendor: product.vendor,
            productType: product.productType,
            tags: product.tags,
            availableForSale: product.availableForSale,
            totalInventory: product.totalInventory,
            
            // Price information
            priceRange: {
                min: parseFloat(product.priceRange.minVariantPrice.amount),
                max: parseFloat(product.priceRange.maxVariantPrice.amount),
                currencyCode: product.priceRange.minVariantPrice.currencyCode
            },
            
            compareAtPriceRange: product.compareAtPriceRange && {
                min: parseFloat(product.compareAtPriceRange.minVariantPrice.amount),
                max: parseFloat(product.compareAtPriceRange.maxVariantPrice.amount),
                currencyCode: product.compareAtPriceRange.minVariantPrice.currencyCode
            },
            
            // Images
            featuredImage: product.featuredImage && {
                url: product.featuredImage.url,
                altText: product.featuredImage.altText,
                width: product.featuredImage.width,
                height: product.featuredImage.height
            },
            
            images: product.images.edges.map(edge => ({
                url: edge.node.url,
                altText: edge.node.altText,
                width: edge.node.width,
                height: edge.node.height
            })),
            
            // Variants
            variants: product.variants.edges.map(edge => ({
                id: edge.node.id,
                title: edge.node.title,
                sku: edge.node.sku,
                price: parseFloat(edge.node.price.amount),
                compareAtPrice: edge.node.compareAtPrice ? parseFloat(edge.node.compareAtPrice.amount) : null,
                currencyCode: edge.node.price.currencyCode,
                availableForSale: edge.node.availableForSale,
                quantityAvailable: edge.node.quantityAvailable,
                weight: edge.node.weight,
                weightUnit: edge.node.weightUnit,
                requiresShipping: edge.node.requiresShipping,
                taxable: edge.node.taxable,
                selectedOptions: edge.node.selectedOptions
            }))
        }));

        const response = {
            success: true,
            data: {
                products: transformedProducts,
                count: transformedProducts.length,
                total: products.length,
                filters: { vendor, productType, tags }
            },
            meta: {
                timestamp: new Date().toISOString(),
                requestId: `req_${Date.now()}`,
                api: 'shopify-products',
                version: '1.0'
            }
        };

        console.log(`Returning ${transformedProducts.length} products to frontend`);
        return res.status(200).json(response);

    } catch (error) {
        console.error('Error in get-products API:', error);
        
        return res.status(500).json({
            success: false,
            error: {
                message: 'Failed to fetch products',
                details: error.message,
                code: 'SHOPIFY_API_ERROR'
            },
            meta: {
                timestamp: new Date().toISOString(),
                requestId: `req_${Date.now()}`,
                api: 'shopify-products',
                version: '1.0'
            }
        });
    }
};
EOF
