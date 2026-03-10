/**
 * ORGANIC HYPOSOLUTIONS - MASTER PRODUCT CATALOG
 * File: /shop/js/product-catalog.js
 *
 * SINGLE SOURCE OF TRUTH for all product data
 * Both cart.js and products.html import this file
 *
 * Features:
 * - All 10 products with complete data
 * - Geographic restrictions (EPA products Utah-only)
 * - Shopify variant IDs for all pricing tiers
 * - Helper functions for product lookups
 *
 * Last Updated: 2026-03-10
 */

(function() {
    'use strict';

    // =============================================================================
    // SHOPIFY CONFIGURATION
    // =============================================================================

    window.SHOPIFY_DOMAIN = 'npmv1h-8e.myshopify.com';

    // =============================================================================
    // MASTER PRODUCT CATALOG - 10 PRODUCTS
    // =============================================================================

    window.PRODUCT_CATALOG = {

        // =========================================================================
        // PRODUCT 1: 32oz EPA Registered Ready-to-Use Cleaner 200ppm (Utah Only)
        // =========================================================================
        '7249401053255': {
            id: '7249401053255',
            shopifyProductId: '7249401053255',
            name: '32oz EPA Registered Ready-to-Use Cleaner 200 PPM',
            shortName: '32oz EPA Cleaner 200 PPM',
            type: 'epa-usda',
            ppm: 200,
            size: '32oz',
            certifications: ['EPA #97801-1', 'USDA #Z-699995-2008'],
            epaNumber: '97801-1',
            usdaNumber: 'Z-699995-2008',
            description: 'Professional-strength ready-to-use hypochlorous acid cleaner and disinfectant. Kills 99.9% of pathogens including bacteria, viruses, and fungi. Safe for food contact surfaces, toys, and skin. Perfect for homes, offices, restaurants, and healthcare facilities. No harsh chemicals, no toxic fumes. Simply spray and wipe. EPA registered (#97801-1) and USDA Certified Organic (#Z-699995-2008). Made in Utah, USA.',
            restrictions: {
                states: ['UT'],
                reason: 'EPA registration limited to Utah'
            },
            pricing: {
                retail: 21.99,
                retailSubscription: 19.79,
                wholesale: 15.99,
                wholesaleSubscription: 14.39
            },
            wholesaleThreshold: 25,
            shopifyVariants: {
                retail: '41829068537927',
                retailSubscription: '41829068570695',
                wholesale: '41829068603463',
                wholesaleSubscription: '41829068636231'
            },
            skus: {
                retail: 'OHS-32OZ-200PPM-RTU-RETAIL',
                retailSubscription: 'OHS-32OZ-200PPM-RTU-RETAIL-SUB',
                wholesale: 'OHS-32OZ-200PPM-RTU-WHOLESALE',
                wholesaleSubscription: 'OHS-32OZ-200PPM-RTU-WHOLESALE-SUB'
            },
            image: 'assets/images/products/epa-cleaner-32oz-200ppm.png',
            emoji: '🧴',
            badgeType: 'EPA+USDA',
            badgeColor: '#f59e0b',
            weight: 2.5,
            category: 'Cleaners',
            productLine: 'epa-registered',
            useCase: ['disinfectant', 'cleaner', 'sanitizer'],
            status: 'active'
        },

        // =========================================================================
        // PRODUCT 2: 1 Gallon EPA Registered Ready-to-Use Solution 200ppm (Utah Only)
        // =========================================================================
        '7249401086023': {
            id: '7249401086023',
            shopifyProductId: '7249401086023',
            name: '1 Gallon EPA Registered Ready-to-Use Solution 200 PPM',
            shortName: '1 Gal EPA Solution 200 PPM',
            type: 'epa-usda',
            ppm: 200,
            size: '1gal',
            certifications: ['EPA #97801-1', 'USDA #Z-699995-2008'],
            epaNumber: '97801-1',
            usdaNumber: 'Z-699995-2008',
            description: 'Bulk premium professional-grade hypochlorous acid cleaner and disinfectant for large-scale applications. Kills 99.9% of pathogens including bacteria, viruses, and fungi. Perfect for commercial facilities, restaurants, and high-volume cleaning needs. Safe for food contact surfaces and skin. EPA registered (#97801-1) and USDA Certified Organic (#Z-699995-2008). Made in Utah, USA.',
            restrictions: {
                states: ['UT'],
                reason: 'EPA registration limited to Utah'
            },
            pricing: {
                retail: 34.99,
                retailSubscription: 31.49,
                wholesale: 22.99,
                wholesaleSubscription: 20.69
            },
            wholesaleThreshold: 10,
            shopifyVariants: {
                retail: '41829068701767',
                retailSubscription: '41829068734535',
                wholesale: '41829068767303',
                wholesaleSubscription: '41829068800071'
            },
            skus: {
                retail: 'OHS-1GAL-200PPM-RTU-RETAIL',
                retailSubscription: 'OHS-1GAL-200PPM-RTU-RETAIL-SUB',
                wholesale: 'OHS-1GAL-200PPM-RTU-WHOLESALE',
                wholesaleSubscription: 'OHS-1GAL-200PPM-RTU-WHOLESALE-SUB'
            },
            image: 'assets/images/products/epa-solution-1gal-200ppm.png',
            emoji: '🪣',
            badgeType: 'EPA+USDA',
            badgeColor: '#f59e0b',
            weight: 9.0,
            category: 'Cleaners',
            productLine: 'epa-registered',
            useCase: ['disinfectant', 'cleaner', 'bulk'],
            status: 'active'
        },

        // =========================================================================
        // PRODUCT 3: 32oz EPA Registered Cleaner 500ppm (Utah Only) — NEW
        // =========================================================================
        '7470030454855': {
            id: '7470030454855',
            shopifyProductId: '7470030454855',
            name: '32oz EPA Registered Ready-to-Use Cleaner 500 PPM',
            shortName: '32oz EPA Cleaner 500 PPM',
            type: 'epa-usda',
            ppm: 500,
            size: '32oz',
            certifications: ['EPA #97801-1', 'USDA #Z-699995-2008'],
            epaNumber: '97801-1',
            usdaNumber: 'Z-699995-2008',
            description: 'Professional-strength 500ppm ready-to-use hypochlorous acid cleaner and disinfectant. Higher concentration for heavy-duty commercial and industrial applications. Kills 99.9% of pathogens including bacteria, viruses, and fungi. EPA registered (#97801-1) and USDA Certified Organic (#Z-699995-2008). Made in Utah, USA.',
            restrictions: {
                states: ['UT'],
                reason: 'EPA registration limited to Utah'
            },
            pricing: {
                retail: 21.99,
                retailSubscription: 19.79,
                wholesale: 15.99,
                wholesaleSubscription: 14.39
            },
            wholesaleThreshold: 25,
            shopifyVariants: {
                retail: '42565309038663',
                retailSubscription: '42565309071431',
                wholesale: '42565309104199',
                wholesaleSubscription: '42565309136967'
            },
            skus: {
                retail: 'OHS-32OZ-500PPM-RTU-RETAIL',
                retailSubscription: 'OHS-32OZ-500PPM-RTU-RETAIL-SUB',
                wholesale: 'OHS-32OZ-500PPM-RTU-WHOLESALE',
                wholesaleSubscription: 'OHS-32OZ-500PPM-RTU-WHOLESALE-SUB'
            },
            image: 'assets/images/products/epa-cleaner-32oz-500ppm.png',
            emoji: '🧴',
            badgeType: 'EPA+USDA',
            badgeColor: '#f59e0b',
            weight: 2.5,
            category: 'Cleaners',
            productLine: 'epa-registered',
            useCase: ['disinfectant', 'cleaner', 'sanitizer', 'heavy-duty'],
            status: 'active'
        },

        // =========================================================================
        // PRODUCT 4: 1 Gallon EPA Registered Solution 500ppm (Utah Only) — NEW
        // =========================================================================
        '7470030258247': {
            id: '7470030258247',
            shopifyProductId: '7470030258247',
            name: '1 Gallon EPA Registered Ready-to-Use Solution 500 PPM',
            shortName: '1 Gal EPA Solution 500 PPM',
            type: 'epa-usda',
            ppm: 500,
            size: '1gal',
            certifications: ['EPA #97801-1', 'USDA #Z-699995-2008'],
            epaNumber: '97801-1',
            usdaNumber: 'Z-699995-2008',
            description: 'Bulk premium 500ppm professional-grade hypochlorous acid cleaner and disinfectant for heavy-duty large-scale applications. Higher concentration formula for commercial and industrial use. Kills 99.9% of pathogens. EPA registered (#97801-1) and USDA Certified Organic (#Z-699995-2008). Made in Utah, USA.',
            restrictions: {
                states: ['UT'],
                reason: 'EPA registration limited to Utah'
            },
            pricing: {
                retail: 34.99,
                retailSubscription: 31.49,
                wholesale: 22.99,
                wholesaleSubscription: 20.69
            },
            wholesaleThreshold: 10,
            shopifyVariants: {
                retail: '42565306449991',
                retailSubscription: '42565306482759',
                wholesale: '42565306515527',
                wholesaleSubscription: '42565306548295'
            },
            skus: {
                retail: 'OHS-1GAL-500PPM-RTU-RETAIL',
                retailSubscription: 'OHS-1GAL-500PPM-RTU-RETAIL-SUB',
                wholesale: 'OHS-1GAL-500PPM-RTU-WHOLESALE',
                wholesaleSubscription: 'OHS-1GAL-500PPM-RTU-WHOLESALE-SUB'
            },
            image: 'assets/images/products/epa-solution-1gal-500ppm.png',
            emoji: '🪣',
            badgeType: 'EPA+USDA',
            badgeColor: '#f59e0b',
            weight: 9.0,
            category: 'Cleaners',
            productLine: 'epa-registered',
            useCase: ['disinfectant', 'cleaner', 'bulk', 'heavy-duty'],
            status: 'active'
        },

        // =========================================================================
        // PRODUCT 5: 32oz USDA Certified Organic Cleaner (Nationwide)
        // =========================================================================
        '7418569752647': {
            id: '7418569752647',
            shopifyProductId: '7418569752647',
            name: '32oz USDA Certified Organic Ready-to-Use Cleaner',
            shortName: '32oz Organic Cleaner',
            type: 'usda-only',
            ppm: null,
            size: '32oz',
            certifications: ['USDA #Z-699995-2008'],
            epaNumber: null,
            usdaNumber: 'Z-699995-2008',
            description: 'Professional-strength ready-to-use hypochlorous acid cleaner. Safe for food contact surfaces, toys, and skin. Perfect for homes, offices, restaurants, and healthcare facilities. No harsh chemicals, no toxic fumes. Simply spray and wipe. USDA Certified Organic (#Z-699995-2008). Ships nationwide. Made in Utah, USA.',
            restrictions: null,
            pricing: {
                retail: 19.99,
                retailSubscription: 17.99,
                wholesale: 13.99,
                wholesaleSubscription: 12.59
            },
            wholesaleThreshold: 25,
            shopifyVariants: {
                retail: '42457056084039',
                retailSubscription: '42457056116807',
                wholesale: '42457056149575',
                wholesaleSubscription: '42457056182343'
            },
            skus: {
                retail: 'USDA-OHS-32OZ-RTU-RETAIL',
                retailSubscription: 'USDA-OHS-32OZ-RTU-RETAIL-SUB',
                wholesale: 'USDA-OHS-32OZ-RTU-WHOLESALE',
                wholesaleSubscription: 'USDA-OHS-32OZ-RTU-WHOLESALE-SUB'
            },
            image: 'assets/images/products/organic-cleaner-32oz.png',
            emoji: '🧴',
            badgeType: 'USDA Organic',
            badgeColor: '#4ADE80',
            weight: 2.5,
            category: 'Cleaners',
            productLine: 'organic',
            useCase: ['cleaner', 'sanitizer', 'organic'],
            status: 'active'
        },

        // =========================================================================
        // PRODUCT 6: 1 Gallon USDA Certified Organic Solution (Nationwide)
        // =========================================================================
        '7418571685959': {
            id: '7418571685959',
            shopifyProductId: '7418571685959',
            name: '1 Gallon USDA Certified Organic Ready-to-Use Solution',
            shortName: '1 Gal Organic Solution',
            type: 'usda-only',
            ppm: null,
            size: '1gal',
            certifications: ['USDA #Z-699995-2008'],
            epaNumber: null,
            usdaNumber: 'Z-699995-2008',
            description: 'Bulk premium professional-grade hypochlorous acid cleaner for large-scale applications. Safe for food contact surfaces and skin. Perfect for commercial facilities and high-volume cleaning needs. Cost-effective bulk solution. USDA Certified Organic (#Z-699995-2008). Ships nationwide. Made in Utah, USA.',
            restrictions: null,
            pricing: {
                retail: 32.99,
                retailSubscription: 29.69,
                wholesale: 20.99,
                wholesaleSubscription: 18.89
            },
            wholesaleThreshold: 10,
            shopifyVariants: {
                retail: '42457071517767',
                retailSubscription: '42457071550535',
                wholesale: '42457071583303',
                wholesaleSubscription: '42457071616071'
            },
            skus: {
                retail: 'USDA-OHS-1GAL-RTU-RETAIL',
                retailSubscription: 'USDA-OHS-1GAL-RTU-RETAIL-SUB',
                wholesale: 'USDA-OHS-1GAL-RTU-WHOLESALE',
                wholesaleSubscription: 'USDA-OHS-1GAL-RTU-WHOLESALE-SUB'
            },
            image: 'assets/images/products/organic-solution-1gal.png',
            emoji: '🪣',
            badgeType: 'USDA Organic',
            badgeColor: '#4ADE80',
            weight: 9.0,
            category: 'Cleaners',
            productLine: 'organic',
            useCase: ['cleaner', 'bulk', 'organic'],
            status: 'active'
        },

        // =========================================================================
        // PRODUCT 7: All in One Hypochlorous Organic Wipes (Nationwide)
        // =========================================================================
        '7249401315399': {
            id: '7249401315399',
            shopifyProductId: '7249401315399',
            name: 'All in One Hypochlorous Organic Wipes',
            shortName: 'Organic Wipes',
            type: 'usda-only',
            ppm: null,
            size: 'wipes',
            certifications: ['USDA #Z-699995-2008'],
            epaNumber: null,
            usdaNumber: 'Z-699995-2008',
            description: 'Convenient pre-moistened hypochlorous acid wipes for quick cleaning on-the-go. Safe for all surfaces including food contact. Ideal for homes, offices, travel, and healthcare. Non-toxic, alcohol-free formula. USDA Certified Organic (#Z-699995-2008). Ships nationwide. Made in Utah, USA.',
            restrictions: null,
            pricing: {
                retail: 12.99,
                retailSubscription: 11.69,
                wholesale: 10.99,
                wholesaleSubscription: 9.99
            },
            wholesaleThreshold: 20,
            shopifyVariants: {
                retail: '41829069619271',
                retailSubscription: '41829069652039',
                wholesale: '41829069684807',
                wholesaleSubscription: '41829069717575'
            },
            skus: {
                retail: 'OHS-ALL-IN-ONE-WIPES-RETAIL',
                retailSubscription: 'OHS-ALL-IN-ONE-WIPES-RETAIL-SUB',
                wholesale: 'OHS-ALL-IN-ONE-WIPES-WHOLESALE',
                wholesaleSubscription: 'OHS-ALL-IN-ONE-WIPES-WHOLESALE-SUB'
            },
            image: 'assets/images/products/organic-wipes.png',
            emoji: '🧻',
            badgeType: 'USDA Organic',
            badgeColor: '#4ADE80',
            weight: 1.0,
            category: 'Wipes',
            productLine: 'organic',
            useCase: ['wipes', 'travel', 'convenience'],
            status: 'active'
        },

        // =========================================================================
        // PRODUCT 8: 32oz Organic Laundry Booster (Nationwide)
        // =========================================================================
        '7249400004679': {
            id: '7249400004679',
            shopifyProductId: '7249400004679',
            name: '32oz Organic Laundry Booster W/ Cap',
            shortName: '32oz Laundry Booster',
            type: 'usda-only',
            ppm: null,
            size: '32oz',
            certifications: ['USDA #Z-699995-2008'],
            epaNumber: null,
            usdaNumber: 'Z-699995-2008',
            description: 'Premium laundry enhancement solution using hypochlorous acid technology. Eliminates odors, brightens whites, and provides antimicrobial protection for fabrics. Safe for all fabric types and colors. Perfect for households and commercial laundries. Non-toxic, eco-friendly alternative to harsh chemicals. USDA Certified Organic (#Z-699995-2008). Ships nationwide. Made in Utah, USA.',
            restrictions: null,
            pricing: {
                retail: 15.99,
                retailSubscription: 14.39,
                wholesale: 10.99,
                wholesaleSubscription: 9.89
            },
            wholesaleThreshold: 25,
            shopifyVariants: {
                retail: '41829064572999',
                retailSubscription: '41829064605767',
                wholesale: '41829064638535',
                wholesaleSubscription: '41829064671303'
            },
            skus: {
                retail: 'HC-32OZ-LAUNDRY-BOOSTER-RETAIL',
                retailSubscription: 'HC-32OZ-LAUNDRY-BOOSTER-RETAIL-SUB',
                wholesale: 'HC-32OZ-LAUNDRY-BOOSTER-WHOLESALE',
                wholesaleSubscription: 'HC-32OZ-LAUNDRY-BOOSTER-WHOLESALE-SUB'
            },
            image: 'assets/images/products/laundry-booster-32oz.png',
            emoji: '👕',
            badgeType: 'USDA Organic',
            badgeColor: '#4ADE80',
            weight: 2.5,
            category: 'Laundry',
            productLine: 'organic',
            useCase: ['laundry', 'odor-removal', 'fabric-care'],
            status: 'active'
        },

        // =========================================================================
        // PRODUCT 9: 1 Gallon Organic Laundry Booster (Nationwide)
        // =========================================================================
        '7249400037447': {
            id: '7249400037447',
            shopifyProductId: '7249400037447',
            name: '1 Gallon Organic Laundry Booster W/ Cap',
            shortName: '1 Gal Laundry Booster',
            type: 'usda-only',
            ppm: null,
            size: '1gal',
            certifications: ['USDA #Z-699995-2008'],
            epaNumber: null,
            usdaNumber: 'Z-699995-2008',
            description: 'Bulk premium laundry enhancement solution using hypochlorous acid technology. Eliminates odors, brightens whites, and provides antimicrobial protection for fabrics. Perfect for commercial laundries, hotels, and professional cleaning services. Safe for all fabric types and colors. Eco-friendly alternative to harsh chemicals. USDA Certified Organic (#Z-699995-2008). Ships nationwide. Made in Utah, USA.',
            restrictions: null,
            pricing: {
                retail: 28.99,
                retailSubscription: 26.09,
                wholesale: 19.99,
                wholesaleSubscription: 17.99
            },
            wholesaleThreshold: 10,
            shopifyVariants: {
                retail: '41829064704071',
                retailSubscription: '41829064736839',
                wholesale: '41829064769607',
                wholesaleSubscription: '41829064802375'
            },
            skus: {
                retail: 'HC-1GAL-LAUNDRY-BOOSTER-RETAIL',
                retailSubscription: 'HC-1GAL-LAUNDRY-BOOSTER-RETAIL-SUB',
                wholesale: 'HC-1GAL-LAUNDRY-BOOSTER-WHOLESALE',
                wholesaleSubscription: 'HC-1GAL-LAUNDRY-BOOSTER-WHOLESALE-SUB'
            },
            image: 'assets/images/products/laundry-booster-1gal.png',
            emoji: '👔',
            badgeType: 'USDA Organic',
            badgeColor: '#4ADE80',
            weight: 9.0,
            category: 'Laundry',
            productLine: 'organic',
            useCase: ['laundry', 'bulk', 'commercial'],
            status: 'active'
        },

        // =========================================================================
        // PRODUCT 10: OHS Pure Skin Serum 100ml (Nationwide) — CORRECTED PRICING
        // =========================================================================
        '7249401348167': {
            id: '7249401348167',
            shopifyProductId: '7249401348167',
            name: 'OHS Pure Skin Serum 100ml',
            shortName: 'Skin Serum 100ml',
            type: 'usda-only',
            ppm: null,
            size: '100ml',
            certifications: ['USDA #Z-699995-2008'],
            epaNumber: null,
            usdaNumber: 'Z-699995-2008',
            description: 'Advanced premium skin wellness serum formulated with hypochlorous acid technology. Professional-grade formulation with premium packaging. Supports skin wellness, soothes irritation, and provides gentle care for all skin types. Perfect for skincare-conscious consumers and dermatology practices. USDA Certified Organic (#Z-699995-2008). Ships nationwide. Made in Utah, USA.',
            restrictions: null,
            pricing: {
                retail: 34.99,
                retailSubscription: 31.49,
                wholesale: 26.99,
                wholesaleSubscription: 24.30
            },
            wholesaleThreshold: 12,
            shopifyVariants: {
                retail: '41829069750343',
                retailSubscription: '41829069783111',
                wholesale: '41829069815879',
                wholesaleSubscription: '41829069848647'
            },
            skus: {
                retail: 'OHS-SKIN-SERUM-100ML-RETAIL',
                retailSubscription: 'OHS-SKIN-SERUM-100ML-RETAIL-SUB',
                wholesale: 'OHS-SKIN-SERUM-100ML-WHOLESALE',
                wholesaleSubscription: 'OHS-SKIN-SERUM-100ML-WHOLESALE-SUB'
            },
            image: 'assets/images/products/skin-serum-100ml.png',
            emoji: '✨',
            badgeType: 'USDA Organic',
            badgeColor: '#4ADE80',
            weight: 0.5,
            category: 'Skincare',
            productLine: 'organic',
            useCase: ['skincare', 'sensitive-skin', 'wellness'],
            status: 'active'
        }
    };

    // =============================================================================
    // PRODUCT ALIASES — For flexible lookups
    // =============================================================================

    window.PRODUCT_ALIASES = {
        // EPA 32oz 200ppm
        'ohs-32oz-epa-cleaner': '7249401053255',
        '32oz epa registered ready-to-use cleaner': '7249401053255',
        '32oz epa registered ready-to-use cleaner 200ppm': '7249401053255',
        '32oz epa cleaner': '7249401053255',
        '32oz epa cleaner 200ppm': '7249401053255',
        'ohs-32oz-200ppm': '7249401053255',

        // EPA 1 Gal 200ppm
        'ohs-1gal-epa-solution': '7249401086023',
        '1 gallon epa registered ready-to-use solution': '7249401086023',
        '1 gallon epa registered ready-to-use solution 200ppm': '7249401086023',
        '1gal epa solution': '7249401086023',
        '1gal epa solution 200ppm': '7249401086023',
        'ohs-1gal-200ppm': '7249401086023',

        // EPA 32oz 500ppm
        'ohs-32oz-epa-cleaner-500ppm': '7470030454855',
        '32oz epa registered cleaner 500ppm': '7470030454855',
        '32oz epa cleaner 500ppm': '7470030454855',
        'ohs-32oz-500ppm': '7470030454855',

        // EPA 1 Gal 500ppm
        'ohs-1gal-epa-solution-500ppm': '7470030258247',
        '1 gallon epa registered solution 500ppm': '7470030258247',
        '1gal epa solution 500ppm': '7470030258247',
        'ohs-1gal-500ppm': '7470030258247',

        // USDA 32oz
        'usda-32oz-organic-cleaner': '7418569752647',
        '32oz usda certified organic ready-to-use cleaner': '7418569752647',
        '32oz organic cleaner': '7418569752647',
        'ohs-32oz-organic-ready-to-use': '7418569752647',

        // USDA 1 Gal
        'usda-1gal-organic-solution': '7418571685959',
        '1 gallon usda certified organic ready-to-use solution': '7418571685959',
        '1gal organic solution': '7418571685959',
        'ohs-1-gallon-organic-ready-to-use': '7418571685959',

        // Wipes
        'ohs-organic-wipes': '7249401315399',
        'ohs-all-in-one-wipes': '7249401315399',
        'all in one hypochlorous organic wipes': '7249401315399',
        'organic wipes': '7249401315399',

        // 32oz Laundry
        'ohs-32oz-laundry': '7249400004679',
        '32oz organic laundry booster w/ cap': '7249400004679',
        '32oz laundry booster': '7249400004679',
        'hc-32oz-laundry-booster': '7249400004679',

        // 1 Gal Laundry
        'ohs-1gal-laundry': '7249400037447',
        '1 gallon organic laundry booster w/ cap': '7249400037447',
        '1gal laundry booster': '7249400037447',
        'hc-1gal-laundry-booster': '7249400037447',

        // Skin Serum
        'ohs-skin-serum': '7249401348167',
        'ohs-skin-serum-100ml': '7249401348167',
        'ohs pure skin serum 100ml': '7249401348167',
        'skin serum 100ml': '7249401348167',
        'ohs-healing-serum': '7249401348167',
        'healing serum': '7249401348167'
    };

    // =============================================================================
    // SKU TO PRODUCT ID MAPPING — Auto-generated from catalog
    // =============================================================================

    window.SKU_MAP = {};

    Object.values(window.PRODUCT_CATALOG).forEach(function(product) {
        if (product.skus) {
            Object.values(product.skus).forEach(function(sku) {
                window.SKU_MAP[sku.toUpperCase()] = product.id;
            });
        }
    });

    // =============================================================================
    // HELPER FUNCTIONS
    // =============================================================================

    /**
     * Find a product by any identifier (Shopify Product ID, name, SKU, alias)
     * @param {string} identifier
     * @returns {Object|null}
     */
    window.findProduct = function(identifier) {
        if (!identifier) return null;

        var strIdentifier = String(identifier).trim();
        var normalized = strIdentifier.toLowerCase();

        // 1. Direct lookup by Shopify Product ID
        if (window.PRODUCT_CATALOG[strIdentifier]) {
            return window.PRODUCT_CATALOG[strIdentifier];
        }

        // 2. Alias lookup (case-insensitive)
        if (window.PRODUCT_ALIASES[normalized]) {
            return window.PRODUCT_CATALOG[window.PRODUCT_ALIASES[normalized]];
        }

        // 3. SKU lookup (case-insensitive)
        var upperIdentifier = strIdentifier.toUpperCase();
        if (window.SKU_MAP[upperIdentifier]) {
            return window.PRODUCT_CATALOG[window.SKU_MAP[upperIdentifier]];
        }

        // 4. Partial name match
        var products = Object.values(window.PRODUCT_CATALOG);
        for (var i = 0; i < products.length; i++) {
            var product = products[i];
            if (product.name) {
                var productNameLower = product.name.toLowerCase();
                if (productNameLower.includes(normalized) || normalized.includes(productNameLower)) {
                    return product;
                }
            }
        }

        // 5. Partial alias match
        var aliases = Object.entries(window.PRODUCT_ALIASES);
        for (var j = 0; j < aliases.length; j++) {
            var alias = aliases[j][0];
            var productId = aliases[j][1];
            if (alias.includes(normalized) || normalized.includes(alias)) {
                return window.PRODUCT_CATALOG[productId];
            }
        }

        return null;
    };

    /**
     * Check if a product is available in a given state
     * @param {string} productId
     * @param {string} state - Two-letter state code
     * @returns {boolean}
     */
    window.isProductAvailableInState = function(productId, state) {
        var product = window.findProduct(productId);
        if (!product) return false;
        if (!product.restrictions) return true;
        if (!product.restrictions.states) return true;
        return product.restrictions.states.includes((state || '').toUpperCase());
    };

    /**
     * Get all products available in a given state
     * @param {string} state - Two-letter state code
     * @returns {Array}
     */
    window.getAvailableProducts = function(state) {
        return Object.values(window.PRODUCT_CATALOG).filter(function(product) {
            return window.isProductAvailableInState(product.id, state);
        });
    };

    /**
     * Get pricing tier info based on quantity AND subscription status.
     * Returns the correct price, tier, variant ID, and SKU key for all 4 tiers.
     *
     * @param {string} productId
     * @param {number} quantity
     * @param {boolean} isSubscription - true if customer selected subscribe & save
     * @returns {Object} { price, tier, tierKey, variantId, isWholesale, isSubscription, savingsPerUnit, threshold, retailPrice, wholesalePrice }
     */
    window.getPricingTier = function(productId, quantity, isSubscription) {
        var product = window.findProduct(productId);
        if (!product || !product.pricing) {
            return {
                price: 0,
                tier: 'unknown',
                tierKey: 'retail',
                variantId: null,
                isWholesale: false,
                isSubscription: false,
                savingsPerUnit: 0,
                threshold: 25,
                retailPrice: 0,
                wholesalePrice: 0
            };
        }

        var threshold = product.wholesaleThreshold || 25;
        var isWholesale = quantity >= threshold;
        isSubscription = isSubscription || false;

        var tierKey, price, variantId;

        if (isWholesale && isSubscription) {
            tierKey   = 'wholesaleSubscription';
            price     = product.pricing.wholesaleSubscription;
            variantId = product.shopifyVariants.wholesaleSubscription;
        } else if (isWholesale) {
            tierKey   = 'wholesale';
            price     = product.pricing.wholesale;
            variantId = product.shopifyVariants.wholesale;
        } else if (isSubscription) {
            tierKey   = 'retailSubscription';
            price     = product.pricing.retailSubscription;
            variantId = product.shopifyVariants.retailSubscription;
        } else {
            tierKey   = 'retail';
            price     = product.pricing.retail;
            variantId = product.shopifyVariants.retail;
        }

        return {
            price: price,
            tier: isWholesale ? 'wholesale' : 'retail',
            tierKey: tierKey,
            variantId: variantId,
            isWholesale: isWholesale,
            isSubscription: isSubscription,
            savingsPerUnit: product.pricing.retail - price,
            threshold: threshold,
            retailPrice: product.pricing.retail,
            wholesalePrice: product.pricing.wholesale
        };
    };

    /**
     * Get all active products
     * @returns {Array}
     */
    window.getActiveProducts = function() {
        return Object.values(window.PRODUCT_CATALOG).filter(function(p) {
            return p.status === 'active';
        });
    };

    /**
     * Get EPA-registered products (Utah-only)
     * @returns {Array}
     */
    window.getEPAProducts = function() {
        return Object.values(window.PRODUCT_CATALOG).filter(function(p) {
            return p.type === 'epa-usda';
        });
    };

    /**
     * Get USDA-only products (ships nationwide)
     * @returns {Array}
     */
    window.getUSDAOnlyProducts = function() {
        return Object.values(window.PRODUCT_CATALOG).filter(function(p) {
            return p.type === 'usda-only';
        });
    };

    // =============================================================================
    // US STATES DATA
    // =============================================================================

    window.US_STATES = [
        { code: 'AL', name: 'Alabama' },
        { code: 'AK', name: 'Alaska' },
        { code: 'AZ', name: 'Arizona' },
        { code: 'AR', name: 'Arkansas' },
        { code: 'CA', name: 'California' },
        { code: 'CO', name: 'Colorado' },
        { code: 'CT', name: 'Connecticut' },
        { code: 'DE', name: 'Delaware' },
        { code: 'FL', name: 'Florida' },
        { code: 'GA', name: 'Georgia' },
        { code: 'HI', name: 'Hawaii' },
        { code: 'ID', name: 'Idaho' },
        { code: 'IL', name: 'Illinois' },
        { code: 'IN', name: 'Indiana' },
        { code: 'IA', name: 'Iowa' },
        { code: 'KS', name: 'Kansas' },
        { code: 'KY', name: 'Kentucky' },
        { code: 'LA', name: 'Louisiana' },
        { code: 'ME', name: 'Maine' },
        { code: 'MD', name: 'Maryland' },
        { code: 'MA', name: 'Massachusetts' },
        { code: 'MI', name: 'Michigan' },
        { code: 'MN', name: 'Minnesota' },
        { code: 'MS', name: 'Mississippi' },
        { code: 'MO', name: 'Missouri' },
        { code: 'MT', name: 'Montana' },
        { code: 'NE', name: 'Nebraska' },
        { code: 'NV', name: 'Nevada' },
        { code: 'NH', name: 'New Hampshire' },
        { code: 'NJ', name: 'New Jersey' },
        { code: 'NM', name: 'New Mexico' },
        { code: 'NY', name: 'New York' },
        { code: 'NC', name: 'North Carolina' },
        { code: 'ND', name: 'North Dakota' },
        { code: 'OH', name: 'Ohio' },
        { code: 'OK', name: 'Oklahoma' },
        { code: 'OR', name: 'Oregon' },
        { code: 'PA', name: 'Pennsylvania' },
        { code: 'RI', name: 'Rhode Island' },
        { code: 'SC', name: 'South Carolina' },
        { code: 'SD', name: 'South Dakota' },
        { code: 'TN', name: 'Tennessee' },
        { code: 'TX', name: 'Texas' },
        { code: 'UT', name: 'Utah' },
        { code: 'VT', name: 'Vermont' },
        { code: 'VA', name: 'Virginia' },
        { code: 'WA', name: 'Washington' },
        { code: 'WV', name: 'West Virginia' },
        { code: 'WI', name: 'Wisconsin' },
        { code: 'WY', name: 'Wyoming' },
        { code: 'DC', name: 'District of Columbia' }
    ];

    console.log('✅ Product Catalog loaded:', Object.keys(window.PRODUCT_CATALOG).length, 'products');
    console.log('📦 EPA Products (Utah Only):', window.getEPAProducts().length);
    console.log('🌿 USDA Products (Nationwide):', window.getUSDAOnlyProducts().length);

})();
