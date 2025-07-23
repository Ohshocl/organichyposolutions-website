// ===================================================================
// CART FUNCTIONS
// ===================================================================

// Consistent localStorage key across all pages
const CART_STORAGE_KEY = 'ohsCart';

// Load cart from localStorage
function loadCart() {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
}

// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

// Update cart badge count
function updateCartBadge() {
    const cartItems = loadCart();
    const cartBadge = document.getElementById('cartBadge');
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    if (totalItems > 0) {
        cartBadge.textContent = totalItems;
        cartBadge.style.display = 'inline-block';
    } else {
        cartBadge.style.display = 'none';
    }
}

// Add to cart function
function addToCart(productId, quantity = 1) {
    let cart = loadCart();
    const existingItemIndex = cart.findIndex(item => item.productId === productId);
    
    if (existingItemIndex >= 0) {
        cart[existingItemIndex].quantity += quantity;
    } else {
        cart.push({ productId, quantity });
    }
    
    saveCart(cart);
    updateCartBadge();
}

// Remove from cart function
function removeFromCart(productId) {
    let cart = loadCart();
    cart = cart.filter(item => item.productId !== productId);
    saveCart(cart);
    updateCartBadge();
}

// Update cart quantity
function updateCartQuantity(productId, change) {
    let cart = loadCart();
    const item = cart.find(item => item.productId === productId);
    
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart(cart);
            updateCartBadge();
        }
    }
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartBadge();
});

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
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 20,
        minOrder: 'Monthly Invoice',
        type: 'premium',
        emoji: '🧻'
    },
    // ===================================================================
    // THERAPEUTIC & SPECIALIZED PRODUCTS
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
        bundleContents: [
            '3oz HC-Pure Multi-Use Disinfectant',
            '32oz Multi Use Cleaner Ready to Use',
            'All-in-One Wipes'
        ],
        bundleSavings: 8.77,
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
        bundleContents: [
            '32oz Multi Use Cleaner Ready to Use',
            '1 Gallon Ready to Use',
            'All-in-One Wipes'
        ],
        bundleSavings: 15.59,
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
        bundleContents: [
            '32oz Pet Cleaner and Deodorizer',
            '32oz 500ppm Pet+ Solution',
            'All-in-One Wipes',
            '3oz HC-Pure Skin Health Mist'
        ],
        bundleSavings: 17.40,
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 5,
        minOrder: 'Monthly Invoice',
        type: 'premium',
        emoji: '🐾'
    },
    // ===================================================================
    // EQUIPMENT & GENERATORS
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
        subscriptionOptions: ['quarterly'],
        wholesaleThreshold: 1,
        minOrder: 'Monthly Invoice',
        type: 'premium',
        emoji: '🏊'
    },

    // ===================================================================
    // BULK PACKAGING CASES
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
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 5,
        minOrder: 'Monthly Invoice',
        type: 'premium',
        emoji: '🛢️'
    },

    // ===================================================================
    // INDUSTRIAL EPA ORGANIC PRODUCTS
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
        subscriptionOptions: ['quarterly'],
        wholesaleThreshold: 1,
        minOrder: 'Monthly Invoice',
        type: 'premium',
        emoji: '🏗️'
    },
    // ===================================================================
    // INDUSTRIAL FDA PRODUCTS
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
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 10,
        minOrder: 1,
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
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 25,
        minOrder: 25,
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
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 25,
        minOrder: 25,
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
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 10,
        minOrder: 1,
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
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 25,
        minOrder: 1,
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
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 25,
        minOrder: 1,
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
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 20,
        minOrder: 1,
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
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 20,
        minOrder: 1,
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
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 20,
        minOrder: 1,
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
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 20,
        minOrder: 20,
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
        bundleContents: [
            '3oz Organic Multi-Surface Disinfectant',
            '32oz Organic Ready-to-Use Cleaner',
            'Organic All-in-One Disinfecting Wipes'
        ],
        bundleSavings: 12.15,
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 15,
        minOrder: 1,
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
        minOrder: 1,
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
        minOrder: 1,
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
        bundleContents: [
            '32oz Organic Ready-to-Use Cleaner',
            '1 Gallon Organic Ready-to-Use Solution',
            'Organic All-in-One Disinfecting Wipes'
        ],
        bundleSavings: 19.45,
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 12,
        minOrder: 1,
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
        bundleContents: [
            '32oz Organic Pet Safe Cleaner & Deodorizer',
            '32oz Organic 500ppm Pet+ & Equine Solution',
            'Organic All-in-One Disinfecting Wipes',
            '3oz Organic Skin Health Mist'
        ],
        bundleSavings: 18.53,
        subscriptionOptions: ['monthly', 'quarterly'],
        wholesaleThreshold: 12,
        minOrder: 1,
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
    bulkOrderThreshold: 1000,
    businessAccountDiscount: 0.12,
    utahTaxRate: 0.0775,
    
    // Shopify + ShipRight Integration
    ecommerceProvider: 'Shopify',
    shippingProvider: 'ShipRight', // Shopify app integration
    fulfillmentIncluded: true, // Fulfillment costs already in product prices
    shippingCalculatedBy: 'Shopify', // Shopify handles shipping calculations via ShipRight
    
    subscriptionDiscounts: {
        monthly: 0.08,
        quarterly: 0.10,
        annual: 0.15
    },
    productLines: {
        premium: {
            name: 'Professional Premium Line',
            minOrder: 'Monthly Invoice',
            badgeColor: '#f59e0b',
            badgeText: 'EPA Premium'
        },
        organic: {
            name: 'USDA Organic Line',
            minOrder: 'Traditional MOQ',
            badgeColor: '#4ADE80',
            badgeText: 'USDA Organic'
        }
    },
    fulfillment: {
        provider: 'Shopify + ShipRight',
        costsIncluded: true, // Fulfillment costs already included in product prices
        standardDays: '2-4',
        expeditedDays: '1-2',
        overnightDays: 'Next day',
        businessOnly: false,
        saturdayDelivery: true,
        signatureRequired: false,
        origin: 'Salt Lake City, Utah',
        integration: 'shopify_app' // ShipRight runs as Shopify app
    },
    
    // Shopify Integration Readiness
    shopifyReady: true,
    productDataStructured: true,
    pricingConfigured: true,
    shippingIntegrated: true
};

window.PRICING_RULES = PRICING_RULES;

// ===================================================================
// WHOLESALE RATE FUNCTIONS - Updated from Volume Discount Functions
// ===================================================================

function calculateWholesaleRate(productId, quantity) {
    const product = PRODUCT_CATALOG[productId];
    if (!product) {
        return { 
            isWholesale: false, 
            price: 0, 
            label: "Product not found", 
            threshold: null 
        };
    }
    
    const isWholesale = quantity >= product.wholesaleThreshold;
    
    if (isWholesale) {
        return {
            isWholesale: true,
            price: product.pricing.wholesale,
            label: `Wholesale Rate (${product.wholesaleThreshold}+ units)`,
            threshold: product.wholesaleThreshold
        };
    } else {
        return {
            isWholesale: false,
            price: product.pricing.retail,
            label: `Retail Rate (under ${product.wholesaleThreshold} units)`,
            threshold: product.wholesaleThreshold
        };
    }
}

function getEffectivePrice(productId, quantity, subscriptionType = null) {
    const product = PRODUCT_CATALOG[productId];
    if (!product) return 0;
    
    const wholesaleInfo = calculateWholesaleRate(productId, quantity);
    let basePrice = wholesaleInfo.price;
    
    // Apply subscription discounts on top of wholesale/retail rate
    if (subscriptionType && product.subscriptionOptions.includes(subscriptionType)) {
        if (subscriptionType === 'monthly') {
            basePrice = wholesaleInfo.isWholesale ? 
                product.pricing.wholesaleMonthly : 
                product.pricing.retailMonthly;
        } else if (subscriptionType === 'quarterly') {
            basePrice = wholesaleInfo.isWholesale ? 
                product.pricing.wholesaleQuarterly : 
                product.pricing.retailQuarterly;
        }
    }
    
    return basePrice;
}

function updateWholesaleProgress() {
    try {
        const cart = JSON.parse(localStorage.getItem('ohsCart') || '[]');
        
        // Calculate progress for each item in cart
        cart.forEach(item => {
            const product = PRODUCT_CATALOG[item.productId];
            if (product && product.wholesaleThreshold) {
                const wholesaleInfo = calculateWholesaleRate(item.productId, item.quantity);
                
                // Update progress elements if they exist for this product
                const progressSection = document.getElementById(`wholesaleProgress-${item.productId}`);
                if (progressSection) {
                    const progressFill = progressSection.querySelector('.wholesale-progress-fill');
                    const itemsToNext = progressSection.querySelector('.items-to-wholesale');
                    const thresholdText = progressSection.querySelector('.wholesale-threshold');
                    
                    if (!wholesaleInfo.isWholesale) {
                        const itemsNeeded = product.wholesaleThreshold - item.quantity;
                        const progress = Math.min((item.quantity / product.wholesaleThreshold) * 100, 100);
                        
                        if (progressFill) progressFill.style.width = `${progress}%`;
                        if (itemsToNext) itemsToNext.textContent = Math.max(0, itemsNeeded);
                        if (thresholdText) thresholdText.textContent = product.wholesaleThreshold;
                        
                        progressSection.style.display = 'block';
                    } else {
                        // Hide progress when wholesale is achieved
                        progressSection.style.display = 'none';
                    }
                }
            }
        });
        
    } catch (error) {
        console.error('Error updating wholesale progress:', error);
    }
}

function updateWholesaleSavingsDisplay() {
    try {
        const cart = JSON.parse(localStorage.getItem('ohsCart') || '[]');
        let totalSavings = 0;
        let hasWholesaleRates = false;
        
        cart.forEach(item => {
            const product = PRODUCT_CATALOG[item.productId];
            if (product) {
                const wholesaleInfo = calculateWholesaleRate(item.productId, item.quantity);
                
                if (wholesaleInfo.isWholesale) {
                    hasWholesaleRates = true;
                    
                    // Calculate savings: retail price - wholesale price
                    const retailPrice = product.pricing.retail;
                    const wholesalePrice = product.pricing.wholesale;
                    const savings = (retailPrice - wholesalePrice) * item.quantity;
                    totalSavings += savings;
                }
            }
        });
        
        // Update wholesale savings display elements
        const wholesaleSavingsDisplay = document.getElementById('wholesaleSavingsDisplay');
        const savingsAmount = document.querySelector('.wholesale-savings-amount, #wholesaleSavingsAmount');
        
        if (wholesaleSavingsDisplay) {
            if (hasWholesaleRates && totalSavings > 0) {
                wholesaleSavingsDisplay.style.display = 'block';
                if (savingsAmount) {
                    savingsAmount.textContent = `$${totalSavings.toFixed(2)}`;
                }
            } else {
                wholesaleSavingsDisplay.style.display = 'none';
            }
        }
        
        return totalSavings;
        
    } catch (error) {
        console.error('Error updating wholesale savings display:', error);
        return 0;
    }
}

// Helper function to get account type (if not already defined)
function getAccountType() {
    return localStorage.getItem('ohsAccountType') || 'consumer';
}

// Update the existing cart functions to use wholesale rates
function updateCartBadge() {
    const cartItems = loadCart();
    const cartBadge = document.getElementById('cartBadge');
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    if (totalItems > 0) {
        cartBadge.textContent = totalItems;
        cartBadge.style.display = 'inline-block';
    } else {
        cartBadge.style.display = 'none';
    }
    
    // Update wholesale progress and savings when cart badge updates
    updateWholesaleProgress();
    updateWholesaleSavingsDisplay();
}

// Optional: Check for duplicate products
function checkForDuplicates() {
    const productIds = Object.keys(PRODUCT_CATALOG);
    const productNames = Object.values(PRODUCT_CATALOG).map(p => p.name);
    
    const uniqueIds = [...new Set(productIds)];
    const uniqueNames = [...new Set(productNames)];
    
    if (productIds.length !== uniqueIds.length) {
        console.error('❌ DUPLICATE PRODUCT IDs FOUND:', productIds.length - uniqueIds.length, 'duplicates');
    }
    
    if (productNames.length !== uniqueNames.length) {
        console.error('❌ DUPLICATE PRODUCT NAMES FOUND:', productNames.length - uniqueNames.length, 'duplicates');
    }
    
    if (productIds.length === uniqueIds.length && productNames.length === uniqueNames.length) {
        console.log('✅ No duplicates found in product catalog');
    }
}

console.log('✅ Wholesale rate functions added to cart system');
checkForDuplicates();

console.log('🎉 COMPLETE PRODUCT CATALOG LOADED - 57 PRODUCTS TOTAL');
console.log('🏆 Premium Line: 38 products | 🌱 Organic Line: 19 products');
console.log('🛒 Shopify Ready | 🚚 ShipRight Integration Ready | 📦 Fulfillment Included');
console.log('✅ Ready for Shopify Import | ⚙️ Wholesale Pricing Configured | 🔄 Cart Functional');
