/**
 * ORGANIC HYPOSOLUTIONS - CREATE CHECKOUT API ENDPOINT
 * ================================================================
 * File: /api/shopify/create-checkout.js
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
  
  // Only allow POST requests for checkout creation
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Extract checkout data from request body
    const { 
      lineItems,
      email,
      shippingAddress,
      note,
      customAttributes = []
    } = req.body;
    
    // Validate required data
    if (!lineItems || !Array.isArray(lineItems) || lineItems.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid line items. At least one item is required.' 
      });
    }
    
    // Validate line items format
    for (const item of lineItems) {
      if (!item.variantId || !item.quantity) {
        return res.status(400).json({
          success: false,
          error: 'Each line item must include a variantId and quantity'
        });
      }
    }
    
    // Initialize Shopify client
    const shopifyClient = Client.buildClient({
      domain: process.env.SHOPIFY_STORE_DOMAIN,
      storefrontAccessToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN
    });
    
    // Create a new checkout
    const checkout = await shopifyClient.checkout.create();
    
    // Format line items for Shopify
    const formattedLineItems = lineItems.map(item => ({
      variantId: item.variantId,
      quantity: parseInt(item.quantity)
    }));
    
    // Add line items to checkout
    const checkoutWithItems = await shopifyClient.checkout.addLineItems(
      checkout.id, 
      formattedLineItems
    );
    
    // Set customer email if provided
    let updatedCheckout = checkoutWithItems;
    if (email) {
      updatedCheckout = await shopifyClient.checkout.updateEmail(
        updatedCheckout.id, 
        email
      );
    }
    
    // Set shipping address if provided
    if (shippingAddress) {
      updatedCheckout = await shopifyClient.checkout.updateShippingAddress(
        updatedCheckout.id,
        shippingAddress
      );
    }
    
    // Set note if provided
    if (note) {
      // Note: The SDK might not directly support notes, this is a workaround
      updatedCheckout = await shopifyClient.checkout.updateAttributes(
        updatedCheckout.id,
        { note }
      );
    }
    
    // Set custom attributes if provided
    if (customAttributes && customAttributes.length > 0) {
      updatedCheckout = await shopifyClient.checkout.updateAttributes(
        updatedCheckout.id,
        { customAttributes }
      );
    }
    
    // Return checkout information
    res.status(200).json({
      success: true,
      checkout: {
        id: updatedCheckout.id,
        webUrl: updatedCheckout.webUrl,
        subtotalPrice: updatedCheckout.subtotalPrice,
        totalPrice: updatedCheckout.totalPrice,
        lineItems: updatedCheckout.lineItems
      }
    });
    
  } catch (error) {
    console.error('Create checkout error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create checkout',
      details: error.message
    });
  }
}
