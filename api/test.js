module.exports = async function handler(req, res) {
    console.log('Test API endpoint called');
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    
    return res.status(200).json({
        success: true,
        message: 'API endpoint is working!',
        timestamp: new Date().toISOString(),
        environment: {
            hasShopifyDomain: !!process.env.SHOPIFY_DOMAIN,
            hasShopifyToken: !!process.env.SHOPIFY_STOREFRONT_TOKEN,
            nodeVersion: process.version
        }
    });
};
