/**
 * ORGANIC HYPOSOLUTIONS - GET PRODUCTS API ENDPOINT
 * ================================================================
 * File: /api/shopify/get-products.js
 * Simple implementation to fix CORS errors
 */

// Import CORS helper
const { setCorsHeaders, handlePreflight } = require('../_utils/cors');

export default async function handler(req, res) {
  // Set proper CORS headers
  setCorsHeaders(req, res);
  
  // Handle preflight requests
  if (handlePreflight(req, res)) {
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    // Check Shopify configuration
    const shopifyConfigured = !!(
      process.env.SHOPIFY_DOMAIN && 
      process.env.SHOPIFY_STOREFRONT_TOKEN
    );
    
    // Response with Shopify configuration status
    res.status(200).json({
      success: true,
      message: "Products API is working!",
      config: {
        shopify: {
          configured: shopifyConfigured,
          domain: process.env.SHOPIFY_DOMAIN || null,
          tokenConfigured: !!process.env.SHOPIFY_STOREFRONT_TOKEN
        }
      },
      debug: {
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

export const config = {
  runtime: 'nodejs',
  maxDuration: 30
};
