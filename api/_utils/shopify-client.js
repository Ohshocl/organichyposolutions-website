cat > api/_utils/shopify-client.js << 'EOF'
/**
 * ORGANIC HYPOSOLUTIONS - SERVER-SIDE SHOPIFY CLIENT (COMMONJS COMPATIBLE)
 * ================================================================
 * File: /api/_utils/shopify-client.js
 * Purpose: Secure server-side Shopify API communication
 * FIXED: Changed to CommonJS for Vercel compatibility
 * ================================================================
 */

// Environment validation
function validateEnvironment() {
    const required = ['SHOPIFY_DOMAIN', 'SHOPIFY_STOREFRONT_TOKEN'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
}

// Shopify Client Class
class ShopifyClient {
    constructor() {
        validateEnvironment();
        
        this.domain = process.env.SHOPIFY_DOMAIN;
        this.storefrontToken = process.env.SHOPIFY_STOREFRONT_TOKEN;
        this.apiVersion = '2024-01';
        
        this.endpoint = `https://${this.domain}/api/${this.apiVersion}/graphql.json`;
        
        console.log('ShopifyClient initialized:', {
            domain: this.domain,
            hasToken: !!this.storefrontToken,
            endpoint: this.endpoint
        });
    }

    async query(query, variables = {}) {
        try {
            console.log('Making Shopify query:', { query: query.substring(0, 100) + '...', variables });
            
            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Storefront-Access-Token': this.storefrontToken,
                },
                body: JSON.stringify({ query, variables })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            
            if (data.errors) {
                console.error('GraphQL errors:', data.errors);
                throw new Error('GraphQL errors: ' + JSON.stringify(data.errors));
            }

            return data.data;
        } catch (error) {
            console.error('Shopify query failed:', error);
            throw error;
        }
    }

    async getProducts(limit = 20) {
        const query = `
            query GetProducts($first: Int!) {
                products(first: $first) {
                    edges {
                        node {
                            id
                            title
                            handle
                            description
                            vendor
                            productType
                            tags
                            availableForSale
                            totalInventory
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
                            compareAtPriceRange {
                                minVariantPrice {
                                    amount
                                    currencyCode
                                }
                                maxVariantPrice {
                                    amount
                                    currencyCode
                                }
                            }
                            variants(first: 10) {
                                edges {
                                    node {
                                        id
                                        title
                                        sku
                                        price {
                                            amount
                                            currencyCode
                                        }
                                        compareAtPrice {
                                            amount
                                            currencyCode
                                        }
                                        availableForSale
                                        quantityAvailable
                                        weight
                                        weightUnit
                                        requiresShipping
                                        taxable
                                        selectedOptions {
                                            name
                                            value
                                        }
                                    }
                                }
                            }
                            images(first: 5) {
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
                            featuredImage {
                                id
                                url
                                altText
                                width
                                height
                            }
                        }
                    }
                }
            }
        `;

        const result = await this.query(query, { first: limit });
        return result.products.edges.map(edge => edge.node);
    }

    async createCheckout(lineItems) {
        const query = `
            mutation CheckoutCreate($input: CheckoutCreateInput!) {
                checkoutCreate(input: $input) {
                    checkout {
                        id
                        webUrl
                        totalPrice {
                            amount
                            currencyCode
                        }
                        subtotalPrice {
                            amount
                            currencyCode
                        }
                        totalTax {
                            amount
                            currencyCode
                        }
                        lineItems(first: 50) {
                            edges {
                                node {
                                    id
                                    quantity
                                    title
                                    variant {
                                        id
                                        title
                                        price {
                                            amount
                                            currencyCode
                                        }
                                        product {
                                            title
                                            handle
                                        }
                                    }
                                }
                            }
                        }
                        shippingAddress {
                            address1
                            address2
                            city
                            province
                            country
                            zip
                        }
                    }
                    checkoutUserErrors {
                        field
                        message
                        code
                    }
                }
            }
        `;

        const input = { lineItems };
        const result = await this.query(query, { input });
        
        if (result.checkoutCreate.checkoutUserErrors.length > 0) {
            throw new Error('Checkout creation failed: ' + 
                JSON.stringify(result.checkoutCreate.checkoutUserErrors));
        }
        
        return result.checkoutCreate.checkout;
    }
}

// Export the class using CommonJS
module.exports = ShopifyClient;
EOF
