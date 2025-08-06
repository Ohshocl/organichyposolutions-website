/**
 * ORGANIC HYPOSOLUTIONS - GENERAL API TEST ENDPOINT
 * ================================================================
 * File: /api/test.js
 * Purpose: Simple test endpoint for API availability
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
    // Basic API test response
    res.status(200).json({
      success: true,
      message: "General API test endpoint is working!",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      apiVersion: '1.0',
      method: req.method,
      headers: {
        contentType: req.headers['content-type'],
        userAgent: req.headers['user-agent']
      }
    });
  } catch (error) {
    console.error('API test error:', error);
    
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
  maxDuration: 10
};
