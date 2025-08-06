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
  
  // Extract query parameters for test type
  const { type = 'default' } = req.query;
  
  // Different test responses based on requested test type
  let response = {
    success: true,
    message: 'Test endpoint working correctly',
    type: type,
    timestamp: new Date().toISOString()
  };
  
  switch (type) {
    case 'error':
      // Simulate an error response
      response = {
        success: false,
        error: 'This is a simulated error response',
        status: 500
      };
      return res.status(500).json(response);
      
    case 'delay':
      // Simulate a delayed response
      await new Promise(resolve => setTimeout(resolve, 2000));
      response.message = 'Delayed test response';
      break;
      
    case 'echo':
      // Echo back the request body
      response.echo = req.body;
      response.method = req.method;
      response.headers = req.headers;
      break;
      
    case 'env':
      // Return environment information (non-sensitive)
      response.environment = process.env.NODE_ENV;
      response.vercel = process.env.VERCEL || false;
      response.region = process.env.VERCEL_REGION || 'unknown';
      break;
  }
  
  // Return test response
  res.status(200).json(response);
}
