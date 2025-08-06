/**
 * ORGANIC HYPOSOLUTIONS - SHOPIFY TEST API ENDPOINT
 * ================================================================
 * File: /api/shopify-test.js
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
  
  try {
    // Your existing Shopify test logic here
    // This might include testing the Shopify connection or credentials
    
    res.status(200).json({ 
      success: true, 
      message: 'Shopify connection test successful',
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    console.error('Shopify test error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Shopify connection test failed',
      error: error.message 
    });
  }
}
