// /api/shopify/get-products.js
// WORKING VERSION - Copy this exactly to your file

import { getProducts } from '../_utils/shopify-client.js';

export default async function handler(req, res) {
    console.log('🔍 Products API called:', req.method, req.query);
    
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        console.log('❌ Invalid method:', req.method);
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { limit = 50, after } = req.query;
        
        console.log('🔍 API: Fetching products...', { limit, after });
        
        const result = await getProducts(parseInt(limit), after);
        
        console.log('📦 Raw Shopify response:', JSON.stringify(result, null, 2));
        
        if (!result.data?.products) {
            console.log('❌ No products data in response');
            throw new Error('No products data received from Shopify');
        }

        // Format response for frontend
        const products = result.data.products.edges.map(edge => {
            console.log('🔄 Processing product:', edge.node.title);
            return {
                id: edge.node.id,
                title: edge.node.title,
                handle: edge.node.handle,
                description: edge.node.description,
                productType: edge.node.productType,
                vendor: edge.node.vendor,
                tags: edge.node.tags,
                availableForSale: edge.node.availableForSale,
                createdAt: edge.node.createdAt,
                updatedAt: edge.node.updatedAt,
                images: edge.node.images.edges.map(img => ({
                    id: img.node.id,
                    url: img.node.url,
                    altText: img.node.altText,
                    width: img.node.width,
                    height: img.node.height
                })),
                variants: edge.node.variants.edges.map(variant => ({
                    id: variant.node.id,
                    title: variant.node.title,
                    availableForSale: variant.node.availableForSale,
                    currentlyNotInStock: variant.node.currentlyNotInStock,
                    quantityAvailable: variant.node.quantityAvailable,
                    price: parseFloat(variant.node.priceV2.amount),
                    compareAtPrice: variant.node.compareAtPriceV2?.amount ? parseFloat(variant.node.compareAtPriceV2.amount) : null,
                    sku: variant.node.sku,
                    weight: variant.node.weight,
                    weightUnit: variant.node.weightUnit,
                    requiresShipping: variant.node.requiresShipping,
                    taxable: variant.node.taxable,
                    selectedOptions: variant.node.selectedOptions
                }))
            };
        });

        console.log('✅ Successfully processed products:', products.length);

        res.status(200).json({
            success: true,
            products,
            pageInfo: result.data.products.pageInfo,
            totalCount: products.length,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ API Error:', error);
        console.error('❌ Error stack:', error.stack);
        res.status(500).json({ 
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
}
