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
        'HC-1000GAL-EPA': {
            retail: 'gid://shopify/ProductVariant/41829066309703',    // $39044.39
            wholesale: 'gid://shopify/ProductVariant/41829066375239' // $29612.99
        },
        'HC-100ML-DIAPER-GEL': {
            retail: 'gid://shopify/ProductVariant/41829065097287',    // $24.85
            wholesale: 'gid://shopify/ProductVariant/41829065162823' // $18.09
        },
        'HC-150GAL-EPA': {
            retail: 'gid://shopify/ProductVariant/41829065883719',    // $7214.4
            wholesale: 'gid://shopify/ProductVariant/41829065949255' // $5472
        },
        'HC-150GAL-FDA': {
            retail: 'gid://shopify/ProductVariant/41829066702919',    // $7515
            wholesale: 'gid://shopify/ProductVariant/41829066768455' // $5700
        },
        'HC-16OZ-EQUINE-GEL': {
            retail: 'gid://shopify/ProductVariant/41829064441927',    // $43.75
            wholesale: 'gid://shopify/ProductVariant/41829064507463' // $33.18
        },
        'HC-1GAL-500PPM': {
            retail: 'gid://shopify/ProductVariant/41829064147015',    // $46.51
            wholesale: 'gid://shopify/ProductVariant/41829064212551' // $33.86
        },
        'HC-1GAL-BULK-CASE': {
            retail: 'gid://shopify/ProductVariant/41829065752647',    // $110.58
            wholesale: 'gid://shopify/ProductVariant/41829065818183' // $83.89
        },
        'HC-1GAL-EPA': {
            retail: 'gid://shopify/ProductVariant/41829062967367',    // $54.02
            wholesale: 'gid://shopify/ProductVariant/41829063032903' // $39.33
        },
        'HC-1GAL-LAUNDRY-BOOSTER': {
            retail: 'gid://shopify/ProductVariant/41829064704071',    // $45.06
            wholesale: 'gid://shopify/ProductVariant/41829064769607' // $32.8
        },
        'HC-1GAL-RTU': {
            retail: 'gid://shopify/ProductVariant/41829062639687',    // $41.73
            wholesale: 'gid://shopify/ProductVariant/41829062705223' // $30.47
        },
        'HC-3000GAL-EPA': {
            retail: 'gid://shopify/ProductVariant/41829066440775',    // $111290.98
            wholesale: 'gid://shopify/ProductVariant/41829066506311' // $84466.56
        },
        'HC-3000GAL-FDA': {
            retail: 'gid://shopify/ProductVariant/41829067227207',    // $95960.91
            wholesale: 'gid://shopify/ProductVariant/41829067292743' // $87949.17
        },
        'HC-300GAL-EPA': {
            retail: 'gid://shopify/ProductVariant/41829066014791',    // $12984.96
            wholesale: 'gid://shopify/ProductVariant/41829066113095' // $9849.6
        },
        'HC-300GAL-FDA': {
            retail: 'gid://shopify/ProductVariant/41829066833991',    // $13527
            wholesale: 'gid://shopify/ProductVariant/41829066899527' // $10260
        },
        'HC-32OZ-500PPM-VET': {
            retail: 'gid://shopify/ProductVariant/41829063786567',    // $26.88
            wholesale: 'gid://shopify/ProductVariant/41829063852103' // $19.56
        },
        'HC-32OZ-BULK-CASE': {
            retail: 'gid://shopify/ProductVariant/41829065621575',    // $53.28
            wholesale: 'gid://shopify/ProductVariant/41829065687111' // $40.41
        },
        'HC-32OZ-EPA': {
            retail: 'gid://shopify/ProductVariant/41829062115399',    // $24.33
            wholesale: 'gid://shopify/ProductVariant/41829062180935' // $17.68
        },
        'HC-32OZ-LAUNDRY-BOOSTER': {
            retail: 'gid://shopify/ProductVariant/41829064572999',    // $26.04
            wholesale: 'gid://shopify/ProductVariant/41829064638535' // $18.95
        },
        'HC-32OZ-PET-CLEANER': {
            retail: 'gid://shopify/ProductVariant/41829063295047',    // $23.82
            wholesale: 'gid://shopify/ProductVariant/41829063360583' // $17.3
        },
        'HC-32OZ-RTU': {
            retail: 'gid://shopify/ProductVariant/41829061787719',    // $23.82
            wholesale: 'gid://shopify/ProductVariant/41829061853255' // $17.3
        },
        'HC-3OZ-DISINFECTANT': {
            retail: 'gid://shopify/ProductVariant/41829060411463',    // $14.14
            wholesale: 'gid://shopify/ProductVariant/41829060476999' // $10.29
        },
        'HC-3OZ-SKIN-MIST': {
            retail: 'gid://shopify/ProductVariant/41829060771911',    // $15.7
            wholesale: 'gid://shopify/ProductVariant/41829060837447' // $11.42
        },
        'HC-5000GAL-EPA': {
            retail: 'gid://shopify/ProductVariant/41829066571847',    // $176172.63
            wholesale: 'gid://shopify/ProductVariant/41829066637383' // $133663.95
        },
        'HC-5000GAL-FDA': {
            retail: 'gid://shopify/ProductVariant/41829067358279',    // $120790.65
            wholesale: 'gid://shopify/ProductVariant/41829067423815' // $139352.15
        },
        'HC-500GAL-EPA': {
            retail: 'gid://shopify/ProductVariant/41829066178631',    // $20568.78
            wholesale: 'gid://shopify/ProductVariant/41829066244167' // $15598.26
        },
        'HC-500GAL-FDA': {
            retail: 'gid://shopify/ProductVariant/41829066965063',    // $21413.37
            wholesale: 'gid://shopify/ProductVariant/41829067030599' // $16248.59
        },
        'HC-8OZ-SKIN-MIST': {
            retail: 'gid://shopify/ProductVariant/41829061263431',    // $19.59
            wholesale: 'gid://shopify/ProductVariant/41829061328967' // $14.25
        },
        'HC-COMPLETE-BUNDLE': {
            retail: 'gid://shopify/ProductVariant/41829067751495',    // $199.27
            wholesale: 'gid://shopify/ProductVariant/41829067817031' // $144.94
        },
        'HC-ESSENTIAL-BUNDLE': {
            retail: 'gid://shopify/ProductVariant/41829067620423',    // $165.92
            wholesale: 'gid://shopify/ProductVariant/41829067685959' // $120.8
        },
        'HC-HEALING-SERUM': {
            retail: 'gid://shopify/ProductVariant/41829064966215',    // $42.18
            wholesale: 'gid://shopify/ProductVariant/41829065031751' // $30.71
        },
        'HC-PET-CARE-BUNDLE': {
            retail: 'gid://shopify/ProductVariant/41829068013639',    // $83.19
            wholesale: 'gid://shopify/ProductVariant/41829068079175' // $60.5
        },
        'HC-POOL-GENERATOR': {
            retail: 'gid://shopify/ProductVariant/41829065490503',    // $1314.01
            wholesale: 'gid://shopify/ProductVariant/41829065556039' // $997.14
        },
        'HC-REFILL-POUCH': {
            retail: 'gid://shopify/ProductVariant/41829065359431',    // $14.42
            wholesale: 'gid://shopify/ProductVariant/41829065424967' // $10.95
        },
        'HC-RTU-VALUE-BUNDLE': {
            retail: 'gid://shopify/ProductVariant/41829067882567',    // $85.06
            wholesale: 'gid://shopify/ProductVariant/41829067948103' // $61.86
        },
        'HC-STARTER-BUNDLE': {
            retail: 'gid://shopify/ProductVariant/41829067489351',    // $89.45
            wholesale: 'gid://shopify/ProductVariant/41829067554887' // $65.13
        },
        'HC-STATION1-KIT': {
            retail: 'gid://shopify/ProductVariant/41829065228359',    // $656.04
            wholesale: 'gid://shopify/ProductVariant/41829065293895' // $477.98
        },
        'HC-WIPES-100CT': {
            retail: 'gid://shopify/ProductVariant/41829064835143',    // $26.21
            wholesale: 'gid://shopify/ProductVariant/41829064900679' // $19.07
        },
        'OHS-100ML-DIAPER-GEL': {
            retail: 'gid://shopify/ProductVariant/41829069881415',    // $35.98
            wholesale: 'gid://shopify/ProductVariant/41829069946951' // $28.97
        },
        'OHS-16OZ-EQUINE-GEL': {
            retail: 'gid://shopify/ProductVariant/41829069226055',    // $32.15
            wholesale: 'gid://shopify/ProductVariant/41829069291591' // $23.79
        },
        'OHS-1GAL-500PPM': {
            retail: 'gid://shopify/ProductVariant/41829069094983',    // $45.18
            wholesale: 'gid://shopify/ProductVariant/41829069160519' // $32.9
        },
        'OHS-1GAL-LAUNDRY': {
            retail: 'gid://shopify/ProductVariant/41829069488199',    // $41.15
            wholesale: 'gid://shopify/ProductVariant/41829069553735' // $30.44
        },
        'OHS-1GAL-READY-RTU': {
            retail: 'gid://shopify/ProductVariant/41829068701767',    // $37.28
            wholesale: 'gid://shopify/ProductVariant/41829068767303' // $25.57
        },
        'OHS-32OZ-500PPM': {
            retail: 'gid://shopify/ProductVariant/41829068963911',    // $24.59
            wholesale: 'gid://shopify/ProductVariant/41829069029447' // $18.2
        },
        'OHS-32OZ-LAUNDRY': {
            retail: 'gid://shopify/ProductVariant/41829069357127',    // $23.86
            wholesale: 'gid://shopify/ProductVariant/41829069422663' // $17.64
        },
        'OHS-32OZ-PET-SAFE': {
            retail: 'gid://shopify/ProductVariant/41829068832839',    // $21.8
            wholesale: 'gid://shopify/ProductVariant/41829068898375' // $16.13
        },
        'OHS-32OZ-RTU': {
            retail: 'gid://shopify/ProductVariant/41829068537927',    // $21.8
            wholesale: 'gid://shopify/ProductVariant/41829068603463' // $16.13
        },
        'OHS-3OZ-DISINFECTANT': {
            retail: 'gid://shopify/ProductVariant/41829068144711',    // $12.97
            wholesale: 'gid://shopify/ProductVariant/41829068210247' // $9.59
        },
        'OHS-3OZ-SKIN-MIST': {
            retail: 'gid://shopify/ProductVariant/41829068275783',    // $14.38
            wholesale: 'gid://shopify/ProductVariant/41829068341319' // $10.64
        },
        'OHS-8OZ-SKIN-MIST': {
            retail: 'gid://shopify/ProductVariant/41829068406855',    // $18.31
            wholesale: 'gid://shopify/ProductVariant/41829068472391' // $13.55
        },
        'OHS-COMPLETE-CARE-BUNDLE': {
            retail: 'gid://shopify/ProductVariant/41829070274631',    // $173.36
            wholesale: 'gid://shopify/ProductVariant/41829070340167' // $128.28
        },
        'OHS-ESSENTIAL-FAMILY-BUNDLE': {
            retail: 'gid://shopify/ProductVariant/41829070143559',    // $139.73
            wholesale: 'gid://shopify/ProductVariant/41829070209095' // $103.42
        },
        'OHS-HEALING-SERUM': {
            retail: 'gid://shopify/ProductVariant/41829069750343',    // $34.63
            wholesale: 'gid://shopify/ProductVariant/41829069815879' // $27.89
        },
        'OHS-ORGANIC-WIPES': {
            retail: 'gid://shopify/ProductVariant/41829069619271',    // $16.45
            wholesale: 'gid://shopify/ProductVariant/41829069684807' // $12.17
        },
        'OHS-PET-CARE-BUNDLE': {
            retail: 'gid://shopify/ProductVariant/41829070536775',    // $72.45
            wholesale: 'gid://shopify/ProductVariant/41829070602311' // $53.61
        },
        'OHS-RTU-VALUE-BUNDLE': {
            retail: 'gid://shopify/ProductVariant/41829070405703',    // $73.92
            wholesale: 'gid://shopify/ProductVariant/41829070471239' // $54.7
        },
        'OHS-STARTER-HOME-BUNDLE': {
            retail: 'gid://shopify/ProductVariant/41829070012487',    // $66.92
            wholesale: 'gid://shopify/ProductVariant/41829070078023' // $49.5
        }
    }
};

// Export for use in other files
window.SHOPIFY_CONFIG = SHOPIFY_CONFIG;
