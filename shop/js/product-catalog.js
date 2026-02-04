/**
 * ORGANIC HYPOSOLUTIONS - MASTER PRODUCT CATALOG
 * Single Source of Truth for All Product Data
 * 
 * This file contains all product information for the OHS ecommerce site.
 * It is imported by products.html, cart.html, and index.html.
 * 
 * DO NOT DUPLICATE THIS DATA - Update here and changes apply everywhere!
 * 
 * Last Updated: 2025-02-04
 * Products: 8 (2 EPA+USDA, 6 USDA-only)
 */

(function() {
    'use strict';
    
    // =============================================================================
    // PRODUCT CATALOG
    // =============================================================================
    
    window.PRODUCT_CATALOG = {
        
        // =========================================================================
        // EPA + USDA PRODUCTS (UTAH ONLY)
        // =========================================================================
        
        /**
         * Product 1: 32oz EPA Registered Ready-to-Use Cleaner
         * Dual-Certified: EPA #97801-1 + USDA #Z-699995-2008
         * Geographic Restriction: Utah only
         */
        '7249401053255': {
            id: '7249401053255',
            name: '32oz EPA Registered Ready-to-Use Cleaner',
            shortName: '32oz EPA+USDA Cleaner',
            type: 'epa-usda',
            productLine: 'premium',
            
            // Certifications
            certifications: ['EPA Registered #97801-1', 'USDA Certified Organic #Z-699995-2008'],
            epaNumber: '97801-1',
            usdaNumber: 'Z-699995-2008',
            
            // Description
            description: 'Professional-strength ready-to-use hypochlorous acid cleaner and disinfectant. Kills 99.9% of pathogens including bacteria, viruses, and fungi. Safe for food contact surfaces, toys, and skin. Perfect for homes, offices, restaurants, and healthcare facilities. No harsh chemicals, no toxic fumes. Simply spray and wipe. EPA registered (#97801-1) and USDA Certified Organic (#Z-699995-2008). Made in Utah, USA.',
            
            // Geographic Restrictions
            restrictions: {
                states: ['UT'],
                reason: 'EPA registration limited to Utah under FIFRA regulations'
            },
            
            // Pricing
            pricing: {
                retail: 21.99,
                retailSubscription: 19.79,
                wholesale: 15.99,
                wholesaleSubscription: 14.39
            },
            
            // Wholesale Settings
            wholesaleThreshold: 25,
            
            // Shopify Integration
            shopifyProductId: '7249401053255',
            shopifyVariants: {
                retail: '41829068537927',
                retailSubscription: '41829068570695',
                wholesale: '41829068603463',
                wholesaleSubscription: '41829068636231'
            },
            
            // SKUs
            skus: {
                retail: 'OHS-32OZ-RTU-RETAIL',
                retailSubscription: 'OHS-32OZ-RTU-RETAIL-SUB',
                wholesale: 'OHS-32OZ-RTU-WHOLESALE',
                wholesaleSubscription: 'OHS-32OZ-RTU-WHOLESALE-SUB'
            },
            
            // Display Settings
            image: 'assets/images/products/32oz-epa-cleaner.jpg',
            emoji: '🧴',
            badgeColor: '#f59e0b', // Amber/Gold for EPA
            badgeType: 'EPA Premium',
            category: 'Cleaners & Disinfectants',
            size: '32oz',
            featured: true,
            
            // Additional Info
            madeIn: 'Utah, USA',
            concentration: '200 ppm HOCl',
            shelfLife: '12 months',
            weight: '2.2 lbs',
            dimensions: '12x4x4'
        },
        
        /**
         * Product 2: 1 Gallon EPA Registered Ready-to-Use Solution
         * Dual-Certified: EPA #97801-1 + USDA #Z-699995-2008
         * Geographic Restriction: Utah only
         */
        '7249401086023': {
            id: '7249401086023',
            name: '1 Gallon EPA Registered Ready-to-Use Solution',
            shortName: '1 Gal EPA+USDA Solution',
            type: 'epa-usda',
            productLine: 'premium',
            
            // Certifications
            certifications: ['EPA Registered #97801-1', 'USDA Certified Organic #Z-699995-2008'],
            epaNumber: '97801-1',
            usdaNumber: 'Z-699995-2008',
            
            // Description
            description: 'Bulk premium professional-grade hypochlorous acid cleaner and disinfectant for large-scale applications. Advanced formulation with premium packaging. Kills 99.9% of pathogens including bacteria viruses and fungi. Perfect for premium commercial facilities luxury establishments and high-end bulk users. Safe for food contact surfaces and skin. Cost-effective solution for high-volume premium cleaning needs. EPA registered (#97801-1) and USDA Certified Organic (#Z-699995-2008). Made in Utah USA.',
            
            // Geographic Restrictions
            restrictions: {
                states: ['UT'],
                reason: 'EPA registration limited to Utah under FIFRA regulations'
            },
            
            // Pricing
            pricing: {
                retail: 34.99,
                retailSubscription: 31.49,
                wholesale: 22.99,
                wholesaleSubscription: 20.69
            },
            
            // Wholesale Settings
            wholesaleThreshold: 10,
            
            // Shopify Integration
            shopifyProductId: '7249401086023',
            shopifyVariants: {
                retail: '41829068701767',
                retailSubscription: '41829068734535',
                wholesale: '41829068767303',
                wholesaleSubscription: '41829068800071'
            },
            
            // SKUs
            skus: {
                retail: 'OHS-1GAL-READY-RTU-RETAIL',
                retailSubscription: 'OHS-1GAL-READY-RTU-RETAIL-SUB',
                wholesale: 'OHS-1GAL-READY-RTU-WHOLESALE',
                wholesaleSubscription: 'OHS-1GAL-READY-RTU-WHOLESALE-SUB'
            },
            
            // Display Settings
            image: 'assets/images/products/1gal-epa-solution.jpg',
            emoji: '🧴',
            badgeColor: '#f59e0b', // Amber/Gold for EPA
            badgeType: 'EPA Premium',
            category: 'Cleaners & Disinfectants',
            size: '1 Gallon',
            featured: true,
            
            // Additional Info
            madeIn: 'Utah, USA',
            concentration: '200 ppm HOCl',
            shelfLife: '12 months',
            weight: '8.8 lbs',
            dimensions: '12x10x6'
        },
        
        // =========================================================================
        // USDA ORGANIC PRODUCTS (NATIONWIDE)
        // =========================================================================
        
        /**
         * Product 3: 32oz USDA Certified Organic Ready-to-Use Cleaner
         * Certification: USDA #Z-699995-2008 only
         * Geographic Restriction: None (Nationwide)
         */
        '7418569752647': {
            id: '7418569752647',
            name: '32oz USDA Certified Organic Ready-to-Use Cleaner',
            shortName: '32oz USDA Organic Cleaner',
            type: 'usda-only',
            productLine: 'organic',
            
            // Certifications
            certifications: ['USDA Certified Organic #Z-699995-2008'],
            epaNumber: null,
            usdaNumber: 'Z-699995-2008',
            
            // Description
            description: 'Professional-strength ready-to-use hypochlorous acid cleaner and disinfectant. Kills 99.9% of pathogens including bacteria, viruses, and fungi. Safe for food contact surfaces, toys, and skin. Perfect for homes, offices, restaurants, and healthcare facilities. No harsh chemicals, no toxic fumes. Simply spray and wipe. USDA Certified Organic (#Z-699995-2008). Made in Utah, USA.',
            
            // Geographic Restrictions
            restrictions: null, // No restrictions - ships nationwide
            
            // Pricing
            pricing: {
                retail: 19.99,
                retailSubscription: 17.99,
                wholesale: 13.99,
                wholesaleSubscription: 12.59
            },
            
            // Wholesale Settings
            wholesaleThreshold: 25,
            
            // Shopify Integration
            shopifyProductId: '7418569752647',
            shopifyVariants: {
                retail: '2457056084039',
                retailSubscription: '42457056116807',
                wholesale: '42457056149575',
                wholesaleSubscription: '42457056182343'
            },
            
            // SKUs
            skus: {
                retail: 'USDA-OHS-32OZ-RTU-RETAIL',
                retailSubscription: 'USDA-OHS-32OZ-RTU-RETAIL-SUB',
                wholesale: 'USDA-OHS-32OZ-RTU-WHOLESALE',
                wholesaleSubscription: 'USDA-OHS-32OZ-RTU-WHOLESALE-SUB'
            },
            
            // Display Settings
            image: 'assets/images/products/32oz-usda-cleaner.jpg',
            emoji: '🌿',
            badgeColor: '#10b981', // Green for USDA Organic
            badgeType: 'USDA Organic',
            category: 'Cleaners & Disinfectants',
            size: '32oz',
            featured: true,
            
            // Additional Info
            madeIn: 'Utah, USA',
            concentration: '200 ppm HOCl',
            shelfLife: '12 months',
            weight: '2.2 lbs',
            dimensions: '12x4x4'
        },
        
        /**
         * Product 4: 1 Gallon USDA Certified Organic Ready-to-Use Solution
         * Certification: USDA #Z-699995-2008 only
         * Geographic Restriction: None (Nationwide)
         */
        '7418571685959': {
            id: '7418571685959',
            name: '1 Gallon USDA Certified Organic Ready-to-Use Solution',
            shortName: '1 Gal USDA Organic Solution',
            type: 'usda-only',
            productLine: 'organic',
            
            // Certifications
            certifications: ['USDA Certified Organic #Z-699995-2008'],
            epaNumber: null,
            usdaNumber: 'Z-699995-2008',
            
            // Description
            description: 'Bulk premium professional-grade hypochlorous acid cleaner and disinfectant for large-scale applications. Advanced formulation with premium packaging. Kills 99.9% of pathogens including bacteria viruses and fungi. Perfect for premium commercial facilities luxury establishments and high-end bulk users. Safe for food contact surfaces and skin. Cost-effective solution for high-volume premium cleaning needs. USDA Certified Organic (#Z-699995-2008). Made in Utah USA.',
            
            // Geographic Restrictions
            restrictions: null, // No restrictions - ships nationwide
            
            // Pricing
            pricing: {
                retail: 32.99,
                retailSubscription: 29.69,
                wholesale: 20.99,
                wholesaleSubscription: 18.89
            },
            
            // Wholesale Settings
            wholesaleThreshold: 10,
            
            // Shopify Integration
            shopifyProductId: '7418571685959',
            shopifyVariants: {
                retail: '42457071517767',
                retailSubscription: '42457071550535',
                wholesale: '42457071583303',
                wholesaleSubscription: '42457071616071'
            },
            
            // SKUs
            skus: {
                retail: 'USDA-OHS-1GAL-READY-RTU-RETAIL',
                retailSubscription: 'USDA-OHS-1GAL-READY-RTU-RETAIL-SUB',
                wholesale: 'USDA-OHS-1GAL-READY-RTU-WHOLESALE',
                wholesaleSubscription: 'USDA-OHS-1GAL-READY-RTU-WHOLESALE-SUB'
            },
            
            // Display Settings
            image: 'assets/images/products/1gal-usda-solution.jpg',
            emoji: '🌿',
            badgeColor: '#10b981', // Green for USDA Organic
            badgeType: 'USDA Organic',
            category: 'Cleaners & Disinfectants',
            size: '1 Gallon',
            featured: true,
            
            // Additional Info
            madeIn: 'Utah, USA',
            concentration: '200 ppm HOCl',
            shelfLife: '12 months',
            weight: '8.8 lbs',
            dimensions: '12x10x6'
        },
        
        /**
         * Product 5: All in One Hypochlorous Organic Wipes
         * Certification: USDA #Z-699995-2008 only
         * Geographic Restriction: None (Nationwide)
         */
        '7249401315399': {
            id: '7249401315399',
            name: 'All in One Hypochlorous Organic Wipes',
            shortName: 'Organic Wipes',
            type: 'usda-only',
            productLine: 'organic',
            
            // Certifications
            certifications: ['USDA Certified Organic #Z-699995-2008'],
            epaNumber: null,
            usdaNumber: 'Z-699995-2008',
            
            // Description
            description: 'Convenient pre-moistened hypochlorous acid wipes. Kills 99.9% of pathogens. Perfect for quick cleaning and disinfecting on-the-go. Safe for all surfaces including food contact. Ideal for homes offices travel and healthcare. Non-toxic alcohol-free formula. USDA Certified Organic (#Z-699995-2008). Made in Utah USA.',
            
            // Geographic Restrictions
            restrictions: null, // No restrictions - ships nationwide
            
            // Pricing
            pricing: {
                retail: 12.99,
                retailSubscription: 11.69,
                wholesale: 10.99,
                wholesaleSubscription: 9.99
            },
            
            // Wholesale Settings
            wholesaleThreshold: 20,
            
            // Shopify Integration
            shopifyProductId: '7249401315399',
            shopifyVariants: {
                retail: '41829069619271',
                retailSubscription: '41829069652039',
                wholesale: '41829069684807',
                wholesaleSubscription: '41829069717575'
            },
            
            // SKUs
            skus: {
                retail: 'OHS-ALL-IN-ONE-WIPES',
                retailSubscription: 'OHS-ALL-IN-ONE-WIPES-SUB',
                wholesale: 'OHS-ALL-IN-ONE-WIPES-WHOLESALE',
                wholesaleSubscription: 'OHS-ALL-IN-ONE-WIPES-WHOLESALE-SUB'
            },
            
            // Display Settings
            image: 'assets/images/products/organic-wipes.jpg',
            emoji: '🧻',
            badgeColor: '#10b981', // Green for USDA Organic
            badgeType: 'USDA Organic',
            category: 'Wipes',
            size: '80 count',
            featured: false,
            
            // Additional Info
            madeIn: 'Utah, USA',
            concentration: '200 ppm HOCl',
            shelfLife: '24 months',
            weight: '1.5 lbs',
            dimensions: '8x6x6'
        },
        
        /**
         * Product 6: 32oz Organic Laundry Booster
         * Certification: USDA #Z-699995-2008 only
         * Geographic Restriction: None (Nationwide)
         */
        '7249400004679': {
            id: '7249400004679',
            name: '32oz Organic Laundry Booster',
            shortName: '32oz Laundry Booster',
            type: 'usda-only',
            productLine: 'organic',
            
            // Certifications
            certifications: ['USDA Certified Organic #Z-699995-2008'],
            epaNumber: null,
            usdaNumber: 'Z-699995-2008',
            
            // Description
            description: 'Premium laundry enhancement solution using hypochlorous acid technology. Eliminates odors brightens whites and provides antimicrobial protection to fabrics. Safe for all fabric types and colors. Perfect for households and commercial laundries. Non-toxic non-irritating formula. Eco-friendly alternative to harsh chemicals. USDA Certified Organic (#Z-699995-2008). Made in Utah USA.',
            
            // Geographic Restrictions
            restrictions: null, // No restrictions - ships nationwide
            
            // Pricing
            pricing: {
                retail: 15.99,
                retailSubscription: 14.39,
                wholesale: 10.99,
                wholesaleSubscription: 9.89
            },
            
            // Wholesale Settings
            wholesaleThreshold: 25,
            
            // Shopify Integration
            shopifyProductId: '7249400004679',
            shopifyVariants: {
                retail: '41829064572999',
                retailSubscription: '41829064605767',
                wholesale: '41829064638535',
                wholesaleSubscription: '41829064671303'
            },
            
            // SKUs
            skus: {
                retail: 'HC-32OZ-LAUNDRY-BOOSTER-RETAIL',
                retailSubscription: 'HC-32OZ-LAUNDRY-BOOSTER-RETAIL-SUB',
                wholesale: 'HC-32OZ-LAUNDRY-BOOSTER-WHOLESALE',
                wholesaleSubscription: 'HC-32OZ-LAUNDRY-BOOSTER-WHOLESALE-SUB'
            },
            
            // Display Settings
            image: 'assets/images/products/32oz-laundry-booster.jpg',
            emoji: '🧺',
            badgeColor: '#10b981', // Green for USDA Organic
            badgeType: 'USDA Organic',
            category: 'Laundry',
            size: '32oz',
            featured: false,
            
            // Additional Info
            madeIn: 'Utah, USA',
            concentration: '200 ppm HOCl',
            shelfLife: '12 months',
            weight: '2.3 lbs',
            dimensions: '12x4x4'
        },
        
        /**
         * Product 7: 1 Gallon Organic Laundry Booster
         * Certification: USDA #Z-699995-2008 only
         * Geographic Restriction: None (Nationwide)
         */
        '7249400037447': {
            id: '7249400037447',
            name: '1 Gallon Organic Laundry Booster',
            shortName: '1 Gal Laundry Booster',
            type: 'usda-only',
            productLine: 'organic',
            
            // Certifications
            certifications: ['USDA Certified Organic #Z-699995-2008'],
            epaNumber: null,
            usdaNumber: 'Z-699995-2008',
            
            // Description
            description: 'Bulk premium laundry enhancement solution using hypochlorous acid technology. Eliminates odors brightens whites and provides antimicrobial protection to fabrics. Perfect for commercial laundries hotels and professional cleaning services. Safe for all fabric types and colors. Cost-effective bulk solution for high-volume laundry needs. Eco-friendly alternative to harsh chemicals. USDA Certified Organic (#Z-699995-2008). Made in Utah USA.',
            
            // Geographic Restrictions
            restrictions: null, // No restrictions - ships nationwide
            
            // Pricing
            pricing: {
                retail: 28.99,
                retailSubscription: 26.09,
                wholesale: 19.99,
                wholesaleSubscription: 17.99
            },
            
            // Wholesale Settings
            wholesaleThreshold: 10,
            
            // Shopify Integration
            shopifyProductId: '7249400037447',
            shopifyVariants: {
                retail: '41829064704071',
                retailSubscription: '41829064736839',
                wholesale: '41829064769607',
                wholesaleSubscription: '41829064802375'
            },
            
            // SKUs
            skus: {
                retail: 'HC-1GAL-LAUNDRY-BOOSTER-RETAIL',
                retailSubscription: 'HC-1GAL-LAUNDRY-BOOSTER-RETAIL-SUB',
                wholesale: 'HC-1GAL-LAUNDRY-BOOSTER-WHOLESALE',
                wholesaleSubscription: 'HC-1GAL-LAUNDRY-BOOSTER-WHOLESALE-SUB'
            },
            
            // Display Settings
            image: 'assets/images/products/1gal-laundry-booster.jpg',
            emoji: '🧺',
            badgeColor: '#10b981', // Green for USDA Organic
            badgeType: 'USDA Organic',
            category: 'Laundry',
            size: '1 Gallon',
            featured: false,
            
            // Additional Info
            madeIn: 'Utah, USA',
            concentration: '200 ppm HOCl',
            shelfLife: '12 months',
            weight: '9.2 lbs',
            dimensions: '12x10x6'
        },
        
        /**
         * Product 8: OHS Pure Healing Skin Serum
         * Certification: USDA #Z-699995-2008 only
         * Geographic Restriction: None (Nationwide)
         */
        '7249401348167': {
            id: '7249401348167',
            name: 'OHS Pure Healing Skin Serum',
            shortName: 'Healing Skin Serum',
            type: 'usda-only',
            productLine: 'organic',
            
            // Certifications
            certifications: ['USDA Certified Organic #Z-699995-2008'],
            epaNumber: null,
            usdaNumber: 'Z-699995-2008',
            
            // Description
            description: 'Advanced premium therapeutic skin serum formulated with hypochlorous acid technology. Professional-grade formulation with premium packaging. Promotes rapid healing, reduces inflammation, and provides antimicrobial protection for wounds, cuts, and skin conditions. Perfect for premium healthcare facilities, dermatology clinics, and discerning consumers. Gentle enough for sensitive skin while delivering superior therapeutic results. USDA Certified Organic (#Z-699995-2008). Made in Utah, USA.',
            
            // Geographic Restrictions
            restrictions: null, // No restrictions - ships nationwide
            
            // Pricing
            pricing: {
                retail: 22.99,
                retailSubscription: 20.69,
                wholesale: 16.99,
                wholesaleSubscription: 15.29
            },
            
            // Wholesale Settings
            wholesaleThreshold: 12, // Not specified in CSV, using reasonable default
            
            // Shopify Integration
            shopifyProductId: '7249401348167',
            shopifyVariants: {
                retail: '41829069750343',
                retailSubscription: '41829069783111',
                wholesale: '41829069815879',
                wholesaleSubscription: '41829069848647'
            },
            
            // SKUs
            skus: {
                retail: 'OHS-HEALING-SERUM-RETAIL',
                retailSubscription: 'OHS-HEALING-SERUM-RETAIL-SUB',
                wholesale: 'OHS-HEALING-SERUM-WHOLESALE',
                wholesaleSubscription: 'OHS-HEALING-SERUM-WHOLESALE-SUB'
            },
            
            // Display Settings
            image: 'assets/images/products/healing-serum.jpg',
            emoji: '💧',
            badgeColor: '#10b981', // Green for USDA Organic
            badgeType: 'USDA Organic',
            category: 'Skin Care',
            size: '2oz',
            featured: true,
            
            // Additional Info
            madeIn: 'Utah, USA',
            concentration: '200 ppm HOCl',
            shelfLife: '18 months',
            weight: '0.3 lbs',
            dimensions: '6x5x2.5'
        }
    };
    
    // =============================================================================
    // PRODUCT ALIASES (for backward compatibility and search)
    // =============================================================================
    
    window.PRODUCT_ALIASES = {
        // EPA Products
        'epa-32oz': '7249401053255',
        'epa-1gal': '7249401086023',
        'epa-cleaner': '7249401053255',
        'epa-solution': '7249401086023',
        
        // USDA Products
        'usda-32oz': '7418569752647',
        'usda-1gal': '7418571685959',
        'usda-cleaner': '7418569752647',
        'usda-solution': '7418571685959',
        
        // Other Products
        'wipes': '7249401315399',
        'laundry-32oz': '7249400004679',
        'laundry-1gal': '7249400037447',
        'serum': '7249401348167',
        'healing-serum': '7249401348167',
        
        // By SKU
        'OHS-32OZ-RTU-RETAIL': '7249401053255',
        'OHS-1GAL-READY-RTU-RETAIL': '7249401086023',
        'USDA-OHS-32OZ-RTU-RETAIL': '7418569752647',
        'USDA-OHS-1GAL-READY-RTU-RETAIL': '7418571685959',
        'OHS-ALL-IN-ONE-WIPES': '7249401315399',
        'HC-32OZ-LAUNDRY-BOOSTER-RETAIL': '7249400004679',
        'HC-1GAL-LAUNDRY-BOOSTER-RETAIL': '7249400037447',
        'OHS-HEALING-SERUM-RETAIL': '7249401348167'
    };
    
    // =============================================================================
    // HELPER FUNCTIONS
    // =============================================================================
    
    /**
     * Get product by ID or alias
     * @param {string} identifier - Product ID or alias
     * @returns {Object|null} Product object or null if not found
     */
    window.getProduct = function(identifier) {
        // Try direct lookup first
        if (window.PRODUCT_CATALOG[identifier]) {
            return window.PRODUCT_CATALOG[identifier];
        }
        
        // Try alias lookup
        const productId = window.PRODUCT_ALIASES[identifier];
        if (productId && window.PRODUCT_CATALOG[productId]) {
            return window.PRODUCT_CATALOG[productId];
        }
        
        console.warn('Product not found:', identifier);
        return null;
    };
    
    /**
     * Get all products of a specific type
     * @param {string} type - 'epa-usda' or 'usda-only'
     * @returns {Array} Array of product objects
     */
    window.getProductsByType = function(type) {
        return Object.values(window.PRODUCT_CATALOG).filter(p => p.type === type);
    };
    
    /**
     * Get all products in a category
     * @param {string} category - Category name
     * @returns {Array} Array of product objects
     */
    window.getProductsByCategory = function(category) {
        return Object.values(window.PRODUCT_CATALOG).filter(p => p.category === category);
    };
    
    /**
     * Get featured products
     * @returns {Array} Array of featured product objects
     */
    window.getFeaturedProducts = function() {
        return Object.values(window.PRODUCT_CATALOG).filter(p => p.featured);
    };
    
    /**
     * Check if product is available in a given state
     * @param {string} productId - Product ID
     * @param {string} state - Two-letter state code (e.g., 'UT', 'CA')
     * @returns {boolean} True if available, false otherwise
     */
    window.isProductAvailableInState = function(productId, state) {
        const product = window.getProduct(productId);
        if (!product) return false;
        
        // No restrictions = available everywhere
        if (!product.restrictions) return true;
        if (!product.restrictions.states) return true;
        
        // Check if state is in allowed list
        return product.restrictions.states.includes(state);
    };
    
    /**
     * Get all products available in a given state
     * @param {string} state - Two-letter state code (e.g., 'UT', 'CA')
     * @returns {Array} Array of available product objects
     */
    window.getAvailableProducts = function(state) {
        return Object.values(window.PRODUCT_CATALOG).filter(product => {
            if (!product.restrictions) return true;
            if (!product.restrictions.states) return true;
            return product.restrictions.states.includes(state);
        });
    };
    
    /**
     * Get EPA-restricted products
     * @returns {Array} Array of EPA products (Utah only)
     */
    window.getEPAProducts = function() {
        return window.getProductsByType('epa-usda');
    };
    
    /**
     * Get USDA-only products
     * @returns {Array} Array of USDA-only products (nationwide)
     */
    window.getUSDAProducts = function() {
        return window.getProductsByType('usda-only');
    };
    
    // =============================================================================
    // INITIALIZATION
    // =============================================================================
    
    // Log catalog status
    const totalProducts = Object.keys(window.PRODUCT_CATALOG).length;
    const epaProducts = window.getEPAProducts().length;
    const usdaProducts = window.getUSDAProducts().length;
    
    console.log('✅ Product Catalog Loaded Successfully');
    console.log('   Total Products:', totalProducts);
    console.log('   EPA+USDA Products (Utah only):', epaProducts);
    console.log('   USDA-only Products (Nationwide):', usdaProducts);
    console.log('   Helper Functions: getProduct(), getProductsByType(), isProductAvailableInState(), getAvailableProducts()');
    
    // Make catalog available globally
    window.CATALOG_VERSION = '1.0.0';
    window.CATALOG_UPDATED = '2025-02-04';
    
})();
