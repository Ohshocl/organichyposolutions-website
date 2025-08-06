/**
 * ORGANIC HYPOSOLUTIONS - SHOPIFY TEST API ENDPOINT
 * ================================================================
 * File: /api/shopify-test.js
 */

// Shopify client import
import Client from 'shopify-buy';

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
    // Initialize Shopify client
    const shopifyClient = Client.buildClient({
      domain: process.env.SHOPIFY_STORE_DOMAIN,
      storefrontAccessToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN
    });
    
    // Test Shopify connection by getting shop information
    const shop = await shopifyClient.shop.fetchInfo();
    
    // Get a sample product to verify product access
    const products = await shopifyClient.product.fetchAll(1);
    const hasProducts = products && products.length > 0;
    
    // Check if we can access checkout
    let checkoutTest = 'not_tested';
    try {
      const checkout = await shopifyClient.checkout.create();
      checkoutTest = checkout && checkout.id ? 'success' : 'failed';
    } catch (checkoutError) {
      console.error('Checkout test failed:', checkoutError);
      checkoutTest = 'failed';
    }
    
    // Return successful test results
    res.status(200).json({
      success: true,
      message: 'Shopify connection test successful',
      shopName: shop.name,
      productAccess: hasProducts ? 'success' : 'failed',
      checkoutAccess: checkoutTest,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Shopify test error:', error);
    
    // Return detailed error response
    res.status(500).json({
      success: false,
      message: 'Shopify connection test failed',
      error: error.message,
      details: {
        storeDomain: process.env.SHOPIFY_STORE_DOMAIN ? 'configured' : 'missing',
        accessToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ? 'configured' : 'missing',
        errorType: error.name || 'Unknown'
      }
    });
  }
}
