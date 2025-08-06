// /api/shopify/get-products.js
// DEBUG VERSION - Test if basic API call works

export default async function handler(req, res) {
    console.log('🔍 DEBUG: Products API called');
    
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        // Test environment variables
        const domain = process.env.SHOPIFY_DOMAIN;
        const token = process.env.SHOPIFY_STOREFRONT_TOKEN;
        
        console.log('🔧 Environment check:');
        console.log('Domain:', domain ? '✅ Set' : '❌ Missing');
        console.log('Token:', token ? '✅ Set' : '❌ Missing');
        
        if (!domain || !token) {
            return res.status(500).json({
                success: false,
                error: 'Missing environment variables',
                debug: {
                    domain: domain ? 'Set' : 'Missing',
                    token: token ? 'Set' : 'Missing'
                }
            });
        }
        
        // Simple Shopify API test
        const query = `
            query {
                products(first: 1) {
                    edges {
                        node {
                            id
                            title
                            handle
                        }
                    }
                }
            }
        `;
        
        console.log('🔄 Making Shopify API call...');
        
        const response = await fetch(`https://${domain}/api/2024-04/graphql.json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': token,
            },
            body: JSON.stringify({ query })
        });
        
        console.log('📡 Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.log('❌ Response error:', errorText);
            return res.status(500).json({
                success: false,
                error: `HTTP ${response.status}: ${errorText}`
            });
        }
        
        const data = await response.json();
        console.log('📦 Response data:', JSON.stringify(data, null, 2));
        
        res.status(200).json({
            success: true,
            debug: 'Direct API call worked',
            domain: domain,
            hasProducts: !!data.data?.products?.edges?.length,
            products: data.data?.products?.edges || []
        });
        
    } catch (error) {
        console.error('❌ Catch error:', error);
        console.error('❌ Error stack:', error.stack);
        
        res.status(500).json({
            success: false,
            error: error.message,
            stack: error.stack
        });
    }
}
