/**
 * ORGANIC HYPOSOLUTIONS - HEALTH CHECK API ENDPOINT
 * ================================================================
 * File: /api/health.js
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
  
  // Check database connection
  let dbStatus = 'ok';
  try {
    // Simulating a database check
    // const db = await connectToDatabase();
    // await db.collection('test').findOne({});
  } catch (error) {
    console.error('Database health check failed:', error);
    dbStatus = 'error';
  }
  
  // Check Shopify API connection
  let shopifyStatus = 'ok';
  try {
    // Simulating a Shopify API check
    // const shopify = await getShopifyConnection();
    // await shopify.shop.get();
  } catch (error) {
    console.error('Shopify health check failed:', error);
    shopifyStatus = 'error';
  }
  
  // Health check response
  res.status(200).json({ 
    status: 'ok', 
    environment: process.env.NODE_ENV,
    services: {
      api: 'ok',
      database: dbStatus,
      shopify: shopifyStatus
    },
    timestamp: new Date().toISOString() 
  });
}
