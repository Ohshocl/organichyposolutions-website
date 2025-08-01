/**
 * ORGANIC HYPOSOLUTIONS - SERVER-SIDE SHOPIFY CLIENT
 * ================================================================
 * File: /api/_utils/shopify-client.js
 * Purpose: Secure server-side Shopify API communication
 * Dependencies: Environment variables must be set in Vercel
 * Security: NEVER expose these functions to frontend - server-side only
 * 
 * REQUIRED ENVIRONMENT VARIABLES:
 * - SHOPIFY_DOMAIN: your-store.myshopify.com
 * - SHOPIFY_STOREFRONT_TOKEN: your-storefront-access-token
 * 
 * Used by:
 * - /api/shopify/create-checkout.js
 * - /api/shopify/get-products.js
 * ================================================================
 */

// =================================================================
// CONFIGURATION & VALIDATION
// =================================================================

const SHOPIFY_DOMAIN = process.env.SHOPIFY_DOMAIN;
const SHOPIFY_STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN;
const API_VERSION = '2024-01'; // Latest stable API version

// Validate required environment variables
if (!SHOPIFY_DOMAIN || !SHOPIFY_STOREFRONT_TOKEN) {
    console.error('❌ Missing required Shopify environment variables');
    console.error('Required: SHOPIFY_DOMAIN, SHOPIFY_STOREFRONT_TOKEN');
    throw new Error('Missing Shopify configuration');
}

console.log('✅ Shopify client initialized for domain:', SHOPIFY_DOMAIN);

// =================================================================
// GRAPHQL MUTATIONS & QUERIES
// =================================================================

/**
 * GraphQL mutation for creating a checkout
 * Includes all necessary fields for cart conversion
 */
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

/**
 * GraphQL query for fetching products
 * Optimized for OHS product catalog needs
 */
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

/**
 * Query for getting a single product by handle
 */
const GET_PRODUCT_BY_HANDLE_QUERY = `
    query getProductByHandle($handle: String!) {
        productByHandle(handle: $handle) {
            id
            handle
            title
            description
            vendor
            productType
            tags
            availableForSale
            images(first: 10) {
                edges {
                    node {
                        id
                        url
                        altText
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
                    }
                }
            }
        }
    }
`;

// =================================================================
// CORE API FUNCTIONS
// =================================================================

/**
 * Make a GraphQL request to Shopify Storefront API
 * @param {string} query - GraphQL query or mutation
 * @param {object} variables - Variables for the query
 * @returns {Promise<object>} - Shopify API response
 */
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
        
        // Check for GraphQL errors
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

/**
 * Create a checkout with line items
 * @param {Array} lineItems - Array of {variantId, quantity} objects
 * @param {object} shippingAddress - Optional shipping address
 * @returns {Promise<object>} - Checkout data
 */
async function createCheckout(lineItems, shippingAddress = null) {
    try {
        console.log('🛒 Creating Shopify checkout with line items:', lineItems);
        
        // Validate line items
        if (!Array.isArray(lineItems) || lineItems.length === 0) {
            throw new Error('Line items must be a non-empty array');
        }

        // Validate each line item
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

        // Add shipping address if provided
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

/**
 * Get products from Shopify
 * @param {number} first - Number of products to fetch (max 250)
 * @param {string} after - Cursor for pagination
 * @returns {Promise<object>} - Products data
 */
async function getProducts(first = 100, after = null) {
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

/**
 * Get a single product by handle
 * @param {string} handle - Product handle
 * @returns {Promise<object>} - Product data
 */
async function getProductByHandle(handle) {
    try {
        console.log(`🔍 Fetching product by handle: ${handle}`);

        const variables = { handle };
        const response = await makeGraphQLRequest(GET_PRODUCT_BY_HANDLE_QUERY, variables);

        const product = response.data?.productByHandle;
        if (!product) {
            throw new Error(`Product not found: ${handle}`);
        }

        console.log(`✅ Fetched product: ${product.title}`);
        return {
            success: true,
            product,
            errors: []
        };

    } catch (error) {
        console.error('❌ Product fetch failed:', error);
        return {
            success: false,
            product: null,
            errors: [error.message]
        };
    }
}

/**
 * Validate a variant ID exists and is available
 * @param {string} variantId - Variant ID to validate
 * @returns {Promise<boolean>} - Whether variant is valid and available
 */
async function validateVariant(variantId) {
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

// =================================================================
// HELPER FUNCTIONS
// =================================================================

/**
 * Convert OHS cart format to Shopify line items
 * @param {object} ohsCart - Cart in OHS format
 * @returns {Array} - Array of Shopify line items
 */
function convertCartToLineItems(ohsCart) {
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

/**
 * Get wholesale threshold for pricing
 * @returns {number} - Wholesale threshold quantity
 */
function getWholesaleThreshold() {
    return parseInt(process.env.WHOLESALE_THRESHOLD || '25');
}

/**
 * Health check for Shopify connection
 * @returns {Promise<boolean>} - Whether Shopify is accessible
 */
async function healthCheck() {
    try {
        const query = `
            query {
                shop {
                    name
                    primaryDomain {
                        host
                    }
                }
            }
        `;

        const response = await makeGraphQLRequest(query);
        const shop = response.data?.shop;
        
        if (shop) {
            console.log(`✅ Shopify health check passed: ${shop.name}`);
            return true;
        }
        
        return false;

    } catch (error) {
        console.error('❌ Shopify health check failed:', error);
        return false;
    }
}

// =================================================================
// EXPORTS
// =================================================================

module.exports = {
    // Core API functions
    createCheckout,
    getProducts,
    getProductByHandle,
    validateVariant,
    makeGraphQLRequest,
    
    // Helper functions
    convertCartToLineItems,
    getWholesaleThreshold,
    healthCheck,
    
    // Configuration
    SHOPIFY_DOMAIN,
    API_VERSION
};

// =================================================================
// INITIALIZATION LOG
// =================================================================

console.log('🏪 Organic HypoSolutions Shopify Client Initialized');
console.log(`   Domain: ${SHOPIFY_DOMAIN}`);
console.log(`   API Version: ${API_VERSION}`);
console.log(`   Wholesale Threshold: ${getWholesaleThreshold()} units`);
console.log('🔐 Environment variables loaded securely');
console.log('📡 Ready for API requests');
