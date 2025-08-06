/**
 * ORGANIC HYPOSOLUTIONS - HEALTH CHECK API ENDPOINT
 * ================================================================
 * File: /api/health.js
 */

// Import CORS helper
const { setCorsHeaders, handlePreflight } = require('./_utils/cors');

export default async function handler(req, res) {
  // Set CORS headers
  setCorsHeaders(req, res);
  
  // Handle preflight requests
  if (handlePreflight(req, res)) {
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

    res.status(200).json(healthChecks);

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

export const config = {
  runtime: 'nodejs',
  maxDuration: 30
};
