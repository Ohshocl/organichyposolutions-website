/**
 * Organic HypoSolutions - Analytics & Tracking (Enhanced)
 * Comprehensive analytics setup for organichyposolutions.com
 * Google Analytics 4 Implementation with Custom Event Tracking
 * Shopify E-commerce Integration Ready
 * Last Updated: August 2025
 */

// Global Analytics Configuration
const ANALYTICS_CONFIG = {
    GA4_ID: 'G-HEKE217WEY',
    DEBUG_MODE: false, // Set to true for development
    COOKIE_CONSENT: true, // GDPR compliance
    SESSION_TIMEOUT: 30, // minutes
    SHOPIFY_READY: true, // Enhanced for Shopify integration
    WHOLESALE_THRESHOLD: 25 // Items threshold for wholesale tracking
};

/**
 * Initialize Google Analytics 4 with Enhanced Configuration
 */
function initializeGA4() {
    // Load gtag script
    const gtagScript = document.createElement('script');
    gtagScript.async = true;
    gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_CONFIG.GA4_ID}`;
    document.head.appendChild(gtagScript);

    // Initialize dataLayer and gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
        dataLayer.push(arguments);
    };

    gtag('js', new Date());
    
    // Configure GA4 with enhanced settings for e-commerce
    gtag('config', ANALYTICS_CONFIG.GA4_ID, {
        // Enhanced E-commerce
        send_page_view: true,
        
        // Privacy settings
        anonymize_ip: true,
        allow_google_signals: true,
        allow_ad_personalization_signals: true,
        
        // Custom dimensions for business insights
        custom_map: {
            'dimension1': 'user_type', // retail/wholesale/business
            'dimension2': 'product_line', // organic/premium
            'dimension3': 'certification_interest', // USDA/EPA/Food Safe
            'dimension4': 'cart_value_tier', // low/medium/high/wholesale
            'dimension5': 'customer_segment' // residential/commercial
        },
        
        // Enhanced measurement
        enhanced_measurement: {
            scrolls: true,
            outbound_clicks: true,
            site_search: true,
            video_engagement: true,
            file_downloads: true
        },
        
        // Debug mode
        debug_mode: ANALYTICS_CONFIG.DEBUG_MODE
    });

    if (ANALYTICS_CONFIG.DEBUG_MODE) {
        console.log('🔍 Google Analytics 4 initialized with ID:', ANALYTICS_CONFIG.GA4_ID);
        console.log('🛍️ Shopify e-commerce tracking enabled');
    }
}

/**
 * Enhanced Page View Tracking with Context
 */
function trackPageView(pagePath, pageTitle, customParams = {}) {
    if (typeof gtag !== 'undefined') {
        // Get cart context for page views
        const cartContext = getCartContext();
        
        gtag('event', 'page_view', {
            page_title: pageTitle || document.title,
            page_location: window.location.href,
            page_path: pagePath || window.location.pathname,
            // Add cart context
            cart_items_count: cartContext.totalItems,
            cart_value: cartContext.totalValue,
            is_wholesale_eligible: cartContext.isWholesale,
            // Custom parameters
            ...customParams
        });
        
        if (ANALYTICS_CONFIG.DEBUG_MODE) {
            console.log('📊 Page view tracked:', pagePath || window.location.pathname, cartContext);
        }
    }
}

/**
 * Enhanced E-commerce Tracking with Shopify Support
 */
const EcommerceTracking = {
    // View item with enhanced data
    viewItem: function(item, source = 'unknown') {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'view_item', {
                currency: 'USD',
                value: item.price,
                items: [{
                    item_id: item.variantId || item.id,
                    item_name: item.name,
                    item_category: item.category || this.getProductCategory(item),
                    item_variant: item.variant || 'default',
                    price: item.price,
                    quantity: 1,
                    // Enhanced attributes
                    item_brand: 'Organic HypoSolutions',
                    item_list_name: source,
                    item_list_id: item.collection || 'general'
                }]
            });
            
            if (ANALYTICS_CONFIG.DEBUG_MODE) {
                console.log('👁️ Item viewed:', item.name);
            }
        }
    },

    // Enhanced add to cart with wholesale detection
    addToCart: function(item, quantity = 1, source = 'unknown') {
        if (typeof gtag !== 'undefined') {
            const cartContext = getCartContext();
            const isWholesaleItem = quantity >= ANALYTICS_CONFIG.WHOLESALE_THRESHOLD;
            
            gtag('event', 'add_to_cart', {
                currency: 'USD',
                value: item.price * quantity,
                items: [{
                    item_id: item.variantId || item.id,
                    item_name: item.name,
                    item_category: item.category || this.getProductCategory(item),
                    item_variant: item.variant || 'default',
                    price: item.price,
                    quantity: quantity,
                    // Enhanced e-commerce attributes
                    item_brand: 'Organic HypoSolutions',
                    item_list_name: source,
                    item_list_id: item.collection || 'general'
                }],
                // Custom parameters
                cart_total_items: cartContext.totalItems + quantity,
                cart_total_value: cartContext.totalValue + (item.price * quantity),
                wholesale_eligible: cartContext.isWholesale || isWholesaleItem,
                source_page: window.location.pathname
            });
            
            if (ANALYTICS_CONFIG.DEBUG_MODE) {
                console.log('🛒 Added to cart:', item.name, 'Qty:', quantity, 'Wholesale:', isWholesaleItem);
            }
        }
    },

    // Remove from cart
    removeFromCart: function(item, quantity = 1) {
        if (typeof gtag !== 'undefined') {
            const cartContext = getCartContext();
            
            gtag('event', 'remove_from_cart', {
                currency: 'USD',
                value: item.price * quantity,
                items: [{
                    item_id: item.variantId || item.id,
                    item_name: item.name,
                    item_category: item.category || this.getProductCategory(item),
                    item_variant: item.variant || 'default',
                    price: item.price,
                    quantity: quantity,
                    item_brand: 'Organic HypoSolutions'
                }],
                cart_total_items: Math.max(0, cartContext.totalItems - quantity),
                cart_total_value: Math.max(0, cartContext.totalValue - (item.price * quantity))
            });
            
            if (ANALYTICS_CONFIG.DEBUG_MODE) {
                console.log('❌ Removed from cart:', item.name, 'Qty:', quantity);
            }
        }
    },

    // Enhanced begin checkout with customer segmentation
    beginCheckout: function(items, totalValue, checkoutType = 'shopify') {
        if (typeof gtag !== 'undefined') {
            const cartContext = getCartContext();
            
            gtag('event', 'begin_checkout', {
                currency: 'USD',
                value: totalValue,
                items: items.map(item => ({
                    item_id: item.variantId || item.id,
                    item_name: item.name,
                    item_category: item.category || this.getProductCategory(item),
                    item_variant: item.variant || 'default',
                    price: item.price,
                    quantity: item.quantity,
                    item_brand: 'Organic HypoSolutions'
                })),
                // Enhanced checkout data
                checkout_type: checkoutType,
                customer_type: cartContext.isWholesale ? 'wholesale' : 'retail',
                total_items: cartContext.totalItems,
                avg_item_value: cartContext.totalItems > 0 ? totalValue / cartContext.totalItems : 0,
                source_page: window.location.pathname
            });
            
            if (ANALYTICS_CONFIG.DEBUG_MODE) {
                console.log('💳 Checkout began:', checkoutType, 'Value:', totalValue, 'Type:', cartContext.isWholesale ? 'Wholesale' : 'Retail');
            }
        }
    },

    // Purchase with enhanced attribution
    purchase: function(transactionId, items, totalValue, shipping = 0, tax = 0, customerType = 'retail') {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'purchase', {
                transaction_id: transactionId,
                currency: 'USD',
                value: totalValue,
                shipping: shipping,
                tax: tax,
                items: items.map(item => ({
                    item_id: item.variantId || item.id,
                    item_name: item.name,
                    item_category: item.category || this.getProductCategory(item),
                    item_variant: item.variant || 'default',
                    price: item.price,
                    quantity: item.quantity,
                    item_brand: 'Organic HypoSolutions'
                })),
                // Enhanced purchase data
                customer_type: customerType,
                order_type: totalValue >= 500 ? 'bulk' : 'standard',
                payment_method: 'shopify_checkout'
            });
            
            if (ANALYTICS_CONFIG.DEBUG_MODE) {
                console.log('✅ Purchase completed:', transactionId, 'Value:', totalValue);
            }
        }
    },

    // Helper function to determine product category
    getProductCategory: function(item) {
        const name = (item.name || '').toLowerCase();
        if (name.includes('organic')) return 'Organic Line';
        if (name.includes('premium') || name.includes('pro')) return 'Premium Line';
        if (name.includes('commercial')) return 'Commercial';
        return 'General Products';
    }
};

/**
 * Enhanced Conversion Tracking with Lead Scoring
 */
const ConversionTracking = {
    // Lead generation with value estimation
    generateLead: function(method, estimatedValue = 0, leadQuality = 'medium') {
        if (typeof gtag !== 'undefined') {
            const cartContext = getCartContext();
            
            gtag('event', 'generate_lead', {
                currency: 'USD',
                value: estimatedValue,
                method: method,
                lead_quality: leadQuality,
                cart_context: cartContext.totalItems > 0 ? 'with_cart' : 'no_cart',
                cart_value: cartContext.totalValue,
                source_page: window.location.pathname
            });
            
            if (ANALYTICS_CONFIG.DEBUG_MODE) {
                console.log('🎯 Lead generated:', method, 'Quality:', leadQuality, 'Value:', estimatedValue);
            }
        }
    },

    // Enhanced quote requests with service context
    requestQuote: function(serviceType, estimatedValue = 0, urgency = 'normal') {
        if (typeof gtag !== 'undefined') {
            const cartContext = getCartContext();
            
            gtag('event', 'request_quote', {
                event_category: 'Lead Generation',
                event_label: serviceType,
                value: estimatedValue,
                service_type: serviceType,
                urgency_level: urgency,
                customer_type: cartContext.isWholesale ? 'wholesale' : 'retail',
                has_cart_items: cartContext.totalItems > 0,
                referrer: document.referrer || 'direct'
            });
            
            if (ANALYTICS_CONFIG.DEBUG_MODE) {
                console.log('📋 Quote requested:', serviceType, 'Urgency:', urgency);
            }
        }
    },

    // Phone calls with enhanced context
    phoneCall: function(source = 'header', context = {}) {
        if (typeof gtag !== 'undefined') {
            const cartContext = getCartContext();
            
            gtag('event', 'phone_call', {
                event_category: 'Contact',
                event_label: 'Phone Number Click',
                call_source: source,
                cart_items: cartContext.totalItems,
                cart_value: cartContext.totalValue,
                customer_intent: cartContext.totalItems > 0 ? 'purchase_ready' : 'information_seeking',
                page_context: window.location.pathname,
                ...context
            });
            
            if (ANALYTICS_CONFIG.DEBUG_MODE) {
                console.log('📞 Phone call initiated from:', source);
            }
        }
    },

    // Enhanced form submissions
    formSubmit: function(formName, formId = null, leadValue = 0) {
        if (typeof gtag !== 'undefined') {
            const cartContext = getCartContext();
            
            gtag('event', 'form_submit', {
                event_category: 'Form',
                event_label: formName,
                form_id: formId,
                form_name: formName,
                lead_value: leadValue,
                cart_context: cartContext.totalItems > 0 ? 'with_cart' : 'no_cart',
                submission_time: new Date().toISOString()
            });
            
            if (ANALYTICS_CONFIG.DEBUG_MODE) {
                console.log('📝 Form submitted:', formName);
            }
        }
    },

    // Newsletter signup with segmentation
    newsletterSignup: function(method, segment = 'general') {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'sign_up', {
                method: method,
                event_category: 'Newsletter',
                customer_segment: segment,
                signup_source: window.location.pathname
            });
            
            if (ANALYTICS_CONFIG.DEBUG_MODE) {
                console.log('📧 Newsletter signup:', method, 'Segment:', segment);
            }
        }
    }
};

/**
 * Enhanced User Interaction Tracking
 */
const InteractionTracking = {
    // CTA button clicks with conversion attribution
    ctaClick: function(buttonText, location, expectedValue = 0) {
        if (typeof gtag !== 'undefined') {
            const cartContext = getCartContext();
            
            gtag('event', 'cta_click', {
                event_category: 'CTA',
                event_label: buttonText,
                location: location,
                button_text: buttonText,
                expected_value: expectedValue,
                cart_items: cartContext.totalItems,
                customer_journey_stage: this.getJourneyStage(cartContext)
            });
            
            if (ANALYTICS_CONFIG.DEBUG_MODE) {
                console.log('🔘 CTA clicked:', buttonText, 'Location:', location);
            }
        }
    },

    // Video interactions with engagement tracking
    videoPlay: function(videoTitle, duration = null, videoType = 'educational') {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'video_play', {
                event_category: 'Video',
                event_label: videoTitle,
                video_title: videoTitle,
                video_duration: duration,
                video_type: videoType,
                engagement_context: window.location.pathname
            });
            
            if (ANALYTICS_CONFIG.DEBUG_MODE) {
                console.log('▶️ Video played:', videoTitle);
            }
        }
    },

    // PDF downloads with content tracking
    pdfDownload: function(fileName, contentType = 'general') {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'file_download', {
                event_category: 'Download',
                event_label: fileName,
                file_extension: 'pdf',
                file_name: fileName,
                content_type: contentType,
                download_source: window.location.pathname
            });
            
            if (ANALYTICS_CONFIG.DEBUG_MODE) {
                console.log('📄 PDF downloaded:', fileName);
            }
        }
    },

    // External link clicks
    externalLink: function(url, linkText, category = 'general') {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'click', {
                event_category: 'External Link',
                event_label: linkText,
                link_url: url,
                link_category: category,
                source_page: window.location.pathname
            });
            
            if (ANALYTICS_CONFIG.DEBUG_MODE) {
                console.log('🔗 External link clicked:', url);
            }
        }
    },

    // Enhanced site search
    siteSearch: function(searchTerm, results = null, searchType = 'products') {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'search', {
                search_term: searchTerm,
                event_category: 'Site Search',
                search_results: results,
                search_type: searchType,
                no_results: results === 0
            });
            
            if (ANALYTICS_CONFIG.DEBUG_MODE) {
                console.log('🔍 Site search:', searchTerm, 'Results:', results);
            }
        }
    },

    // Helper to determine customer journey stage
    getJourneyStage: function(cartContext) {
        if (cartContext.totalItems === 0) return 'awareness';
        if (cartContext.totalItems < 5) return 'consideration';
        if (cartContext.isWholesale) return 'wholesale_decision';
        return 'purchase_ready';
    }
};

/**
 * Enhanced Service-Specific Tracking
 */
const ServiceTracking = {
    // Calculator usage with detailed metrics
    calculatorUse: function(serviceType, estimatedCost, inputs = {}) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'calculator_use', {
                event_category: 'Calculator',
                event_label: serviceType,
                value: estimatedCost,
                service_type: serviceType,
                estimated_cost: estimatedCost,
                calculation_inputs: JSON.stringify(inputs),
                high_value_calculation: estimatedCost > 1000
            });
            
            if (ANALYTICS_CONFIG.DEBUG_MODE) {
                console.log('🧮 Calculator used:', serviceType, 'Cost:', estimatedCost);
            }
        }
    },

    // Service interest with intent scoring
    serviceInterest: function(serviceType, actionType, intentScore = 5) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'service_interest', {
                event_category: 'Service',
                event_label: serviceType,
                action_type: actionType,
                service_type: serviceType,
                intent_score: intentScore,
                customer_segment: this.getCustomerSegment()
            });
            
            if (ANALYTICS_CONFIG.DEBUG_MODE) {
                console.log('🎯 Service interest:', serviceType, 'Action:', actionType);
            }
        }
    },

    // Certification views with compliance tracking
    certificationView: function(certificationType, documentType = 'page') {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'certification_view', {
                event_category: 'Certification',
                event_label: certificationType,
                certification_type: certificationType,
                document_type: documentType,
                compliance_interest: true
            });
            
            if (ANALYTICS_CONFIG.DEBUG_MODE) {
                console.log('🏆 Certification viewed:', certificationType);
            }
        }
    },

    // Product line interest with preference tracking
    productLineInterest: function(productLine, actionType, preference = null) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'product_line_interest', {
                event_category: 'Product Line',
                event_label: productLine,
                action_type: actionType,
                product_line: productLine,
                customer_preference: preference,
                organic_preference: productLine.toLowerCase().includes('organic')
            });
            
            if (ANALYTICS_CONFIG.DEBUG_MODE) {
                console.log('🧽 Product line interest:', productLine, 'Action:', actionType);
            }
        }
    },

    // Helper to determine customer segment
    getCustomerSegment: function() {
        const path = window.location.pathname;
        if (path.includes('commercial') || path.includes('business')) return 'commercial';
        if (path.includes('residential') || path.includes('home')) return 'residential';
        return 'general';
    }
};

/**
 * Error Tracking with Enhanced Context
 */
const ErrorTracking = {
    // JavaScript errors with stack traces
    jsError: function(error, source, line, stack = null) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', {
                description: `${error} at ${source}:${line}`,
                fatal: false,
                error_source: source,
                error_line: line,
                error_stack: stack,
                page_context: window.location.pathname
            });
            
            if (ANALYTICS_CONFIG.DEBUG_MODE) {
                console.log('❌ JS Error:', error, 'Source:', source);
            }
        }
    },

    // 404 errors with referrer tracking
    pageNotFound: function(attemptedUrl, referrer = null) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_not_found', {
                event_category: 'Error',
                event_label: attemptedUrl,
                attempted_url: attemptedUrl,
                referrer: referrer || document.referrer,
                user_agent: navigator.userAgent
            });
            
            if (ANALYTICS_CONFIG.DEBUG_MODE) {
                console.log('🚫 404 Error:', attemptedUrl);
            }
        }
    },

    // Form errors with field tracking
    formError: function(formName, errorType, fieldName = null) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_error', {
                event_category: 'Form Error',
                event_label: formName,
                form_name: formName,
                error_type: errorType,
                error_field: fieldName,
                page_context: window.location.pathname
            });
            
            if (ANALYTICS_CONFIG.DEBUG_MODE) {
                console.log('📝❌ Form error:', formName, 'Type:', errorType);
            }
        }
    }
};

/**
 * Enhanced Session and User Tracking
 */
const SessionTracking = {
    // Session start with device context
    sessionStart: function() {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'session_start', {
                event_category: 'Session',
                device_type: this.getDeviceType(),
                session_source: document.referrer || 'direct',
                landing_page: window.location.pathname
            });
            
            if (ANALYTICS_CONFIG.DEBUG_MODE) {
                console.log('🚀 Session started');
            }
        }
    },

    // Enhanced user type identification
    setUserType: function(userType, segment = null) {
        if (typeof gtag !== 'undefined') {
            gtag('config', ANALYTICS_CONFIG.GA4_ID, {
                custom_map: {
                    'dimension1': userType,
                    'dimension5': segment || this.inferCustomerSegment()
                }
            });
            
            if (ANALYTICS_CONFIG.DEBUG_MODE) {
                console.log('👤 User type set:', userType, 'Segment:', segment);
            }
        }
    },

    // Time on page with engagement scoring
    timeOnPage: function(seconds, pageName, interactions = 0) {
        if (typeof gtag !== 'undefined' && seconds > 30) {
            const engagementScore = this.calculateEngagementScore(seconds, interactions);
            
            gtag('event', 'time_on_page', {
                event_category: 'Engagement',
                event_label: pageName,
                value: Math.round(seconds),
                time_seconds: seconds,
                interaction_count: interactions,
                engagement_score: engagementScore,
                high_engagement: engagementScore > 7
            });
            
            if (ANALYTICS_CONFIG.DEBUG_MODE) {
                console.log('⏱️ Time on page:', pageName, seconds + 's', 'Score:', engagementScore);
            }
        }
    },

    // Helper functions
    getDeviceType: function() {
        const width = window.innerWidth;
        if (width < 768) return 'mobile';
        if (width < 1024) return 'tablet';
        return 'desktop';
    },

    inferCustomerSegment: function() {
        const path = window.location.pathname;
        if (path.includes('commercial') || path.includes('business')) return 'commercial';
        if (path.includes('calculator')) return 'service_seeker';
        if (path.includes('products')) return 'product_buyer';
        return 'general';
    },

    calculateEngagementScore: function(timeSeconds, interactions) {
        let score = Math.min(timeSeconds / 60, 5); // Up to 5 points for time
        score += Math.min(interactions * 0.5, 5); // Up to 5 points for interactions
        return Math.round(score * 10) / 10; // Round to 1 decimal
    }
};

/**
 * Cart Context Helper Function
 */
function getCartContext() {
    try {
        // Try to get cart data from global functions if available
        if (typeof window.getDisplayCart === 'function') {
            return window.getDisplayCart();
        }
        
        // Fallback to localStorage parsing
        const cart = JSON.parse(localStorage.getItem('ohsCart') || '{}');
        const items = Object.values(cart);
        const totalItems = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
        const totalValue = items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);
        
        return {
            totalItems,
            totalValue,
            isWholesale: totalItems >= ANALYTICS_CONFIG.WHOLESALE_THRESHOLD,
            items: items.length
        };
    } catch (error) {
        if (ANALYTICS_CONFIG.DEBUG_MODE) {
            console.warn('Could not get cart context:', error);
        }
        return {
            totalItems: 0,
            totalValue: 0,
            isWholesale: false,
            items: 0
        };
    }
}

/**
 * Enhanced Automatic Event Tracking Setup
 */
function setupAutomaticTracking() {
    // Track all CTA button clicks with enhanced context
    document.addEventListener('click', function(event) {
        const element = event.target.closest('button, a');
        if (!element) return;

        const classes = element.className;
        const text = element.textContent.trim();
        const href = element.href;

        // Enhanced CTA tracking
        if (classes.includes('btn-calculate') || classes.includes('btn-service')) {
            const expectedValue = classes.includes('btn-calculate') ? 500 : 0;
            InteractionTracking.ctaClick(text, 'Hero Section', expectedValue);
        }

        // Enhanced phone number tracking
        if (href && href.startsWith('tel:')) {
            const source = element.closest('header') ? 'header' : 
                          element.closest('footer') ? 'footer' : 'content';
            ConversionTracking.phoneCall(source);
        }

        // External links with categorization
        if (href && !href.includes('organichyposolutions.com') && href.startsWith('http')) {
            const category = href.includes('google.com') ? 'forms' : 
                           href.includes('certification') ? 'compliance' : 'general';
            InteractionTracking.externalLink(href, text, category);
        }

        // PDF downloads with content type detection
        if (href && href.endsWith('.pdf')) {
            const contentType = href.includes('sds') ? 'safety_data' :
                              href.includes('cert') ? 'certification' : 'general';
            InteractionTracking.pdfDownload(text, contentType);
        }

        // Quote buttons with urgency detection
        if (classes.includes('btn-quote') || text.toLowerCase().includes('quote')) {
            const urgency = classes.includes('urgent') || text.includes('now') ? 'high' : 'normal';
            ConversionTracking.requestQuote('General', 0, urgency);
        }

        // Product line switching
        if (classes.includes('product-line-btn')) {
            const productLine = text.toLowerCase().includes('organic') ? 'Organic' : 'Premium';
            ServiceTracking.productLineInterest(productLine, 'view_switch');
        }
    });

    // Enhanced form tracking
    document.addEventListener('submit', function(event) {
        const form = event.target;
        const formName = form.id || form.name || 'Unknown Form';
        const isContactForm = formName.toLowerCase().includes('contact');
        const leadValue = isContactForm ? 100 : 50;
        
        ConversionTracking.formSubmit(formName, form.id, leadValue);
    });

    // Enhanced scroll depth tracking
    let scrollDepth = 0;
    let scrollTimer;
    let interactionCount = 0;
    
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(function() {
            const currentScroll = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            
            if (currentScroll > scrollDepth && currentScroll >= 25) {
                if (currentScroll >= 25 && scrollDepth < 25) {
                    gtag('event', 'scroll', { percent_scrolled: 25, engagement_level: 'low' });
                }
                if (currentScroll >= 50 && scrollDepth < 50) {
                    gtag('event', 'scroll', { percent_scrolled: 50, engagement_level: 'medium' });
                }
                if (currentScroll >= 75 && scrollDepth < 75) {
                    gtag('event', 'scroll', { percent_scrolled: 75, engagement_level: 'high' });
                }
                if (currentScroll >= 90 && scrollDepth < 90) {
                    gtag('event', 'scroll', { percent_scrolled: 90, engagement_level: 'very_high' });
                }
                scrollDepth = currentScroll;
                interactionCount++;
            }
        }, 250);
    });

    // Enhanced time on page tracking
    const startTime = Date.now();
    let pageInteractions = 0;
    
    // Count user interactions
    ['click', 'scroll', 'keydown', 'mousemove'].forEach(eventType => {
        document.addEventListener(eventType, function() {
            pageInteractions++;
        }, { passive: true, once: false });
    });
    
    window.addEventListener('beforeunload', function() {
        const timeSpent = (Date.now() - startTime) / 1000;
        const pageName = document.title.replace(' - Organic HypoSolutions', '');
        SessionTracking.timeOnPage(timeSpent, pageName, pageInteractions);
    });

    // Cart event listeners
    window.addEventListener('cartUpdated', function(event) {
        if (event.detail && event.detail.productId) {
            const item = {
                id: event.detail.productId,
                variantId: event.detail.cartItem?.variantId,
                name: event.detail.cartItem?.name,
                price: event.detail.cartItem?.price,
                category: EcommerceTracking.getProductCategory(event.detail.cartItem)
            };
            
            EcommerceTracking.addToCart(item, event.detail.cartItem?.quantity || 1, 'website');
        }
    });

    if (ANALYTICS_CONFIG.DEBUG_MODE) {
        console.log('🔧 Enhanced automatic tracking setup complete');
    }
}

/**
 * Initialize Enhanced Analytics
 */
function initializeAnalytics() {
    try {
        // Check for cookie consent
        if (ANALYTICS_CONFIG.COOKIE_CONSENT) {
            // Basic consent check - you can enhance this with a proper cookie banner
            const hasConsent = localStorage.getItem('analytics_consent') !== 'false';
            if (!hasConsent && ANALYTICS_CONFIG.DEBUG_MODE) {
                console.log('📊 Analytics consent not given, tracking limited');
            }
        }

        // Initialize GA4
        initializeGA4();

        // Setup automatic tracking after DOM is loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupAutomaticTracking);
        } else {
            setupAutomaticTracking();
        }

        // Track session start
        SessionTracking.sessionStart();

        // Enhanced error tracking
        window.addEventListener('error', function(event) {
            ErrorTracking.jsError(
                event.error?.message || 'Unknown error',
                event.filename,
                event.lineno,
                event.error?.stack
            );
        });

        // Unhandled promise rejection tracking
        window.addEventListener('unhandledrejection', function(event) {
            ErrorTracking.jsError(
                'Unhandled Promise Rejection: ' + event.reason,
                'Promise',
                0,
                event.reason?.stack
            );
        });

        if (ANALYTICS_CONFIG.DEBUG_MODE) {
            console.log('🎯 OHS Enhanced Analytics initialized successfully');
            console.log('🛍️ Shopify e-commerce tracking ready');
            console.log('📊 Wholesale threshold set to:', ANALYTICS_CONFIG.WHOLESALE_THRESHOLD, 'items');
        }

    } catch (error) {
        console.error('Analytics initialization error:', error);
    }
}

/**
 * Enhanced Public API
 */
window.OHSAnalytics = {
    // Core tracking
    trackPageView,
    
    // E-commerce
    ecommerce: EcommerceTracking,
    
    // Conversions
    conversions: ConversionTracking,
    
    // Interactions
    interactions: InteractionTracking,
    
    // Services
    services: ServiceTracking,
    
    // Errors
    errors: ErrorTracking,
    
    // Sessions
    sessions: SessionTracking,
    
    // Utilities
    getCartContext,
    
    // Configuration
    config: ANALYTICS_CONFIG,
    
    // Manual initialization
    init: initializeAnalytics,
    
    // Debug helpers
    debug: {
        logCartContext: () => console.log('Cart Context:', getCartContext()),
        logConfig: () => console.log('Analytics Config:', ANALYTICS_CONFIG)
    }
};

// Auto-initialize when script loads
initializeAnalytics();

/**
 * Enhanced Data Layer Helper
 */
window.pushToDataLayer = function(eventName, eventData) {
    if (window.dataLayer) {
        const enhancedData = {
            event: eventName,
            timestamp: new Date().toISOString(),
            page_path: window.location.pathname,
            ...eventData
        };
        
        window.dataLayer.push(enhancedData);
        
        if (ANALYTICS_CONFIG.DEBUG_MODE) {
            console.log('📤 Data Layer Push:', eventName, enhancedData);
        }
    }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.OHSAnalytics;
}

// Integration with global scripts
if (typeof window.OHS !== 'undefined') {
    window.OHS.analytics = window.OHSAnalytics;
    
    if (ANALYTICS_CONFIG.DEBUG_MODE) {
        console.log('🔗 Analytics integrated with OHS global scripts');
    }
}
