// /api/_utils/shopify-client.js
// WORKING VERSION - Copy this exactly

const SHOPIFY_DOMAIN = process.env.SHOPIFY_DOMAIN;
const SHOPIFY_STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN;
const SHOPIFY_ADMIN_API_KEY = process.env.SHOPIFY_ADMIN_API_KEY;

console.log('🔧 Shopify client initializing...');
console.log('Domain:', SHOPIFY_DOMAIN ? '✅ Set' : '❌ Missing');
console.log('Storefront Token:', SHOPIFY_STOREFRONT_TOKEN ? '✅ Set' : '❌ Missing');
console.log('Admin Token:', SHOPIFY_ADMIN_API_KEY ? '✅ Set' : '❌ Missing');

if (!SHOPIFY_DOMAIN || !SHOPIFY_STOREFRONT_TOKEN) {
    throw new Error('Missing required Shopify environment variables');
}

const API_VERSION = '2024-04';

// GraphQL query for products
const GET_PRODUCTS_QUERY = `
    query getProducts($first: Int!, $after: String) {
        products(first: $first, after: $after) {
            pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
            }
            edges {
                cursor
                node {
                    id
                    title
                    handle
                    description
                    productType
                    vendor
                    tags
                    availableForSale
                    createdAt
                    updatedAt
                    images(first: 10) {
                        edges {
                            node {
                                id
                                url
                                altText
                                width
                                height
                            }
                        }
                    }
                    variants(first: 100) {
                        edges {
                            node {
                                id
                                title
                                availableForSale
                                currentlyNotInStock
                                quantityAvailable
                                priceV2 {
                                    amount
                                    currencyCode
                                }
                                compareAtPriceV2 {
                                    amount
                                    currencyCode
                                }
                                selectedOptions {
                                    name
                                    value
                                }
                                sku
                                weight
                                weightUnit
                                requiresShipping
                                taxable
                            }
                        }
                    }
                }
            }
        }
    }
`;

// Improved API request function with retry logic
async function shopifyStorefrontRequest(query, variables = {}) {
    const maxRetries = 3;
    const baseDelay = 1000;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`🔄 Shopify API attempt ${attempt}/${maxRetries}`);
            console.log('Query variables:', variables);
            
            const url = `https://${SHOPIFY_DOMAIN}/api/${API_VERSION}/graphql.json`;
            console.log('Request URL:', url);
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
                },
                body: JSON.stringify({
                    query,
                    variables
                })
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', Object.fromEntries(response.headers.entries()));

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`❌ HTTP ${response.status}: ${errorText}`);
                
                // Don't retry on 4xx errors (client errors)
                if (response.status >= 400 && response.status < 500) {
                    throw new Error(`HTTP ${response.status}: ${errorText}`);
                }
                
                // Retry on 5xx errors (server errors)
                if (attempt === maxRetries) {
                    throw new Error(`HTTP ${response.status} after ${maxRetries} attempts`);
                }
                
                await new Promise(resolve => setTimeout(resolve, baseDelay * Math.pow(2, attempt - 1)));
                continue;
            }

            const data = await response.json();
            console.log('Response data keys:', Object.keys(data));
            
            // Check for GraphQL errors
            if (data.errors && data.errors.length > 0) {
                console.error('❌ GraphQL errors:', data.errors);
                throw new Error(`GraphQL errors: ${data.errors.map(e => e.message).join(', ')}`);
            }

            console.log('✅ Shopify API success');
            return data;

        } catch (error) {
            console.error(`❌ Attempt ${attempt} failed:`, error.message);
            
            if (attempt === maxRetries) {
                throw error;
            }
            
            await new Promise(resolve => setTimeout(resolve, baseDelay * Math.pow(2, attempt - 1)));
        }
    }
}

// Export functions
export async function getProducts(limit = 50, after = null) {
    try {
        console.log('📦 getProducts called with:', { limit, after });
        
        const result = await shopifyStorefrontRequest(GET_PRODUCTS_QUERY, {
            first: limit,
            after: after
        });

        console.log('📦 getProducts result keys:', Object.keys(result));
        console.log('📦 Has products data:', !!result.data?.products);
        
        return result;
    } catch (error) {
        console.error('❌ getProducts failed:', error);
        throw error;
    }
}

export async function healthCheck() {
    try {
        console.log('🏥 Health check starting...');
        
        const result = await shopifyStorefrontRequest(`
            query {
                shop {
                    name
                    primaryDomain {
                        url
                    }
                }
            }
        `);
        
        console.log('🏥 Health check success');
        return {
            success: true,
            shop: result.data.shop
        };
    } catch (error) {
        console.error('🏥 Health check failed:', error);
        return {
            success: false,
            error: error.message
        };
    }
}
