cat > api/shopify/get-products.js << 'EOF'
const ShopifyClient = require('../_utils/shopify-client');

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ 
            error: 'Method Not Allowed',
            message: 'Only GET requests are supported'
        });
    }

    try {
        console.log('GET /api/shopify/get-products - Starting request');
        
        const { limit = '20' } = req.query;
        const productLimit = Math.min(parseInt(limit) || 20, 100);

        const shopify = new ShopifyClient();
        const products = await shopify.getProducts(productLimit);
        
        const transformedProducts = products.map(product => ({
            id: product.id,
            title: product.title,
            handle: product.handle,
            description: product.description,
            availableForSale: product.availableForSale,
            priceRange: {
                min: parseFloat(product.priceRange.minVariantPrice.amount),
                currencyCode: product.priceRange.minVariantPrice.currencyCode
            },
            featuredImage: product.images.edges[0] ? {
                url: product.images.edges[0].node.url,
                altText: product.images.edges[0].node.altText
            } : null,
            variants: product.variants.edges.map(edge => ({
                id: edge.node.id,
                title: edge.node.title,
                price: parseFloat(edge.node.price.amount),
                currencyCode: edge.node.price.currencyCode,
                availableForSale: edge.node.availableForSale
            }))
        }));

        return res.status(200).json({
            success: true,
            data: {
                products: transformedProducts,
                count: transformedProducts.length
            },
            meta: {
                timestamp: new Date().toISOString(),
                api: 'shopify-products'
            }
        });

    } catch (error) {
        console.error('Error in get-products API:', error);
        
        return res.status(500).json({
            success: false,
            error: {
                message: 'Failed to fetch products',
                details: error.message
            }
        });
    }
};
EOF
