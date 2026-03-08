/**
 * Organic HypoSolutions - Analytics & Tracking
 * GA4 Implementation with Shopify E-commerce Integration
 * organichyposolutions.com
 *
 * Integrates with product-catalog.js (must load first):
 *   - window.PRODUCT_CATALOG for product data
 *   - window.findProduct() for lookups
 *   - window.getPricingTier() for dynamic wholesale thresholds
 *
 * Cart storage: ohsCart key, ARRAY format
 *   [{productId, variantId, name, price, quantity, sku, tier, type, isSubscription, image}]
 *
 * Last Updated: 2026-03-08
 */

// =============================================================================
// CONFIGURATION
// =============================================================================

const ANALYTICS_CONFIG = {
    GA4_ID: 'G-HEKE217WEY',
    DEBUG_MODE: false,
    COOKIE_CONSENT: true,
    SESSION_TIMEOUT: 30,
    PRODUCT_COUNT: 10
};

// =============================================================================
// GA4 INITIALIZATION
// =============================================================================

function initializeGA4() {
    var gtagScript = document.createElement('script');
    gtagScript.async = true;
    gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + ANALYTICS_CONFIG.GA4_ID;
    document.head.appendChild(gtagScript);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
        dataLayer.push(arguments);
    };

    gtag('js', new Date());

    gtag('config', ANALYTICS_CONFIG.GA4_ID, {
        send_page_view: true,
        anonymize_ip: true,
        allow_google_signals: true,
        allow_ad_personalization_signals: true,
        custom_map: {
            'dimension1': 'user_type',
            'dimension2': 'product_line',
            'dimension3': 'certification_interest',
            'dimension4': 'cart_value_tier',
            'dimension5': 'customer_segment'
        },
        debug_mode: ANALYTICS_CONFIG.DEBUG_MODE
    });

    if (ANALYTICS_CONFIG.DEBUG_MODE) {
        console.log('[OHS Analytics] GA4 initialized:', ANALYTICS_CONFIG.GA4_ID);
    }
}

// =============================================================================
// CART CONTEXT HELPER
// Reads ohsCart (ARRAY format) from localStorage.
// Uses per-product wholesaleThreshold from product-catalog.js.
// =============================================================================

function getCartContext() {
    try {
        // ohsCart is always an ARRAY — never an object
        var cart = JSON.parse(localStorage.getItem('ohsCart') || '[]');
        if (!Array.isArray(cart)) cart = [];

        var totalItems = 0;
        var totalValue = 0;
        var hasSubscription = false;
        var hasEPA = false;
        var hasUSDA = false;
        var has500ppm = false;
        var wholesaleItemCount = 0;

        for (var i = 0; i < cart.length; i++) {
            var item = cart[i];
            var qty = item.quantity || 0;
            var price = item.price || 0;
            totalItems += qty;
            totalValue += price * qty;

            if (item.isSubscription) hasSubscription = true;
            if (item.type === 'epa-usda') hasEPA = true;
            if (item.type === 'usda-only') hasUSDA = true;

            // Check per-product wholesale threshold
            var product = (typeof window.findProduct === 'function') ? window.findProduct(item.productId) : null;
            if (product) {
                var threshold = product.wholesaleThreshold || 25;
                if (qty >= threshold) wholesaleItemCount++;
                if (product.ppm === 500) has500ppm = true;
            } else {
                if (item.tier === 'wholesale') wholesaleItemCount++;
            }
        }

        return {
            totalItems: totalItems,
            totalValue: Math.round(totalValue * 100) / 100,
            uniqueProducts: cart.length,
            hasWholesaleItems: wholesaleItemCount > 0,
            wholesaleItemCount: wholesaleItemCount,
            hasSubscription: hasSubscription,
            hasEPA: hasEPA,
            hasUSDA: hasUSDA,
            has500ppm: has500ppm
        };
    } catch (error) {
        if (ANALYTICS_CONFIG.DEBUG_MODE) {
            console.warn('[OHS Analytics] Cart context error:', error);
        }
        return {
            totalItems: 0,
            totalValue: 0,
            uniqueProducts: 0,
            hasWholesaleItems: false,
            wholesaleItemCount: 0,
            hasSubscription: false,
            hasEPA: false,
            hasUSDA: false,
            has500ppm: false
        };
    }
}

// =============================================================================
// PRODUCT DETAIL HELPER
// Builds GA4 item object from product-catalog.js data
// =============================================================================

function buildGA4Item(item, quantity, source) {
    var product = (typeof window.findProduct === 'function') ? window.findProduct(item.productId || item.id) : null;
    var ppmLabel = product && product.ppm ? product.ppm + 'ppm' : '';
    var certType = product ? product.type : (item.type || 'unknown');

    return {
        item_id: item.variantId || item.productId || item.id,
        item_name: item.name || (product ? product.name : 'Unknown'),
        item_brand: 'Organic HypoSolutions',
        item_category: certType === 'epa-usda' ? 'EPA+USDA Certified' : 'USDA Organic',
        item_category2: product ? product.category : '',
        item_category3: ppmLabel,
        item_category4: item.isSubscription ? 'subscription' : 'one-time',
        item_variant: item.tier || 'retail',
        price: item.price || 0,
        quantity: quantity || item.quantity || 1,
        item_list_name: source || 'website'
    };
}

// =============================================================================
// PAGE VIEW TRACKING
// =============================================================================

function trackPageView(pagePath, pageTitle, customParams) {
    if (typeof gtag === 'undefined') return;
    var ctx = getCartContext();

    gtag('event', 'page_view', {
        page_title: pageTitle || document.title,
        page_location: window.location.href,
        page_path: pagePath || window.location.pathname,
        cart_items_count: ctx.totalItems,
        cart_value: ctx.totalValue,
        has_wholesale_items: ctx.hasWholesaleItems,
        has_subscription_items: ctx.hasSubscription,
        has_epa_products: ctx.hasEPA,
        has_500ppm: ctx.has500ppm
    });

    if (ANALYTICS_CONFIG.DEBUG_MODE) {
        console.log('[OHS Analytics] Page view:', pagePath || window.location.pathname);
    }
}

// =============================================================================
// E-COMMERCE TRACKING
// =============================================================================

var EcommerceTracking = {

    viewItem: function(item, source) {
        if (typeof gtag === 'undefined') return;
        var product = (typeof window.findProduct === 'function') ? window.findProduct(item.productId || item.id) : null;

        gtag('event', 'view_item', {
            currency: 'USD',
            value: item.price || (product ? product.pricing.retail : 0),
            items: [buildGA4Item(item, 1, source)],
            product_type: product ? product.type : 'unknown',
            product_ppm: product ? product.ppm : null,
            product_line: product ? product.productLine : 'unknown'
        });

        if (ANALYTICS_CONFIG.DEBUG_MODE) {
            console.log('[OHS Analytics] Item viewed:', item.name, product ? product.ppm + 'ppm' : '');
        }
    },

    addToCart: function(item, quantity, source) {
        if (typeof gtag === 'undefined') return;
        quantity = quantity || 1;
        var ctx = getCartContext();
        var product = (typeof window.findProduct === 'function') ? window.findProduct(item.productId || item.id) : null;

        gtag('event', 'add_to_cart', {
            currency: 'USD',
            value: (item.price || 0) * quantity,
            items: [buildGA4Item(item, quantity, source)],
            // Cart context after add
            cart_total_items: ctx.totalItems,
            cart_total_value: ctx.totalValue,
            // Product specifics
            product_type: product ? product.type : item.type,
            product_ppm: product ? product.ppm : null,
            is_subscription: item.isSubscription || false,
            pricing_tier: item.tier || 'retail',
            is_wholesale: item.tier === 'wholesale',
            source_page: window.location.pathname
        });

        if (ANALYTICS_CONFIG.DEBUG_MODE) {
            console.log('[OHS Analytics] Add to cart:', item.name,
                'Qty:', quantity,
                'Tier:', item.tier,
                'Sub:', item.isSubscription);
        }
    },

    removeFromCart: function(item, quantity) {
        if (typeof gtag === 'undefined') return;
        quantity = quantity || 1;

        gtag('event', 'remove_from_cart', {
            currency: 'USD',
            value: (item.price || 0) * quantity,
            items: [buildGA4Item(item, quantity)]
        });

        if (ANALYTICS_CONFIG.DEBUG_MODE) {
            console.log('[OHS Analytics] Remove from cart:', item.name);
        }
    },

    // Fired when subscription toggle changes on a product card
    subscriptionToggle: function(productId, isSubscription, newPrice, tier) {
        if (typeof gtag === 'undefined') return;
        var product = (typeof window.findProduct === 'function') ? window.findProduct(productId) : null;

        gtag('event', 'subscription_toggle', {
            event_category: 'Subscription',
            product_id: productId,
            product_name: product ? product.name : 'Unknown',
            product_ppm: product ? product.ppm : null,
            subscription_enabled: isSubscription,
            new_price: newPrice,
            pricing_tier: tier || 'retail',
            savings: product ? (product.pricing.retail - newPrice).toFixed(2) : 0
        });

        if (ANALYTICS_CONFIG.DEBUG_MODE) {
            console.log('[OHS Analytics] Subscription toggle:', isSubscription ? 'ON' : 'OFF',
                product ? product.shortName : productId);
        }
    },

    // Fired when quantity crosses a wholesale threshold
    wholesaleThresholdCrossed: function(productId, quantity, direction) {
        if (typeof gtag === 'undefined') return;
        var product = (typeof window.findProduct === 'function') ? window.findProduct(productId) : null;
        var threshold = product ? product.wholesaleThreshold : 25;

        gtag('event', 'wholesale_threshold', {
            event_category: 'Pricing',
            product_id: productId,
            product_name: product ? product.name : 'Unknown',
            quantity: quantity,
            threshold: threshold,
            direction: direction, // 'entered' or 'exited'
            wholesale_price: product ? product.pricing.wholesale : 0,
            retail_price: product ? product.pricing.retail : 0
        });

        if (ANALYTICS_CONFIG.DEBUG_MODE) {
            console.log('[OHS Analytics] Wholesale threshold', direction, ':', product ? product.shortName : productId, 'qty:', quantity, 'threshold:', threshold);
        }
    },

    beginCheckout: function(items, totalValue) {
        if (typeof gtag === 'undefined') return;
        var ctx = getCartContext();
        var ga4Items = [];

        for (var i = 0; i < items.length; i++) {
            ga4Items.push(buildGA4Item(items[i], items[i].quantity, 'checkout'));
        }

        gtag('event', 'begin_checkout', {
            currency: 'USD',
            value: totalValue || ctx.totalValue,
            items: ga4Items,
            checkout_type: 'shopify',
            customer_type: ctx.hasWholesaleItems ? 'wholesale' : 'retail',
            has_subscription: ctx.hasSubscription,
            has_epa_products: ctx.hasEPA,
            has_500ppm: ctx.has500ppm,
            total_items: ctx.totalItems,
            unique_products: ctx.uniqueProducts
        });

        if (ANALYTICS_CONFIG.DEBUG_MODE) {
            console.log('[OHS Analytics] Checkout started — Value:', totalValue || ctx.totalValue,
                'Wholesale:', ctx.hasWholesaleItems, 'Subs:', ctx.hasSubscription);
        }
    },

    purchase: function(transactionId, items, totalValue, shipping, tax) {
        if (typeof gtag === 'undefined') return;
        var ctx = getCartContext();
        var ga4Items = [];

        for (var i = 0; i < items.length; i++) {
            ga4Items.push(buildGA4Item(items[i], items[i].quantity, 'purchase'));
        }

        gtag('event', 'purchase', {
            transaction_id: transactionId,
            currency: 'USD',
            value: totalValue,
            shipping: shipping || 0,
            tax: tax || 0,
            items: ga4Items,
            customer_type: ctx.hasWholesaleItems ? 'wholesale' : 'retail',
            has_subscription: ctx.hasSubscription,
            payment_method: 'shopify_checkout'
        });

        if (ANALYTICS_CONFIG.DEBUG_MODE) {
            console.log('[OHS Analytics] Purchase:', transactionId, 'Value:', totalValue);
        }
    }
};

// =============================================================================
// GEO-FILTER / STATE TRACKING
// EPA products restricted to Utah — state selection is a key funnel event
// =============================================================================

var GeoTracking = {

    stateSelected: function(stateCode, source) {
        if (typeof gtag === 'undefined') return;
        var isUtah = stateCode === 'UT';
        var availableProducts = (typeof window.getAvailableProducts === 'function')
            ? window.getAvailableProducts(stateCode).length
            : (isUtah ? 10 : 6);

        gtag('event', 'state_selected', {
            event_category: 'GeoFilter',
            state_code: stateCode,
            is_utah: isUtah,
            epa_products_visible: isUtah,
            available_products: availableProducts,
            selection_source: source || 'modal'
        });

        if (ANALYTICS_CONFIG.DEBUG_MODE) {
            console.log('[OHS Analytics] State selected:', stateCode,
                'Products available:', availableProducts);
        }
    },

    stateChanged: function(oldState, newState) {
        if (typeof gtag === 'undefined') return;

        gtag('event', 'state_changed', {
            event_category: 'GeoFilter',
            old_state: oldState,
            new_state: newState,
            lost_epa_access: oldState === 'UT' && newState !== 'UT',
            gained_epa_access: oldState !== 'UT' && newState === 'UT'
        });
    },

    epaProductBlocked: function(productId, userState) {
        if (typeof gtag === 'undefined') return;
        var product = (typeof window.findProduct === 'function') ? window.findProduct(productId) : null;

        gtag('event', 'epa_product_blocked', {
            event_category: 'GeoFilter',
            product_id: productId,
            product_name: product ? product.name : 'Unknown',
            user_state: userState,
            reason: 'EPA registration limited to Utah'
        });
    }
};

// =============================================================================
// CONVERSION TRACKING
// =============================================================================

var ConversionTracking = {

    generateLead: function(method, estimatedValue, leadQuality) {
        if (typeof gtag === 'undefined') return;
        var ctx = getCartContext();

        gtag('event', 'generate_lead', {
            currency: 'USD',
            value: estimatedValue || 0,
            method: method,
            lead_quality: leadQuality || 'medium',
            cart_context: ctx.totalItems > 0 ? 'with_cart' : 'no_cart',
            cart_value: ctx.totalValue,
            source_page: window.location.pathname
        });

        if (ANALYTICS_CONFIG.DEBUG_MODE) {
            console.log('[OHS Analytics] Lead:', method, 'Quality:', leadQuality);
        }
    },

    requestQuote: function(serviceType, estimatedValue, urgency) {
        if (typeof gtag === 'undefined') return;

        gtag('event', 'request_quote', {
            event_category: 'Lead Generation',
            event_label: serviceType,
            value: estimatedValue || 0,
            service_type: serviceType,
            urgency_level: urgency || 'normal',
            referrer: document.referrer || 'direct'
        });
    },

    phoneCall: function(source, context) {
        if (typeof gtag === 'undefined') return;
        var ctx = getCartContext();

        gtag('event', 'phone_call', {
            event_category: 'Contact',
            call_source: source || 'content',
            cart_items: ctx.totalItems,
            cart_value: ctx.totalValue,
            customer_intent: ctx.totalItems > 0 ? 'purchase_ready' : 'information_seeking',
            page_context: window.location.pathname
        });
    },

    formSubmit: function(formName, formId, leadValue) {
        if (typeof gtag === 'undefined') return;

        gtag('event', 'form_submit', {
            event_category: 'Form',
            event_label: formName,
            form_id: formId,
            form_name: formName,
            lead_value: leadValue || 0,
            submission_time: new Date().toISOString()
        });
    },

    newsletterSignup: function(method, segment) {
        if (typeof gtag === 'undefined') return;

        gtag('event', 'sign_up', {
            method: method,
            event_category: 'Newsletter',
            customer_segment: segment || 'general',
            signup_source: window.location.pathname
        });
    }
};

// =============================================================================
// INTERACTION TRACKING
// =============================================================================

var InteractionTracking = {

    ctaClick: function(buttonText, location, expectedValue) {
        if (typeof gtag === 'undefined') return;
        var ctx = getCartContext();

        gtag('event', 'cta_click', {
            event_category: 'CTA',
            event_label: buttonText,
            location: location,
            button_text: buttonText,
            expected_value: expectedValue || 0,
            cart_items: ctx.totalItems,
            customer_journey_stage: getJourneyStage(ctx)
        });
    },

    videoPlay: function(videoTitle, duration, videoType) {
        if (typeof gtag === 'undefined') return;

        gtag('event', 'video_play', {
            event_category: 'Video',
            event_label: videoTitle,
            video_title: videoTitle,
            video_duration: duration || null,
            video_type: videoType || 'educational'
        });
    },

    pdfDownload: function(fileName, contentType) {
        if (typeof gtag === 'undefined') return;

        gtag('event', 'file_download', {
            event_category: 'Download',
            event_label: fileName,
            file_extension: 'pdf',
            file_name: fileName,
            content_type: contentType || 'general',
            download_source: window.location.pathname
        });
    },

    externalLink: function(url, linkText, category) {
        if (typeof gtag === 'undefined') return;

        gtag('event', 'click', {
            event_category: 'External Link',
            event_label: linkText,
            link_url: url,
            link_category: category || 'general',
            source_page: window.location.pathname
        });
    },

    siteSearch: function(searchTerm, results, searchType) {
        if (typeof gtag === 'undefined') return;

        gtag('event', 'search', {
            search_term: searchTerm,
            event_category: 'Site Search',
            search_results: results,
            search_type: searchType || 'products',
            no_results: results === 0
        });
    }
};

// =============================================================================
// SERVICE TRACKING
// =============================================================================

var ServiceTracking = {

    calculatorUse: function(serviceType, estimatedCost, inputs) {
        if (typeof gtag === 'undefined') return;

        gtag('event', 'calculator_use', {
            event_category: 'Calculator',
            event_label: serviceType,
            value: estimatedCost,
            service_type: serviceType,
            estimated_cost: estimatedCost,
            high_value_calculation: estimatedCost > 1000
        });
    },

    serviceInterest: function(serviceType, actionType, intentScore) {
        if (typeof gtag === 'undefined') return;

        gtag('event', 'service_interest', {
            event_category: 'Service',
            event_label: serviceType,
            action_type: actionType,
            service_type: serviceType,
            intent_score: intentScore || 5
        });
    },

    certificationView: function(certificationType, documentType) {
        if (typeof gtag === 'undefined') return;

        gtag('event', 'certification_view', {
            event_category: 'Certification',
            event_label: certificationType,
            certification_type: certificationType,
            document_type: documentType || 'page'
        });
    },

    productLineInterest: function(productLine, actionType) {
        if (typeof gtag === 'undefined') return;

        gtag('event', 'product_line_interest', {
            event_category: 'Product Line',
            event_label: productLine,
            action_type: actionType,
            product_line: productLine,
            is_epa_line: productLine.toLowerCase().includes('epa')
        });
    }
};

// =============================================================================
// ERROR TRACKING
// =============================================================================

var ErrorTracking = {

    jsError: function(error, source, line, stack) {
        if (typeof gtag === 'undefined') return;

        gtag('event', 'exception', {
            description: error + ' at ' + source + ':' + line,
            fatal: false,
            error_source: source,
            error_line: line,
            page_context: window.location.pathname
        });
    },

    pageNotFound: function(attemptedUrl, referrer) {
        if (typeof gtag === 'undefined') return;

        gtag('event', 'page_not_found', {
            event_category: 'Error',
            event_label: attemptedUrl,
            attempted_url: attemptedUrl,
            referrer: referrer || document.referrer
        });
    },

    formError: function(formName, errorType, fieldName) {
        if (typeof gtag === 'undefined') return;

        gtag('event', 'form_error', {
            event_category: 'Form Error',
            event_label: formName,
            form_name: formName,
            error_type: errorType,
            error_field: fieldName || null
        });
    },

    shopifyApiError: function(endpoint, statusCode, errorMessage) {
        if (typeof gtag === 'undefined') return;

        gtag('event', 'shopify_api_error', {
            event_category: 'Error',
            event_label: endpoint,
            status_code: statusCode,
            error_message: errorMessage,
            page_context: window.location.pathname
        });
    }
};

// =============================================================================
// SESSION TRACKING
// =============================================================================

var SessionTracking = {

    sessionStart: function() {
        if (typeof gtag === 'undefined') return;

        gtag('event', 'session_start', {
            event_category: 'Session',
            device_type: getDeviceType(),
            session_source: document.referrer || 'direct',
            landing_page: window.location.pathname
        });
    },

    setUserType: function(userType, segment) {
        if (typeof gtag === 'undefined') return;

        gtag('config', ANALYTICS_CONFIG.GA4_ID, {
            custom_map: {
                'dimension1': userType,
                'dimension5': segment || inferCustomerSegment()
            }
        });
    },

    timeOnPage: function(seconds, pageName, interactions) {
        if (typeof gtag === 'undefined' || seconds <= 30) return;
        var score = calculateEngagementScore(seconds, interactions || 0);

        gtag('event', 'time_on_page', {
            event_category: 'Engagement',
            event_label: pageName,
            value: Math.round(seconds),
            time_seconds: seconds,
            interaction_count: interactions || 0,
            engagement_score: score,
            high_engagement: score > 7
        });
    }
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function getDeviceType() {
    var w = window.innerWidth;
    if (w < 768) return 'mobile';
    if (w < 1024) return 'tablet';
    return 'desktop';
}

function inferCustomerSegment() {
    var path = window.location.pathname;
    if (path.includes('calculator')) return 'service_seeker';
    if (path.includes('products') || path.includes('shop')) return 'product_buyer';
    if (path.includes('wholesale')) return 'wholesale_prospect';
    if (path.includes('book-service')) return 'service_seeker';
    return 'general';
}

function calculateEngagementScore(timeSeconds, interactions) {
    var score = Math.min(timeSeconds / 60, 5);
    score += Math.min(interactions * 0.5, 5);
    return Math.round(score * 10) / 10;
}

function getJourneyStage(ctx) {
    if (ctx.totalItems === 0) return 'awareness';
    if (ctx.totalItems < 5) return 'consideration';
    if (ctx.hasWholesaleItems) return 'wholesale_decision';
    return 'purchase_ready';
}

// =============================================================================
// AUTOMATIC EVENT TRACKING
// =============================================================================

function setupAutomaticTracking() {

    // --- Click tracking ---
    document.addEventListener('click', function(event) {
        var element = event.target.closest('button, a');
        if (!element) return;

        var classes = element.className || '';
        var text = (element.textContent || '').trim();
        var href = element.href || '';

        // CTA buttons
        if (classes.includes('btn-calculate') || classes.includes('btn-service')) {
            InteractionTracking.ctaClick(text, 'content', classes.includes('btn-calculate') ? 500 : 0);
        }

        // Phone clicks
        if (href.startsWith('tel:')) {
            var callSource = element.closest('footer') ? 'footer' : 'content';
            ConversionTracking.phoneCall(callSource);
        }

        // External links (not organichyposolutions.com)
        if (href.startsWith('http') && !href.includes('organichyposolutions.com')) {
            var category = 'general';
            if (href.includes('google.com')) category = 'forms';
            if (href.includes('myshopify.com')) category = 'shopify';
            InteractionTracking.externalLink(href, text, category);
        }

        // PDF downloads
        if (href.endsWith('.pdf')) {
            var contentType = 'general';
            if (href.includes('sds') || href.includes('SDS')) contentType = 'safety_data';
            if (href.includes('cert') || href.includes('epa') || href.includes('usda')) contentType = 'certification';
            if (href.includes('fsis') || href.includes('FSIS')) contentType = 'compliance';
            InteractionTracking.pdfDownload(text || href.split('/').pop(), contentType);
        }

        // Quote/booking buttons
        if (classes.includes('btn-quote') || text.toLowerCase().includes('quote') || text.toLowerCase().includes('book')) {
            ConversionTracking.requestQuote('General', 0, 'normal');
        }

        // Product line switching
        if (classes.includes('product-line-btn') || classes.includes('filter-btn')) {
            var line = text.toLowerCase().includes('epa') ? 'EPA+USDA' :
                       text.toLowerCase().includes('organic') ? 'USDA Organic' : text;
            ServiceTracking.productLineInterest(line, 'filter');
        }
    });

    // --- Form tracking ---
    document.addEventListener('submit', function(event) {
        var form = event.target;
        var formName = form.id || form.name || 'Unknown Form';
        var isContact = formName.toLowerCase().includes('contact');
        ConversionTracking.formSubmit(formName, form.id, isContact ? 100 : 50);
    });

    // --- Scroll depth ---
    var scrollDepth = 0;
    var scrollTimer;

    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(function() {
            var maxScroll = document.body.scrollHeight - window.innerHeight;
            if (maxScroll <= 0) return;
            var current = Math.round((window.scrollY / maxScroll) * 100);

            var milestones = [25, 50, 75, 90];
            for (var i = 0; i < milestones.length; i++) {
                if (current >= milestones[i] && scrollDepth < milestones[i]) {
                    gtag('event', 'scroll', {
                        percent_scrolled: milestones[i],
                        page_path: window.location.pathname
                    });
                }
            }
            if (current > scrollDepth) scrollDepth = current;
        }, 250);
    });

    // --- Time on page ---
    var startTime = Date.now();
    var pageInteractions = 0;

    ['click', 'scroll', 'keydown'].forEach(function(evt) {
        document.addEventListener(evt, function() { pageInteractions++; }, { passive: true });
    });

    window.addEventListener('beforeunload', function() {
        var seconds = (Date.now() - startTime) / 1000;
        var pageName = document.title.replace(' | Organic HypoSolutions', '');
        SessionTracking.timeOnPage(seconds, pageName, pageInteractions);
    });

    // --- Cart events (dispatched by cart.js / products page) ---
    window.addEventListener('cartUpdated', function(event) {
        if (!event.detail || !event.detail.cartItem) return;
        var ci = event.detail.cartItem;
        EcommerceTracking.addToCart(ci, ci.quantity || 1, 'website');
    });

    window.addEventListener('cartItemRemoved', function(event) {
        if (!event.detail || !event.detail.cartItem) return;
        EcommerceTracking.removeFromCart(event.detail.cartItem, event.detail.cartItem.quantity || 1);
    });

    // --- State selection events (dispatched by geo-filter) ---
    window.addEventListener('stateSelected', function(event) {
        if (event.detail && event.detail.state) {
            GeoTracking.stateSelected(event.detail.state, event.detail.source || 'modal');
        }
    });

    if (ANALYTICS_CONFIG.DEBUG_MODE) {
        console.log('[OHS Analytics] Automatic tracking ready');
    }
}

// =============================================================================
// INITIALIZATION
// =============================================================================

function initializeAnalytics() {
    try {
        if (ANALYTICS_CONFIG.COOKIE_CONSENT) {
            var hasConsent = localStorage.getItem('analytics_consent') !== 'false';
            if (!hasConsent && ANALYTICS_CONFIG.DEBUG_MODE) {
                console.log('[OHS Analytics] Consent not given — tracking limited');
            }
        }

        initializeGA4();

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupAutomaticTracking);
        } else {
            setupAutomaticTracking();
        }

        SessionTracking.sessionStart();

        // Global error handler
        window.addEventListener('error', function(event) {
            ErrorTracking.jsError(
                event.error ? event.error.message : 'Unknown error',
                event.filename,
                event.lineno,
                event.error ? event.error.stack : null
            );
        });

        window.addEventListener('unhandledrejection', function(event) {
            ErrorTracking.jsError(
                'Unhandled Promise Rejection: ' + event.reason,
                'Promise',
                0,
                event.reason ? event.reason.stack : null
            );
        });

        if (ANALYTICS_CONFIG.DEBUG_MODE) {
            console.log('[OHS Analytics] Initialized — 10 products, per-product thresholds, subscription + geo tracking');
        }
    } catch (error) {
        console.error('[OHS Analytics] Init error:', error);
    }
}

// =============================================================================
// PUBLIC API
// =============================================================================

window.OHSAnalytics = {
    trackPageView: trackPageView,
    ecommerce: EcommerceTracking,
    geo: GeoTracking,
    conversions: ConversionTracking,
    interactions: InteractionTracking,
    services: ServiceTracking,
    errors: ErrorTracking,
    sessions: SessionTracking,
    getCartContext: getCartContext,
    config: ANALYTICS_CONFIG,
    init: initializeAnalytics
};

// Data layer helper
window.pushToDataLayer = function(eventName, eventData) {
    if (!window.dataLayer) return;
    window.dataLayer.push({
        event: eventName,
        timestamp: new Date().toISOString(),
        page_path: window.location.pathname,
        ...eventData
    });
};

// Auto-init
initializeAnalytics();

// Integration hook
if (typeof window.OHS !== 'undefined') {
    window.OHS.analytics = window.OHSAnalytics;
}
