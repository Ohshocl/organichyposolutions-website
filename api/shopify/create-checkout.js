/**
 * ORGANIC HYPOSOLUTIONS - CREATE CHECKOUT API ENDPOINT (COMMONJS COMPATIBLE)
 * ================================================================
 * File: /api/shopify/create-checkout.js
 * Purpose: Server-side endpoint for creating Shopify checkouts
 * FIXED: Changed to CommonJS for Vercel compatibility
 * ================================================================
 */

const { createCheckout } = require('../_utils/shopify-client');

module.exports = async function handler(req, res) {
    
    // =================================================================
    // CORS HEADERS & PREFLIGHT
    // =================================================================
    
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
    
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
        // ENVIRONMENT VALIDATION
        // =================================================================
        
        const SHOPIFY_DOMAIN = process.env.SHOPIFY_DOMAIN;
        const SHOPIFY_STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN;

        if (!SHOPIFY_DOMAIN || !SHOPIFY_STOREFRONT_TOKEN) {
            console.error('❌ Missing Shopify environment variables');
            return res.status(500).json({
                success: false,
                error: 'Server configuration error',
                details: ['Missing Shopify credentials'],
                helpText: 'Please contact support if this error persists'
            });
        }
        
        // =================================================================
        // REQUEST BODY VALIDATION
        // =================================================================
        
        const { lineItems, shippingAddress, note } = req.body;
        
        console.log('📊 Request data:', {
            lineItemsCount: lineItems?.length || 0,
            hasShippingAddress: !!shippingAddress,
            hasNote: !!note
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

        const response = {
            success: true,
            checkoutUrl: checkout.webUrl,
            checkoutId: checkout.id,
            totalPrice: {
                amount: checkout.totalPriceV2?.amount || '0.00',
                currencyCode: checkout.totalPriceV2?.currencyCode || 'USD'
            },
            subtotalPrice: {
                amount: checkout.subtotalPriceV2?.amount || '0.00',
                currencyCode: checkout.subtotalPriceV2?.currencyCode || 'USD'
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
};
