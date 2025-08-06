/**
 * ORGANIC HYPOSOLUTIONS - GET PRODUCTS API ENDPOINT
 * ================================================================
 * File: /api/shopify/get-products.js
 */

export default async function handler(req, res) {
  // Set proper CORS headers
  const allowedOrigins = [
    'https://organichyposolutions.com',
    'https://www.organichyposolutions.com',
    'https://organichyposolutions-website.vercel.app',
    'https://organichyposolutions-website-git-main-ohss-projects-e45c0d7a.vercel.app',
    'https://organichyposolutions-website-zsvji7i3s-ohss-projects-e45c0d7a.vercel.app'
  ];
  
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers', 
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Check Shopify configuration
    const shopifyConfigured = !!(
      process.env.SHOPIFY_DOMAIN && 
      process.env.SHOPIFY_STOREFRONT_TOKEN
    );
    
    // Response with Shopify configuration status
    res.status(200).json({
      success: true,
      message: "Products API is working!",
      config: {
        shopify: {
          configured: shopifyConfigured,
          domain: process.env.SHOPIFY_DOMAIN || null,
          tokenConfigured: !!process.env.SHOPIFY_STOREFRONT_TOKEN
        }
      },
      debug: {
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
      }
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

export const config = {
  runtime: 'nodejs',
  maxDuration: 30
};
