/**
 * ORGANIC HYPOSOLUTIONS - MASTER PRODUCT CATALOG
 * File: /shop/js/product-catalog.js
 * 
 * SINGLE SOURCE OF TRUTH for all product data
 * Both cart.js and products.html import this file
 * 
 * Features:
 * - All 8 products with complete data
 * - Geographic restrictions (EPA products Utah-only)
 * - Shopify variant IDs for all pricing tiers
 * - Helper functions for product lookups
 * 
 * Last Updated: 2025-02-03
 */

(function() {
    'use strict';

    // =============================================================================
    // SHOPIFY CONFIGURATION
    // =============================================================================
    
    window.SHOPIFY_DOMAIN = 'npmv1h-8e.myshopify.com';
    
    // =============================================================================
    // MASTER PRODUCT CATALOG - 8 PRODUCTS
    // =============================================================================
    
    window.PRODUCT_CATALOG = {
        
        // =========================================================================
        // PRODUCT 1: 32oz EPA Registered Ready-to-Use Cleaner (Utah Only)
        // =========================================================================
        '7249401053255': {
            id: '7249401053255',
            shopifyProductId: '7249401053255',
            name: '32oz EPA Registered Ready-to-Use Cleaner',
            shortName: '32oz EPA Cleaner',
            type: 'epa-usda',
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
                retail: 'OHS-32OZ-RTU-RETAIL',
                retailSubscription: 'OHS-32OZ-RTU-RETAIL-SUB',
                wholesale: 'OHS-32OZ-RTU-WHOLESALE',
                wholesaleSubscription: 'OHS-32OZ-RTU-WHOLESALE-SUB'
            },
            image: 'assets/images/products/32oz_epa_ready_to_use_cleaner.jpeg',
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
        // PRODUCT 2: 1 Gallon EPA Registered Ready-to-Use Solution (Utah Only)
        // =========================================================================
        '7249401086023': {
            id: '7249401086023',
            shopifyProductId: '7249401086023',
            name: '1 Gallon EPA Registered Ready-to-Use Solution',
            shortName: '1 Gal EPA Solution',
            type: 'epa-usda',
            certifications: ['EPA #97801-1', 'USDA #Z-699995-2008'],
            epaNumber: '97801-1',
            usdaNumber: 'Z-699995-2008',
            description: 'Bulk premium professional-grade hypochlorous acid cleaner and disinfectant for large-scale applications. Advanced formulation with premium packaging. Kills 99.9% of pathogens including bacteria viruses and fungi. Perfect for premium commercial facilities luxury establishments and high-end bulk users. Safe for food contact surfaces and skin. Cost-effective solution for high-volume premium cleaning needs. EPA registered (#97801-1) and USDA Certified Organic (#Z-699995-2008). Made in Utah USA.',
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
                retail: 'OHS-1GAL-READY-RTU-RETAIL',
                retailSubscription: 'OHS-1GAL-READY-RTU-RETAIL-SUB',
                wholesale: 'OHS-1GAL-READY-RTU-WHOLESALE',
                wholesaleSubscription: 'OHS-1GAL-READY-RTU-WHOLESALE-SUB'
            },
            image: 'assets/images/products/1_gallon_epa_ready_to_use_solution.jpg',
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
        // PRODUCT 3: 32oz USDA Certified Organic Ready-to-Use Cleaner (Nationwide)
        // =========================================================================
        '7418569752647': {
            id: '7418569752647',
            shopifyProductId: '7418569752647',
            name: '32oz USDA Certified Organic Ready-to-Use Cleaner',
            shortName: '32oz Organic Cleaner',
            type: 'usda-only',
            certifications: ['USDA #Z-699995-2008'],
            epaNumber: null,
            usdaNumber: 'Z-699995-2008',
            description: 'Professional-strength ready-to-use hypochlorous acid cleaner and disinfectant. Kills 99.9% of pathogens including bacteria, viruses, and fungi. Safe for food contact surfaces, toys, and skin. Perfect for homes, offices, restaurants, and healthcare facilities. No harsh chemicals, no toxic fumes. Simply spray and wipe. USDA Certified Organic (#Z-699995-2008). Made in Utah, USA.',
            restrictions: null, // Ships nationwide
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
            image: 'assets/images/products/32oz_organic_ready_to_use_cleaner.jpeg',
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
        // PRODUCT 4: 1 Gallon USDA Certified Organic Ready-to-Use Solution (Nationwide)
        // =========================================================================
        '7418571685959': {
            id: '7418571685959',
            shopifyProductId: '7418571685959',
            name: '1 Gallon USDA Certified Organic Ready-to-Use Solution',
            shortName: '1 Gal Organic Solution',
            type: 'usda-only',
            certifications: ['USDA #Z-699995-2008'],
            epaNumber: null,
            usdaNumber: 'Z-699995-2008',
            description: 'Bulk premium professional-grade hypochlorous acid cleaner and disinfectant for large-scale applications. Advanced formulation with premium packaging. Kills 99.9% of pathogens including bacteria viruses and fungi. Perfect for premium commercial facilities luxury establishments and high-end bulk users. Safe for food contact surfaces and skin. Cost-effective solution for high-volume premium cleaning needs. USDA Certified Organic (#Z-699995-2008). Made in Utah USA.',
            restrictions: null, // Ships nationwide
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
                retail: 'USDA-OHS-1GAL-READY-RTU-RETAIL',
                retailSubscription: 'USDA-OHS-1GAL-READY-RTU-RETAIL-SUB',
                wholesale: 'USDA-OHS-1GAL-READY-RTU-WHOLESALE',
                wholesaleSubscription: 'USDA-OHS-1GAL-READY-RTU-WHOLESALE-SUB'
            },
            image: 'assets/images/products/1_gallon_organic_ready_to_use_solution.jpg',
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
        // PRODUCT 5: All in One Hypochlorous Organic Wipes (Nationwide)
        // =========================================================================
        '7249401315399': {
            id: '7249401315399',
            shopifyProductId: '7249401315399',
            name: 'All in One Hypochlorous Organic Wipes',
            shortName: 'Organic Wipes',
            type: 'usda-only',
            certifications: ['USDA #Z-699995-2008'],
            epaNumber: null,
            usdaNumber: 'Z-699995-2008',
            description: 'Convenient pre-moistened hypochlorous acid wipes. Kills 99.9% of pathogens. Perfect for quick cleaning and disinfecting on-the-go. Safe for all surfaces including food contact. Ideal for homes offices travel and healthcare. Non-toxic alcohol-free formula. USDA Certified Organic (#Z-699995-2008). Made in Utah USA.',
            restrictions: null, // Ships nationwide
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
                retail: 'OHS-ALL-IN-ONE-WIPES',
                retailSubscription: 'OHS-ALL-IN-ONE-WIPES-SUB',
                wholesale: 'OHS-ALL-IN-ONE-WIPES-WHOLESALE',
                wholesaleSubscription: 'OHS-ALL-IN-ONE-WIPES-WHOLESALE-SUB'
            },
            image: 'assets/images/products/organic_all_in_one_disinfecting_wipes.jpg',
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
        // PRODUCT 6: 32oz Organic Laundry Booster W/ Cap (Nationwide)
        // =========================================================================
        '7249400004679': {
            id: '7249400004679',
            shopifyProductId: '7249400004679',
            name: '32oz Organic Laundry Booster W/ Cap',
            shortName: '32oz Laundry Booster',
            type: 'usda-only',
            certifications: ['USDA #Z-699995-2008'],
            epaNumber: null,
            usdaNumber: 'Z-699995-2008',
            description: 'Premium laundry enhancement solution using hypochlorous acid technology. Eliminates odors brightens whites and provides antimicrobial protection to fabrics. Safe for all fabric types and colors. Perfect for households and commercial laundries. Non-toxic non-irritating formula. Eco-friendly alternative to harsh chemicals. USDA Certified Organic (#Z-699995-2008). Made in Utah USA.',
            restrictions: null, // Ships nationwide
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
            image: 'assets/images/products/32oz_organic_laundry.jpeg',
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
        // PRODUCT 7: 1 Gallon Organic Laundry Booster W/ Cap (Nationwide)
        // =========================================================================
        '7249400037447': {
            id: '7249400037447',
            shopifyProductId: '7249400037447',
            name: '1 Gallon Organic Laundry Booster W/ Cap',
            shortName: '1 Gal Laundry Booster',
            type: 'usda-only',
            certifications: ['USDA #Z-699995-2008'],
            epaNumber: null,
            usdaNumber: 'Z-699995-2008',
            description: 'Bulk premium laundry enhancement solution using hypochlorous acid technology. Eliminates odors brightens whites and provides antimicrobial protection to fabrics. Perfect for commercial laundries hotels and professional cleaning services. Safe for all fabric types and colors. Cost-effective bulk solution for high-volume laundry needs. Eco-friendly alternative to harsh chemicals. USDA Certified Organic (#Z-699995-2008). Made in Utah USA.',
            restrictions: null, // Ships nationwide
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
            image: 'assets/images/products/1gallon_organic_laundry_booster.jpg',
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
        // PRODUCT 8: OHS Pure Healing Skin Serum (Nationwide)
        // =========================================================================
        '7249401348167': {
            id: '7249401348167',
            shopifyProductId: '7249401348167',
            name: 'OHS Pure Healing Skin Serum',
            shortName: 'Healing Serum',
            type: 'usda-only',
            certifications: ['USDA #Z-699995-2008'],
            epaNumber: null,
            usdaNumber: 'Z-699995-2008',
            description: 'Advanced premium therapeutic skin serum formulated with hypochlorous acid technology. Professional-grade formulation with premium packaging. Promotes rapid healing, reduces inflammation, and provides antimicrobial protection for wounds, cuts, and skin conditions. Perfect for premium healthcare facilities, dermatology clinics, and discerning consumers. Gentle enough for sensitive skin while delivering superior therapeutic results. USDA Certified Organic (#Z-699995-2008). Made in Utah, USA.',
            restrictions: null, // Ships nationwide
            pricing: {
                retail: 22.99,
                retailSubscription: 20.69,
                wholesale: 16.99,
                wholesaleSubscription: 15.29
            },
            wholesaleThreshold: 12,
            shopifyVariants: {
                retail: '41829069750343',
                retailSubscription: '41829069783111',
                wholesale: '41829069815879',
                wholesaleSubscription: '41829069848647'
            },
            skus: {
                retail: 'OHS-HEALING-SERUM-RETAIL',
                retailSubscription: 'OHS-HEALING-SERUM-RETAIL-SUB',
                wholesale: 'OHS-HEALING-SERUM-WHOLESALE',
                wholesaleSubscription: 'OHS-HEALING-SERUM-WHOLESALE-SUB'
            },
            image: 'assets/images/products/OHS_Skin_Serum.jpeg',
            emoji: '✨',
            badgeType: 'USDA Organic',
            badgeColor: '#4ADE80',
            weight: 0.5,
            category: 'Skincare',
            productLine: 'organic',
            useCase: ['skincare', 'healing', 'sensitive-skin'],
            status: 'active'
        }
    };
    
    // =============================================================================
    // PRODUCT ALIASES - For flexible lookups
    // =============================================================================
    
    window.PRODUCT_ALIASES = {
        // EPA 32oz aliases
        'ohs-32oz-epa-cleaner': '7249401053255',
        '32oz epa registered ready-to-use cleaner': '7249401053255',
        '32oz epa cleaner': '7249401053255',
        'ohs-32oz-rtu-retail': '7249401053255',
        
        // EPA 1 Gallon aliases
        'ohs-1gal-epa-solution': '7249401086023',
        '1 gallon epa registered ready-to-use solution': '7249401086023',
        '1gal epa solution': '7249401086023',
        
        // USDA 32oz aliases
        'usda-32oz-organic-cleaner': '7418569752647',
        '32oz usda certified organic ready-to-use cleaner': '7418569752647',
        '32oz organic cleaner': '7418569752647',
        'ohs-32oz-organic-ready-to-use': '7418569752647',
        
        // USDA 1 Gallon aliases
        'usda-1gal-organic-solution': '7418571685959',
        '1 gallon usda certified organic ready-to-use solution': '7418571685959',
        '1gal organic solution': '7418571685959',
        'ohs-1-gallon-organic-ready-to-use': '7418571685959',
        
        // Wipes aliases
        'ohs-organic-wipes': '7249401315399',
        'ohs-all-in-one-wipes': '7249401315399',
        'all in one hypochlorous organic wipes': '7249401315399',
        'organic wipes': '7249401315399',
        
        // 32oz Laundry aliases
        'ohs-32oz-laundry': '7249400004679',
        '32oz organic laundry booster w/ cap': '7249400004679',
        '32oz laundry booster': '7249400004679',
        'hc-32oz-laundry-booster': '7249400004679',
        
        // 1 Gallon Laundry aliases
        'ohs-1gal-laundry': '7249400037447',
        '1 gallon organic laundry booster w/ cap': '7249400037447',
        '1gal laundry booster': '7249400037447',
        'hc-1gal-laundry-booster': '7249400037447',
        
        // Skin Serum aliases
        'ohs-healing-serum': '7249401348167',
        'ohs-skin-serum': '7249401348167',
        'ohs pure healing skin serum': '7249401348167',
        'healing serum': '7249401348167'
    };
    
    // =============================================================================
    // SKU TO PRODUCT ID MAPPING
    // =============================================================================
    
    window.SKU_MAP = {};
    
    // Auto-generate SKU map from product catalog
    Object.values(window.PRODUCT_CATALOG).forEach(product => {
        if (product.skus) {
            Object.values(product.skus).forEach(sku => {
                window.SKU_MAP[sku.toUpperCase()] = product.id;
            });
        }
    });
    
    // =============================================================================
    // HELPER FUNCTIONS
    // =============================================================================
    
    /**
     * Find a product by any identifier (ID, name, SKU, alias)
     * @param {string} identifier - Product identifier to search for
     * @returns {Object|null} - Product object or null if not found
     */
    window.findProduct = function(identifier) {
        if (!identifier) return null;
        
        const strIdentifier = String(identifier).trim();
        const normalized = strIdentifier.toLowerCase();
        
        // 1. Direct lookup by Shopify Product ID
        if (window.PRODUCT_CATALOG[strIdentifier]) {
            return window.PRODUCT_CATALOG[strIdentifier];
        }
        
        // 2. Try alias lookup (case-insensitive)
        if (window.PRODUCT_ALIASES[normalized]) {
            return window.PRODUCT_CATALOG[window.PRODUCT_ALIASES[normalized]];
        }
        
        // 3. Try SKU lookup (case-insensitive)
        const upperIdentifier = strIdentifier.toUpperCase();
        if (window.SKU_MAP[upperIdentifier]) {
            return window.PRODUCT_CATALOG[window.SKU_MAP[upperIdentifier]];
        }
        
        // 4. Try partial name matching
        for (const product of Object.values(window.PRODUCT_CATALOG)) {
            if (product.name) {
                const productNameLower = product.name.toLowerCase();
                if (productNameLower.includes(normalized) || normalized.includes(productNameLower)) {
                    return product;
                }
            }
        }
        
        // 5. Try partial alias matching
        for (const [alias, productId] of Object.entries(window.PRODUCT_ALIASES)) {
            if (alias.includes(normalized) || normalized.includes(alias)) {
                return window.PRODUCT_CATALOG[productId];
            }
        }
        
        return null;
    };
    
    /**
     * Check if a product is available in a given state
     * @param {string} productId - Product ID
     * @param {string} state - Two-letter state code
     * @returns {boolean} - True if product can ship to state
     */
    window.isProductAvailableInState = function(productId, state) {
        const product = window.findProduct(productId);
        if (!product) return false;
        
        // No restrictions = ships nationwide
        if (!product.restrictions) return true;
        if (!product.restrictions.states) return true;
        
        // Check if state is in allowed list
        return product.restrictions.states.includes(state?.toUpperCase());
    };
    
    /**
     * Get all products available in a given state
     * @param {string} state - Two-letter state code
     * @returns {Array} - Array of available products
     */
    window.getAvailableProducts = function(state) {
        return Object.values(window.PRODUCT_CATALOG).filter(product => {
            return window.isProductAvailableInState(product.id, state);
        });
    };
    
    /**
     * Get pricing tier information for a product based on quantity
     * @param {string} productId - Product ID
     * @param {number} quantity - Quantity
     * @returns {Object} - Pricing tier info
     */
    window.getPricingTier = function(productId, quantity) {
        const product = window.findProduct(productId);
        if (!product || !product.pricing) {
            return {
                price: 0,
                tier: 'unknown',
                variantId: null,
                isWholesale: false,
                savingsPerUnit: 0,
                threshold: 25
            };
        }
        
        const threshold = product.wholesaleThreshold || 25;
        const isWholesale = quantity >= threshold;
        
        const price = isWholesale ? product.pricing.wholesale : product.pricing.retail;
        const tier = isWholesale ? 'wholesale' : 'retail';
        const variantId = product.shopifyVariants ? product.shopifyVariants[tier] : null;
        const savingsPerUnit = isWholesale ? (product.pricing.retail - product.pricing.wholesale) : 0;
        
        return {
            price: price,
            tier: tier,
            variantId: variantId,
            isWholesale: isWholesale,
            savingsPerUnit: savingsPerUnit,
            threshold: threshold,
            retailPrice: product.pricing.retail,
            wholesalePrice: product.pricing.wholesale
        };
    };
    
    /**
     * Get all active products
     * @returns {Array} - Array of active products
     */
    window.getActiveProducts = function() {
        return Object.values(window.PRODUCT_CATALOG).filter(p => p.status === 'active');
    };
    
    /**
     * Get EPA-registered products (Utah-only)
     * @returns {Array} - Array of EPA products
     */
    window.getEPAProducts = function() {
        return Object.values(window.PRODUCT_CATALOG).filter(p => p.type === 'epa-usda');
    };
    
    /**
     * Get USDA-only products (ships nationwide)
     * @returns {Array} - Array of USDA-only products
     */
    window.getUSDAOnlyProducts = function() {
        return Object.values(window.PRODUCT_CATALOG).filter(p => p.type === 'usda-only');
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
