/**
 * ORGANIC HYPOSOLUTIONS - SERVER-SIDE SHOPIFY CLIENT (FIXED)
 * ================================================================
 * File: /api/_utils/shopify-client.js
 * Purpose: Secure server-side Shopify API communication
 * FIXED: Changed to ES6 modules for compatibility
 * ================================================================
 */

// =================================================================
// CONFIGURATION & VALIDATION
// =================================================================

const SHOPIFY_DOMAIN = process.env.SHOPIFY_DOMAIN;
const SHOPIFY_STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN;
const API_VERSION = '2024-01';

// Validate required environment variables
if (!SHOPIFY_DOMAIN || !SHOPIFY_STOREFRONT_TOKEN) {
    console.error('❌ Missing required Shopify environment variables');
    console.error('Required: SHOPIFY_DOMAIN, SHOPIFY_STOREFRONT_TOKEN');
    throw new Error('Missing Shopify configuration');
}

console.log('✅ Shopify client initialized for domain:', SHOPIFY_DOMAIN);

// =================================================================
// GRAPHQL MUTATIONS & QUERIES (KEPT YOUR EXACT QUERIES)
// =================================================================

const CREATE_CHECKOUT_MUTATION = `
    mutation checkoutCreate($input: CheckoutCreateInput!) {
        checkoutCreate(input: $input) {
            checkout {
                id
                webUrl
                totalPriceV2 {
                    amount
                    currencyCode
                }
                subtotalPriceV2 {
                    amount
                    currencyCode
                }
                totalTaxV2 {
                    amount
                    currencyCode
                }
                lineItems(first: 250) {
                    edges {
                        node {
                            id
                            title
                            quantity
                            variant {
                                id
                                title
                                priceV2 {
                                    amount
                                    currencyCode
                                }
                            }
                        }
                    }
                }
                shippingAddress {
                    firstName
                    lastName
                    company
                    address1
                    city
                    province
                    country
                    zip
                }
                ready
                requiresShipping
                currencyCode
            }
            checkoutUserErrors {
                field
                message
                code
            }
            userErrors {
                field
                message
            }
        }
    }
`;

const GET_PRODUCTS_QUERY = `
    query getProducts($first: Int!, $after: String) {
        products(first: $first, after: $after) {
            edges {
                node {
                    id
                    handle
                    title
                    description
                    descriptionHtml
                    vendor
                    productType
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
                                sku
                                availableForSale
                                quantityAvailable
                                requiresShipping
                                weight
                                weightUnit
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
                                image {
                                    id
                                    url
                                    altText
                                }
                            }
                        }
                    }
                    options {
                        id
                        name
                        values
                    }
                    priceRange {
                        minVariantPrice {
                            amount
                            currencyCode
                        }
                        maxVariantPrice {
                            amount
                            currencyCode
                        }
                    }
                    seo {
                        title
                        description
                    }
                }
            }
            pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
            }
        }
    }
`;

// =================================================================
// CORE API FUNCTIONS (KEPT YOUR EXACT LOGIC)
// =================================================================

async function makeGraphQLRequest(query, variables = {}) {
    const url = `https://${SHOPIFY_DOMAIN}/api/${API_VERSION}/graphql.json`;
    
    try {
        console.log(`🔄 Making Shopify API request to: ${url}`);
        console.log('📊 Variables:', JSON.stringify(variables, null, 2));
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
                'Accept': 'application/json'
            },
            body: JSON.stringify({ 
                query, 
                variables 
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Shopify API response received');
        
        if (data.errors && data.errors.length > 0) {
            console.error('❌ GraphQL errors:', data.errors);
            throw new Error(`GraphQL errors: ${data.errors.map(e => e.message).join(', ')}`);
        }

        return data;
        
    } catch (error) {
        console.error('❌ Shopify API request failed:', error);
        throw new Error(`Shopify API request failed: ${error.message}`);
    }
}

export async function createCheckout(lineItems, shippingAddress = null) {
    try {
        console.log('🛒 Creating Shopify checkout with line items:', lineItems);
        
        if (!Array.isArray(lineItems) || lineItems.length === 0) {
            throw new Error('Line items must be a non-empty array');
        }

        lineItems.forEach((item, index) => {
            if (!item.variantId || !item.quantity || item.quantity <= 0) {
                throw new Error(`Invalid line item at index ${index}: must have variantId and positive quantity`);
            }
        });

        const variables = {
            input: {
                lineItems: lineItems.map(item => ({
                    variantId: item.variantId,
                    quantity: parseInt(item.quantity)
                }))
            }
        };

        if (shippingAddress) {
            variables.input.shippingAddress = shippingAddress;
        }

        const response = await makeGraphQLRequest(CREATE_CHECKOUT_MUTATION, variables);

        if (response.data?.checkoutCreate?.checkoutUserErrors?.length > 0) {
            const errors = response.data.checkoutCreate.checkoutUserErrors;
            console.error('❌ Checkout creation errors:', errors);
            throw new Error(`Checkout errors: ${errors.map(e => `${e.field}: ${e.message}`).join(', ')}`);
        }

        const checkout = response.data?.checkoutCreate?.checkout;
        if (!checkout) {
            throw new Error('No checkout data returned from Shopify');
        }

        console.log('✅ Checkout created successfully:', checkout.id);
        return {
            success: true,
            checkout,
            errors: []
        };

    } catch (error) {
        console.error('❌ Checkout creation failed:', error);
        return {
            success: false,
            checkout: null,
            errors: [error.message]
        };
    }
}

export async function getProducts(first = 100, after = null) {
    try {
        console.log(`📦 Fetching ${first} products from Shopify`);
        
        if (first > 250) {
            console.warn('⚠️ Limiting request to 250 products (Shopify maximum)');
            first = 250;
        }

        const variables = { first };
        if (after) {
            variables.after = after;
        }

        const response = await makeGraphQLRequest(GET_PRODUCTS_QUERY, variables);

        const products = response.data?.products;
        if (!products) {
            throw new Error('No products data returned from Shopify');
        }

        console.log(`✅ Fetched ${products.edges.length} products`);
        return {
            success: true,
            products: products.edges.map(edge => edge.node),
            pageInfo: products.pageInfo,
            errors: []
        };

    } catch (error) {
        console.error('❌ Products fetch failed:', error);
        return {
            success: false,
            products: [],
            pageInfo: null,
            errors: [error.message]
        };
    }
}

export function getWholesaleThreshold() {
    return parseInt(process.env.WHOLESALE_THRESHOLD || '25');
}

export function convertCartToLineItems(ohsCart) {
    const lineItems = [];
    
    for (const [productId, cartItem] of Object.entries(ohsCart)) {
        if (cartItem && cartItem.quantity > 0) {
            lineItems.push({
                variantId: cartItem.variantId || cartItem.shopifyVariantId,
                quantity: cartItem.quantity
            });
        }
    }
    
    return lineItems;
}

export async function validateVariant(variantId) {
    try {
        const query = `
            query getVariant($id: ID!) {
                node(id: $id) {
                    ... on ProductVariant {
                        id
                        availableForSale
                        quantityAvailable
                    }
                }
            }
        `;

        const response = await makeGraphQLRequest(query, { id: variantId });
        const variant = response.data?.node;

        return variant && variant.availableForSale && variant.quantityAvailable > 0;

    } catch (error) {
        console.error('❌ Variant validation failed:', error);
        return false;
    }
}

// Export configuration
export const DOMAIN = SHOPIFY_DOMAIN;
export const VERSION = API_VERSION;

console.log('🏪 Organic HypoSolutions Shopify Client Initialized (ES6 Module)');
console.log(`   Domain: ${SHOPIFY_DOMAIN}`);
console.log(`   API Version: ${API_VERSION}`);
console.log('🔐 Environment variables loaded securely');
console.log('📡 Ready for API requests');
