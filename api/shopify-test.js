/**
 * ORGANIC HYPOSOLUTIONS - SHOPIFY API TEST ENDPOINT
 * ================================================================
 * File: /api/shopify-test.js
 * Purpose: Test endpoint for Shopify API integration
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

  try {
    // Check Shopify configuration
    const shopifyConfigured = !!(
      process.env.SHOPIFY_DOMAIN && 
      process.env.SHOPIFY_STOREFRONT_TOKEN
    );
    
    // Shopify-specific test response
    res.status(200).json({
      success: true,
      message: "Shopify API test endpoint is working!",
      config: {
        shopify: {
          configured: shopifyConfigured,
          domain: process.env.SHOPIFY_DOMAIN || 'Not configured',
          storefront: process.env.SHOPIFY_STOREFRONT_TOKEN ? 'Configured' : 'Not configured',
          adminApi: process.env.SHOPIFY_ADMIN_API_KEY ? 'Configured' : 'Not configured'
        }
      },
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    console.error('Shopify test error:', error);
    
    res.status(500).json({
      success: false,
      error: "Shopify test failed",
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

export const config = {
  runtime: 'nodejs',
  maxDuration: 10
};
