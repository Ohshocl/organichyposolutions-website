// Shopify API Configuration
const SHOPIFY_CONFIG = {
    // Your actual Shopify store values
    storeDomain: 'nprmh-8e.myshopify.com',
    storefrontAccessToken: 'Shpat_b7d57418522af9bbacbc45eaa2e503db',
    
    // API endpoints
    storefrontApiUrl: 'https://nprmh-8e.myshopify.com/api/2023-10/graphql.json',
    adminApiUrl: 'https://nprmh-8e.myshopify.com/admin/api/2023-10',
    
    // Product variant mapping - maps your cart.js SKUs to Shopify variant IDs
    variantMapping: {
        'OHS-PET-CARE-BUNDLE': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // OHS-PET-CARE-BUNDLE-RETAIL - $72.45
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // OHS-PET-CARE-BUNDLE-WHOLESALE - $53.61
        },
        'OHS-RTU-VALUE-BUNDLE': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // OHS-RTU-VALUE-BUNDLE-RETAIL - $62.73
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // OHS-RTU-VALUE-BUNDLE-WHOLESALE - $46.38
        },
        'OHS-COMPLETE-CARE-BUNDLE': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // OHS-COMPLETE-CARE-BUNDLE-RETAIL - $94.51
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // OHS-COMPLETE-CARE-BUNDLE-WHOLESALE - $69.88
        },
        'OHS-ESSENTIAL-FAMILY-BUNDLE': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // OHS-ESSENTIAL-FAMILY-BUNDLE-RETAIL - $45.64
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // OHS-ESSENTIAL-FAMILY-BUNDLE-WHOLESALE - $33.75
        },
        'OHS-STARTER-HOME-BUNDLE': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // OHS-STARTER-HOME-BUNDLE-RETAIL - $38.73
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // OHS-STARTER-HOME-BUNDLE-WHOLESALE - $28.64
        },
        'OHS-PREMIUM-CLEANING-BUNDLE': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // OHS-PREMIUM-CLEANING-BUNDLE-RETAIL - $83.27
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // OHS-PREMIUM-CLEANING-BUNDLE-WHOLESALE - $61.59
        },
        'OHS-MULTI-SURFACE-BUNDLE': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // OHS-MULTI-SURFACE-BUNDLE-RETAIL - $56.82
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // OHS-MULTI-SURFACE-BUNDLE-WHOLESALE - $42.03
        },
        'OHS-SANITIZING-BUNDLE': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // OHS-SANITIZING-BUNDLE-RETAIL - $49.91
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // OHS-SANITIZING-BUNDLE-WHOLESALE - $36.92
        },
        'OHS-PROFESSIONAL-BUNDLE': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // OHS-PROFESSIONAL-BUNDLE-RETAIL - $109.82
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // OHS-PROFESSIONAL-BUNDLE-WHOLESALE - $81.24
        },
        'OHS-ECO-SAFE-BUNDLE': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // OHS-ECO-SAFE-BUNDLE-RETAIL - $67.18
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // OHS-ECO-SAFE-BUNDLE-WHOLESALE - $49.68
        },
        'OHS-CONCENTRATED-SOLUTION-16OZ': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // OHS-CONCENTRATED-SOLUTION-16OZ-RETAIL - $28.64
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // OHS-CONCENTRATED-SOLUTION-16OZ-WHOLESALE - $21.18
        },
        'OHS-CONCENTRATED-SOLUTION-32OZ': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // OHS-CONCENTRATED-SOLUTION-32OZ-RETAIL - $45.64
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // OHS-CONCENTRATED-SOLUTION-32OZ-WHOLESALE - $33.75
        },
        'OHS-CONCENTRATED-SOLUTION-64OZ': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // OHS-CONCENTRATED-SOLUTION-64OZ-RETAIL - $72.45
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // OHS-CONCENTRATED-SOLUTION-64OZ-WHOLESALE - $53.61
        },
        'OHS-CONCENTRATED-SOLUTION-GALLON': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // OHS-CONCENTRATED-SOLUTION-GALLON-RETAIL - $109.82
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // OHS-CONCENTRATED-SOLUTION-GALLON-WHOLESALE - $81.24
        },
        'OHS-RTU-SURFACE-CLEANER-16OZ': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // OHS-RTU-SURFACE-CLEANER-16OZ-RETAIL - $21.82
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // OHS-RTU-SURFACE-CLEANER-16OZ-WHOLESALE - $16.13
        },
        'OHS-RTU-SURFACE-CLEANER-32OZ': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // OHS-RTU-SURFACE-CLEANER-32OZ-RETAIL - $35.36
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // OHS-RTU-SURFACE-CLEANER-32OZ-WHOLESALE - $26.14
        },
        'OHS-RTU-SURFACE-CLEANER-64OZ': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // OHS-RTU-SURFACE-CLEANER-64OZ-RETAIL - $56.82
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // OHS-RTU-SURFACE-CLEANER-64OZ-WHOLESALE - $42.03
        },
        'OHS-RTU-SURFACE-CLEANER-GALLON': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // OHS-RTU-SURFACE-CLEANER-GALLON-RETAIL - $83.27
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // OHS-RTU-SURFACE-CLEANER-GALLON-WHOLESALE - $61.59
        },
        'OHS-FABRIC-FRESHENER-16OZ': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // OHS-FABRIC-FRESHENER-16OZ-RETAIL - $19.18
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // OHS-FABRIC-FRESHENER-16OZ-WHOLESALE - $14.18
        },
        'OHS-FABRIC-FRESHENER-32OZ': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // OHS-FABRIC-FRESHENER-32OZ-RETAIL - $31.09
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // OHS-FABRIC-FRESHENER-32OZ-WHOLESALE - $23.00
        },
        'OHS-FABRIC-FRESHENER-64OZ': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // OHS-FABRIC-FRESHENER-64OZ-RETAIL - $49.91
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // OHS-FABRIC-FRESHENER-64OZ-WHOLESALE - $36.92
        },
        'OHS-FABRIC-FRESHENER-GALLON': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // OHS-FABRIC-FRESHENER-GALLON-RETAIL - $74.73
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // OHS-FABRIC-FRESHENER-GALLON-WHOLESALE - $55.29
        },
        'OHS-ODOR-ELIMINATOR-16OZ': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // OHS-ODOR-ELIMINATOR-16OZ-RETAIL - $23.73
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // OHS-ODOR-ELIMINATOR-16OZ-WHOLESALE - $17.55
        },
        'OHS-ODOR-ELIMINATOR-32OZ': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // OHS-ODOR-ELIMINATOR-32OZ-RETAIL - $38.73
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // OHS-ODOR-ELIMINATOR-32OZ-WHOLESALE - $28.64
        },
        'OHS-ODOR-ELIMINATOR-64OZ': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // OHS-ODOR-ELIMINATOR-64OZ-RETAIL - $61.09
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // OHS-ODOR-ELIMINATOR-64OZ-WHOLESALE - $45.17
        },
        'OHS-ODOR-ELIMINATOR-GALLON': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // OHS-ODOR-ELIMINATOR-GALLON-RETAIL - $91.64
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // OHS-ODOR-ELIMINATOR-GALLON-WHOLESALE - $67.78
        },
        'OHS-SANITIZING-SPRAY-16OZ': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // OHS-SANITIZING-SPRAY-16OZ-RETAIL - $20.45
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // OHS-SANITIZING-SPRAY-16OZ-WHOLESALE - $15.13
        },
        'OHS-SANITIZING-SPRAY-32OZ': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // OHS-SANITIZING-SPRAY-32OZ-RETAIL - $32.73
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // OHS-SANITIZING-SPRAY-32OZ-WHOLESALE - $24.21
        },
        'OHS-SANITIZING-SPRAY-64OZ': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // OHS-SANITIZING-SPRAY-64OZ-RETAIL - $52.18
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // OHS-SANITIZING-SPRAY-64OZ-WHOLESALE - $38.60
        },
        'OHS-SANITIZING-SPRAY-GALLON': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // OHS-SANITIZING-SPRAY-GALLON-RETAIL - $78.18
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // OHS-SANITIZING-SPRAY-GALLON-WHOLESALE - $57.82
        },
        'OHS-HAND-SANITIZER-8OZ': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // OHS-HAND-SANITIZER-8OZ-RETAIL - $16.36
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // OHS-HAND-SANITIZER-8OZ-WHOLESALE - $12.10
        },
        'OHS-HAND-SANITIZER-16OZ': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // OHS-HAND-SANITIZER-16OZ-RETAIL - $26.18
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // OHS-HAND-SANITIZER-16OZ-WHOLESALE - $19.36
        },
        'OHS-HAND-SANITIZER-32OZ': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // OHS-HAND-SANITIZER-32OZ-RETAIL - $41.82
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // OHS-HAND-SANITIZER-32OZ-WHOLESALE - $30.93
        },
        'OHS-HAND-SANITIZER-64OZ': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // OHS-HAND-SANITIZER-64OZ-RETAIL - $66.82
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // OHS-HAND-SANITIZER-64OZ-WHOLESALE - $49.43
        },
        'OHS-DISINFECTING-WIPES-80CT': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // OHS-DISINFECTING-WIPES-80CT-RETAIL - $18.18
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // OHS-DISINFECTING-WIPES-80CT-WHOLESALE - $13.45
        },
        'OHS-DISINFECTING-WIPES-160CT': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // OHS-DISINFECTING-WIPES-160CT-RETAIL - $29.18
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // OHS-DISINFECTING-WIPES-160CT-WHOLESALE - $21.58
        },
        'OHS-DISINFECTING-WIPES-320CT': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // OHS-DISINFECTING-WIPES-320CT-RETAIL - $46.64
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // OHS-DISINFECTING-WIPES-320CT-WHOLESALE - $34.49
        },
        'OHS-DISINFECTING-WIPES-BULK': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // OHS-DISINFECTING-WIPES-BULK-RETAIL - $69.82
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // OHS-DISINFECTING-WIPES-BULK-WHOLESALE - $51.64
        },
        'HC-MULTI-SURFACE-CLEANER-16OZ': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // HC-MULTI-SURFACE-CLEANER-16OZ-RETAIL - $24.73
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // HC-MULTI-SURFACE-CLEANER-16OZ-WHOLESALE - $18.29
        },
        'HC-MULTI-SURFACE-CLEANER-32OZ': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // HC-MULTI-SURFACE-CLEANER-32OZ-RETAIL - $39.91
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // HC-MULTI-SURFACE-CLEANER-32OZ-WHOLESALE - $29.51
        },
        'HC-MULTI-SURFACE-CLEANER-64OZ': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // HC-MULTI-SURFACE-CLEANER-64OZ-RETAIL - $63.64
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // HC-MULTI-SURFACE-CLEANER-64OZ-WHOLESALE - $47.06
        },
        'HC-MULTI-SURFACE-CLEANER-GALLON': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // HC-MULTI-SURFACE-CLEANER-GALLON-RETAIL - $95.45
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // HC-MULTI-SURFACE-CLEANER-GALLON-WHOLESALE - $70.58
        },
        'HC-DISINFECTANT-SPRAY-16OZ': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // HC-DISINFECTANT-SPRAY-16OZ-RETAIL - $22.27
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // HC-DISINFECTANT-SPRAY-16OZ-WHOLESALE - $16.47
        },
        'HC-DISINFECTANT-SPRAY-32OZ': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // HC-DISINFECTANT-SPRAY-32OZ-RETAIL - $35.82
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // HC-DISINFECTANT-SPRAY-32OZ-WHOLESALE - $26.48
        },
        'HC-DISINFECTANT-SPRAY-64OZ': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // HC-DISINFECTANT-SPRAY-64OZ-RETAIL - $57.27
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // HC-DISINFECTANT-SPRAY-64OZ-WHOLESALE - $42.37
        },
        'HC-DISINFECTANT-SPRAY-GALLON': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // HC-DISINFECTANT-SPRAY-GALLON-RETAIL - $85.82
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // HC-DISINFECTANT-SPRAY-GALLON-WHOLESALE - $63.48
        },
        'HC-FABRIC-SANITIZER-16OZ': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // HC-FABRIC-SANITIZER-16OZ-RETAIL - $20.91
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // HC-FABRIC-SANITIZER-16OZ-WHOLESALE - $15.46
        },
        'HC-FABRIC-SANITIZER-32OZ': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // HC-FABRIC-SANITIZER-32OZ-RETAIL - $33.36
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // HC-FABRIC-SANITIZER-32OZ-WHOLESALE - $24.68
        },
        'HC-FABRIC-SANITIZER-64OZ': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // HC-FABRIC-SANITIZER-64OZ-RETAIL - $53.45
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // HC-FABRIC-SANITIZER-64OZ-WHOLESALE - $39.54
        },
        'HC-FABRIC-SANITIZER-GALLON': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // HC-FABRIC-SANITIZER-GALLON-RETAIL - $80.00
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // HC-FABRIC-SANITIZER-GALLON-WHOLESALE - $59.16
        },
        'HC-GLASS-CLEANER-16OZ': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // HC-GLASS-CLEANER-16OZ-RETAIL - $18.64
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // HC-GLASS-CLEANER-16OZ-WHOLESALE - $13.79
        },
        'HC-GLASS-CLEANER-32OZ': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // HC-GLASS-CLEANER-32OZ-RETAIL - $29.82
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // HC-GLASS-CLEANER-32OZ-WHOLESALE - $22.06
        },
        'HC-GLASS-CLEANER-64OZ': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // HC-GLASS-CLEANER-64OZ-RETAIL - $47.64
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // HC-GLASS-CLEANER-64OZ-WHOLESALE - $35.23
        },
        'HC-GLASS-CLEANER-GALLON': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // HC-GLASS-CLEANER-GALLON-RETAIL - $71.45
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // HC-GLASS-CLEANER-GALLON-WHOLESALE - $52.84
        },
        'HC-HAND-SANITIZER-8OZ': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // HC-HAND-SANITIZER-8OZ-RETAIL - $19.73
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // HC-HAND-SANITIZER-8OZ-WHOLESALE - $14.60
        },
        'HC-HAND-SANITIZER-16OZ': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // HC-HAND-SANITIZER-16OZ-RETAIL - $31.36
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // HC-HAND-SANITIZER-16OZ-WHOLESALE - $23.20
        },
        'HC-HAND-SANITIZER-32OZ': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // HC-HAND-SANITIZER-32OZ-RETAIL - $50.18
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // HC-HAND-SANITIZER-32OZ-WHOLESALE - $37.11
        },
        'HC-HAND-SANITIZER-64OZ': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // HC-HAND-SANITIZER-64OZ-RETAIL - $80.18
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // HC-HAND-SANITIZER-64OZ-WHOLESALE - $59.28
        },
        'HC-WIPES-ALLINONE': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // HC-WIPES-ALLINONE-RETAIL - $26.21
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // HC-WIPES-ALLINONE-WHOLESALE - $19.07
        },
        'HC-WIPES-PREMIUM': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // HC-WIPES-PREMIUM-RETAIL - $34.91
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // HC-WIPES-PREMIUM-WHOLESALE - $25.45
        },
        'HC-BULK-REFILL-SOLUTION': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // HC-BULK-REFILL-SOLUTION-RETAIL - $124.55
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // HC-BULK-REFILL-SOLUTION-WHOLESALE - $92.12
        },
        'HC-LAUNDRY-BOOSTER-32OZ': {
            retail: 'gid://shopify/ProductVariant/RETAIL_VARIANT_ID_HERE',    // HC-LAUNDRY-BOOSTER-32OZ-RETAIL - $35.45
            wholesale: 'gid://shopify/ProductVariant/WHOLESALE_VARIANT_ID_HERE' // HC-LAUNDRY-BOOSTER-32OZ-WHOLESALE - $26.22
        }
    }
};

// Export for use in other files
window.SHOPIFY_CONFIG = SHOPIFY_CONFIG;
