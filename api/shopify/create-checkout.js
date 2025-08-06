cat > api/shopify/create-checkout.js << 'EOF'
/**
 * ORGANIC HYPOSOLUTIONS - CREATE CHECKOUT API ENDPOINT (COMMONJS COMPATIBLE)
 * ================================================================
 * File: /api/shopify/create-checkout.js
 * Purpose: Server-side endpoint for creating Shopify checkouts
 * FIXED: Changed to CommonJS for Vercel compatibility
 * ================================================================
 */

const ShopifyClient = require('../_utils/shopify-client');

module.exports = async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');

    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            error: 'Method Not Allowed',
            message: 'Only POST requests are supported'
        });
    }

    try {
        console.log('POST /api/shopify/create-checkout - Starting request');
        
        // Validate request body
        if (!req.body || !req.body.lineItems) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'Missing required field: lineItems',
                    code: 'INVALID_REQUEST_BODY'
                }
            });
        }

        const { lineItems, shippingAddress, email, note } = req.body;
        
        // Validate line items
        if (!Array.isArray(lineItems) || lineItems.length === 0) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'lineItems must be a non-empty array',
                    code: 'INVALID_LINE_ITEMS'
                }
            });
        }

        // Validate each line item
        for (const item of lineItems) {
            if (!item.variantId || !item.quantity) {
                return res.status(400).json({
                    success: false,
                    error: {
                        message: 'Each line item must have variantId and quantity',
                        code: 'INVALID_LINE_ITEM_FORMAT'
                    }
                });
            }
            
            if (typeof item.quantity !== 'number' || item.quantity <= 0) {
                return res.status(400).json({
                    success: false,
                    error: {
                        message: 'Quantity must be a positive number',
                        code: 'INVALID_QUANTITY'
                    }
                });
            }
        }

        console.log('Request data:', { 
            lineItemsCount: lineItems.length, 
            hasShippingAddress: !!shippingAddress,
            hasEmail: !!email 
        });

        // Initialize Shopify client
        const shopify = new ShopifyClient();
        
        // Prepare checkout input
        const checkoutInput = {
            lineItems: lineItems.map(item => ({
                variantId: item.variantId,
                quantity: item.quantity
            }))
        };

        // Add optional fields
        if (email) {
            checkoutInput.email = email;
        }
        
        if (shippingAddress) {
            checkoutInput.shippingAddress = shippingAddress;
        }
        
        if (note) {
            checkoutInput.note = note;
        }

        console.log('Creating checkout with input:', checkoutInput);

        // Create checkout
        const checkout = await shopify.createCheckout(checkoutInput.lineItems);
        
        console.log('Checkout created successfully:', {
            checkoutId: checkout.id,
            webUrl: checkout.webUrl,
            totalPrice: checkout.totalPrice
        });

        // Transform response
        const response = {
            success: true,
            data: {
                checkout: {
                    id: checkout.id,
                    webUrl: checkout.webUrl,
                    totalPrice: {
                        amount: parseFloat(checkout.totalPrice.amount),
                        currencyCode: checkout.totalPrice.currencyCode
                    },
                    subtotalPrice: {
                        amount: parseFloat(checkout.subtotalPrice.amount),
                        currencyCode: checkout.subtotalPrice.currencyCode
                    },
                    totalTax: checkout.totalTax && {
                        amount: parseFloat(checkout.totalTax.amount),
                        currencyCode: checkout.totalTax.currencyCode
                    },
                    lineItems: checkout.lineItems.edges.map(edge => ({
                        id: edge.node.id,
                        quantity: edge.node.quantity,
                        title: edge.node.title,
                        variant: {
                            id: edge.node.variant.id,
                            title: edge.node.variant.title,
                            price: {
                                amount: parseFloat(edge.node.variant.price.amount),
                                currencyCode: edge.node.variant.price.currencyCode
                            },
                            product: {
                                title: edge.node.variant.product.title,
                                handle: edge.node.variant.product.handle
                            }
                        }
                    })),
                    shippingAddress: checkout.shippingAddress
                }
            },
            meta: {
                timestamp: new Date().toISOString(),
                requestId: `req_${Date.now()}`,
                api: 'shopify-checkout',
                version: '1.0'
            }
        };

        return res.status(201).json(response);

    } catch (error) {
        console.error('Error in create-checkout API:', error);
        
        return res.status(500).json({
            success: false,
            error: {
                message: 'Failed to create checkout',
                details: error.message,
                code: 'SHOPIFY_CHECKOUT_ERROR'
            },
            meta: {
                timestamp: new Date().toISOString(),
                requestId: `req_${Date.now()}`,
                api: 'shopify-checkout',
                version: '1.0'
            }
        });
    }
};
EOF
