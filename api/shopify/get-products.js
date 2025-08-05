/**
 * ORGANIC HYPOSOLUTIONS - GET PRODUCTS API ENDPOINT (SIMPLIFIED & FIXED)
 * ================================================================
 * File: /api/shopify/get-products.js
 * Purpose: Fetch products directly from Shopify
 * FIXED: Removed complex cart.js server-side integration
 * SIMPLIFIED: Just fetches from Shopify, let frontend handle cart.js mapping
 * ================================================================
 */

import { getProducts } from '../_utils/shopify-client.js';

export default async function handler(req, res) {
    // =================================================================
    // CORS HEADERS
    // =================================================================
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({
            success: false,
            error: 'Method not allowed',
            allowedMethods: ['GET']
        });
    }

    try {
        console.log('🔍 Fetching products from Shopify...');

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
        // QUERY PARAMETERS
        // =================================================================
        
        const {
            limit = '50',
            cursor = null
        } = req.query;

        const parsedLimit = Math.min(parseInt(limit) || 50, 250);

        console.log(`📋 Fetching ${parsedLimit} products`);

        // =================================================================
        // FETCH FROM SHOPIFY
        // =================================================================
        
        const shopifyResult = await getProducts(parsedLimit, cursor);
        
        if (!shopifyResult.success) {
            console.error('❌ Shopify fetch failed:', shopifyResult.errors);
            return res.status(500).json({
                success: false,
                error: 'Failed to fetch products from Shopify',
                details: shopifyResult.errors || ['Unknown Shopify error']
            });
        }

        // =================================================================
        // FORMAT PRODUCTS (SIMPLE FORMAT)
        // =================================================================
        
        const products = shopifyResult.products.map(product => {
            // Get default variant for pricing
            const defaultVariant = product.variants?.edges?.[0]?.node;
            
            return {
                // Basic Shopify data
                id: product.id,
                handle: product.handle,
                title: product.title,
                description: product.description,
                vendor: product.vendor || 'Organic HypoSolutions',
                productType: product.productType,
                tags: product.tags || [],
                
                // Availability
                availableForSale: product.availableForSale,
                
                // Pricing from Shopify
                price: parseFloat(defaultVariant?.priceV2?.amount || 0),
                compareAtPrice: parseFloat(defaultVariant?.compareAtPriceV2?.amount || 0),
                currency: defaultVariant?.priceV2?.currencyCode || 'USD',
                
                // Images
                images: product.images?.edges?.map(edge => ({
                    id: edge.node.id,
                    url: edge.node.url,
                    altText: edge.node.altText || product.title
                })) || [],
                featuredImage: product.images?.edges?.[0]?.node?.url || null,
                
                // Variants
                variants: product.variants?.edges?.map(edge => ({
                    id: edge.node.id,
                    title: edge.node.title,
                    sku: edge.node.sku,
                    price: parseFloat(edge.node.priceV2?.amount || 0),
                    compareAtPrice: parseFloat(edge.node.compareAtPriceV2?.amount || 0),
                    availableForSale: edge.node.availableForSale,
                    quantityAvailable: edge.node.quantityAvailable
                })) || [],
                
                // Default variant for easy access
                defaultVariantId: defaultVariant?.id,
                
                // Timestamps
                createdAt: product.createdAt,
                updatedAt: product.updatedAt
            };
        });

        // =================================================================
        // SUCCESS RESPONSE
        // =================================================================
        
        console.log(`✅ Successfully fetched ${products.length} products`);

        const responseData = {
            success: true,
            products: products,
            pagination: {
                hasNextPage: shopifyResult.pageInfo?.hasNextPage || false,
                hasPreviousPage: shopifyResult.pageInfo?.hasPreviousPage || false,
                startCursor: shopifyResult.pageInfo?.startCursor || null,
                endCursor: shopifyResult.pageInfo?.endCursor || null
            },
            meta: {
                total: products.length,
                requested: parsedLimit,
                timestamp: new Date().toISOString(),
                domain: SHOPIFY_DOMAIN
            }
        };

        res.status(200).json(responseData);

    } catch (error) {
        console.error('❌ API Error:', error);
        console.error('Stack trace:', error.stack);

        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message,
            helpText: 'Please try again or contact support if the error persists'
        });
    }
}

// =================================================================
// EXPORT CONFIGURATION
// =================================================================

export const config = {
    runtime: 'nodejs18.x',
    maxDuration: 30
};
