/**
 * ORGANIC HYPOSOLUTIONS - API PROXY ENDPOINT
 * ================================================================
 * File: /api/proxy.js
 */

// You may need to import fetch if using Node.js
// import fetch from 'node-fetch';

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
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { targetUrl, method, body, headers } = req.body;
    
    // Only allow proxying to our own domain or Shopify
    if (!targetUrl.includes('organichyposolutions') && 
        !targetUrl.includes('shopify')) {
      return res.status(403).json({ error: 'Forbidden target URL' });
    }
    
    // Make the request to the target URL
    const fetchOptions = {
      method: method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };
    
    if (body && (method === 'POST' || method === 'PUT')) {
      fetchOptions.body = JSON.stringify(body);
    }
    
    const response = await fetch(targetUrl, fetchOptions);
    const data = await response.json();
    
    // Return the proxied response
    res.status(response.status).json(data);
    
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({
      success: false,
      error: 'Proxy request failed',
      details: error.message
    });
  }
}
