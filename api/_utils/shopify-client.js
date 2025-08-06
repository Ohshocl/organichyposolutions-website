cat > api/_utils/shopify-client.js << 'EOF'
/**
 * SHOPIFY CLIENT - CommonJS Compatible
 */

function validateEnvironment() {
    const required = ['SHOPIFY_DOMAIN', 'SHOPIFY_STOREFRONT_TOKEN'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
}

class ShopifyClient {
    constructor() {
        validateEnvironment();
        
        this.domain = process.env.SHOPIFY_DOMAIN;
        this.storefrontToken = process.env.SHOPIFY_STOREFRONT_TOKEN;
        this.apiVersion = '2024-01';
        this.endpoint = `https://${this.domain}/api/${this.apiVersion}/graphql.json`;
    }

    async query(query, variables = {}) {
        try {
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
                            availableForSale
                            priceRange {
                                minVariantPrice {
                                    amount
                                    currencyCode
                                }
                            }
                            images(first: 1) {
                                edges {
                                    node {
                                        url
                                        altText
                                    }
                                }
                            }
                            variants(first: 5) {
                                edges {
                                    node {
                                        id
                                        title
                                        price {
                                            amount
                                            currencyCode
                                        }
                                        availableForSale
                                    }
                                }
                            }
                        }
                    }
                }
            }
        `;

        const result = await this.query(query, { first: limit });
        return result.products.edges.map(edge => edge.node);
    }
}

module.exports = ShopifyClient;
EOF
