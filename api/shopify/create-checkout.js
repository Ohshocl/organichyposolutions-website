/**
 * ORGANIC HYPOSOLUTIONS - CREATE CHECKOUT API ENDPOINT
 * ================================================================
 * File: /api/shopify/create-checkout.js
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

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
      message: 'This endpoint only accepts POST requests'
    });
  }

  try {
    console.log('Checkout request received:', JSON.stringify(req.body));
    
    // Get cart items from request body
    const { lineItems } = req.body;

    // Validate request
    if (!lineItems || !Array.isArray(lineItems) || lineItems.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request',
        message: 'Line items are required and must be an array'
      });
    }

    // For now, return a simple success response for testing
    // Without actually trying to call the Shopify API
    res.status(200).json({
      success: true,
      message: "Checkout API is now working!",
      mockCheckoutUrl: "https://checkout.example.com/placeholder",
      debug: {
        lineItemCount: lineItems.length,
        shopifyConfigured: !!(process.env.SHOPIFY_DOMAIN && process.env.SHOPIFY_STOREFRONT_TOKEN),
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Create checkout error:', error);
    
    res.status(500).json({
      success: false,
      error: "Checkout creation failed",
      details: error.message || "Unknown error",
      timestamp: new Date().toISOString()
    });
  }
}

export const config = {
  runtime: 'nodejs',
  maxDuration: 30
};
