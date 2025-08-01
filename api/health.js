// ================================================================
// api/health.js
// Health Check Endpoint for OHS API Functions
// ================================================================

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://organichyposolutions.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    res.status(405).json({
      error: 'Method not allowed',
      message: 'This endpoint only accepts GET requests'
    });
    return;
  }

  try {
    const startTime = Date.now();
    
    // Basic system checks
    const healthChecks = {
      timestamp: new Date().toISOString(),
      status: 'healthy',
      version: process.env.npm_package_version || '2.1.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch
      },
      api: {
        baseUrl: process.env.SITE_URL || 'https://organichyposolutions.com',
        version: process.env.API_VERSION || '2024-01'
      },
      shopify: {
        configured: !!(process.env.SHOPIFY_DOMAIN && process.env.SHOPIFY_STOREFRONT_TOKEN),
        domain: process.env.SHOPIFY_DOMAIN ? 
          process.env.SHOPIFY_DOMAIN.replace(/^https?:\/\//, '') : null
      },
      services: {
        email: !!process.env.CONTACT_EMAIL,
        analytics: !!process.env.GOOGLE_ANALYTICS_ID
      }
    };

    // Calculate response time
    const responseTime = Date.now() - startTime;
    healthChecks.responseTime = `${responseTime}ms`;

    // Determine overall health status
    if (!healthChecks.shopify.configured) {
      healthChecks.status = 'degraded';
      healthChecks.warnings = ['Shopify integration not fully configured'];
    }

    // Add request information
    healthChecks.request = {
      userAgent: req.headers['user-agent'],
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      method: req.method,
      url: req.url
    };

    // Set appropriate status code
    const statusCode = healthChecks.status === 'healthy' ? 200 : 
                      healthChecks.status === 'degraded' ? 200 : 503;

    res.status(statusCode).json(healthChecks);

  } catch (error) {
    console.error('Health check error:', error);
    
    res.status(503).json({
      timestamp: new Date().toISOString(),
      status: 'unhealthy',
      error: 'Internal server error',
      message: 'Health check failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
