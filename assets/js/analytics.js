/**
 * Organic HypoSolutions - Analytics & Tracking
 * Comprehensive analytics setup for organichyposolutions.com
 * Google Analytics 4 Implementation with Custom Event Tracking
 */

// Global Analytics Configuration
const ANALYTICS_CONFIG = {
    GA4_ID: 'G-HEKE217WEY',
    DEBUG_MODE: false, // Set to true for development
    COOKIE_CONSENT: true, // GDPR compliance
    SESSION_TIMEOUT: 30 // minutes
};

/**
 * Initialize Google Analytics 4
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
    
    // Configure GA4 with enhanced settings
    gtag('config', ANALYTICS_CONFIG.GA4_ID, {
        // Enhanced E-commerce
        send_page_view: true,
        
        // Privacy settings
        anonymize_ip: true,
        allow_google_signals: true,
        allow_ad_personalization_signals: true,
        
        // Custom parameters
        custom_map: {
            'dimension1': 'user_type',
            'dimension2': 'product_line',
            'dimension3': 'certification_interest'
        },
        
        // Debug mode
        debug_mode: ANALYTICS_CONFIG.DEBUG_MODE
    });

    if (ANALYTICS_CONFIG.DEBUG_MODE) {
        console.log('Google Analytics 4 initialized with ID:', ANALYTICS_CONFIG.GA4_ID);
    }
}

/**
 * Page View Tracking
 */
function trackPageView(pagePath, pageTitle) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
            page_title: pageTitle || document.title,
            page_location: window.location.href,
            page_path: pagePath || window.location.pathname
        });
        
        if (ANALYTICS_CONFIG.DEBUG_MODE) {
            console.log('Page view tracked:', pagePath || window.location.pathname);
        }
    }
}

/**
 * E-commerce Tracking
 */
const EcommerceTracking = {
    // View item
    viewItem: function(item) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'view_item', {
                currency: 'USD',
                value: item.price,
                items: [{
                    item_id: item.id,
                    item_name: item.name,
                    item_category: item.category,
                    price: item.price,
                    quantity: 1
                }]
            });
        }
    },

    // Add to cart
    addToCart: function(item, quantity = 1) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'add_to_cart', {
                currency: 'USD',
                value: item.price * quantity,
                items: [{
                    item_id: item.id,
                    item_name: item.name,
                    item_category: item.category,
                    price: item.price,
                    quantity: quantity
                }]
            });
        }
    },

    // Remove from cart
    removeFromCart: function(item, quantity = 1) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'remove_from_cart', {
                currency: 'USD',
                value: item.price * quantity,
                items: [{
                    item_id: item.id,
                    item_name: item.name,
                    item_category: item.category,
                    price: item.price,
                    quantity: quantity
                }]
            });
        }
    },

    // Begin checkout
    beginCheckout: function(items, totalValue) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'begin_checkout', {
                currency: 'USD',
                value: totalValue,
                items: items
            });
        }
    },

    // Purchase
    purchase: function(transactionId, items, totalValue, shipping = 0, tax = 0) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'purchase', {
                transaction_id: transactionId,
                currency: 'USD',
                value: totalValue,
                shipping: shipping,
                tax: tax,
                items: items
            });
        }
    }
};

/**
 * Conversion Tracking
 */
const ConversionTracking = {
    // Lead generation
    generateLead: function(method, value = 0) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'generate_lead', {
                currency: 'USD',
                value: value,
                method: method
            });
        }
    },

    // Quote requests
    requestQuote: function(serviceType, estimatedValue = 0) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'request_quote', {
                event_category: 'Lead Generation',
                event_label: serviceType,
                value: estimatedValue
            });
        }
    },

    // Phone calls
    phoneCall: function() {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'phone_call', {
                event_category: 'Contact',
                event_label: 'Phone Number Click'
            });
        }
    },

    // Form submissions
    formSubmit: function(formName, formId = null) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
                event_category: 'Form',
                event_label: formName,
                form_id: formId
            });
        }
    },

    // Newsletter signup
    newsletterSignup: function(method) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'sign_up', {
                method: method,
                event_category: 'Newsletter'
            });
        }
    }
};

/**
 * User Interaction Tracking
 */
const InteractionTracking = {
    // CTA button clicks
    ctaClick: function(buttonText, location) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'cta_click', {
                event_category: 'CTA',
                event_label: buttonText,
                location: location
            });
        }
    },

    // Video interactions
    videoPlay: function(videoTitle, duration = null) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'video_play', {
                event_category: 'Video',
                event_label: videoTitle,
                video_duration: duration
            });
        }
    },

    // PDF downloads
    pdfDownload: function(fileName) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'file_download', {
                event_category: 'Download',
                event_label: fileName,
                file_extension: 'pdf'
            });
        }
    },

    // External link clicks
    externalLink: function(url, linkText) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'click', {
                event_category: 'External Link',
                event_label: linkText,
                link_url: url
            });
        }
    },

    // Search functionality
    siteSearch: function(searchTerm, results = null) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'search', {
                search_term: searchTerm,
                event_category: 'Site Search',
                search_results: results
            });
        }
    }
};

/**
 * Service-Specific Tracking
 */
const ServiceTracking = {
    // Calculator usage
    calculatorUse: function(serviceType, estimatedCost) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'calculator_use', {
                event_category: 'Calculator',
                event_label: serviceType,
                value: estimatedCost
            });
        }
    },

    // Service interest
    serviceInterest: function(serviceType, actionType) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'service_interest', {
                event_category: 'Service',
                event_label: serviceType,
                action_type: actionType
            });
        }
    },

    // Certification views
    certificationView: function(certificationType) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'certification_view', {
                event_category: 'Certification',
                event_label: certificationType
            });
        }
    },

    // Product line interest
    productLineInterest: function(productLine, actionType) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'product_line_interest', {
                event_category: 'Product Line',
                event_label: productLine,
                action_type: actionType,
                custom_parameter_product_line: productLine
            });
        }
    }
};

/**
 * Error Tracking
 */
const ErrorTracking = {
    // JavaScript errors
    jsError: function(error, source, line) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', {
                description: `${error} at ${source}:${line}`,
                fatal: false
            });
        }
    },

    // 404 errors
    pageNotFound: function(attemptedUrl) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_not_found', {
                event_category: 'Error',
                event_label: attemptedUrl
            });
        }
    },

    // Form errors
    formError: function(formName, errorType) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_error', {
                event_category: 'Form Error',
                event_label: formName,
                error_type: errorType
            });
        }
    }
};

/**
 * Session and User Tracking
 */
const SessionTracking = {
    // Session start
    sessionStart: function() {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'session_start', {
                event_category: 'Session'
            });
        }
    },

    // User type identification
    setUserType: function(userType) {
        if (typeof gtag !== 'undefined') {
            gtag('config', ANALYTICS_CONFIG.GA4_ID, {
                custom_map: {'dimension1': userType}
            });
        }
    },

    // Time on page (for key pages)
    timeOnPage: function(seconds, pageName) {
        if (typeof gtag !== 'undefined' && seconds > 30) {
            gtag('event', 'time_on_page', {
                event_category: 'Engagement',
                event_label: pageName,
                value: Math.round(seconds)
            });
        }
    }
};

/**
 * Automatic Event Tracking Setup
 */
function setupAutomaticTracking() {
    // Track all CTA button clicks
    document.addEventListener('click', function(event) {
        const element = event.target.closest('button, a');
        if (!element) return;

        const classes = element.className;
        const text = element.textContent.trim();
        const href = element.href;

        // CTA buttons
        if (classes.includes('btn-calculate') || classes.includes('btn-service')) {
            InteractionTracking.ctaClick(text, 'Hero Section');
        }

        // Phone numbers
        if (href && href.startsWith('tel:')) {
            ConversionTracking.phoneCall();
        }

        // External links
        if (href && !href.includes('organichyposolutions.com') && href.startsWith('http')) {
            InteractionTracking.externalLink(href, text);
        }

        // PDF downloads
        if (href && href.endsWith('.pdf')) {
            InteractionTracking.pdfDownload(text);
        }

        // Quote buttons
        if (classes.includes('btn-quote') || text.toLowerCase().includes('quote')) {
            ConversionTracking.requestQuote('General', 0);
        }
    });

    // Track form submissions
    document.addEventListener('submit', function(event) {
        const form = event.target;
        const formName = form.id || form.name || 'Unknown Form';
        ConversionTracking.formSubmit(formName, form.id);
    });

    // Track scroll depth
    let scrollDepth = 0;
    let scrollTimer;
    
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(function() {
            const currentScroll = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            
            if (currentScroll > scrollDepth && currentScroll >= 25) {
                if (currentScroll >= 25 && scrollDepth < 25) {
                    gtag('event', 'scroll', { percent_scrolled: 25 });
                }
                if (currentScroll >= 50 && scrollDepth < 50) {
                    gtag('event', 'scroll', { percent_scrolled: 50 });
                }
                if (currentScroll >= 75 && scrollDepth < 75) {
                    gtag('event', 'scroll', { percent_scrolled: 75 });
                }
                if (currentScroll >= 90 && scrollDepth < 90) {
                    gtag('event', 'scroll', { percent_scrolled: 90 });
                }
                scrollDepth = currentScroll;
            }
        }, 250);
    });

    // Track time on page for key pages
    const startTime = Date.now();
    window.addEventListener('beforeunload', function() {
        const timeSpent = (Date.now() - startTime) / 1000;
        const pageName = document.title.replace(' - Organic HypoSolutions', '');
        SessionTracking.timeOnPage(timeSpent, pageName);
    });
}

/**
 * Initialize Analytics
 */
function initializeAnalytics() {
    try {
        // Check for cookie consent (basic implementation)
        if (ANALYTICS_CONFIG.COOKIE_CONSENT) {
            // You can add cookie consent check here
            // For now, we'll assume consent is given
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

        // Setup error tracking
        window.addEventListener('error', function(event) {
            ErrorTracking.jsError(event.error?.message || 'Unknown error', event.filename, event.lineno);
        });

        if (ANALYTICS_CONFIG.DEBUG_MODE) {
            console.log('OHS Analytics initialized successfully');
        }

    } catch (error) {
        console.error('Analytics initialization error:', error);
    }
}

/**
 * Public API - Global functions for manual tracking
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
    
    // Manual initialization (if needed)
    init: initializeAnalytics
};

// Auto-initialize when script loads
initializeAnalytics();

/**
 * Enhanced E-commerce Data Layer Helper
 */
window.pushToDataLayer = function(eventName, eventData) {
    if (window.dataLayer) {
        window.dataLayer.push({
            event: eventName,
            ...eventData
        });
        
        if (ANALYTICS_CONFIG.DEBUG_MODE) {
            console.log('Data Layer Push:', eventName, eventData);
        }
    }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.OHSAnalytics;
}
