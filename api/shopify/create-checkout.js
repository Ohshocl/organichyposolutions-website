/**
 * ORGANIC HYPOSOLUTIONS - CREATE CHECKOUT API ENDPOINT
 * ================================================================
 * File: /api/shopify/create-checkout.js
 * Purpose: Server-side endpoint for creating Shopify checkouts
 * Dependencies: /api/_utils/shopify-client.js
 * Method: POST
 * 
 * REQUEST BODY:
 * {
 *   "lineItems": [
 *     {
 *       "variantId": "gid://shopify/ProductVariant/123456789",
 *       "quantity": 2
 *     }
 *   ],
 *   "shippingAddress": { // Optional
 *     "firstName": "John",
 *     "lastName": "Doe", 
 *     "company": "OHS Customer",
 *     "address1": "123 Main St",
 *     "city": "Salt Lake City",
 *     "province": "UT",
 *     "country": "US",
 *     "zip": "84101"
 *   }
 * }
 * 
 * RESPONSE:
 * Success: { success: true, checkoutUrl: "https://...", checkoutId: "..." }
 * Error: { success: false, error: "Error message", details: [...] }
 * ================================================================
 */

import { createCheckout, convertCartToLineItems, validateVariant } from '../_utils/shopify-client.js';

/**
 * Main handler for create-checkout API endpoint
 */
export default async function handler(req, res) {
    
    // =================================================================
    // CORS HEADERS & PREFLIGHT
    // =================================================================
    
    // Set CORS headers for cross-origin requests
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
    
    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        console.log('🔄 Handling CORS preflight request');
        res.status(200).end();
        return;
    }

    // =================================================================
    // METHOD VALIDATION
    // =================================================================
    
    if (req.method !== 'POST') {
        console.warn(`❌ Invalid method: ${req.method}`);
        return res.status(405).json({ 
            success: false,
            error: 'Method not allowed',
            allowedMethods: ['POST'],
            details: ['This endpoint only accepts POST requests']
        });
    }

    console.log('🛒 Processing checkout creation request...');

    try {
        
        // =================================================================
        // REQUEST BODY VALIDATION
        // =================================================================
        
        const { lineItems, shippingAddress, customerType, cartData } = req.body;
        
        // Log request for debugging
        console.log('📊 Request data:', {
            lineItemsCount: lineItems?.length || 0,
            hasShippingAddress: !!shippingAddress,
            customerType: customerType || 'retail'
        });

        // Validate line items exist
        if (!lineItems) {
            return res.status(400).json({
                success: false,
                error: 'Missing line items',
                details: ['Request body must include lineItems array']
            });
        }

        // Validate line items is array
        if (!Array.isArray(lineItems)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid line items format',
                details: ['lineItems must be an array']
            });
        }

        // Validate line items not empty
        if (lineItems.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Empty cart',
                details: ['At least one line item is required']
            });
        }

        // =================================================================
        // LINE ITEMS VALIDATION & PROCESSING
        // =================================================================
        
        const validatedLineItems = [];
        const validationErrors = [];

        for (let i = 0; i < lineItems.length; i++) {
            const item = lineItems[i];
            
            // Check required fields
            if (!item.variantId) {
                validationErrors.push(`Line item ${i + 1}: Missing variantId`);
                continue;
            }
            
            if (!item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0) {
                validationErrors.push(`Line item ${i + 1}: Invalid quantity (must be positive number)`);
                continue;
            }

            // Ensure variantId is in correct format
            let variantId = item.variantId;
            if (!variantId.startsWith('gid://shopify/ProductVariant/')) {
                // Convert numeric ID to GID format if needed
                if (/^\d+$/.test(variantId)) {
                    variantId = `gid://shopify/ProductVariant/${variantId}`;
                } else {
                    validationErrors.push(`Line item ${i + 1}: Invalid variantId format`);
                    continue;
                }
            }

            validatedLineItems.push({
                variantId: variantId,
                quantity: parseInt(item.quantity)
            });
        }

        // Return validation errors if any
        if (validationErrors.length > 0) {
            return res.status(400).json({
                success: false,
                error: 'Line item validation failed',
                details: validationErrors
            });
        }

        console.log(`✅ Validated ${validatedLineItems.length} line items`);

        // =================================================================
        // SHIPPING ADDRESS VALIDATION (Optional)
        // =================================================================
        
        let processedShippingAddress = null;
        
        if (shippingAddress) {
            // Validate shipping address format
            const requiredFields = ['firstName', 'lastName', 'address1', 'city', 'province', 'country', 'zip'];
            const addressErrors = [];
            
            for (const field of requiredFields) {
                if (!shippingAddress[field] || typeof shippingAddress[field] !== 'string') {
                    addressErrors.push(`Missing or invalid ${field}`);
                }
            }
            
            if (addressErrors.length > 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid shipping address',
                    details: addressErrors
                });
            }
            
            processedShippingAddress = {
                firstName: shippingAddress.firstName.trim(),
                lastName: shippingAddress.lastName.trim(),
                company: shippingAddress.company?.trim() || '',
                address1: shippingAddress.address1.trim(),
                address2: shippingAddress.address2?.trim() || '',
                city: shippingAddress.city.trim(),
                province: shippingAddress.province.trim(),
                country: shippingAddress.country.trim(),
                zip: shippingAddress.zip.trim()
            };
            
            console.log('📮 Shipping address validated');
        }

        // =================================================================
        // CREATE SHOPIFY CHECKOUT
        // =================================================================
        
        console.log('🔄 Creating Shopify checkout...');
        
        const checkoutResult = await createCheckout(validatedLineItems, processedShippingAddress);
        
        if (!checkoutResult.success) {
            console.error('❌ Checkout creation failed:', checkoutResult.errors);
            return res.status(500).json({
                success: false,
                error: 'Failed to create checkout',
                details: checkoutResult.errors
            });
        }

        const checkout = checkoutResult.checkout;
        
        if (!checkout || !checkout.webUrl) {
            console.error('❌ Invalid checkout response - missing webUrl');
            return res.status(500).json({
                success: false,
                error: 'Invalid checkout response',
                details: ['Checkout was created but webUrl is missing']
            });
        }

        // =================================================================
        // SUCCESS RESPONSE
        // =================================================================
        
        console.log('✅ Checkout created successfully');
        console.log(`🔗 Checkout URL: ${checkout.webUrl}`);
        console.log(`💰 Total: ${checkout.totalPriceV2?.amount} ${checkout.totalPriceV2?.currencyCode}`);

        // Prepare success response
        const response = {
            success: true,
            checkoutUrl: checkout.webUrl,
            checkoutId: checkout.id,
            totalPrice: {
                amount: checkout.totalPriceV2?.amount || '0.00',
                currencyCode: checkout.totalPriceV2?.currencyCode || 'USD'
            },
            lineItemsCount: checkout.lineItems?.edges?.length || validatedLineItems.length,
            requiresShipping: checkout.requiresShipping || true,
            ready: checkout.ready || false
        };

        // Add debugging info in development
        if (process.env.NODE_ENV === 'development') {
            response.debug = {
                processedLineItems: validatedLineItems,
                originalRequest: {
                    lineItemsCount: lineItems.length,
                    customerType: customerType,
                    hasShippingAddress: !!shippingAddress
                }
            };
        }

        res.status(200).json(response);

    } catch (error) {
        
        // =================================================================
        // ERROR HANDLING
        // =================================================================
        
        console.error('❌ Checkout creation error:', error);
        console.error('Stack trace:', error.stack);

        // Determine error type and appropriate response
        let statusCode = 500;
        let errorMessage = 'Internal server error during checkout creation';
        const errorDetails = [error.message];

        // Handle specific error types
        if (error.message.includes('GraphQL')) {
            statusCode = 400;
            errorMessage = 'Shopify API error';
        } else if (error.message.includes('Network')) {
            statusCode = 503;
            errorMessage = 'Service temporarily unavailable';
        } else if (error.message.includes('Authentication') || error.message.includes('Unauthorized')) {
            statusCode = 401;
            errorMessage = 'Authentication error';
        }

        res.status(statusCode).json({
            success: false,
            error: errorMessage,
            details: errorDetails,
            timestamp: new Date().toISOString()
        });
    }
}

// =================================================================
// EXPORT CONFIGURATION
// =================================================================

// Set the runtime for Vercel serverless functions
export const config = {
    runtime: 'nodejs18.x',
    maxDuration: 30 // 30 seconds timeout
};

// =================================================================
// USAGE EXAMPLES
// =================================================================

/*
Example Frontend Usage:

// Basic checkout creation
const response = await fetch('/api/shopify/create-checkout', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        lineItems: [
            {
                variantId: 'gid://shopify/ProductVariant/123456789',
                quantity: 2
            },
            {
                variantId: 'gid://shopify/ProductVariant/987654321',
                quantity: 1
            }
        ]
    })
});

const data = await response.json();

if (data.success) {
    // Redirect to checkout
    window.location.href = data.checkoutUrl;
} else {
    console.error('Checkout failed:', data.error);
    alert('Failed to create checkout: ' + data.error);
}

// With shipping address
const responseWithShipping = await fetch('/api/shopify/create-checkout', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        lineItems: [...],
        shippingAddress: {
            firstName: 'John',
            lastName: 'Doe',
            company: 'OHS Customer',
            address1: '123 Main St',
            city: 'Salt Lake City',
            province: 'UT',
            country: 'US',
            zip: '84101'
        }
    })
});
*/
