// Shopify API Configuration
// Replace with your actual values

const SHOPIFY_CONFIG = {
    // Your store domain (replace with your actual domain)
    storeDomain: 'your-store.myshopify.com',
    
    // Your Storefront API access token (replace with your actual token)
    storefrontAccessToken: 'your-storefront-access-token-here',
    
    // Shopify Storefront API endpoint
    storefrontApiUrl: 'https://your-store.myshopify.com/api/2023-10/graphql.json',
    
    // Admin API endpoint (if needed for customer tagging)
    adminApiUrl: 'https://your-store.myshopify.com/admin/api/2023-10',
    
    // Product variant mapping - maps your cart.js SKUs to Shopify variant IDs
    variantMapping: {
        // Example structure - you'll need to populate with your actual Shopify variant IDs
        'OHS-PET-CARE-BUNDLE': {
            retail: 'gid://shopify/ProductVariant/YOUR_RETAIL_VARIANT_ID',
            wholesale: 'gid://shopify/ProductVariant/YOUR_WHOLESALE_VARIANT_ID'
        },
        'HC-WIPES-ALLINONE': {
            retail: 'gid://shopify/ProductVariant/YOUR_RETAIL_VARIANT_ID', 
            wholesale: 'gid://shopify/ProductVariant/YOUR_WHOLESALE_VARIANT_ID'
        }
        // Add all 57 products here with their Shopify variant IDs
    }
};

// Export for use in other files
window.SHOPIFY_CONFIG = SHOPIFY_CONFIG;
