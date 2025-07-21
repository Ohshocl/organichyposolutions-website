// ===================================================================
// COMPLETE PRODUCT CATALOG - 57 Products Total
// Properly formatted for JavaScript execution
// ===================================================================

const PRODUCT_CATALOG = {
    // ===================================================================
    // THE HYPO COMPANY - PREMIUM LINE (First 10 Products)
    // ===================================================================
    
    'hc-3oz-disinfectant': {
        id: 'hc-3oz-disinfectant',
        shopifyHandle: '3oz-multi-use-disinfectant-premium',
        shopifyVariantId: null,
        name: '3oz Multi-Use Disinfectant',
        description: 'Premium EPA-certified multi-use disinfectant in convenient 3oz size.',
        sku: 'HC-3OZ-DISINFECTANT',
        weight: 0.3,
        category: 'Disinfectants',
        certifications: ['EPA Certified', 'Professional Grade'],
        productLine: 'premium',
        useCase: ['professional', 'commercial', 'healthcare'],
        badgeType: 'EPA Premium',
        badgeColor: '#f59e0b',
        pricing: {
            cost: 6.77,
            wholesale: 10.29,
            wholesaleMonthly: 9.47,
            wholesaleQuarterly: 9.27,
            retail: 14.14,
            retailMonthly: 13.04,
            retailQuarterly: 12.76
        },
        margins: {
            wholesale: 0.341,
            wholesaleMonthly: 0.285,
            wholesaleQuarterly: 0.270,
            retail: 0.521,
            retailMonthly: 0.456,
            retailQuarterly: 0.440
        },
        volumeDiscounts: {
            '50+': { 
                discount: 0.15, 
                badge: '50+ Volume Discount', 
                retailPrice: 12.02,
                wholesalePrice: 8.75
            },
            '25+': { 
                discount: 0.10, 
                badge: '25+ Volume Discount',
                retailPrice: 12.73,
                wholesalePrice: 9.26
            },
            '10+': { 
                discount: 0.05, 
                badge: '10+ Volume Discount',
                retailPrice: 13.43,
                wholesalePrice: 9.78
            }
        },
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 50,
        minOrder: 'Monthly Invoice',
        maxOrder: 9999,
        stockLevel: 'in-stock',
        fulfillmentTime: '2-4 business days',
        type: 'premium',
        emoji: '🧴',
        sdsDocument: 'assets/documents/hc-3oz-disinfectant-sds.pdf',
        complianceNotes: 'EPA certified for professional use'
    },

    'hc-32oz-cleaner-rtu': {
        id: 'hc-32oz-cleaner-rtu',
        shopifyHandle: '32oz-multi-use-cleaner-ready-to-use',
        name: '32oz Multi Use Cleaner Ready to Use',
        description: 'Premium ready-to-use multi-purpose cleaner for immediate application.',
        sku: 'HC-32OZ-CLEANER-RTU',
        weight: 2.2,
        category: 'Ready-to-Use Products',
        certifications: ['EPA Certified', 'Ready-to-Use'],
        productLine: 'premium',
        useCase: ['professional', 'commercial', 'office'],
        badgeType: 'EPA Premium',
        badgeColor: '#f59e0b',
        pricing: {
            cost: 11.40,
            wholesale: 17.30,
            wholesaleMonthly: 15.93,
            wholesaleQuarterly: 15.59,
            retail: 23.82,
            retailMonthly: 21.96,
            retailQuarterly: 21.51
        },
        margins: {
            wholesale: 0.341,
            wholesaleMonthly: 0.285,
            wholesaleQuarterly: 0.270,
            retail: 0.521,
            retailMonthly: 0.456,
            retailQuarterly: 0.440
        },
        volumeDiscounts: {
            '25+': { 
                discount: 0.15, 
                badge: '25+ Volume Discount',
                retailPrice: 20.25,
                wholesalePrice: 14.71
            },
            '10+': { 
                discount: 0.08, 
                badge: '10+ Volume Discount',
                retailPrice: 21.91,
                wholesalePrice: 15.92
            }
        },
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 25,
        minOrder: 'Monthly Invoice',
        type: 'premium',
        emoji: '🧽'
    },

    'hc-32oz-cleaner-epa': {
        id: 'hc-32oz-cleaner-epa',
        shopifyHandle: '32oz-multi-use-cleaner-epa-certified',
        name: '32oz Multi Use Cleaner EPA',
        description: 'EPA-certified premium multi-use cleaner for professional applications.',
        sku: 'HC-32OZ-CLEANER-EPA',
        weight: 2.2,
        category: 'EPA Certified Products',
        certifications: ['EPA Registered', 'Professional Grade', 'Commercial Use'],
        productLine: 'premium',
        useCase: ['healthcare', 'commercial', 'industrial'],
        badgeType: 'EPA Premium',
        badgeColor: '#f59e0b',
        pricing: {
            cost: 11.64,
            wholesale: 17.68,
            wholesaleMonthly: 16.28,
            wholesaleQuarterly: 15.93,
            retail: 24.33,
            retailMonthly: 22.43,
            retailQuarterly: 21.97
        },
        margins: {
            wholesale: 0.341,
            wholesaleMonthly: 0.285,
            wholesaleQuarterly: 0.270,
            retail: 0.521,
            retailMonthly: 0.456,
            retailQuarterly: 0.440
        },
        volumeDiscounts: {
            '25+': { 
                discount: 0.15, 
                badge: '25+ EPA Volume Discount',
                retailPrice: 20.68,
                wholesalePrice: 15.03
            },
            '10+': { 
                discount: 0.08, 
                badge: '10+ EPA Volume Discount',
                retailPrice: 22.38,
                wholesalePrice: 16.27
            }
        },
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 25,
        minOrder: 'Monthly Invoice',
        type: 'premium',
        emoji: '🔬'
    },

    'hc-32oz-pet-cleaner': {
        id: 'hc-32oz-pet-cleaner',
        shopifyHandle: '32oz-pet-cleaner-and-deodorizer',
        name: '32oz Pet Cleaner and Deodorizer',
        description: 'Premium pet-safe cleaner and deodorizer for professional animal care.',
        sku: 'HC-32OZ-PET-CLEANER',
        weight: 2.2,
        category: 'Pet Care',
        certifications: ['EPA Certified', 'Pet Safe', 'Professional Grade'],
        productLine: 'premium',
        useCase: ['veterinary', 'pet-care', 'animal-facility'],
        badgeType: 'EPA Premium',
        badgeColor: '#f59e0b',
        pricing: {
            cost: 11.40,
            wholesale: 17.30,
            wholesaleMonthly: 15.93,
            wholesaleQuarterly: 15.59,
            retail: 23.82,
            retailMonthly: 21.96,
            retailQuarterly: 21.51
        },
        margins: {
            wholesale: 0.341,
            wholesaleMonthly: 0.285,
            wholesaleQuarterly: 0.270,
            retail: 0.521,
            retailMonthly: 0.456,
            retailQuarterly: 0.440
        },
        volumeDiscounts: {
            '25+': { 
                discount: 0.15, 
                badge: '25+ Pet Care Discount',
                retailPrice: 20.25,
                wholesalePrice: 14.71
            },
            '10+': { 
                discount: 0.08, 
                badge: '10+ Pet Care Discount',
                retailPrice: 21.91,
                wholesalePrice: 15.92
            }
        },
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 25,
        minOrder: 'Monthly Invoice',
        type: 'premium',
        emoji: '🐾'
    },

    'hc-1gal-ready-to-use': {
        id: 'hc-1gal-ready-to-use',
        shopifyHandle: '1-gallon-ready-to-use-premium',
        name: '1 Gallon Ready to Use',
        description: 'Premium 1-gallon ready-to-use solution for large-scale applications.',
        sku: 'HC-1GAL-RTU',
        weight: 8.8,
        category: 'Large Format',
        certifications: ['EPA Certified', 'Professional Grade', 'Ready-to-Use'],
        productLine: 'premium',
        useCase: ['commercial', 'industrial', 'large-facility'],
        badgeType: 'EPA Premium',
        badgeColor: '#f59e0b',
        pricing: {
            cost: 19.54,
            wholesale: 29.67,
            wholesaleMonthly: 27.32,
            wholesaleQuarterly: 26.74,
            retail: 40.65,
            retailMonthly: 37.49,
            retailQuarterly: 36.71
        },
        margins: {
            wholesale: 0.341,
            wholesaleMonthly: 0.285,
            wholesaleQuarterly: 0.270,
            retail: 0.521,
            retailMonthly: 0.456,
            retailQuarterly: 0.440
        },
        volumeDiscounts: {
            '10+': { 
                discount: 0.12, 
                badge: '10+ Gallon Discount',
                retailPrice: 35.77,
                wholesalePrice: 26.11
            },
            '5+': { 
                discount: 0.06, 
                badge: '5+ Gallon Discount',
                retailPrice: 38.21,
                wholesalePrice: 27.89
            }
        },
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 10,
        minOrder: 'Monthly Invoice',
        type: 'premium',
        emoji: '🛢️'
    },

    'hc-1gal-ready-to-use-epa': {
        id: 'hc-1gal-ready-to-use-epa',
        shopifyHandle: '1-gallon-ready-to-use-epa-certified',
        name: '1 Gallon Ready to Use EPA',
        description: 'EPA-certified premium 1-gallon solution for professional applications.',
        sku: 'HC-1GAL-RTU-EPA',
        weight: 8.8,
        category: 'EPA Certified Products',
        certifications: ['EPA Registered', 'Professional Grade', 'Commercial Use'],
        productLine: 'premium',
        useCase: ['healthcare', 'commercial', 'industrial'],
        badgeType: 'EPA Premium',
        badgeColor: '#f59e0b',
        pricing: {
            cost: 20.07,
            wholesale: 30.47,
            wholesaleMonthly: 28.06,
            wholesaleQuarterly: 27.46,
            retail: 41.73,
            retailMonthly: 38.50,
            retailQuarterly: 37.70
        },
        margins: {
            wholesale: 0.341,
            wholesaleMonthly: 0.285,
            wholesaleQuarterly: 0.270,
            retail: 0.521,
            retailMonthly: 0.456,
            retailQuarterly: 0.440
        },
        volumeDiscounts: {
            '10+': { 
                discount: 0.12, 
                badge: '10+ EPA Gallon Discount',
                retailPrice: 36.72,
                wholesalePrice: 26.81
            },
            '5+': { 
                discount: 0.06, 
                badge: '5+ EPA Gallon Discount',
                retailPrice: 39.23,
                wholesalePrice: 28.64
            }
        },
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 10,
        minOrder: 'Monthly Invoice',
        type: 'premium',
        emoji: '🔬'
    },

    'ohs-3oz-organic-disinfectant': {
        id: 'ohs-3oz-organic-disinfectant',
        shopifyHandle: '3oz-organic-multi-surface-disinfectant',
        name: '3oz Organic Multi-Surface Disinfectant',
        description: 'USDA Certified Organic multi-surface disinfectant for family-safe cleaning.',
        sku: 'OHS-3OZ-ORGANIC',
        weight: 0.3,
        category: 'Organic Disinfectants',
        certifications: ['USDA Organic #8150019050', 'FDA Food Contact FCN 1811', 'Family Safe'],
        productLine: 'organic',
        useCase: ['residential', 'family', 'eco-conscious', 'food-service'],
        badgeType: 'USDA Organic',
        badgeColor: '#4ADE80',
        pricing: {
            cost: 6.85,
            wholesale: 9.59,
            wholesaleMonthly: 8.83,
            wholesaleQuarterly: 8.64,
            retail: 12.97,
            retailMonthly: 11.96,
            retailQuarterly: 11.71
        },
        margins: {
            wholesale: 0.286,
            wholesaleMonthly: 0.224,
            wholesaleQuarterly: 0.207,
            retail: 0.422,
            retailMonthly: 0.371,
            retailQuarterly: 0.358
        },
        volumeDiscounts: {
            '1000+': { 
                discount: 0.18, 
                badge: '1000+ Organic Discount',
                retailPrice: 10.64,
                wholesalePrice: 7.86
            },
            '500+': { 
                discount: 0.12, 
                badge: '500+ Organic Discount',
                retailPrice: 11.41,
                wholesalePrice: 8.44
            },
            '100+': { 
                discount: 0.08, 
                badge: '100+ Organic Discount',
                retailPrice: 11.93,
                wholesalePrice: 8.82
            }
        },
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 1000,
        minOrder: 1000,
        maxOrder: 9999,
        type: 'organic',
        emoji: '🌱',
        sdsDocument: 'assets/documents/ohs-3oz-organic-sds.pdf',
        complianceNotes: 'USDA Organic certified, safe for food contact surfaces'
    },

    'ohs-32oz-organic-cleaner': {
        id: 'ohs-32oz-organic-cleaner',
        shopifyHandle: '32oz-organic-ready-to-use-cleaner',
        name: '32oz Organic Ready-to-Use Cleaner',
        description: 'USDA Certified Organic ready-to-use cleaner for eco-conscious families.',
        sku: 'OHS-32OZ-ORGANIC-RTU',
        weight: 2.2,
        category: 'Organic Ready-to-Use',
        certifications: ['USDA Organic #8150019050', 'FDA Food Contact FCN 1811', 'Eco-Safe'],
        productLine: 'organic',
        useCase: ['residential', 'family', 'eco-conscious'],
        badgeType: 'USDA Organic',
        badgeColor: '#4ADE80',
        pricing: {
            cost: 11.52,
            wholesale: 16.13,
            wholesaleMonthly: 14.85,
            wholesaleQuarterly: 14.53,
            retail: 21.80,
            retailMonthly: 20.10,
            retailQuarterly: 19.68
        },
        margins: {
            wholesale: 0.286,
            wholesaleMonthly: 0.224,
            wholesaleQuarterly: 0.207,
            retail: 0.422,
            retailMonthly: 0.371,
            retailQuarterly: 0.358
        },
        volumeDiscounts: {
            '500+': { 
                discount: 0.18, 
                badge: '500+ Organic Discount',
                retailPrice: 17.88,
                wholesalePrice: 13.23
            },
            '250+': { 
                discount: 0.12, 
                badge: '250+ Organic Discount',
                retailPrice: 19.18,
                wholesalePrice: 14.19
            },
            '100+': { 
                discount: 0.08, 
                badge: '100+ Organic Discount',
                retailPrice: 20.06,
                wholesalePrice: 14.84
            }
        },
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 500,
        minOrder: 500,
        type: 'organic',
        emoji: '🧽'
    },

    'ohs-32oz-pet-safe-cleaner': {
        id: 'ohs-32oz-pet-safe-cleaner',
        shopifyHandle: '32oz-organic-pet-safe-cleaner-deodorizer',
        name: '32oz Organic Pet Safe Cleaner & Deodorizer',
        description: 'USDA Certified Organic pet-safe cleaner and deodorizer for family homes.',
        sku: 'OHS-32OZ-PET-SAFE',
        weight: 2.2,
        category: 'Organic Pet Care',
        certifications: ['USDA Organic #8150019050', 'Pet Safe', 'Family Safe'],
        productLine: 'organic',
        useCase: ['pet-care', 'family', 'residential'],
        badgeType: 'USDA Organic',
        badgeColor: '#4ADE80',
        pricing: {
            cost: 11.52,
            wholesale: 16.13,
            wholesaleMonthly: 14.85,
            wholesaleQuarterly: 14.53,
            retail: 21.80,
            retailMonthly: 20.10,
            retailQuarterly: 19.68
        },
        margins: {
            wholesale: 0.286,
            wholesaleMonthly: 0.224,
            wholesaleQuarterly: 0.207,
            retail: 0.422,
            retailMonthly: 0.371,
            retailQuarterly: 0.358
        },
        volumeDiscounts: {
            '500+': { 
                discount: 0.18, 
                badge: '500+ Pet Safe Discount',
                retailPrice: 17.88,
                wholesalePrice: 13.23
            },
            '250+': { 
                discount: 0.12, 
                badge: '250+ Pet Safe Discount',
                retailPrice: 19.18,
                wholesalePrice: 14.19
            }
        },
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 500,
        minOrder: 500,
        type: 'organic',
        emoji: '🐾'
    },

// ===================================================================
    // PREMIUM PERSONAL CARE & SKIN HEALTH
    // ===================================================================

    
    'hc-3oz-skin-health-mist': {
        id: 'hc-3oz-skin-health-mist',
        shopifyHandle: '3oz-hc-pure-skin-health-mist',
        name: '3oz HC-Pure Skin Health Mist',
        description: 'Premium hypochlorous acid skin health mist for professional therapeutic use.',
        sku: 'HC-3OZ-SKIN-MIST',
        weight: 0.3,
        category: 'Personal Care',
        certifications: ['EPA Certified', 'Therapeutic Grade', 'Skin Safe'],
        productLine: 'premium',
        useCase: ['therapeutic', 'skincare', 'professional'],
        badgeType: 'EPA Premium',
        badgeColor: '#f59e0b',
        pricing: {
            cost: 7.52,
            wholesale: 11.42,
            wholesaleMonthly: 10.52,
            wholesaleQuarterly: 10.29,
            retail: 15.70,
            retailMonthly: 14.48,
            retailQuarterly: 14.18
        },
        margins: {
            wholesale: 0.341,
            wholesaleMonthly: 0.285,
            wholesaleQuarterly: 0.270,
            retail: 0.521,
            retailMonthly: 0.456,
            retailQuarterly: 0.440
        },
        volumeDiscounts: {
            '50+': { 
                discount: 0.15, 
                badge: '50+ Skin Care Discount',
                retailPrice: 13.35,
                wholesalePrice: 9.71
            },
            '25+': { 
                discount: 0.10, 
                badge: '25+ Skin Care Discount',
                retailPrice: 14.13,
                wholesalePrice: 10.28
            }
        },
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 50,
        minOrder: 'Monthly Invoice',
        type: 'premium',
        emoji: '💧',
        sdsDocument: 'assets/documents/hc-skin-health-mist-sds.pdf',
        complianceNotes: 'Therapeutic grade for professional use'
    },

    'hc-8oz-skin-health-mist': {
        id: 'hc-8oz-skin-health-mist',
        shopifyHandle: '8oz-hc-pure-skin-health-mist',
        name: '8oz HC-Pure Skin Health Mist',
        description: 'Premium larger format skin health mist for extended therapeutic applications.',
        sku: 'HC-8OZ-SKIN-MIST',
        weight: 0.6,
        category: 'Personal Care',
        certifications: ['EPA Certified', 'Therapeutic Grade', 'Professional Use'],
        productLine: 'premium',
        useCase: ['therapeutic', 'skincare', 'professional', 'spa'],
        badgeType: 'EPA Premium',
        badgeColor: '#f59e0b',
        pricing: {
            cost: 9.38,
            wholesale: 14.25,
            wholesaleMonthly: 13.12,
            wholesaleQuarterly: 12.84,
            retail: 19.59,
            retailMonthly: 18.07,
            retailQuarterly: 17.69
        },
        margins: {
            wholesale: 0.341,
            wholesaleMonthly: 0.285,
            wholesaleQuarterly: 0.270,
            retail: 0.521,
            retailMonthly: 0.456,
            retailQuarterly: 0.440
        },
        volumeDiscounts: {
            '25+': { 
                discount: 0.15, 
                badge: '25+ Professional Skin Care',
                retailPrice: 16.65,
                wholesalePrice: 12.11
            }
        },
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 25,
        minOrder: 'Monthly Invoice',
        type: 'premium',
        emoji: '🌟'
    },

    // ===================================================================
    // VETERINARY & PET CARE PREMIUM PRODUCTS
    // ===================================================================

    'hc-32oz-500ppm-pet': {
        id: 'hc-32oz-500ppm-pet',
        shopifyHandle: '32oz-500ppm-pet-teat-equine',
        name: '32oz 500ppm (Pet+/Teat/Equine)',
        description: 'Professional 500ppm solution for veterinary, pet care, and equine applications.',
        sku: 'HC-32OZ-500PPM-PET',
        weight: 2.2,
        category: 'Veterinary Care',
        certifications: ['EPA Certified', 'Veterinary Grade', 'Professional Use'],
        productLine: 'premium',
        useCase: ['veterinary', 'equine', 'livestock', 'professional-pet-care'],
        badgeType: 'EPA Premium',
        badgeColor: '#f59e0b',
        pricing: {
            cost: 12.88,
            wholesale: 19.56,
            wholesaleMonthly: 18.02,
            wholesaleQuarterly: 17.62,
            retail: 26.88,
            retailMonthly: 24.81,
            retailQuarterly: 24.29
        },
        margins: {
            wholesale: 0.341,
            wholesaleMonthly: 0.285,
            wholesaleQuarterly: 0.270,
            retail: 0.521,
            retailMonthly: 0.456,
            retailQuarterly: 0.440
        },
        volumeDiscounts: {
            '25+': { 
                discount: 0.15, 
                badge: '25+ Veterinary Discount',
                retailPrice: 22.85,
                wholesalePrice: 16.63
            }
        },
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 25,
        minOrder: 'Monthly Invoice',
        type: 'premium',
        emoji: '🐎'
    },

    'hc-1gal-500ppm-organic': {
        id: 'hc-1gal-500ppm-organic',
        shopifyHandle: '1-gallon-500ppm-organic',
        name: '1 Gallon 500ppm Organic',
        description: 'Premium 1-gallon 500ppm organic solution for large-scale veterinary use.',
        sku: 'HC-1GAL-500PPM-ORG',
        weight: 8.8,
        category: 'Veterinary Care',
        certifications: ['EPA Certified', 'Organic Certified', 'Professional Grade'],
        productLine: 'premium',
        useCase: ['veterinary', 'large-facility', 'organic-farming'],
        badgeType: 'EPA Premium',
        badgeColor: '#f59e0b',
        pricing: {
            cost: 21.66,
            wholesale: 32.90,
            wholesaleMonthly: 30.32,
            wholesaleQuarterly: 29.68,
            retail: 45.18,
            retailMonthly: 41.66,
            retailQuarterly: 40.81
        },
        margins: {
            wholesale: 0.341,
            wholesaleMonthly: 0.285,
            wholesaleQuarterly: 0.270,
            retail: 0.521,
            retailMonthly: 0.456,
            retailQuarterly: 0.440
        },
        volumeDiscounts: {
            '10+': { 
                discount: 0.12, 
                badge: '10+ Large Format Discount',
                retailPrice: 39.76,
                wholesalePrice: 28.95
            }
        },
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 10,
        minOrder: 'Monthly Invoice',
        type: 'premium',
        emoji: '🏭'
    },

    // ===================================================================
    // LAUNDRY CARE PREMIUM PRODUCTS
    // ===================================================================

    'hc-32oz-laundry-booster': {
        id: 'hc-32oz-laundry-booster',
        shopifyHandle: '32oz-laundry-booster-premium',
        name: '32oz Laundry Booster',
        description: 'Premium laundry sanitizer and booster for professional laundry applications.',
        sku: 'HC-32OZ-LAUNDRY',
        weight: 2.2,
        category: 'Laundry Care',
        certifications: ['EPA Certified', 'Fabric Safe', 'Professional Grade'],
        productLine: 'premium',
        useCase: ['commercial-laundry', 'healthcare', 'hospitality'],
        badgeType: 'EPA Premium',
        badgeColor: '#f59e0b',
        pricing: {
            cost: 12.48,
            wholesale: 18.95,
            wholesaleMonthly: 17.46,
            wholesaleQuarterly: 17.08,
            retail: 26.04,
            retailMonthly: 24.02,
            retailQuarterly: 23.53
        },
        margins: {
            wholesale: 0.341,
            wholesaleMonthly: 0.285,
            wholesaleQuarterly: 0.270,
            retail: 0.521,
            retailMonthly: 0.456,
            retailQuarterly: 0.440
        },
        volumeDiscounts: {
            '25+': { 
                discount: 0.15, 
                badge: '25+ Laundry Pro Discount',
                retailPrice: 22.13,
                wholesalePrice: 16.11
            }
        },
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 25,
        minOrder: 'Monthly Invoice',
        type: 'premium',
        emoji: '👕'
    },

    'hc-1gal-laundry-booster': {
        id: 'hc-1gal-laundry-booster',
        shopifyHandle: '1-gallon-laundry-booster-premium',
        name: '1 Gallon Laundry Booster',
        description: 'Premium 1-gallon laundry booster for large-scale commercial laundry operations.',
        sku: 'HC-1GAL-LAUNDRY',
        weight: 8.8,
        category: 'Laundry Care',
        certifications: ['EPA Certified', 'Commercial Grade', 'Large Format'],
        productLine: 'premium',
        useCase: ['commercial-laundry', 'industrial', 'hospitality'],
        badgeType: 'EPA Premium',
        badgeColor: '#f59e0b',
        pricing: {
            cost: 21.59,
            wholesale: 32.80,
            wholesaleMonthly: 30.22,
            wholesaleQuarterly: 29.58,
            retail: 45.06,
            retailMonthly: 41.55,
            retailQuarterly: 40.69
        },
        margins: {
            wholesale: 0.341,
            wholesaleMonthly: 0.285,
            wholesaleQuarterly: 0.270,
            retail: 0.521,
            retailMonthly: 0.456,
            retailQuarterly: 0.440
        },
        volumeDiscounts: {
            '10+': { 
                discount: 0.12, 
                badge: '10+ Commercial Laundry Discount',
                retailPrice: 39.65,
                wholesalePrice: 28.86
            }
        },
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 10,
        minOrder: 'Monthly Invoice',
        type: 'premium',
        emoji: '🏭'
    },

    // ===================================================================
    // CLEANING SUPPLIES & WIPES
    // ===================================================================

    'hc-all-in-one-wipes': {
        id: 'hc-all-in-one-wipes',
        shopifyHandle: 'all-in-one-wipes-premium',
        name: 'All-in-one Wipes',
        description: 'Premium all-in-one disinfecting wipes for professional and commercial use.',
        sku: 'HC-WIPES-AIO',
        weight: 1.8,
        category: 'Cleaning Supplies',
        certifications: ['EPA Certified', 'Professional Grade', 'Ready-to-Use'],
        productLine: 'premium',
        useCase: ['office', 'healthcare', 'commercial', 'professional'],
        badgeType: 'EPA Premium',
        badgeColor: '#f59e0b',
        pricing: {
            cost: 12.56,
            wholesale: 19.07,
            wholesaleMonthly: 17.58,
            wholesaleQuarterly: 17.19,
            retail: 26.21,
            retailMonthly: 24.19,
            retailQuarterly: 23.69
        },
        margins: {
            wholesale: 0.341,
            wholesaleMonthly: 0.285,
            wholesaleQuarterly: 0.270,
            retail: 0.521,
            retailMonthly: 0.456,
            retailQuarterly: 0.440
        },
        volumeDiscounts: {
            '20+': { 
                discount: 0.15, 
                badge: '20+ Wipes Bulk Discount',
                retailPrice: 22.28,
                wholesalePrice: 16.21
            }
        },
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 20,
        minOrder: 'Monthly Invoice',
        type: 'premium',
        emoji: '🧻'
    },
// ===================================================================
    // THERAPEUTIC & SPECIALIZED PRODUCTS (50.1% retail margin)
    // ===================================================================

    'hc-16oz-equine-healing-gel': {
        id: 'hc-16oz-equine-healing-gel',
        shopifyHandle: '16oz-equine-healing-udder-gel',
        name: '16oz Equine Healing/Udder Gel',
        description: 'Premium therapeutic gel for equine healing and udder care applications.',
        sku: 'HC-16OZ-EQUINE-GEL',
        weight: 1.2,
        category: 'Therapeutic Products',
        certifications: ['EPA Certified', 'Therapeutic Grade', 'Veterinary Use'],
        productLine: 'premium',
        useCase: ['equine', 'therapeutic', 'veterinary', 'livestock'],
        badgeType: 'EPA Premium',
        badgeColor: '#f59e0b',
        pricing: {
            cost: 21.84,
            wholesale: 33.18,
            wholesaleMonthly: 30.56,
            wholesaleQuarterly: 29.91,
            retail: 43.75,
            retailMonthly: 40.36,
            retailQuarterly: 39.52
        },
        margins: {
            wholesale: 0.341,
            wholesaleMonthly: 0.285,
            wholesaleQuarterly: 0.270,
            retail: 0.501,
            retailMonthly: 0.436,
            retailQuarterly: 0.420
        },
        volumeDiscounts: {
            '20+': { 
                discount: 0.12, 
                badge: '20+ Therapeutic Discount',
                retailPrice: 38.50,
                wholesalePrice: 29.20
            }
        },
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 20,
        minOrder: 'Monthly Invoice',
        type: 'premium',
        emoji: '🐎'
    },

    'hc-healing-skin-serum': {
        id: 'hc-healing-skin-serum',
        shopifyHandle: 'hc-pure-healing-skin-serum',
        name: 'HC-Pure Healing Skin Serum',
        description: 'Premium therapeutic skin serum for professional healing applications.',
        sku: 'HC-HEALING-SERUM',
        weight: 0.4,
        category: 'Therapeutic Products',
        certifications: ['EPA Certified', 'Therapeutic Grade', 'Professional Use'],
        productLine: 'premium',
        useCase: ['therapeutic', 'professional', 'medical', 'spa'],
        badgeType: 'EPA Premium',
        badgeColor: '#f59e0b',
        pricing: {
            cost: 19.79,
            wholesale: 30.06,
            wholesaleMonthly: 27.71,
            wholesaleQuarterly: 27.12,
            retail: 39.66,
            retailMonthly: 36.58,
            retailQuarterly: 35.83
        },
        margins: {
            wholesale: 0.341,
            wholesaleMonthly: 0.285,
            wholesaleQuarterly: 0.270,
            retail: 0.501,
            retailMonthly: 0.436,
            retailQuarterly: 0.420
        },
        volumeDiscounts: {
            '20+': { 
                discount: 0.12, 
                badge: '20+ Healing Serum Discount',
                retailPrice: 34.90,
                wholesalePrice: 26.45
            }
        },
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 20,
        minOrder: 'Monthly Invoice',
        type: 'premium',
        emoji: '💊'
    },

    'hc-100ml-diaper-rash-gel': {
        id: 'hc-100ml-diaper-rash-gel',
        shopifyHandle: '100ml-diaper-rash-gel',
        name: '100ml Diaper Rash Gel',
        description: 'Premium therapeutic gel for diaper rash and sensitive skin applications.',
        sku: 'HC-100ML-DIAPER-GEL',
        weight: 0.3,
        category: 'Therapeutic Products',
        certifications: ['EPA Certified', 'Baby Safe', 'Therapeutic Grade'],
        productLine: 'premium',
        useCase: ['baby-care', 'therapeutic', 'sensitive-skin'],
        badgeType: 'EPA Premium',
        badgeColor: '#f59e0b',
        pricing: {
            cost: 21.14,
            wholesale: 32.12,
            wholesaleMonthly: 29.59,
            wholesaleQuarterly: 28.96,
            retail: 42.33,
            retailMonthly: 39.07,
            retailQuarterly: 38.26
        },
        margins: {
            wholesale: 0.341,
            wholesaleMonthly: 0.285,
            wholesaleQuarterly: 0.270,
            retail: 0.501,
            retailMonthly: 0.436,
            retailQuarterly: 0.420
        },
        volumeDiscounts: {
            '20+': { 
                discount: 0.12, 
                badge: '20+ Baby Care Discount',
                retailPrice: 37.25,
                wholesalePrice: 28.27
            }
        },
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 20,
        minOrder: 'Monthly Invoice',
        type: 'premium',
        emoji: '👶'
    },

    // ===================================================================
    // PREMIUM BUNDLE KITS
    // ===================================================================

    'hc-starter-cleaning-bundle': {
        id: 'hc-starter-cleaning-bundle',
        shopifyHandle: 'hc-starter-cleaning-bundle',
        name: 'HC Starter Cleaning Bundle',
        description: 'Premium starter bundle with essential cleaning products for professional use.',
        sku: 'HC-STARTER-BUNDLE',
        weight: 6.0,
        category: 'Bundle Kits',
        certifications: ['EPA Certified Bundle', 'Professional Grade'],
        productLine: 'premium',
        useCase: ['starter-kit', 'professional', 'small-business'],
        badgeType: 'EPA Premium Bundle',
        badgeColor: '#f59e0b',
        pricing: {
            cost: 36.85,
            wholesale: 56.00,
            wholesaleMonthly: 51.60,
            wholesaleQuarterly: 50.49,
            retail: 77.00,
            retailMonthly: 71.02,
            retailQuarterly: 69.58
        },
        margins: {
            wholesale: 0.341,
            wholesaleMonthly: 0.285,
            wholesaleQuarterly: 0.270,
            retail: 0.521,
            retailMonthly: 0.456,
            retailQuarterly: 0.440
        },
        bundleContents: [
            '3oz HC-Pure Multi-Use Disinfectant',
            '32oz Multi Use Cleaner Ready to Use',
            'All-in-One Wipes'
        ],
        bundleSavings: 8.77,
        volumeDiscounts: {
            '10+': { 
                discount: 0.10, 
                badge: '10+ Bundle Discount',
                retailPrice: 69.30,
                wholesalePrice: 50.40
            }
        },
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 10,
        minOrder: 'Monthly Invoice',
        type: 'premium',
        emoji: '📦'
    },

    'hc-essential-cleaning-bundle': {
        id: 'hc-essential-cleaning-bundle',
        shopifyHandle: 'hc-essential-cleaning-bundle',
        name: 'HC Essential Cleaning Bundle',
        description: 'Premium essential bundle with comprehensive cleaning solutions for professionals.',
        sku: 'HC-ESSENTIAL-BUNDLE',
        weight: 12.5,
        category: 'Bundle Kits',
        certifications: ['EPA Certified Bundle', 'Professional Grade'],
        productLine: 'premium',
        useCase: ['comprehensive', 'professional', 'commercial'],
        badgeType: 'EPA Premium Bundle',
        badgeColor: '#f59e0b',
        pricing: {
            cost: 76.92,
            wholesale: 116.86,
            wholesaleMonthly: 107.71,
            wholesaleQuarterly: 105.41,
            retail: 160.71,
            retailMonthly: 148.25,
            retailQuarterly: 145.19
        },
        margins: {
            wholesale: 0.341,
            wholesaleMonthly: 0.285,
            wholesaleQuarterly: 0.270,
            retail: 0.521,
            retailMonthly: 0.456,
            retailQuarterly: 0.440
        },
        bundleContents: [
            '3oz HC-Pure Multi-Use Disinfectant',
            '32oz Multi Use Cleaner EPA',
            '32oz Pet Cleaner and Deodorizer',
            'All-in-One Wipes',
            '32oz Laundry Booster'
        ],
        bundleSavings: 19.50,
        volumeDiscounts: {
            '5+': { 
                discount: 0.10, 
                badge: '5+ Essential Bundle Discount',
                retailPrice: 144.64,
                wholesalePrice: 105.17
            }
        },
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 5,
        minOrder: 'Monthly Invoice',
        type: 'premium',
        emoji: '🎯'
    },

    'hc-complete-cleaning-bundle': {
        id: 'hc-complete-cleaning-bundle',
        shopifyHandle: 'hc-complete-cleaning-bundle',
        name: 'HC Complete Cleaning Bundle',
        description: 'Premium complete bundle with full range of professional cleaning solutions.',
        sku: 'HC-COMPLETE-BUNDLE',
        weight: 18.2,
        category: 'Bundle Kits',
        certifications: ['EPA Certified Bundle', 'Professional Grade', 'Complete Solution'],
        productLine: 'premium',
        useCase: ['complete-solution', 'large-facility', 'comprehensive'],
        badgeType: 'EPA Premium Bundle',
        badgeColor: '#f59e0b',
        pricing: {
            cost: 95.38,
            wholesale: 144.94,
            wholesaleMonthly: 133.55,
            wholesaleQuarterly: 130.74,
            retail: 199.27,
            retailMonthly: 183.78,
            retailQuarterly: 180.02
        },
        margins: {
            wholesale: 0.341,
            wholesaleMonthly: 0.285,
            wholesaleQuarterly: 0.270,
            retail: 0.521,
            retailMonthly: 0.456,
            retailQuarterly: 0.440
        },
        bundleContents: [
            '3oz HC-Pure Multi-Use Disinfectant',
            '32oz Multi Use Cleaner EPA',
            '1 Gallon Ready to Use EPA',
            'All-in-One Wipes',
            '32oz Laundry Booster',
            '3oz HC-Pure Skin Health Mist'
        ],
        bundleSavings: 26.38,
        volumeDiscounts: {
            '3+': { 
                discount: 0.10, 
                badge: '3+ Complete Bundle Discount',
                retailPrice: 179.34,
                wholesalePrice: 130.45
            }
        },
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 3,
        minOrder: 'Monthly Invoice',
        type: 'premium',
        emoji: '🏆'
    },

    'hc-ready-to-use-value-bundle': {
        id: 'hc-ready-to-use-value-bundle',
        shopifyHandle: 'hc-ready-to-use-value-bundle',
        name: 'HC Ready to Use Value Bundle',
        description: 'Premium ready-to-use bundle for immediate professional applications.',
        sku: 'HC-RTU-VALUE-BUNDLE',
        weight: 13.8,
        category: 'Bundle Kits',
        certifications: ['EPA Certified Bundle', 'Ready-to-Use'],
        productLine: 'premium',
        useCase: ['ready-to-use', 'immediate-application', 'convenience'],
        badgeType: 'EPA Premium Bundle',
        badgeColor: '#f59e0b',
        pricing: {
            cost: 40.71,
            wholesale: 61.86,
            wholesaleMonthly: 57.02,
            wholesaleQuarterly: 55.79,
            retail: 85.06,
            retailMonthly: 78.49,
            retailQuarterly: 76.88
        },
        margins: {
            wholesale: 0.341,
            wholesaleMonthly: 0.285,
            wholesaleQuarterly: 0.270,
            retail: 0.521,
            retailMonthly: 0.456,
            retailQuarterly: 0.440
        },
        bundleContents: [
            '32oz Multi Use Cleaner Ready to Use',
            '1 Gallon Ready to Use',
            'All-in-One Wipes'
        ],
        bundleSavings: 15.59,
        volumeDiscounts: {
            '5+': { 
                discount: 0.10, 
                badge: '5+ RTU Bundle Discount',
                retailPrice: 76.55,
                wholesalePrice: 55.67
            }
        },
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 5,
        minOrder: 'Monthly Invoice',
        type: 'premium',
        emoji: '⚡'
    },

    'hc-pet-care-bundle': {
        id: 'hc-pet-care-bundle',
        shopifyHandle: 'hc-pet-care-bundle',
        name: 'HC Pet Care Bundle',
        description: 'Premium pet care bundle with specialized products for professional pet care.',
        sku: 'HC-PET-CARE-BUNDLE',
        weight: 7.5,
        category: 'Bundle Kits',
        certifications: ['EPA Certified Bundle', 'Pet Safe', 'Professional Grade'],
        productLine: 'premium',
        useCase: ['pet-care', 'veterinary', 'professional'],
        badgeType: 'EPA Premium Bundle',
        badgeColor: '#f59e0b',
        pricing: {
            cost: 39.82,
            wholesale: 60.50,
            wholesaleMonthly: 55.76,
            wholesaleQuarterly: 54.59,
            retail: 83.19,
            retailMonthly: 76.77,
            retailQuarterly: 75.18
        },
        margins: {
            wholesale: 0.341,
            wholesaleMonthly: 0.285,
            wholesaleQuarterly: 0.270,
            retail: 0.521,
            retailMonthly: 0.456,
            retailQuarterly: 0.440
        },
        bundleContents: [
            '32oz Pet Cleaner and Deodorizer',
            '32oz 500ppm Pet+ Solution',
            'All-in-One Wipes',
            '3oz HC-Pure Skin Health Mist'
        ],
        bundleSavings: 17.40,
        volumeDiscounts: {
            '5+': { 
                discount: 0.10, 
                badge: '5+ Pet Care Bundle Discount',
                retailPrice: 74.87,
                wholesalePrice: 54.45
            }
        },
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 5,
        minOrder: 'Monthly Invoice',
        type: 'premium',
        emoji: '🐾'
    },
// ===================================================================
    // EQUIPMENT & GENERATORS (50.1% retail margin)
    // ===================================================================

    'hc-hypochlorous-station1-starter-kit': {
        id: 'hc-hypochlorous-station1-starter-kit',
        shopifyHandle: 'hypochlorous-station1-starter-kit',
        name: 'Hypochlorous Station1 Starter Kit',
        description: 'Professional hypochlorous acid generation system with complete starter kit.',
        sku: 'HC-STATION1-STARTER',
        weight: 25.0,
        category: 'Equipment',
        certifications: ['EPA Certified', 'Professional Equipment', 'Complete System'],
        productLine: 'premium',
        useCase: ['equipment', 'professional', 'on-site-generation'],
        badgeType: 'EPA Premium Equipment',
        badgeColor: '#f59e0b',
        pricing: {
            cost: 327.77,
            wholesale: 497.98,
            wholesaleMonthly: 458.91,
            wholesaleQuarterly: 449.21,
            retail: 656.04,
            retailMonthly: 605.31,
            retailQuarterly: 592.92
        },
        margins: {
            wholesale: 0.341,
            wholesaleMonthly: 0.285,
            wholesaleQuarterly: 0.270,
            retail: 0.501,
            retailMonthly: 0.436,
            retailQuarterly: 0.420
        },
        volumeDiscounts: {
            '2+': { 
                discount: 0.08, 
                badge: '2+ Equipment Discount',
                retailPrice: 603.56,
                wholesalePrice: 458.14
            }
        },
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 2,
        minOrder: 'Monthly Invoice',
        type: 'premium',
        emoji: '⚙️'
    },

    'hc-hypochlorous-refill-pouch': {
        id: 'hc-hypochlorous-refill-pouch',
        shopifyHandle: 'hypochlorous-refill-pouch',
        name: 'Hypochlorous Refill Pouch',
        description: 'Professional refill pouch for hypochlorous acid generation systems.',
        sku: 'HC-REFILL-POUCH',
        weight: 0.8,
        category: 'Equipment Supplies',
        certifications: ['EPA Certified', 'System Compatible'],
        productLine: 'premium',
        useCase: ['equipment-supply', 'refill', 'consumable'],
        badgeType: 'EPA Premium',
        badgeColor: '#f59e0b',
        pricing: {
            cost: 7.20,
            wholesale: 10.95,
            wholesaleMonthly: 10.09,
            wholesaleQuarterly: 9.87,
            retail: 14.42,
            retailMonthly: 13.31,
            retailQuarterly: 13.04
        },
        margins: {
            wholesale: 0.341,
            wholesaleMonthly: 0.285,
            wholesaleQuarterly: 0.270,
            retail: 0.501,
            retailMonthly: 0.436,
            retailQuarterly: 0.420
        },
        volumeDiscounts: {
            '100+': { 
                discount: 0.15, 
                badge: '100+ Refill Pouch Discount',
                retailPrice: 12.26,
                wholesalePrice: 9.31
            },
            '50+': { 
                discount: 0.10, 
                badge: '50+ Refill Pouch Discount',
                retailPrice: 12.98,
                wholesalePrice: 9.86
            }
        },
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 100,
        minOrder: 'Monthly Invoice',
        type: 'premium',
        emoji: '💧'
    },

    'hc-hypochlorous-generator-inline-pool': {
        id: 'hc-hypochlorous-generator-inline-pool',
        shopifyHandle: 'hypochlorous-generator-for-inline-pool',
        name: 'Hypochlorous Generator for Inline Pool',
        description: 'Professional inline hypochlorous acid generator for pool water treatment systems.',
        sku: 'HC-GENERATOR-POOL',
        weight: 45.0,
        category: 'Equipment',
        certifications: ['EPA Certified', 'Pool Equipment', 'Professional Installation'],
        productLine: 'premium',
        useCase: ['pool-treatment', 'commercial-pools', 'water-treatment'],
        badgeType: 'EPA Premium Equipment',
        badgeColor: '#f59e0b',
        pricing: {
            cost: 656.27,
            wholesale: 997.14,
            wholesaleMonthly: 919.00,
            wholesaleQuarterly: 899.42,
            retail: 1314.01,
            retailMonthly: 1212.85,
            retailQuarterly: 1188.11
        },
        margins: {
            wholesale: 0.341,
            wholesaleMonthly: 0.285,
            wholesaleQuarterly: 0.270,
            retail: 0.501,
            retailMonthly: 0.436,
            retailQuarterly: 0.420
        },
        volumeDiscounts: {
            '1+': { 
                discount: 0.05, 
                badge: 'Equipment Discount Available',
                retailPrice: 1248.31,
                wholesalePrice: 947.28
            }
        },
        subscriptionOptions: ['quarterly'],
        wholesaleThreshold: 1,
        minOrder: 'Monthly Invoice',
        type: 'premium',
        emoji: '🏊'
    },

    // ===================================================================
    // BULK PACKAGING CASES (50.1% retail margin)
    // ===================================================================

    'hc-32oz-bulk-case': {
        id: 'hc-32oz-bulk-case',
        shopifyHandle: 'hypo-company-32oz-bulk-case',
        name: '32oz Bulk Case',
        description: 'Premium bulk case packaging for 32oz products - cost-effective bulk purchasing.',
        sku: 'HC-32OZ-BULK-CASE',
        weight: 26.4,
        category: 'Bulk Packaging',
        certifications: ['EPA Certified', 'Bulk Packaging', 'Commercial Grade'],
        productLine: 'premium',
        useCase: ['bulk-purchasing', 'distributors', 'high-volume'],
        badgeType: 'EPA Premium Bulk',
        badgeColor: '#f59e0b',
        pricing: {
            cost: 26.59,
            wholesale: 40.41,
            wholesaleMonthly: 37.24,
            wholesaleQuarterly: 36.44,
            retail: 53.28,
            retailMonthly: 49.16,
            retailQuarterly: 48.16
        },
        margins: {
            wholesale: 0.341,
            wholesaleMonthly: 0.285,
            wholesaleQuarterly: 0.270,
            retail: 0.501,
            retailMonthly: 0.436,
            retailQuarterly: 0.420
        },
        volumeDiscounts: {
            '15+': { 
                discount: 0.10, 
                badge: '15+ Bulk Case Discount',
                retailPrice: 47.95,
                wholesalePrice: 36.37
            },
            '10+': { 
                discount: 0.05, 
                badge: '10+ Bulk Case Discount',
                retailPrice: 50.62,
                wholesalePrice: 38.39
            }
        },
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 15,
        minOrder: 'Monthly Invoice',
        type: 'premium',
        emoji: '📦'
    },

    'hc-one-gallon-case': {
        id: 'hc-one-gallon-case',
        shopifyHandle: 'hypo-company-one-gallon-case',
        name: 'One Gallon Case',
        description: 'Premium bulk case packaging for 1-gallon products - professional bulk solution.',
        sku: 'HC-1GAL-BULK-CASE',
        weight: 51.0,
        category: 'Bulk Packaging',
        certifications: ['EPA Certified', 'Bulk Packaging', 'Professional Grade'],
        productLine: 'premium',
        useCase: ['bulk-purchasing', 'distributors', 'commercial'],
        badgeType: 'EPA Premium Bulk',
        badgeColor: '#f59e0b',
        pricing: {
            cost: 55.20,
            wholesale: 83.89,
            wholesaleMonthly: 77.28,
            wholesaleQuarterly: 75.63,
            retail: 110.58,
            retailMonthly: 102.04,
            retailQuarterly: 100.02
        },
        margins: {
            wholesale: 0.341,
            wholesaleMonthly: 0.285,
            wholesaleQuarterly: 0.270,
            retail: 0.501,
            retailMonthly: 0.436,
            retailQuarterly: 0.420
        },
        volumeDiscounts: {
            '5+': { 
                discount: 0.10, 
                badge: '5+ Gallon Case Discount',
                retailPrice: 99.52,
                wholesalePrice: 75.50
            }
        },
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 5,
        minOrder: 'Monthly Invoice',
        type: 'premium',
        emoji: '🛢️'
    },

    // ===================================================================
    // INDUSTRIAL EPA ORGANIC PRODUCTS (50.1% retail margin)
    // ===================================================================

    'hc-150gal-organic-epa': {
        id: 'hc-150gal-organic-epa',
        shopifyHandle: 'hypo-company-150-gallon-organic-epa',
        name: '150 Gallon Organic EPA',
        description: 'Premium industrial-scale organic EPA-registered solution for large operations.',
        sku: 'HC-150GAL-ORGANIC-EPA',
        weight: 1200.0,
        category: 'Industrial Bulk',
        certifications: ['EPA Registered', 'Organic Certified', 'Industrial Grade'],
        productLine: 'premium',
        useCase: ['industrial', 'food-processing', 'large-facility'],
        badgeType: 'EPA Premium Industrial',
        badgeColor: '#f59e0b',
        pricing: {
            cost: 3600.00,
            wholesale: 5472.00,
            wholesaleMonthly: 5043.60,
            wholesaleQuarterly: 4939.20,
            retail: 7214.40,
            retailMonthly: 6658.20,
            retailQuarterly: 6523.68
        },
        margins: {
            wholesale: 0.341,
            wholesaleMonthly: 0.285,
            wholesaleQuarterly: 0.270,
            retail: 0.501,
            retailMonthly: 0.436,
            retailQuarterly: 0.420
        },
        volumeDiscounts: {
            '2+': { 
                discount: 0.05, 
                badge: 'Industrial Volume Discount',
                retailPrice: 6853.68,
                wholesalePrice: 5198.40
            }
        },
        subscriptionOptions: ['quarterly'],
        wholesaleThreshold: 1,
        minOrder: 'Monthly Invoice',
        type: 'premium',
        emoji: '🏭'
    },

    'hc-300gal-organic-epa': {
        id: 'hc-300gal-organic-epa',
        shopifyHandle: 'hypo-company-300-gallon-organic-epa',
        name: '300 Gallon Organic EPA',
        description: 'Premium industrial-scale organic EPA-registered solution - 300 gallon format.',
        sku: 'HC-300GAL-ORGANIC-EPA',
        weight: 2400.0,
        category: 'Industrial Bulk',
        certifications: ['EPA Registered', 'Organic Certified', 'Industrial Grade'],
        productLine: 'premium',
        useCase: ['industrial', 'food-processing', 'manufacturing'],
        badgeType: 'EPA Premium Industrial',
        badgeColor: '#f59e0b',
        pricing: {
            cost: 6480.00,
            wholesale: 9849.60,
            wholesaleMonthly: 9081.84,
            wholesaleQuarterly: 8890.80,
            retail: 12984.96,
            retailMonthly: 11978.64,
            retailQuarterly: 11734.08
        },
        margins: {
            wholesale: 0.341,
            wholesaleMonthly: 0.285,
            wholesaleQuarterly: 0.270,
            retail: 0.501,
            retailMonthly: 0.436,
            retailQuarterly: 0.420
        },
        volumeDiscounts: {
            '2+': { 
                discount: 0.05, 
                badge: 'Industrial Volume Discount',
                retailPrice: 12335.71,
                wholesalePrice: 9357.12
            }
        },
        subscriptionOptions: ['quarterly'],
        wholesaleThreshold: 1,
        minOrder: 'Monthly Invoice',
        type: 'premium',
        emoji: '🏭'
    },

    'hc-500gal-organic-epa': {
        id: 'hc-500gal-organic-epa',
        shopifyHandle: 'hypo-company-500-gallon-organic-epa',
        name: '500 Gallon Organic EPA',
        description: 'Premium industrial-scale organic EPA-registered solution - 500 gallon format.',
        sku: 'HC-500GAL-ORGANIC-EPA',
        weight: 4000.0,
        category: 'Industrial Bulk',
        certifications: ['EPA Registered', 'Organic Certified', 'Industrial Grade'],
        productLine: 'premium',
        useCase: ['industrial', 'large-manufacturing', 'food-processing'],
        badgeType: 'EPA Premium Industrial',
        badgeColor: '#f59e0b',
        pricing: {
            cost: 10260.00,
            wholesale: 15598.26,
            wholesaleMonthly: 14381.48,
            wholesaleQuarterly: 14084.04,
            retail: 20568.78,
            retailMonthly: 18984.02,
            retailQuarterly: 18597.36
        },
        margins: {
            wholesale: 0.341,
            wholesaleMonthly: 0.285,
            wholesaleQuarterly: 0.270,
            retail: 0.501,
            retailMonthly: 0.436,
            retailQuarterly: 0.420
        },
        volumeDiscounts: {
            '2+': { 
                discount: 0.05, 
                badge: 'Large Industrial Discount',
                retailPrice: 19540.34,
                wholesalePrice: 14818.35
            }
        },
        subscriptionOptions: ['quarterly'],
        wholesaleThreshold: 1,
        minOrder: 'Monthly Invoice',
        type: 'premium',
        emoji: '🏗️'
    },

    'hc-1000gal-organic-epa': {
        id: 'hc-1000gal-organic-epa',
        shopifyHandle: 'hypo-company-1000-gallon-organic-epa',
        name: '1000 Gallon Organic EPA',
        description: 'Premium industrial-scale organic EPA-registered solution - 1000 gallon format.',
        sku: 'HC-1000GAL-ORGANIC-EPA',
        weight: 8000.0,
        category: 'Industrial Bulk',
        certifications: ['EPA Registered', 'Organic Certified', 'Large Industrial'],
        productLine: 'premium',
        useCase: ['large-industrial', 'manufacturing', 'food-processing'],
        badgeType: 'EPA Premium Industrial',
        badgeColor: '#f59e0b',
        pricing: {
            cost: 19490.00,
            wholesale: 29612.99,
            wholesaleMonthly: 27302.12,
            wholesaleQuarterly: 26739.24,
            retail: 39044.39,
            retailMonthly: 36043.92,
            retailQuarterly: 35323.68
        },
        margins: {
            wholesale: 0.341,
            wholesaleMonthly: 0.285,
            wholesaleQuarterly: 0.270,
            retail: 0.501,
            retailMonthly: 0.436,
            retailQuarterly: 0.420
        },
        volumeDiscounts: {
            '1+': { 
                discount: 0.03, 
                badge: 'Enterprise Volume Pricing',
                retailPrice: 37873.06,
                wholesalePrice: 28724.60
            }
        },
        subscriptionOptions: ['quarterly'],
        wholesaleThreshold: 1,
        minOrder: 'Monthly Invoice',
        type: 'premium',
        emoji: '🏢'
    },

    'hc-3000gal-organic-epa': {
        id: 'hc-3000gal-organic-epa',
        shopifyHandle: 'hypo-company-3000-gallon-organic-epa',
        name: '3000 Gallon Organic EPA',
        description: 'Premium industrial-scale organic EPA-registered solution - 3000 gallon format.',
        sku: 'HC-3000GAL-ORGANIC-EPA',
        weight: 24000.0,
        category: 'Industrial Bulk',
        certifications: ['EPA Registered', 'Organic Certified', 'Enterprise Grade'],
        productLine: 'premium',
        useCase: ['enterprise', 'large-manufacturing', 'industrial'],
        badgeType: 'EPA Premium Industrial',
        badgeColor: '#f59e0b',
        pricing: {
            cost: 55560.00,
            wholesale: 84466.56,
            wholesaleMonthly: 77881.19,
            wholesaleQuarterly: 76285.68,
            retail: 111290.98,
            retailMonthly: 102710.76,
            retailQuarterly: 100645.92
        },
        margins: {
            wholesale: 0.341,
            wholesaleMonthly: 0.285,
            wholesaleQuarterly: 0.270,
            retail: 0.501,
            retailMonthly: 0.436,
            retailQuarterly: 0.420
        },
        volumeDiscounts: {
            '1+': { 
                discount: 0.03, 
                badge: 'Enterprise Volume Pricing',
                retailPrice: 107952.25,
                wholesalePrice: 81932.56
            }
        },
        subscriptionOptions: ['quarterly'],
        wholesaleThreshold: 1,
        minOrder: 'Monthly Invoice',
        type: 'premium',
        emoji: '🏭'
    },

    'hc-5000gal-organic-epa': {
        id: 'hc-5000gal-organic-epa',
        shopifyHandle: 'hypo-company-5000-gallon-organic-epa',
        name: '5000 Gallon Organic EPA',
        description: 'Premium industrial-scale organic EPA-registered solution - 5000 gallon format.',
        sku: 'HC-5000GAL-ORGANIC-EPA',
        weight: 40000.0,
        category: 'Industrial Bulk',
        certifications: ['EPA Registered', 'Organic Certified', 'Enterprise Grade'],
        productLine: 'premium',
        useCase: ['enterprise', 'mega-manufacturing', 'industrial'],
        badgeType: 'EPA Premium Industrial',
        badgeColor: '#f59e0b',
        pricing: {
            cost: 87950.00,
            wholesale: 133663.95,
            wholesaleMonthly: 123259.44,
            wholesaleQuarterly: 120751.50,
            retail: 176172.63,
            retailMonthly: 162626.22,
            retailQuarterly: 159396.84
        },
        margins: {
            wholesale: 0.341,
            wholesaleMonthly: 0.285,
            wholesaleQuarterly: 0.270,
            retail: 0.501,
            retailMonthly: 0.436,
            retailQuarterly: 0.420
        },
        volumeDiscounts: {
            '1+': { 
                discount: 0.03, 
                badge: 'Enterprise Volume Pricing',
                retailPrice: 170887.45,
                wholesalePrice: 129634.03
            }
        },
        subscriptionOptions: ['quarterly'],
        wholesaleThreshold: 1,
        minOrder: 'Monthly Invoice',
        type: 'premium',
        emoji: '🏗️'
    },
// ===================================================================
    // INDUSTRIAL FDA PRODUCTS (Variable margin structure)
    // ===================================================================

    'hc-150gal-fda': {
        id: 'hc-150gal-fda',
        shopifyHandle: 'hypo-company-150-gallon-fda',
        name: '150 Gallon FDA',
        description: 'Premium FDA-approved hypochlorous acid solution for pharmaceutical applications.',
        sku: 'HC-150GAL-FDA',
        weight: 1200.0,
        category: 'Industrial FDA',
        certifications: ['FDA Approved', 'Pharmaceutical Grade', 'Industrial'],
        productLine: 'premium',
        useCase: ['pharmaceutical', 'medical', 'fda-regulated'],
        badgeType: 'EPA Premium FDA',
        badgeColor: '#f59e0b',
        pricing: {
            cost: 3750.00,
            wholesale: 5700.00,
            wholesaleMonthly: 5256.00,
            wholesaleQuarterly: 5145.00,
            retail: 7515.00,
            retailMonthly: 6936.00,
            retailQuarterly: 6799.50
        },
        margins: {
            wholesale: 0.341,
            wholesaleMonthly: 0.285,
            wholesaleQuarterly: 0.270,
            retail: 0.501,
            retailMonthly: 0.436,
            retailQuarterly: 0.420
        },
        volumeDiscounts: {
            '2+': { 
                discount: 0.05, 
                badge: 'FDA Volume Discount',
                retailPrice: 7139.25,
                wholesalePrice: 5415.00
            }
        },
        subscriptionOptions: ['quarterly'],
        wholesaleThreshold: 1,
        minOrder: 'Monthly Invoice',
        type: 'premium',
        emoji: '💊'
    },

    'hc-300gal-fda': {
        id: 'hc-300gal-fda',
        shopifyHandle: 'hypo-company-300-gallon-fda',
        name: '300 Gallon FDA',
        description: 'Premium FDA-approved solution for large-scale pharmaceutical operations.',
        sku: 'HC-300GAL-FDA',
        weight: 2400.0,
        category: 'Industrial FDA',
        certifications: ['FDA Approved', 'Pharmaceutical Grade', 'Industrial'],
        productLine: 'premium',
        useCase: ['pharmaceutical', 'medical', 'large-facility'],
        badgeType: 'EPA Premium FDA',
        badgeColor: '#f59e0b',
        pricing: {
            cost: 6750.00,
            wholesale: 10260.00,
            wholesaleMonthly: 9462.00,
            wholesaleQuarterly: 9261.00,
            retail: 13527.00,
            retailMonthly: 12485.40,
            retailQuarterly: 12236.70
        },
        margins: {
            wholesale: 0.341,
            wholesaleMonthly: 0.285,
            wholesaleQuarterly: 0.270,
            retail: 0.501,
            retailMonthly: 0.436,
            retailQuarterly: 0.420
        },
        volumeDiscounts: {
            '2+': { 
                discount: 0.05, 
                badge: 'FDA Volume Discount',
                retailPrice: 12850.65,
                wholesalePrice: 9747.00
            }
        },
        subscriptionOptions: ['quarterly'],
        wholesaleThreshold: 1,
        minOrder: 'Monthly Invoice',
        type: 'premium',
        emoji: '💊'
    },

    'hc-500gal-fda': {
        id: 'hc-500gal-fda',
        shopifyHandle: 'hypo-company-500-gallon-fda',
        name: '500 Gallon FDA',
        description: 'Premium FDA-approved solution for pharmaceutical and medical applications.',
        sku: 'HC-500GAL-FDA',
        weight: 4000.0,
        category: 'Industrial FDA',
        certifications: ['FDA Approved', 'Pharmaceutical Grade', 'Medical Grade'],
        productLine: 'premium',
        useCase: ['pharmaceutical', 'medical', 'healthcare-systems'],
        badgeType: 'EPA Premium FDA',
        badgeColor: '#f59e0b',
        pricing: {
            cost: 10690.00,
            wholesale: 16248.59,
            wholesaleMonthly: 14980.32,
            wholesaleQuarterly: 14672.33,
            retail: 21413.37,
            retailMonthly: 19762.07,
            retailQuarterly: 19369.88
        },
        margins: {
            wholesale: 0.341,
            wholesaleMonthly: 0.285,
            wholesaleQuarterly: 0.270,
            retail: 0.501,
            retailMonthly: 0.436,
            retailQuarterly: 0.420
        },
        volumeDiscounts: {
            '2+': { 
                discount: 0.05, 
                badge: 'FDA Large Volume Discount',
                retailPrice: 20342.70,
                wholesalePrice: 15436.16
            }
        },
        subscriptionOptions: ['quarterly'],
        wholesaleThreshold: 1,
        minOrder: 'Monthly Invoice',
        type: 'premium',
        emoji: '🏥'
    },

    'hc-1000gal-fda': {
        id: 'hc-1000gal-fda',
        shopifyHandle: 'hypo-company-1000-gallon-fda',
        name: '1000 Gallon FDA',
        description: 'Premium FDA-approved solution for large pharmaceutical manufacturing.',
        sku: 'HC-1000GAL-FDA',
        weight: 8000.0,
        category: 'Industrial FDA',
        certifications: ['FDA Approved', 'Pharmaceutical Grade', 'Manufacturing Grade'],
        productLine: 'premium',
        useCase: ['pharmaceutical-manufacturing', 'medical', 'large-healthcare'],
        badgeType: 'EPA Premium FDA',
        badgeColor: '#f59e0b',
        pricing: {
            cost: 20310.00,
            wholesale: 30871.83,
            wholesaleMonthly: 28470.34,
            wholesaleQuarterly: 27892.65,
            retail: 40688.01,
            retailMonthly: 37553.99,
            retailQuarterly: 36786.42
        },
        margins: {
            wholesale: 0.341,
            wholesaleMonthly: 0.285,
            wholesaleQuarterly: 0.270,
            retail: 0.501,
            retailMonthly: 0.436,
            retailQuarterly: 0.420
        },
        volumeDiscounts: {
            '1+': { 
                discount: 0.03, 
                badge: 'FDA Enterprise Pricing',
                retailPrice: 39467.37,
                wholesalePrice: 29945.68
            }
        },
        subscriptionOptions: ['quarterly'],
        wholesaleThreshold: 1,
        minOrder: 'Monthly Invoice',
        type: 'premium',
        emoji: '🏭'
    },

    'hc-3000gal-fda': {
        id: 'hc-3000gal-fda',
        shopifyHandle: 'hypo-company-3000-gallon-fda',
        name: '3000 Gallon FDA',
        description: 'Premium FDA-approved solution for enterprise pharmaceutical operations.',
        sku: 'HC-3000GAL-FDA',
        weight: 24000.0,
        category: 'Industrial FDA',
        certifications: ['FDA Approved', 'Pharmaceutical Grade', 'Enterprise Grade'],
        productLine: 'premium',
        useCase: ['pharmaceutical-enterprise', 'large-medical', 'manufacturing'],
        badgeType: 'EPA Premium FDA',
        badgeColor: '#f59e0b',
        pricing: {
            cost: 57870.00,
            wholesale: 87949.17,
            wholesaleMonthly: 81126.47,
            wholesaleQuarterly: 79469.55,
            retail: 95960.91,
            retailMonthly: 88588.02,
            retailQuarterly: 86805.76
        },
        margins: {
            wholesale: 0.341,
            wholesaleMonthly: 0.285,
            wholesaleQuarterly: 0.270,
            retail: 0.396,
            retailMonthly: 0.314,
            retailQuarterly: 0.300
        },
        volumeDiscounts: {
            '1+': { 
                discount: 0.03, 
                badge: 'FDA Enterprise Pricing',
                retailPrice: 93082.08,
                wholesalePrice: 85310.70
            }
        },
        subscriptionOptions: ['quarterly'],
        wholesaleThreshold: 1,
        minOrder: 'Monthly Invoice',
        type: 'premium',
        emoji: '🏗️'
    },

    'hc-5000gal-fda': {
        id: 'hc-5000gal-fda',
        shopifyHandle: 'hypo-company-5000-gallon-fda',
        name: '5000 Gallon FDA',
        description: 'Premium FDA-approved solution for mega-scale pharmaceutical manufacturing.',
        sku: 'HC-5000GAL-FDA',
        weight: 40000.0,
        category: 'Industrial FDA',
        certifications: ['FDA Approved', 'Pharmaceutical Grade', 'Mega-Scale'],
        productLine: 'premium',
        useCase: ['pharmaceutical-mega-scale', 'enterprise-medical', 'large-manufacturing'],
        badgeType: 'EPA Premium FDA',
        badgeColor: '#f59e0b',
        pricing: {
            cost: 91650.00,
            wholesale: 139352.15,
            wholesaleMonthly: 128547.23,
            wholesaleQuarterly: 125929.95,
            retail: 120790.65,
            retailMonthly: 111450.50,
            retailQuarterly: 109223.25
        },
        margins: {
            wholesale: 0.341,
            wholesaleMonthly: 0.285,
            wholesaleQuarterly: 0.270,
            retail: 0.241,
            retailMonthly: 0.134,
            retailQuarterly: 0.118
        },
        volumeDiscounts: {
            '1+': { 
                discount: 0.02, 
                badge: 'Mega-Scale FDA Pricing',
                retailPrice: 118374.84,
                wholesalePrice: 136565.11
            }
        },
        subscriptionOptions: ['quarterly'],
        wholesaleThreshold: 1,
        minOrder: 'Monthly Invoice',
        type: 'premium',
        emoji: '🏭'
    },

    // ===================================================================
    // COMPLETE ORGANIC HYPOSOLUTIONS LINE
    // ===================================================================

    'ohs-1gal-organic-solution': {
        id: 'ohs-1gal-organic-solution',
        shopifyHandle: '1-gallon-organic-ready-to-use-solution',
        name: '1 Gallon Organic Ready-to-Use Solution',
        description: 'USDA Certified Organic 1-gallon solution for large-scale eco-conscious applications.',
        sku: 'OHS-1GAL-ORGANIC-RTU',
        weight: 8.8,
        category: 'Organic Large Format',
        certifications: ['USDA Organic #8150019050', 'EPA Registered', 'Eco-Safe'],
        productLine: 'organic',
        useCase: ['large-facility', 'commercial', 'eco-conscious'],
        badgeType: 'USDA Organic',
        badgeColor: '#4ADE80',
        pricing: {
            cost: 19.69,
            wholesale: 27.57,
            wholesaleMonthly: 25.39,
            wholesaleQuarterly: 24.85,
            retail: 37.28,
            retailMonthly: 34.37,
            retailQuarterly: 33.66
        },
        margins: {
            wholesale: 0.286,
            wholesaleMonthly: 0.224,
            wholesaleQuarterly: 0.207,
            retail: 0.422,
            retailMonthly: 0.371,
            retailQuarterly: 0.358
        },
        volumeDiscounts: {
            '440+': { 
                discount: 0.18, 
                badge: '440+ Organic Gallon Discount',
                retailPrice: 30.57,
                wholesalePrice: 22.61
            },
            '200+': { 
                discount: 0.12, 
                badge: '200+ Organic Gallon Discount',
                retailPrice: 32.81,
                wholesalePrice: 24.26
            },
            '100+': { 
                discount: 0.08, 
                badge: '100+ Organic Gallon Discount',
                retailPrice: 34.30,
                wholesalePrice: 25.36
            }
        },
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 440,
        minOrder: 440,
        type: 'organic',
        emoji: '🌿'
    },

    'ohs-8oz-organic-skin-health-mist': {
        id: 'ohs-8oz-organic-skin-health-mist',
        shopifyHandle: '8oz-organic-skin-health-mist',
        name: '8oz Organic Skin Health Mist',
        description: 'USDA Certified Organic skin health mist for family-safe therapeutic applications.',
        sku: 'OHS-8OZ-SKIN-MIST',
        weight: 0.6,
        category: 'Organic Personal Care',
        certifications: ['USDA Organic #8150019050', 'Skin Safe', 'Family Safe'],
        productLine: 'organic',
        useCase: ['family', 'skincare', 'therapeutic', 'eco-conscious'],
        badgeType: 'USDA Organic',
        badgeColor: '#4ADE80',
        pricing: {
            cost: 9.68,
            wholesale: 13.55,
            wholesaleMonthly: 12.48,
            wholesaleQuarterly: 12.22,
            retail: 18.31,
            retailMonthly: 16.88,
            retailQuarterly: 16.54
        },
        margins: {
            wholesale: 0.286,
            wholesaleMonthly: 0.224,
            wholesaleQuarterly: 0.207,
            retail: 0.422,
            retailMonthly: 0.371,
            retailQuarterly: 0.358
        },
        volumeDiscounts: {
            '600+': { 
                discount: 0.18, 
                badge: '600+ Organic Skin Care Discount',
                retailPrice: 15.01,
                wholesalePrice: 11.11
            },
            '300+': { 
                discount: 0.12, 
                badge: '300+ Organic Skin Care Discount',
                retailPrice: 16.11,
                wholesalePrice: 11.92
            }
        },
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 600,
        minOrder: 600,
        type: 'organic',
        emoji: '🌸'
    },

    'ohs-32oz-500ppm-pet-equine': {
        id: 'ohs-32oz-500ppm-pet-equine',
        shopifyHandle: '32oz-organic-500ppm-pet-equine-solution',
        name: '32oz Organic 500ppm Pet+ & Equine Solution',
        description: 'USDA Certified Organic 500ppm solution safe for pets and equine applications.',
        sku: 'OHS-32OZ-500PPM-PET',
        weight: 2.2,
        category: 'Organic Veterinary',
        certifications: ['USDA Organic #8150019050', 'Pet Safe', 'Equine Safe'],
        productLine: 'organic',
        useCase: ['pet-care', 'equine', 'organic-farming', 'veterinary'],
        badgeType: 'USDA Organic',
        badgeColor: '#4ADE80',
        pricing: {
            cost: 13.00,
            wholesale: 18.20,
            wholesaleMonthly: 16.76,
            wholesaleQuarterly: 16.40,
            retail: 24.59,
            retailMonthly: 22.68,
            retailQuarterly: 22.22
        },
        margins: {
            wholesale: 0.286,
            wholesaleMonthly: 0.224,
            wholesaleQuarterly: 0.207,
            retail: 0.422,
            retailMonthly: 0.371,
            retailQuarterly: 0.358
        },
        volumeDiscounts: {
            '500+': { 
                discount: 0.18, 
                badge: '500+ Organic Pet Care Discount',
                retailPrice: 20.16,
                wholesalePrice: 14.92
            },
            '250+': { 
                discount: 0.12, 
                badge: '250+ Organic Pet Care Discount',
                retailPrice: 21.64,
                wholesalePrice: 16.02
            }
        },
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 500,
        minOrder: 500,
        type: 'organic',
        emoji: '🐎'
    },

    'ohs-1gal-500ppm-veterinary': {
        id: 'ohs-1gal-500ppm-veterinary',
        shopifyHandle: '1-gallon-organic-500ppm-veterinary-solution',
        name: '1 Gallon Organic 500ppm Veterinary Solution',
        description: 'USDA Certified Organic 1-gallon 500ppm solution for professional veterinary use.',
        sku: 'OHS-1GAL-500PPM-VET',
        weight: 8.8,
        category: 'Organic Veterinary',
        certifications: ['USDA Organic #8150019050', 'Veterinary Grade', 'Professional Use'],
        productLine: 'organic',
        useCase: ['veterinary', 'professional', 'large-animal-facility', 'organic-farming'],
        badgeType: 'USDA Organic',
        badgeColor: '#4ADE80',
        pricing: {
            cost: 21.81,
            wholesale: 30.53,
            wholesaleMonthly: 28.12,
            wholesaleQuarterly: 27.53,
            retail: 41.27,
            retailMonthly: 38.06,
            retailQuarterly: 37.27
        },
        margins: {
            wholesale: 0.286,
            wholesaleMonthly: 0.224,
            wholesaleQuarterly: 0.207,
            retail: 0.422,
            retailMonthly: 0.371,
            retailQuarterly: 0.358
        },
        volumeDiscounts: {
            '440+': { 
                discount: 0.18, 
                badge: '440+ Organic Veterinary Discount',
                retailPrice: 33.84,
                wholesalePrice: 25.03
            },
            '200+': { 
                discount: 0.12, 
                badge: '200+ Organic Veterinary Discount',
                retailPrice: 36.32,
                wholesalePrice: 26.87
            }
        },
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 440,
        minOrder: 440,
        type: 'organic',
        emoji: '🏥'
    },

    'ohs-32oz-organic-laundry-booster': {
        id: 'ohs-32oz-organic-laundry-booster',
        shopifyHandle: '32oz-organic-laundry-booster',
        name: '32oz Organic Laundry Booster',
        description: 'USDA Certified Organic laundry booster for eco-friendly fabric care.',
        sku: 'OHS-32OZ-LAUNDRY',
        weight: 2.2,
        category: 'Organic Laundry Care',
        certifications: ['USDA Organic #8150019050', 'Fabric Safe', 'Eco-Friendly'],
        productLine: 'organic',
        useCase: ['eco-laundry', 'family', 'commercial-laundry', 'eco-conscious'],
        badgeType: 'USDA Organic',
        badgeColor: '#4ADE80',
        pricing: {
            cost: 12.60,
            wholesale: 17.64,
            wholesaleMonthly: 16.24,
            wholesaleQuarterly: 15.90,
            retail: 23.86,
            retailMonthly: 22.00,
            retailQuarterly: 21.55
        },
        margins: {
            wholesale: 0.286,
            wholesaleMonthly: 0.224,
            wholesaleQuarterly: 0.207,
            retail: 0.422,
            retailMonthly: 0.371,
            retailQuarterly: 0.358
        },
        volumeDiscounts: {
            '500+': { 
                discount: 0.18, 
                badge: '500+ Organic Laundry Discount',
                retailPrice: 19.56,
                wholesalePrice: 14.46
            },
            '250+': { 
                discount: 0.12, 
                badge: '250+ Organic Laundry Discount',
                retailPrice: 21.00,
                wholesalePrice: 15.52
            }
        },
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 500,
        minOrder: 500,
        type: 'organic',
        emoji: '👕'
    },

    'ohs-1gal-organic-laundry-booster': {
        id: 'ohs-1gal-organic-laundry-booster',
        shopifyHandle: '1-gallon-organic-laundry-booster',
        name: '1 Gallon Organic Laundry Booster',
        description: 'USDA Certified Organic 1-gallon laundry booster for large-scale eco-friendly operations.',
        sku: 'OHS-1GAL-LAUNDRY',
        weight: 8.8,
        category: 'Organic Laundry Care',
        certifications: ['USDA Organic #8150019050', 'Large Format', 'Commercial Safe'],
        productLine: 'organic',
        useCase: ['commercial-laundry', 'eco-facilities', 'large-household'],
        badgeType: 'USDA Organic',
        badgeColor: '#4ADE80',
        pricing: {
            cost: 21.74,
            wholesale: 30.44,
            wholesaleMonthly: 28.04,
            wholesaleQuarterly: 27.45,
            retail: 41.15,
            retailMonthly: 37.95,
            retailQuarterly: 37.17
        },
        margins: {
            wholesale: 0.286,
            wholesaleMonthly: 0.224,
            wholesaleQuarterly: 0.207,
            retail: 0.422,
            retailMonthly: 0.371,
            retailQuarterly: 0.358
        },
        volumeDiscounts: {
            '440+': { 
                discount: 0.18, 
                badge: '440+ Organic Laundry Gallon Discount',
                retailPrice: 33.74,
                wholesalePrice: 24.96
            },
            '200+': { 
                discount: 0.12, 
                badge: '200+ Organic Laundry Gallon Discount',
                retailPrice: 36.21,
                wholesalePrice: 26.79
            }
        },
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 440,
        minOrder: 440,
        type: 'organic',
        emoji: '🏭'
    },

    'ohs-organic-all-in-one-wipes': {
        id: 'ohs-organic-all-in-one-wipes',
        shopifyHandle: 'organic-all-in-one-disinfecting-wipes',
        name: 'Organic All-in-One Disinfecting Wipes',
        description: 'USDA Certified Organic disinfecting wipes for family-safe cleaning.',
        sku: 'OHS-ORGANIC-WIPES',
        weight: 1.8,
        category: 'Organic Cleaning Supplies',
        certifications: ['USDA Organic #8150019050', 'EPA Registered', 'Family Safe'],
        productLine: 'organic',
        useCase: ['family', 'office', 'eco-conscious', 'childcare'],
        badgeType: 'USDA Organic',
        badgeColor: '#4ADE80',
        pricing: {
            cost: 12.84,
            wholesale: 17.98,
            wholesaleMonthly: 16.55,
            wholesaleQuarterly: 16.20,
            retail: 24.29,
            retailMonthly: 22.41,
            retailQuarterly: 21.94
        },
        margins: {
            wholesale: 0.286,
            wholesaleMonthly: 0.224,
            wholesaleQuarterly: 0.207,
            retail: 0.422,
            retailMonthly: 0.371,
            retailQuarterly: 0.358
        },
        volumeDiscounts: {
            '200+': { 
                discount: 0.18, 
                badge: '200+ Organic Wipes Discount',
                retailPrice: 19.92,
                wholesalePrice: 14.74
            },
            '100+': { 
                discount: 0.12, 
                badge: '100+ Organic Wipes Discount',
                retailPrice: 21.38,
                wholesalePrice: 15.82
            }
        },
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 200,
        minOrder: 200,
        type: 'organic',
        emoji: '🧻'
    },

    'ohs-16oz-organic-equine-healing-gel': {
        id: 'ohs-16oz-organic-equine-healing-gel',
        shopifyHandle: '16oz-organic-equine-healing-udder-gel',
        name: '16oz Organic Equine Healing & Udder Gel',
        description: 'USDA Certified Organic therapeutic gel for equine and livestock healing.',
        sku: 'OHS-16OZ-EQUINE-GEL',
        weight: 1.2,
        category: 'Organic Therapeutic',
        certifications: ['USDA Organic #8150019050', 'Therapeutic Grade', 'Veterinary Safe'],
        productLine: 'organic',
        useCase: ['equine', 'livestock', 'therapeutic', 'organic-farming'],
        badgeType: 'USDA Organic Therapeutic',
        badgeColor: '#4ADE80',
        pricing: {
            cost: 21.96,
            wholesale: 30.75,
            wholesaleMonthly: 28.32,
            wholesaleQuarterly: 27.72,
            retail: 38.16,
            retailMonthly: 35.21,
            retailQuarterly: 34.47
        },
        margins: {
            wholesale: 0.286,
            wholesaleMonthly: 0.224,
            wholesaleQuarterly: 0.207,
            retail: 0.372,
            retailMonthly: 0.330,
            retailQuarterly: 0.317
        },
        volumeDiscounts: {
            '50+': { 
                discount: 0.15, 
                badge: '50+ Organic Therapeutic Discount',
                retailPrice: 32.44,
                wholesalePrice: 26.14
            },
            '25+': { 
                discount: 0.08, 
                badge: '25+ Organic Therapeutic Discount',
                retailPrice: 35.11,
                wholesalePrice: 28.29
            }
        },
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 50,
        minOrder: 50,
        type: 'organic',
        emoji: '🐎'
    },

    'ohs-organic-healing-skin-serum': {
        id: 'ohs-organic-healing-skin-serum',
        shopifyHandle: 'organic-healing-skin-serum',
        name: 'Organic Healing Skin Serum',
        description: 'USDA Certified Organic therapeutic skin serum for natural healing applications.',
        sku: 'OHS-HEALING-SERUM',
        weight: 0.4,
        category: 'Organic Therapeutic',
        certifications: ['USDA Organic #8150019050', 'Therapeutic Grade', 'Skin Safe'],
        productLine: 'organic',
        useCase: ['therapeutic', 'skincare', 'family', 'natural-healing'],
        badgeType: 'USDA Organic Therapeutic',
        badgeColor: '#4ADE80',
        pricing: {
            cost: 19.91,
            wholesale: 27.89,
            wholesaleMonthly: 25.68,
            wholesaleQuarterly: 25.15,
            retail: 34.63,
            retailMonthly: 31.95,
            retailQuarterly: 31.31
        },
        margins: {
            wholesale: 0.286,
            wholesaleMonthly: 0.224,
            wholesaleQuarterly: 0.207,
            retail: 0.372,
            retailMonthly: 0.330,
            retailQuarterly: 0.317
        },
        volumeDiscounts: {
            '100+': { 
                discount: 0.15, 
                badge: '100+ Organic Serum Discount',
                retailPrice: 29.44,
                wholesalePrice: 23.71
            },
            '50+': { 
                discount: 0.08, 
                badge: '50+ Organic Serum Discount',
                retailPrice: 31.86,
                wholesalePrice: 25.66
            }
        },
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 100,
        minOrder: 100,
        type: 'organic',
        emoji: '💊'
    },

    'ohs-100ml-organic-diaper-rash-gel': {
        id: 'ohs-100ml-organic-diaper-rash-gel',
        shopifyHandle: '100ml-organic-baby-diaper-rash-gel',
        name: '100ml Organic Baby Diaper Rash Gel',
        description: 'USDA Certified Organic therapeutic gel for baby diaper rash and sensitive skin.',
        sku: 'OHS-100ML-DIAPER-GEL',
        weight: 0.3,
        category: 'Organic Therapeutic',
        certifications: ['USDA Organic #8150019050', 'Baby Safe', 'Therapeutic Grade'],
        productLine: 'organic',
        useCase: ['baby-care', 'sensitive-skin', 'family', 'therapeutic'],
        badgeType: 'USDA Organic Baby Care',
        badgeColor: '#4ADE80',
        pricing: {
            cost: 20.69,
            wholesale: 28.97,
            wholesaleMonthly: 26.68,
            wholesaleQuarterly: 26.11,
            retail: 35.98,
            retailMonthly: 33.20,
            retailQuarterly: 32.52
        },
        margins: {
            wholesale: 0.286,
            wholesaleMonthly: 0.224,
            wholesaleQuarterly: 0.207,
            retail: 0.372,
            retailMonthly: 0.330,
            retailQuarterly: 0.317
        },
        volumeDiscounts: {
            '100+': { 
                discount: 0.15, 
                badge: '100+ Organic Baby Care Discount',
                retailPrice: 30.58,
                wholesalePrice: 24.62
            },
            '50+': { 
                discount: 0.08, 
                badge: '50+ Organic Baby Care Discount',
                retailPrice: 33.10,
                wholesalePrice: 26.65
            }
        },
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 100,
        minOrder: 100,
        type: 'organic',
        emoji: '👶'
    },

    // ===================================================================
    // ORGANIC BUNDLE KITS
    // ===================================================================

    'ohs-organic-starter-home-bundle': {
        id: 'ohs-organic-starter-home-bundle',
        shopifyHandle: 'ohs-organic-starter-home-bundle',
        name: 'OHS Organic Starter Home Bundle',
        description: 'USDA Certified Organic starter bundle perfect for eco-conscious families.',
        sku: 'OHS-STARTER-BUNDLE',
        weight: 6.5,
        category: 'Organic Bundle Kits',
        certifications: ['USDA Organic Bundle', 'Family Safe', 'Eco-Friendly'],
        productLine: 'organic',
        useCase: ['family-starter', 'eco-conscious', 'residential'],
        badgeType: 'USDA Organic Bundle',
        badgeColor: '#4ADE80',
        pricing: {
            cost: 35.37,
            wholesale: 49.50,
            wholesaleMonthly: 45.60,
            wholesaleQuarterly: 44.64,
            retail: 66.92,
            retailMonthly: 61.74,
            retailQuarterly: 60.50
        },
        margins: {
            wholesale: 0.286,
            wholesaleMonthly: 0.224,
            wholesaleQuarterly: 0.207,
            retail: 0.422,
            retailMonthly: 0.371,
            retailQuarterly: 0.358
        },
        bundleContents: [
            '3oz Organic Multi-Surface Disinfectant',
            '32oz Organic Ready-to-Use Cleaner',
            'Organic All-in-One Disinfecting Wipes'
        ],
        bundleSavings: 12.15,
        volumeDiscounts: {
            '300+': { 
                discount: 0.10, 
                badge: '300+ Organic Bundle Discount',
                retailPrice: 60.23,
                wholesalePrice: 44.55
            }
        },
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 300,
        minOrder: 300,
        type: 'organic',
        emoji: '🏠'
    },

    'ohs-organic-essential-family-bundle': {
        id: 'ohs-organic-essential-family-bundle',
        shopifyHandle: 'ohs-organic-essential-family-bundle',
        name: 'OHS Organic Essential Family Bundle',
        description: 'USDA Certified Organic comprehensive bundle for complete family protection.',
        sku: 'OHS-ESSENTIAL-BUNDLE',
        weight: 12.0,
        category: 'Organic Bundle Kits',
        certifications: ['USDA Organic Bundle', 'Family Safe', 'Comprehensive'],
        productLine: 'organic',
        useCase: ['family-comprehensive', 'eco-conscious', 'complete-care'],
        badgeType: 'USDA Organic Bundle',
        badgeColor: '#4ADE80',
        pricing: {
            cost: 73.85,
            wholesale: 103.42,
            wholesaleMonthly: 95.29,
            wholesaleQuarterly: 93.26,
            retail: 139.73,
            retailMonthly: 128.87,
            retailQuarterly: 126.26
        },
        margins: {
            wholesale: 0.286,
            wholesaleMonthly: 0.224,
            wholesaleQuarterly: 0.207,
            retail: 0.422,
            retailMonthly: 0.371,
            retailQuarterly: 0.358
        },
        bundleContents: [
            '3oz Organic Multi-Surface Disinfectant',
            '32oz Organic Ready-to-Use Cleaner',
            '32oz Organic Pet Safe Cleaner & Deodorizer',
            'Organic All-in-One Disinfecting Wipes',
            '32oz Organic Laundry Booster'
        ],
        bundleSavings: 22.58,
        volumeDiscounts: {
            '250+': { 
                discount: 0.10, 
                badge: '250+ Organic Family Bundle Discount',
                retailPrice: 125.76,
                wholesalePrice: 93.08
            }
        },
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 250,
        minOrder: 250,
        type: 'organic',
        emoji: '👨‍👩‍👧‍👦'
    },

    'ohs-organic-complete-care-bundle': {
        id: 'ohs-organic-complete-care-bundle',
        shopifyHandle: 'ohs-organic-complete-care-bundle',
        name: 'OHS Organic Complete Care Bundle',
        description: 'USDA Certified Organic complete care solution with everything families need.',
        sku: 'OHS-COMPLETE-BUNDLE',
        weight: 18.0,
        category: 'Organic Bundle Kits',
        certifications: ['USDA Organic Bundle', 'Complete Solution', 'Family Safe'],
        productLine: 'organic',
        useCase: ['complete-family-care', 'premium-organic', 'comprehensive'],
        badgeType: 'USDA Organic Bundle',
        badgeColor: '#4ADE80',
        pricing: {
            cost: 91.61,
            wholesale: 128.28,
            wholesaleMonthly: 118.19,
            wholesaleQuarterly: 115.73,
            retail: 173.36,
            retailMonthly: 159.88,
            retailQuarterly: 156.63
        },
        margins: {
            wholesale: 0.286,
            wholesaleMonthly: 0.224,
            wholesaleQuarterly: 0.207,
            retail: 0.422,
            retailMonthly: 0.371,
            retailQuarterly: 0.358
        },
        bundleContents: [
            '3oz Organic Multi-Surface Disinfectant',
            '32oz Organic Ready-to-Use Cleaner',
            '1 Gallon Organic Ready-to-Use Solution',
            'Organic All-in-One Disinfecting Wipes',
            '32oz Organic Laundry Booster',
            '3oz Organic Skin Health Mist'
        ],
        bundleSavings: 31.38,
        volumeDiscounts: {
            '200+': { 
                discount: 0.10, 
                badge: '200+ Organic Complete Bundle Discount',
                retailPrice: 156.02,
                wholesalePrice: 115.45
            }
        },
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 200,
        minOrder: 200,
        type: 'organic',
        emoji: '🌟'
    },

    'ohs-organic-ready-to-use-value-bundle': {
        id: 'ohs-organic-ready-to-use-value-bundle',
        shopifyHandle: 'ohs-organic-ready-to-use-value-bundle',
        name: 'OHS Organic Ready-to-Use Value Bundle',
        description: 'USDA Certified Organic ready-to-use bundle for immediate family applications.',
        sku: 'OHS-RTU-VALUE-BUNDLE',
        weight: 13.0,
        category: 'Organic Bundle Kits',
        certifications: ['USDA Organic Bundle', 'Ready-to-Use', 'Value Pack'],
        productLine: 'organic',
        useCase: ['ready-to-use', 'convenience', 'family'],
        badgeType: 'USDA Organic Bundle',
        badgeColor: '#4ADE80',
        pricing: {
            cost: 39.06,
            wholesale: 54.70,
            wholesaleMonthly: 50.38,
            wholesaleQuarterly: 49.32,
            retail: 73.92,
            retailMonthly: 68.18,
            retailQuarterly: 66.79
        },
        margins: {
            wholesale: 0.286,
            wholesaleMonthly: 0.224,
            wholesaleQuarterly: 0.207,
            retail: 0.422,
            retailMonthly: 0.371,
            retailQuarterly: 0.358
        },
        bundleContents: [
            '32oz Organic Ready-to-Use Cleaner',
            '1 Gallon Organic Ready-to-Use Solution',
            'Organic All-in-One Disinfecting Wipes'
        ],
        bundleSavings: 19.45,
        volumeDiscounts: {
            '300+': { 
                discount: 0.10, 
                badge: '300+ Organic RTU Bundle Discount',
                retailPrice: 66.53,
                wholesalePrice: 49.23
            }
        },
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 300,
        minOrder: 300,
        type: 'organic',
        emoji: '⚡'
    },

    'ohs-organic-pet-care-bundle': {
        id: 'ohs-organic-pet-care-bundle',
        shopifyHandle: 'ohs-organic-pet-care-bundle',
        name: 'OHS Organic Pet Care Bundle',
        description: 'USDA Certified Organic pet care bundle safe for beloved family pets.',
        sku: 'OHS-PET-CARE-BUNDLE',
        weight: 8.0,
        category: 'Organic Bundle Kits',
        certifications: ['USDA Organic Bundle', 'Pet Safe', 'Family Safe'],
        productLine: 'organic',
        useCase: ['pet-care', 'family-pets', 'organic-pet-care'],
        badgeType: 'USDA Organic Pet Bundle',
        badgeColor: '#4ADE80',
        pricing: {
            cost: 38.28,
            wholesale: 53.61,
            wholesaleMonthly: 49.38,
            wholesaleQuarterly: 48.35,
            retail: 72.45,
            retailMonthly: 66.84,
            retailQuarterly: 65.48
        },
        margins: {
            wholesale: 0.286,
            wholesaleMonthly: 0.224,
            wholesaleQuarterly: 0.207,
            retail: 0.422,
            retailMonthly: 0.371,
            retailQuarterly: 0.358
        },
        bundleContents: [
            '32oz Organic Pet Safe Cleaner & Deodorizer',
            '32oz Organic 500ppm Pet+ & Equine Solution',
            'Organic All-in-One Disinfecting Wipes',
            '3oz Organic Skin Health Mist'
        ],
        bundleSavings: 18.53,
        volumeDiscounts: {
            '200+': { 
                discount: 0.10, 
                badge: '200+ Organic Pet Bundle Discount',
                retailPrice: 65.21,
                wholesalePrice: 48.25
            }
        },
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 200,
        minOrder: 200,
        type: 'organic',
        emoji: '🐾'
    }

}; // END of PRODUCT_CATALOG - FINAL CLOSING BRACE!

// Make it globally accessible
window.PRODUCT_CATALOG = PRODUCT_CATALOG;

// ===================================================================
// PRICING RULES CONFIGURATION
// ===================================================================

const PRICING_RULES = {
    volumeDiscount: 0.15,
    bulkOrderThreshold: 1000,
    businessAccountDiscount: 0.12,
    utahTaxRate: 0.0775,
    freeShippingThreshold: 50,
    standardShipping: 9.95,
    expeditedShipping: 19.95,
    overnightShipping: 39.95,
    serviceAreaRadius: 25,
    deliveryFeePerMile: 0.70,
    subscriptionDiscounts: {
        monthly: 0.08,
        quarterly: 0.10,
        annual: 0.15
    },
    wholesaleMargins: {
        organic: 0.286,
        premium: 0.341
    },
    productLines: {
        premium: {
            name: 'Professional Premium Line',
            margin: 0.341,
            retailMargin: 0.521,
            minOrder: 'Monthly Invoice',
            badgeColor: '#f59e0b',
            badgeText: 'EPA Premium'
        },
        organic: {
            name: 'USDA Organic Line',
            margin: 0.286,
            retailMargin: 0.422,
            minOrder: 'Traditional MOQ',
            badgeColor: '#4ADE80',
            badgeText: 'USDA Organic'
        }
    },
    fulfillment: {
        standardDays: '2-4',
        expeditedDays: '1-2',
        overnightDays: 'Next day',
        businessOnly: false,
        saturdayDelivery: true,
        signatureRequired: false,
        origin: 'Salt Lake City, Utah'
    }
};

window.PRICING_RULES = PRICING_RULES;

console.log('🎉 COMPLETE PRODUCT CATALOG LOADED - 57 PRODUCTS TOTAL');
console.log('🏆 Premium Line: 38 products | 🌱 Organic Line: 19 products');
console.log('✅ Shopify Ready | ⚙️ Pricing Configured | 🛒 Cart Functional');

console.log('🛒 Cart Functional');
// Empty line (line 2879)
// Make it globally accessible  
window.PRODUCT_CATALOG = PRODUCT_CATALOG;
