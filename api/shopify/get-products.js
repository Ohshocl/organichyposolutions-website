/**
 * ORGANIC HYPOSOLUTIONS - GET PRODUCTS API ENDPOINT
 * ================================================================
 * File: /api/shopify/get-products.js
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
  
  // Only allow GET requests for fetching products
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get query parameters
    const { 
      limit = 20,
      page = 1,
      collection = null,
      sort = 'title',
      direction = 'asc',
      query = '',
      productType = '',
      tags = ''
    } = req.query;
    
    // Initialize Shopify client
    const shopifyClient = Client.buildClient({
      domain: process.env.SHOPIFY_STORE_DOMAIN,
      storefrontAccessToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN
    });
    
    // Prepare query options
    const options = {
      first: parseInt(limit),
      sortKey: sort.toUpperCase(),
      reverse: direction.toLowerCase() === 'desc'
    };
    
    // Handle pagination
    if (page > 1) {
      // For pagination, we would need to implement cursor-based pagination
      // This is a simplified approach
      options.first = parseInt(limit) * parseInt(page);
    }
    
    // Fetch products (with different approaches based on the query parameters)
    let products;
    
    if (collection) {
      // Fetch products from a specific collection
      const collectionData = await shopifyClient.collection.fetchWithProducts(collection, options);
      products = collectionData.products;
    } else if (query) {
      // Fetch products matching a search query
      // Note: The Shopify Buy SDK doesn't support search directly, so this is a workaround
      const allProducts = await shopifyClient.product.fetchAll();
      products = allProducts.filter(product => 
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
      );
    } else if (productType || tags) {
      // Fetch products by product type or tags
      const allProducts = await shopifyClient.product.fetchAll();
      products = allProducts.filter(product => {
        const matchesType = !productType || product.productType.toLowerCase() === productType.toLowerCase();
        const matchesTags = !tags || (product.tags && product.tags.some(tag => tag.toLowerCase().includes(tags.toLowerCase())));
        return matchesType && matchesTags;
      });
    } else {
      // Fetch all products
      products = await shopifyClient.product.fetchAll(options);
    }
    
    // Apply pagination if needed
    if (page > 1) {
      const startIndex = (parseInt(page) - 1) * parseInt(limit);
      products = products.slice(startIndex, startIndex + parseInt(limit));
    }
    
    // Process products to standardize the response format
    const formattedProducts = products.map(product => ({
      id: product.id,
      title: product.title,
      handle: product.handle,
      description: product.description,
      productType: product.productType,
      tags: product.tags,
      vendor: product.vendor,
      images: product.images.map(image => ({
        id: image.id,
        src: image.src,
        altText: image.altText
      })),
      variants: product.variants.map(variant => ({
        id: variant.id,
        title: variant.title,
        price: variant.price,
        compareAtPrice: variant.compareAtPrice,
        available: variant.available,
        sku: variant.sku
      })),
      url: `/products/${product.handle}`
    }));
    
    // Return the formatted products
    res.status(200).json({
      success: true,
      products: formattedProducts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: products.length
      }
    });
    
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products',
      details: error.message
    });
  }
}
