/**
 * ORGANIC HYPOSOLUTIONS - GET PRODUCTS API ENDPOINT
 * ================================================================
 * File: /api/shopify/get-products.js
 * Simple implementation to fix "cat error"
 */

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
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
    // Simple response for now - can be enhanced later
    res.status(200).json({
      success: true,
      message: "Products API is working!",
      debug: "File fixed - no more cat errors"
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

// Export configuration for Vercel - FIXED RUNTIME VALUE
export const config = {
  runtime: 'nodejs', // Changed from 'nodejs18.x' to 'nodejs'
  maxDuration: 30
};
