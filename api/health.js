/**
 * ORGANIC HYPOSOLUTIONS - API HEALTH CHECK ENDPOINT
 * ================================================================
 * File: /api/health.js
 * Purpose: Simple health check endpoint for monitoring and testing
 * URL: /api/health
 * Method: GET
 * ================================================================
 */

export default async function handler(req, res) {
    
    // =================================================================
    // CORS HEADERS
    // =================================================================
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({
            success: false,
            error: 'Method not allowed',
            allowedMethods: ['GET']
        });
    }

    try {
        
        // =================================================================
        // HEALTH CHECK DATA
        // =================================================================
        
        const timestamp = new Date().toISOString();
        const uptime = process.uptime();
        const memoryUsage = process.memoryUsage();
        
        // Check environment variables (basic check)
        const hasShopifyConfig = !!(
            process.env.SHOPIFY_DOMAIN && 
            process.env.SHOPIFY_STOREFRONT_TOKEN
        );
        
        const hasEmailConfig = !!(
            process.env.GMAIL_USER && 
            process.env.GMAIL_APP_PASSWORD
        );

        // =================================================================
        // API ENDPOINTS STATUS
        // =================================================================
        
        const apiEndpoints = [
            { name: 'Health Check', path: '/api/health', status: 'operational' },
            { name: 'Get Products', path: '/api/shopify/get-products', status: hasShopifyConfig ? 'operational' : 'degraded' },
            { name: 'Create Checkout', path: '/api/shopify/create-checkout', status: hasShopifyConfig ? 'operational' : 'degraded' },
            { name: 'Contact Form', path: '/api/forms/contact', status: hasEmailConfig ? 'operational' : 'degraded' }
        ];

        // =================================================================
        // RESPONSE DATA
        // =================================================================
        
        const healthData = {
            success: true,
            status: 'healthy',
            service: 'Organic HypoSolutions API',
            version: '2.1.0',
            timestamp: timestamp,
            uptime: {
                seconds: Math.floor(uptime),
                readable: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`
            },
            system: {
                node: process.version,
                platform: process.platform,
                arch: process.arch,
                memory: {
                    used: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
                    total: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
                    external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`
                }
            },
            configuration: {
                shopify: hasShopifyConfig ? 'configured' : 'missing',
                email: hasEmailConfig ? 'configured' : 'missing',
                environment: process.env.NODE_ENV || 'development'
            },
            endpoints: apiEndpoints,
            business: {
                name: 'Organic HypoSolutions',
                website: 'https://organichyposolutions.com',
                phone: '(801) 712-5663',
                email: 'ohshocl@gmail.com',
                serviceArea: 'Utah'
            }
        };

        // =================================================================
        // LOG HEALTH CHECK
        // =================================================================
        
        console.log(`🏥 Health check requested at ${timestamp}`);
        console.log(`📊 System status: ${healthData.status}`);
        console.log(`⏱️ Uptime: ${healthData.uptime.readable}`);
        console.log(`🔧 Shopify config: ${hasShopifyConfig ? '✅' : '❌'}`);
        console.log(`📧 Email config: ${hasEmailConfig ? '✅' : '❌'}`);

        // =================================================================
        // SUCCESS RESPONSE
        // =================================================================
        
        res.status(200).json(healthData);

    } catch (error) {
        
        // =================================================================
        // ERROR HANDLING
        // =================================================================
        
        console.error('❌ Health check error:', error);
        
        res.status(500).json({
            success: false,
            status: 'unhealthy',
            service: 'Organic HypoSolutions API',
            error: 'Health check failed',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
}

// =================================================================
// EXPORT CONFIGURATION - VERCEL COMPATIBLE
// =================================================================

// ✅ CURRENT: Using supported Node.js runtime
export const config = {
    runtime: 'nodejs',      // Current supported runtime (Node.js 20.x)
    maxDuration: 10         // 10 seconds timeout for health checks
};
