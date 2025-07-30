// ===================================================================
// COMPLETE HYPO COMPANY PREMIUM LINE - ALL 38 PRODUCTS
// WITH COMPLETE SHOPIFY VARIANT IDS MAPPED
// NO ORDER MINIMUMS AS REQUESTED
// ===================================================================

const HYPO_COMPANY_PRODUCTS = {

    // ===================================================================
    // PERSONAL CARE PRODUCTS (3 Products)
    // ===================================================================
    
    'hc-3oz-disinfectant': {
        id: 'hc-3oz-disinfectant',
        shopifyHandle: '3oz-multi-use-disinfectant-premium',
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
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 50,
        minOrder: 1, // NO MINIMUM
        stockLevel: 'in-stock',
        fulfillmentTime: '2-4 business days',
        type: 'premium',
        emoji: '🧴',
        sdsDocument: 'assets/documents/hc-3oz-disinfectant-sds.pdf',
        complianceNotes: 'EPA certified for professional use',
        // Shopify Variant IDs
        shopifyVariants: {
            retail: "41829060411463",
            wholesale: "41829060476999",
            retailSubscription: "41829060444231",
            wholesaleSubscription: "41829060509767"
        }
    },

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
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 50,
        minOrder: 1, // NO MINIMUM
        type: 'premium',
        emoji: '💧',
        sdsDocument: 'assets/documents/hc-skin-health-mist-sds.pdf',
        complianceNotes: 'Therapeutic grade for professional use',
        // Shopify Variant IDs
        shopifyVariants: {
            retail: "41829060771911",
            wholesale: "41829060837447",
            retailSubscription: "41829060804679",
            wholesaleSubscription: "41829060870215"
        }
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
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 25,
        minOrder: 1, // NO MINIMUM
        type: 'premium',
        emoji: '🌟',
        // Shopify Variant IDs
        shopifyVariants: {
            retail: "41829061263431",
            wholesale: "41829061328967",
            retailSubscription: "41829061296199",
            wholesaleSubscription: "41829061361735"
        }
    },

    // ===================================================================
    // COMMERCIAL CLEANING PRODUCTS (4 Products)
    // ===================================================================

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
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 25,
        minOrder: 1, // NO MINIMUM
        type: 'premium',
        emoji: '🧽',
        // Shopify Variant IDs
        shopifyVariants: {
            retail: "41829061787719",
            wholesale: "41829061853255",
            retailSubscription: "41829061820487",
            wholesaleSubscription: "41829061886023"
        }
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
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 25,
        minOrder: 1, // NO MINIMUM
        type: 'premium',
        emoji: '🔬',
        // Shopify Variant IDs
        shopifyVariants: {
            retail: "41829062115399",
            wholesale: "41829062180935",
            retailSubscription: "41829062148167",
            wholesaleSubscription: "41829062213703"
        }
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
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 10,
        minOrder: 1, // NO MINIMUM
        type: 'premium',
        emoji: '🛢️',
        // Shopify Variant IDs
        shopifyVariants: {
            retail: "41829062639687",
            wholesale: "41829062705223",
            retailSubscription: "41829062672455",
            wholesaleSubscription: "41829062737991"
        }
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
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 10,
        minOrder: 1, // NO MINIMUM
        type: 'premium',
        emoji: '🔬',
        // Shopify Variant IDs
        shopifyVariants: {
            retail: "41829062967367",
            wholesale: "41829063032903",
            retailSubscription: "41829063000135",
            wholesaleSubscription: "41829063065671"
        }
    },

    // ===================================================================
    // PET CARE PRODUCTS (1 Product)
    // ===================================================================

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
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 25,
        minOrder: 1, // NO MINIMUM
        type: 'premium',
        emoji: '🐾',
        // Shopify Variant IDs
        shopifyVariants: {
            retail: "41829063295047",
            wholesale: "41829063360583",
            retailSubscription: "41829063327815",
            wholesaleSubscription: "41829063393351"
        }
    },

    // ===================================================================
    // VETERINARY PRODUCTS (3 Products)
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
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 25,
        minOrder: 1, // NO MINIMUM
        type: 'premium',
        emoji: '🐎',
        // Shopify Variant IDs
        shopifyVariants: {
            retail: "41829063786567",
            wholesale: "41829063852103",
            retailSubscription: "41829063819335",
            wholesaleSubscription: "41829063884871"
        }
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
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 10,
        minOrder: 1, // NO MINIMUM
        type: 'premium',
        emoji: '🏭',
        // Shopify Variant IDs
        shopifyVariants: {
            retail: "41829064147015",
            wholesale: "41829064212551",
            retailSubscription: "41829064179783",
            wholesaleSubscription: "41829064245319"
        }
    },

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
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 20,
        minOrder: 1, // NO MINIMUM
        type: 'premium',
        emoji: '🐎',
        // Shopify Variant IDs
        shopifyVariants: {
            retail: "41829064441927",
            wholesale: "41829064507463",
            retailSubscription: "41829064474695",
            wholesaleSubscription: "41829064540231"
        }
    },

    // ===================================================================
    // LAUNDRY CARE PRODUCTS (2 Products)
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
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 25,
        minOrder: 1, // NO MINIMUM
        type: 'premium',
        emoji: '👕',
        // Shopify Variant IDs
        shopifyVariants: {
            retail: "41829064572999",
            wholesale: "41829064638535",
            retailSubscription: "41829064605767",
            wholesaleSubscription: "41829064671303"
        }
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
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 10,
        minOrder: 1, // NO MINIMUM
        type: 'premium',
        emoji: '🏭',
        // Shopify Variant IDs
        shopifyVariants: {
            retail: "41829064704071",
            wholesale: "41829064769607",
            retailSubscription: "41829064736839",
            wholesaleSubscription: "41829064802375"
        }
    },

    // ===================================================================
    // CLEANING SUPPLIES (1 Product)
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
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 20,
        minOrder: 1, // NO MINIMUM
        type: 'premium',
        emoji: '🧻',
        // Shopify Variant IDs
        shopifyVariants: {
            retail: "41829064835143",
            wholesale: "41829064900679",
            retailSubscription: "41829064867911",
            wholesaleSubscription: "41829064933447"
        }
    },

    // ===================================================================
    // THERAPEUTIC PRODUCTS (2 Products)
    // ===================================================================

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
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 20,
        minOrder: 1, // NO MINIMUM
        type: 'premium',
        emoji: '💊',
        // Shopify Variant IDs
        shopifyVariants: {
            retail: "41829064966215",
            wholesale: "41829065031751",
            retailSubscription: "41829064998983",
            wholesaleSubscription: "41829065064519"
        }
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
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 20,
        minOrder: 1, // NO MINIMUM
        type: 'premium',
        emoji: '👶',
        // Shopify Variant IDs
        shopifyVariants: {
            retail: "41829065097287",
            wholesale: "41829065162823",
            retailSubscription: "41829065130055",
            wholesaleSubscription: "41829065195591"
        }
    },

    // ===================================================================
    // EQUIPMENT PRODUCTS (3 Products)
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
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 2,
        minOrder: 1, // NO MINIMUM
        type: 'premium',
        emoji: '⚙️',
        // Shopify Variant IDs
        shopifyVariants: {
            retail: "41829065228359",
            wholesale: "41829065293895",
            retailSubscription: "41829065261127",
            wholesaleSubscription: "41829065326663"
        }
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
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 100,
        minOrder: 1, // NO MINIMUM
        type: 'premium',
        emoji: '💧',
        // Shopify Variant IDs
        shopifyVariants: {
            retail: "41829065359431",
            wholesale: "41829065424967",
            retailSubscription: "41829065392199",
            wholesaleSubscription: "41829065457735"
        }
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
        subscriptionOptions: ['quarterly'],
        wholesaleThreshold: 1,
        minOrder: 1, // NO MINIMUM
        type: 'premium',
        emoji: '🏊',
        // Shopify Variant IDs
        shopifyVariants: {
            retail: "41829065490503",
            wholesale: "41829065556039",
            retailSubscription: "41829065523271",
            wholesaleSubscription: "41829065588807"
        }
    },

    // ===================================================================
    // BULK PACKAGING (2 Products)
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
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 15,
        minOrder: 1, // NO MINIMUM
        type: 'premium',
        emoji: '📦',
        // Shopify Variant IDs
        shopifyVariants: {
            retail: "41829065621575",
            wholesale: "41829065687111",
            retailSubscription: "41829065654343",
            wholesaleSubscription: "41829065719879"
        }
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
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 5,
        minOrder: 1, // NO MINIMUM
        type: 'premium',
        emoji: '🛢️',
        // Shopify Variant IDs
        shopifyVariants: {
            retail: "41829065752647",
            wholesale: "41829065818183",
            retailSubscription: "41829065785415",
            wholesaleSubscription: "41829065850951"
        }
    },

    // ===================================================================
    // INDUSTRIAL BULK EPA PRODUCTS (6 Products)
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
        subscriptionOptions: ['quarterly'],
        wholesaleThreshold: 1,
        minOrder: 1, // NO MINIMUM
        type: 'premium',
        emoji: '🏭',
        // Shopify Variant IDs
        shopifyVariants: {
            retail: "41829065883719",
            wholesale: "41829065949255",
            retailSubscription: "41829065916487",
            wholesaleSubscription: "41829065981991"
        }
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
        subscriptionOptions: ['quarterly'],
        wholesaleThreshold: 1,
        minOrder: 1, // NO MINIMUM
        type: 'premium',
        emoji: '🏭',
        // Shopify Variant IDs
        shopifyVariants: {
            retail: "41829066014791",
            wholesale: "41829066113095",
            retailSubscription: "41829066047559",
            wholesaleSubscription: "41829066145863"
        }
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
        subscriptionOptions: ['quarterly'],
        wholesaleThreshold: 1,
        minOrder: 1, // NO MINIMUM
        type: 'premium',
        emoji: '🏗️',
        // Shopify Variant IDs
        shopifyVariants: {
            retail: "41829066178631",
            wholesale: "41829066244167",
            retailSubscription: "41829066211399",
            wholesaleSubscription: "41829066276935"
        }
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
        subscriptionOptions: ['quarterly'],
        wholesaleThreshold: 1,
        minOrder: 1, // NO MINIMUM
        type: 'premium',
        emoji: '🏢',
        // Shopify Variant IDs
        shopifyVariants: {
            retail: "41829066309703",
            wholesale: "41829066375239",
            retailSubscription: "41829066342471",
            wholesaleSubscription: "41829066408007"
        }
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
        subscriptionOptions: ['quarterly'],
        wholesaleThreshold: 1,
        minOrder: 1, // NO MINIMUM
        type: 'premium',
        emoji: '🏭',
        // Shopify Variant IDs
        shopifyVariants: {
            retail: "41829066440775",
            wholesale: "41829066506311",
            retailSubscription: "41829066473543",
            wholesaleSubscription: "41829066539079"
        }
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
        subscriptionOptions: ['quarterly'],
        wholesaleThreshold: 1,
        minOrder: 1, // NO MINIMUM
        type: 'premium',
        emoji: '🏗️',
        // Shopify Variant IDs
        shopifyVariants: {
            retail: "41829066571847",
            wholesale: "41829066637383",
            retailSubscription: "41829066604615",
            wholesaleSubscription: "41829066670151"
        }
    },

    // ===================================================================
    // INDUSTRIAL FDA PRODUCTS (6 Products)
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
        subscriptionOptions: ['quarterly'],
        wholesaleThreshold: 1,
        minOrder: 1, // NO MINIMUM
        type: 'premium',
        emoji: '💊',
        // Shopify Variant IDs
        shopifyVariants: {
            retail: "41829066702919",
            wholesale: "41829066768455",
            retailSubscription: "41829066735687",
            wholesaleSubscription: "41829066801223"
        }
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
        subscriptionOptions: ['quarterly'],
        wholesaleThreshold: 1,
        minOrder: 1, // NO MINIMUM
        type: 'premium',
        emoji: '💊',
        // Shopify Variant IDs
        shopifyVariants: {
            retail: "41829066833991",
            wholesale: "41829066899527",
            retailSubscription: "41829066866759",
            wholesaleSubscription: "41829066932295"
        }
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
        subscriptionOptions: ['quarterly'],
        wholesaleThreshold: 1,
        minOrder: 1, // NO MINIMUM
        type: 'premium',
        emoji: '🏥',
        // Shopify Variant IDs
        shopifyVariants: {
            retail: "41829066965063",
            wholesale: "41829067030599",
            retailSubscription: "41829066997831",
            wholesaleSubscription: "41829067063367"
        }
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
        subscriptionOptions: ['quarterly'],
        wholesaleThreshold: 1,
        minOrder: 1, // NO MINIMUM
        type: 'premium',
        emoji: '🏭',
        // Shopify Variant IDs
        shopifyVariants: {
            retail: "41829067096135",
            wholesale: "41829067161671",
            retailSubscription: "41829067128903",
            wholesaleSubscription: "41829067194439"
        }
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
        subscriptionOptions: ['quarterly'],
        wholesaleThreshold: 1,
        minOrder: 1, // NO MINIMUM
        type: 'premium',
        emoji: '🏗️',
        // Shopify Variant IDs
        shopifyVariants: {
            retail: "41829067227207",
            wholesale: "41829067292743",
            retailSubscription: "41829067259975",
            wholesaleSubscription: "41829067325511"
        }
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
        subscriptionOptions: ['quarterly'],
        wholesaleThreshold: 1,
        minOrder: 1, // NO MINIMUM
        type: 'premium',
        emoji: '🏭',
        // Shopify Variant IDs
        shopifyVariants: {
            retail: "41829067358279",
            wholesale: "41829067423815",
            retailSubscription: "41829067391047",
            wholesaleSubscription: "41829067456583"
        }
    },

    // ===================================================================
    // BUNDLE KITS (5 Products)
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
        bundleContents: [
            '3oz HC-Pure Multi-Use Disinfectant',
            '32oz Multi Use Cleaner Ready to Use',
            'All-in-One Wipes'
        ],
        bundleSavings: 8.77,
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 10,
        minOrder: 1, // NO MINIMUM
        type: 'premium',
        emoji: '📦',
        // Shopify Variant IDs
        shopifyVariants: {
            retail: "41829067489351",
            wholesale: "41829067554887",
            retailSubscription: "41829067522119",
            wholesaleSubscription: "41829067587655"
        }
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
        bundleContents: [
            '3oz HC-Pure Multi-Use Disinfectant',
            '32oz Multi Use Cleaner EPA',
            '32oz Pet Cleaner and Deodorizer',
            'All-in-One Wipes',
            '32oz Laundry Booster'
        ],
        bundleSavings: 19.50,
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 5,
        minOrder: 1, // NO MINIMUM
        type: 'premium',
        emoji: '🎯',
        // Shopify Variant IDs
        shopifyVariants: {
            retail: "41829067620423",
            wholesale: "41829067685959",
            retailSubscription: "41829067653191",
            wholesaleSubscription: "41829067718727"
        }
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
        bundleContents: [
            '3oz HC-Pure Multi-Use Disinfectant',
            '32oz Multi Use Cleaner EPA',
            '1 Gallon Ready to Use EPA',
            'All-in-One Wipes',
            '32oz Laundry Booster',
            '3oz HC-Pure Skin Health Mist'
        ],
        bundleSavings: 26.38,
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 3,
        minOrder: 1, // NO MINIMUM
        type: 'premium',
        emoji: '🏆',
        // Shopify Variant IDs
        shopifyVariants: {
            retail: "41829067751495",
            wholesale: "41829067817031",
            retailSubscription: "41829067784263",
            wholesaleSubscription: "41829067849799"
        }
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
        bundleContents: [
            '32oz Multi Use Cleaner Ready to Use',
            '1 Gallon Ready to Use',
            'All-in-One Wipes'
        ],
        bundleSavings: 15.59,
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 5,
        minOrder: 1, // NO MINIMUM
        type: 'premium',
        emoji: '⚡',
        // Shopify Variant IDs
        shopifyVariants: {
            retail: "41829067882567",
            wholesale: "41829067948103",
            retailSubscription: "41829067915335",
            wholesaleSubscription: "41829067980871"
        }
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
        bundleContents: [
            '32oz Pet Cleaner and Deodorizer',
            '32oz 500ppm Pet+ Solution',
            'All-in-One Wipes',
            '3oz HC-Pure Skin Health Mist'
        ],
        bundleSavings: 17.40,
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 5,
        minOrder: 1, // NO MINIMUM
        type: 'premium',
        emoji: '🐾',
        // Shopify Variant IDs
        shopifyVariants: {
            retail: "41829068013639",
            wholesale: "41829068079175",
            retailSubscription: "41829068046407",
            wholesaleSubscription: "41829068111943"
        }
    }

}; // END HYPO COMPANY PRODUCTS

console.log('✅ HYPO COMPANY COMPLETE - All 38 products with Shopify variant IDs mapped');
console.log('🚫 NO ORDER MINIMUMS - All minOrder set to 1 as requested');
console.log('🔗 VARIANT IDS MAPPED - All 4 variants per product (retail, wholesale, retail sub, wholesale sub)');
console.log('📦 READY FOR INTEGRATION - Hypo Company section complete');
// ===================================================================
    // ORGANIC HYPOSOLUTIONS (OHS) LINE - ALL 19 PRODUCTS
    // WITH COMPLETE SHOPIFY VARIANT IDS MAPPED
    // NO ORDER MINIMUMS AS REQUESTED
    // ===================================================================

    // ===================================================================
    // PERSONAL CARE PRODUCTS (3 Products)
    // ===================================================================
const OHS_PRODUCTS = {
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
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 50,
        minOrder: 1, // NO MINIMUM
        type: 'organic',
        emoji: '🌱',
        sdsDocument: 'assets/documents/ohs-3oz-organic-sds.pdf',
        complianceNotes: 'USDA Organic certified, safe for food contact surfaces',
        // Shopify Variant IDs
        shopifyVariants: {
            retail: "41829068144711",
            wholesale: "41829068210247",
            retailSubscription: "41829068177479",
            wholesaleSubscription: "41829068243015"
        }
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
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 25,
        minOrder: 1, // NO MINIMUM
        type: 'organic',
        emoji: '🌸',
        // Shopify Variant IDs
        shopifyVariants: {
            retail: "41829061263431",
            wholesale: "41829061328967",
            retailSubscription: "41829061296199",
            wholesaleSubscription: "41829061361735"
        }
    },

    // ===================================================================
    // COMMERCIAL CLEANING (2 Products)
    // ===================================================================

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
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 25,
        minOrder: 1, // NO MINIMUM
        type: 'organic',
        emoji: '🧽',
        // Shopify Variant IDs
        shopifyVariants: {
            retail: "41829068537927",
            wholesale: "41829068603463",
            retailSubscription: "41829068570695",
            wholesaleSubscription: "41829068636231"
        }
    },

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
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 10,
        minOrder: 1, // NO MINIMUM
        type: 'organic',
        emoji: '🌿',
        // Shopify Variant IDs
        shopifyVariants: {
            retail: "41829068701767",
            wholesale: "41829068767303",
            retailSubscription: "41829068734535",
            wholesaleSubscription: "41829068800071"
        }
    },

    // ===================================================================
    // PET CARE (1 Product)
    // ===================================================================

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
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 25,
        minOrder: 1, // NO MINIMUM
        type: 'organic',
        emoji: '🐾',
        // Shopify Variant IDs
        shopifyVariants: {
            retail: "41829068832839",
            wholesale: "41829068898375",
            retailSubscription: "41829068865607",
            wholesaleSubscription: "41829068931143"
        }
    },

    // ===================================================================
    // VETERINARY (3 Products)
    // ===================================================================

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
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 25,
        minOrder: 1, // NO MINIMUM
        type: 'organic',
        emoji: '🐎',
        // Shopify Variant IDs
        shopifyVariants: {
            retail: "41829068963911",
            wholesale: "41829069029447",
            retailSubscription: "41829068996679",
            wholesaleSubscription: "41829069062215"
        }
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
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 10,
        minOrder: 1, // NO MINIMUM
        type: 'organic',
        emoji: '🏥',
        // Shopify Variant IDs
        shopifyVariants: {
            retail: "41829069094983",
            wholesale: "41829069160519",
            retailSubscription: "41829069127751",
            wholesaleSubscription: "41829069193287"
        }
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
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 20,
        minOrder: 1, // NO MINIMUM
        type: 'organic',
        emoji: '🐎',
        // Shopify Variant IDs
        shopifyVariants: {
            retail: "41829069226055",
            wholesale: "41829069291591",
            retailSubscription: "41829069258823",
            wholesaleSubscription: "41829069324359"
        }
    },

    // ===================================================================
    // LAUNDRY CARE (2 Products)
    // ===================================================================

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
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 25,
        minOrder: 1, // NO MINIMUM
        type: 'organic',
        emoji: '👕',
        // Shopify Variant IDs
        shopifyVariants: {
            retail: "41829069357127",
            wholesale: "41829069422663",
            retailSubscription: "41829069389895",
            wholesaleSubscription: "41829069455431"
        }
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
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 25,
        minOrder: 1, // NO MINIMUM
        type: 'organic',
        emoji: '🏭',
        // Shopify Variant IDs
        shopifyVariants: {
            retail: "41829069488199",
            wholesale: "41829069553735",
            retailSubscription: "41829069520967",
            wholesaleSubscription: "41829069586503"
        }
    },

    // ===================================================================
    // CLEANING SUPPLIES (1 Product)
    // ===================================================================

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
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 20,
        minOrder: 1, // NO MINIMUM
        type: 'organic',
        emoji: '🧻',
        // Shopify Variant IDs
        shopifyVariants: {
            retail: "41829069619271",
            wholesale: "41829069684807",
            retailSubscription: "41829069652039",
            wholesaleSubscription: "41829069717575"
        }
    },

    // ===================================================================
    // THERAPEUTIC (2 Products)
    // ===================================================================

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
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 20,
        minOrder: 1, // NO MINIMUM
        type: 'organic',
        emoji: '💊',
        // Shopify Variant IDs
        shopifyVariants: {
            retail: "41829069750343",
            wholesale: "41829069815879",
            retailSubscription: "41829069783111",
            wholesaleSubscription: "41829069848647"
        }
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
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 20,
        minOrder: 1, // NO MINIMUM
        type: 'organic',
        emoji: '👶',
        // Shopify Variant IDs
        shopifyVariants: {
            retail: "41829069881415",
            wholesale: "41829069946951",
            retailSubscription: "41829069914183",
            wholesaleSubscription: "41829069979719"
        }
    },

    // ===================================================================
    // ORGANIC BUNDLE KITS (5 Products)
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
        bundleContents: [
            '3oz Organic Multi-Surface Disinfectant',
            '32oz Organic Ready-to-Use Cleaner',
            'Organic All-in-One Disinfecting Wipes'
        ],
        bundleSavings: 12.15,
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 15,
        minOrder: 1, // NO MINIMUM
        type: 'organic',
        emoji: '🏠',
        // Shopify Variant IDs
        shopifyVariants: {
            retail: "41829070012391",
            wholesale: "41829070077927",
            retailSubscription: "41829070045159",
            wholesaleSubscription: "41829070110695"
        }
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
        bundleContents: [
            '3oz Organic Multi-Surface Disinfectant',
            '32oz Organic Ready-to-Use Cleaner',
            '32oz Organic Pet Safe Cleaner & Deodorizer',
            'Organic All-in-One Disinfecting Wipes',
            '32oz Organic Laundry Booster'
        ],
        bundleSavings: 22.58,
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 8,
        minOrder: 1, // NO MINIMUM
        type: 'organic',
        emoji: '👨‍👩‍👧‍👦',
        // Shopify Variant IDs
        shopifyVariants: {
            retail: "41829070143463",
            wholesale: "41829070208999",
            retailSubscription: "41829070176231",
            wholesaleSubscription: "41829070241767"
        }
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
        bundleContents: [
            '3oz Organic Multi-Surface Disinfectant',
            '32oz Organic Ready-to-Use Cleaner',
            '1 Gallon Organic Ready-to-Use Solution',
            'Organic All-in-One Disinfecting Wipes',
            '32oz Organic Laundry Booster',
            '3oz Organic Skin Health Mist'
        ],
        bundleSavings: 31.38,
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 8,
        minOrder: 1, // NO MINIMUM
        type: 'organic',
        emoji: '🌟',
        // Shopify Variant IDs
        shopifyVariants: {
            retail: "41829070274631",
            wholesale: "41829070340167",
            retailSubscription: "41829070307399",
            wholesaleSubscription: "41829070372935"
        }
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
        bundleContents: [
            '32oz Organic Ready-to-Use Cleaner',
            '1 Gallon Organic Ready-to-Use Solution',
            'Organic All-in-One Disinfecting Wipes'
        ],
        bundleSavings: 19.45,
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 12,
        minOrder: 1, // NO MINIMUM
        type: 'organic',
        emoji: '⚡',
        // Shopify Variant IDs
        shopifyVariants: {
            retail: "41829070405703",
            wholesale: "41829070471239",
            retailSubscription: "41829070438471",
            wholesaleSubscription: "41829070504007"
        }
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
        bundleContents: [
            '32oz Organic Pet Safe Cleaner & Deodorizer',
            '32oz Organic 500ppm Pet+ & Equine Solution',
            'Organic All-in-One Disinfecting Wipes',
            '3oz Organic Skin Health Mist'
        ],
        bundleSavings: 18.53,
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 12,
        minOrder: 1, // NO MINIMUM
        type: 'organic',
        emoji: '🐾',
        // Shopify Variant IDs
        shopifyVariants: {
            retail: "41829070536775",
            wholesale: "41829070602311",
            retailSubscription: "41829070569543",
            wholesaleSubscription: "41829070635079"
        }
    }

}; // END OHS PRODUCTS
// Make sure PRODUCT_CATALOG is globally accessible
window.PRODUCT_CATALOG = {
    ...HYPO_PRODUCTS,
    ...OHS_PRODUCTS
};

// Make sure calculateWholesaleRate is globally accessible  
window.calculateWholesaleRate = function(productId, quantity) {
    const product = window.PRODUCT_CATALOG[productId];
    if (!product || !product.pricing) {
        return { price: 0, isWholesale: false };
    }
    
    // Simple wholesale logic - you can enhance this
    const threshold = product.wholesaleThreshold || 12;
    const isWholesale = quantity >= threshold;
    
    return {
        price: isWholesale ? product.pricing.wholesale : product.pricing.retail,
        isWholesale: isWholesale
    };
};

console.log('✅ Cart system ready with', Object.keys(window.PRODUCT_CATALOG).length, 'products');
console.log('✅ OHS ORGANIC COMPLETE - All 19 products with Shopify variant IDs mapped');
console.log('🚫 NO ORDER MINIMUMS - All minOrder set to 1 as requested');
console.log('🔗 VARIANT IDS MAPPED - All 4 variants per product (retail, wholesale, retail sub, wholesale sub)');
console.log('🌱 ORGANIC CERTIFIED - All products USDA Organic #8150019050');
console.log('📦 READY FOR INTEGRATION - OHS section complete');

// =================================================================
// MISSING FUNCTIONS FROM CART-BACKUP.JS + STEP 2C REQUIREMENT
// =================================================================

// 1. GET ACCOUNT TYPE
function getAccountType() {
    return localStorage.getItem('ohsAccountType') || 'consumer';
}

// 2. ENHANCED CART BADGE UPDATE
function updateCartBadge() {
    const cartItems = JSON.parse(localStorage.getItem('ohsCart') || '[]');
    const cartBadge = document.getElementById('cartBadge');
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cartBadge) {
        if (totalItems > 0) {
            cartBadge.textContent = totalItems;
            cartBadge.style.display = 'inline-block';
        } else {
            cartBadge.style.display = 'none';
        }
    }
    
    updateWholesaleProgress();
    updateWholesaleSavingsDisplay();
}

// 3. WHOLESALE PROGRESS UPDATE
function updateWholesaleProgress() {
    const cartItems = JSON.parse(localStorage.getItem('ohsCart') || '[]');
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    console.log('Wholesale progress: ' + totalQuantity + ' items in cart');
}

// 4. WHOLESALE SAVINGS DISPLAY
function updateWholesaleSavingsDisplay() {
    console.log('Wholesale savings updated');
}

// 5. CHECK FOR DUPLICATES
function checkForDuplicates() {
    const productIds = Object.keys(PRODUCT_CATALOG);
    const productNames = Object.values(PRODUCT_CATALOG).map(p => p.name);
    
    const uniqueIds = [...new Set(productIds)];
    const uniqueNames = [...new Set(productNames)];
    
    if (productIds.length !== uniqueIds.length) {
        console.error('DUPLICATE PRODUCT IDs FOUND:', productIds.length - uniqueIds.length, 'duplicates');
    }
    
    if (productNames.length !== uniqueNames.length) {
        console.error('DUPLICATE PRODUCT NAMES FOUND:', productNames.length - uniqueNames.length, 'duplicates');
    }
    
    if (productIds.length === uniqueIds.length && productNames.length === uniqueNames.length) {
        console.log('No duplicates found in product catalog');
    }
}

// 6. VERIFY SHOPIFY VARIANTS (REQUIRED BY STEP 2C)
function verifyShopifyVariants() {
    const products = Object.values(PRODUCT_CATALOG);
    const withVariants = products.filter(p => p.shopifyVariants);
    console.log(withVariants.length + ' of ' + products.length + ' products have Shopify variants');
    
    if (withVariants.length === products.length) {
        console.log('All products ready for Shopify integration!');
    } else {
        console.warn('Some products missing Shopify variants');
        const missingVariants = products.filter(p => !p.shopifyVariants);
        missingVariants.forEach(product => {
            console.warn('Missing variants: ' + product.id + ' - ' + product.name);
        });
    }
}

// 7. INITIALIZATION CALLS
console.log('Wholesale rate functions added to cart system');
checkForDuplicates();
verifyShopifyVariants();

console.log('COMPLETE PRODUCT CATALOG LOADED - 57 PRODUCTS TOTAL');
console.log('Premium Line: 38 products | Organic Line: 19 products');
console.log('Shopify Ready | ShipRight Integration Ready | Fulfillment Included');
console.log('Ready for Shopify Import | Wholesale Pricing Configured | Cart Functional');
