/**
 * ORGANIC HYPOSOLUTIONS - TEST API ENDPOINT
 * ================================================================
 * File: /api/test.js
 */

export default async function handler(req, res) {
  // DIRECT CORS HANDLING - No imports needed
  const origin = req.headers.origin;
  // Allow any origin from our domains
  res.setHeader('Access-Control-Allow-Origin', origin || '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', '*');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Test endpoint response
  res.status(200).json({ 
    success: true, 
    message: 'Test endpoint working correctly', 
    timestamp: new Date().toISOString() 
  });
}
