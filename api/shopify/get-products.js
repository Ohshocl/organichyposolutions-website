export default async function handler(req, res) {
    console.log('✅ Clean products API called');
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const domain = process.env.SHOPIFY_DOMAIN;
        const token = process.env.SHOPIFY_STOREFRONT_TOKEN;
        
        console.log('Environment:', { 
            domain: domain ? 'Set' : 'Missing', 
            token: token ? 'Set' : 'Missing' 
        });
        
        if (!domain || !token) {
            return res.status(500).json({
                success: false,
                error: 'Missing environment variables'
            });
        }
        
        const query = `{
            products(first: 1) {
                edges {
                    node {
                        id
                        title
                        handle
                    }
                }
            }
        }`;
        
        const response = await fetch(`https://${domain}/api/2024-04/graphql.json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': token,
            },
            body: JSON.stringify({ query })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            return res.status(500).json({
                success: false,
                error: `HTTP ${response.status}: ${errorText}`
            });
        }
        
        const data = await response.json();
        
        res.status(200).json({
            success: true,
            message: 'Products API working!',
            productCount: data.data?.products?.edges?.length || 0,
            products: data.data?.products?.edges || []
        });
        
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}
