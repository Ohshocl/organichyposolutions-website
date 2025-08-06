module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    
    try {
        const response = await fetch(`https://${process.env.SHOPIFY_DOMAIN}/api/2024-01/graphql.json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_TOKEN,
            },
            body: JSON.stringify({
                query: `{
                    shop {
                        name
                        description
                    }
                }`
            })
        });
        
        const data = await response.json();
        
        return res.status(200).json({
            success: true,
            shopifyResponse: data,
            environment: {
                domain: process.env.SHOPIFY_DOMAIN,
                hasToken: !!process.env.SHOPIFY_STOREFRONT_TOKEN
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            stack: error.stack
        });
    }
};
