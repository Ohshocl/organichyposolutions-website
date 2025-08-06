/**
 * ORGANIC HYPOSOLUTIONS - TEST API ENDPOINT
 * ================================================================
 * File: /api/shopify/test.js (or /api/shopify/shopify-test.js)
 * Purpose: Test endpoint for Shopify API integration
 */

// Import CORS helper
const { setCorsHeaders, handlePreflight } = require('../_utils/cors');

export default async function handler(req, res) {
  // Set CORS headers
  setCorsHeaders(req, res);
  
  // Handle preflight requests
  if (handlePreflight(req, res)) {
    return;
  }

  try {
    // Simple test response
    res.status(200).json({
      success: true,
      message: "Test API is working!",
      timestamp: new Date().toISOString(),
      shopifyConfigured: !!(process.env.SHOPIFY_DOMAIN && process.env.SHOPIFY_STOREFRONT_TOKEN)
    });
  } catch (error) {
    console.error('Test API error:', error);
    
    res.status(500).json({
      success: false,
      error: "Test failed",
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

export const config = {
  runtime: 'nodejs',
  maxDuration: 30
};
