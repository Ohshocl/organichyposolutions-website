/**
 * OHS Global Scripts
 * File: assets/js/global-scripts.js
 * Dependencies: Bootstrap 5.3.0, Font Awesome 6.0.0, product-catalog.js
 *
 * RESPONSIBILITIES:
 *  - Nav/footer dynamic loader
 *  - Cart badge (ohsCart array format only)
 *  - Smooth scrolling, mobile menu, scroll animations
 *  - Banner management
 *  - showNotification() fallback (cart.js overrides on pages that load it)
 *  - Service booking helpers
 *  - Form UX enhancements
 *  - Utility functions (debounce, throttle, isInViewport)
 *
 * CART FORMAT (enforced everywhere):
 *  localStorage key: 'ohsCart'
 *  value: Array of { productId, variantId, name, price, quantity,
 *                    sku, tier, type, isSubscription, image }
 *
 * NOTIFICATION SYSTEM:
 *  This file defines a lightweight showNotification() fallback.
 *  shop/js/cart.js defines a richer version and overwrites window.showNotification.
 *  On pages that load cart.js, cart.js's version wins automatically.
 *  On pages that don't load cart.js, the fallback here provides toast alerts.
 *
 * CART WRITES:
 *  addItemToCart() here writes directly to localStorage.
 *  It is ONLY for pages that do NOT load cart.js (e.g. homepage quick-add).
 *  On any page that loads cart.js, use window.addToCart() instead —
 *  cart.js maintains an internal array that stays in sync with localStorage.
 *
 * Last Updated: March 8, 2026
 */

console.log('🚀 OHS Global Scripts Loading...');

// ==========================================================================
// CONSTANTS
// ==========================================================================

const CART_KEY         = 'ohsCart';
const ANIMATION_CONFIG = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };

// ==========================================================================
// NAV / FOOTER DYNAMIC LOADER
// Reads #nav-placeholder and #footer-placeholder on every page,
// fetches templates/standard-nav.html and templates/standard-footer.html,
// rewrites absolute paths for subdirectory pages, sets active nav state.
// ==========================================================================

(function loadTemplates() {
    'use strict';

    // Determine how many directory levels deep this page is.
    // e.g. /shop/cart.html → depth 1 → basePath = '../'
    const pathParts   = window.location.pathname.split('/').filter(p => p && !p.includes('.'));
    const basePath    = pathParts.length > 0 ? '../'.repeat(pathParts.length) : '';
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'index';

    function loadTemplate(placeholderId, templateFile) {
        const el = document.getElementById(placeholderId);
        if (!el) return;

        fetch(basePath + 'templates/' + templateFile)
            .then(r => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                return r.text();
            })
            .then(html => {
                // Rewrite root-relative paths so they resolve correctly from subdirs
                if (basePath) {
                    html = html.replace(/href="\//g,   'href="'   + basePath);
                    html = html.replace(/src="\//g,    'src="'    + basePath);
                    html = html.replace(/action="\//g, 'action="' + basePath);
                }

                el.innerHTML = html;

                // Mark the current page's nav link as active
                const activeLink = el.querySelector(`[data-page="${currentPage}"]`);
                if (activeLink) activeLink.classList.add('active', 'fw-semibold');

                // Update cart badge now that the badge element exists in the DOM
                updateCartBadge();
            })
            .catch(err => console.warn(`Template load failed (${templateFile}):`, err));
    }

    loadTemplate('nav-placeholder',    'standard-nav.html');
    loadTemplate('footer-placeholder', 'standard-footer.html');
})();

// ==========================================================================
// CART BADGE
// Reads ohsCart (array format). Targets both #cartBadge and .cart-badge
// to match cart.js's selector. cart.js overwrites window.updateCartBadge
// on pages where it loads — that is intentional and correct.
// ==========================================================================

/**
 * Reads ohsCart from localStorage and updates every nav/cart badge element.
 * ohsCart is always an Array of cart item objects.
 */
function updateCartBadge() {
    const badges = document.querySelectorAll('#cartBadge, .cart-badge');
    if (!badges.length) return;

    try {
        const cart  = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
        const total = Array.isArray(cart)
            ? cart.reduce((sum, item) => sum + (item.quantity || 0), 0)
            : 0;

        badges.forEach(badge => {
            if (total > 0) {
                badge.textContent   = total;
                badge.style.display = 'inline-block';
            } else {
                badge.style.display = 'none';
            }
        });
    } catch (err) {
        console.error('updateCartBadge error:', err);
        badges.forEach(badge => { badge.style.display = 'none'; });
    }
}

// ==========================================================================
// NOTIFICATION SYSTEM (FALLBACK)
// Lightweight toast notification for pages that do NOT load cart.js.
// cart.js defines a richer showNotification() and overwrites this on
// pages where it loads (products, cart). This fallback uses the
// #notificationContainer + .notification CSS classes from components.css.
// ==========================================================================

/**
 * Show a toast notification. Types: 'success', 'error', 'warning', 'info'.
 * cart.js overrides this with its own version on pages that load it.
 */
function showNotification(message, type) {
    type = type || 'info';

    let container = document.getElementById('notificationContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notificationContainer';
        document.body.appendChild(container);
    }

    const iconMap = {
        success: 'check-circle',
        error:   'times-circle',
        warning: 'exclamation-triangle',
        info:    'info-circle'
    };

    const notification = document.createElement('div');
    notification.className = 'notification ' + type;

    notification.innerHTML =
        '<i class="fas fa-' + (iconMap[type] || 'info-circle') + '"></i>' +
        '<div style="flex:1;">' + message + '</div>' +
        '<button onclick="this.parentElement.remove()" ' +
        'style="background:none;border:none;color:white;font-size:1.2rem;cursor:pointer;padding:0;opacity:0.8;">' +
        '&times;</button>';

    container.appendChild(notification);

    // Slide in
    requestAnimationFrame(function() {
        notification.classList.add('show');
    });

    // Auto-remove after 4 seconds
    setTimeout(function() {
        notification.classList.remove('show');
        setTimeout(function() { notification.remove(); }, 300);
    }, 4000);
}

// ==========================================================================
// CART HELPERS
// All cart writes use the Array format keyed by 'ohsCart'.
// Higher-level add/update/checkout logic lives in shop/js/cart.js.
//
// ⚠️  addItemToCart() is ONLY for pages that do NOT load cart.js
//     (e.g. homepage quick-add widget).
//     On pages that load cart.js, use window.addToCart() instead so
//     cart.js's internal cartItems array stays in sync.
// ==========================================================================

/**
 * Add a single item to the ohsCart array.
 * Merges quantity if the same variantId already exists.
 *
 * @param {Object} item - Must include: productId, variantId, name, price,
 *                        quantity, sku, tier, type, isSubscription, image
 */
function addItemToCart(item) {
    if (!item || !item.variantId) {
        console.error('addItemToCart: item must have a variantId', item);
        return false;
    }

    try {
        const cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
        if (!Array.isArray(cart)) {
            throw new Error('ohsCart is not an array — localStorage may be corrupted.');
        }

        const idx = cart.findIndex(c => c.variantId === item.variantId);
        if (idx >= 0) {
            cart[idx].quantity += item.quantity || 1;
        } else {
            cart.push({
                productId:      item.productId,
                variantId:      item.variantId,
                name:           item.name,
                price:          item.price,
                quantity:       item.quantity || 1,
                sku:            item.sku            || '',
                tier:           item.tier           || 'retail',
                type:           item.type           || 'usda-only',
                isSubscription: item.isSubscription || false,
                image:          item.image          || ''
            });
        }

        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        updateCartBadge();

        // Notify other tabs / scripts
        window.dispatchEvent(new CustomEvent('cartUpdated', {
            detail: { item, cart }
        }));

        return true;
    } catch (err) {
        console.error('addItemToCart error:', err);
        return false;
    }
}

/**
 * Return total item quantity across the whole cart.
 * @returns {number}
 */
function getCartTotalQuantity() {
    try {
        const cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
        return Array.isArray(cart)
            ? cart.reduce((sum, item) => sum + (item.quantity || 0), 0)
            : 0;
    } catch (err) {
        console.error('getCartTotalQuantity error:', err);
        return 0;
    }
}

/**
 * Returns true when the cart's total quantity meets the given threshold.
 * @param {number} threshold
 * @returns {boolean}
 */
function isWholesaleEligible(threshold) {
    return getCartTotalQuantity() >= (threshold || 25);
}

/**
 * Redirect to the cart page (shop/cart.html).
 * Called from CTA buttons. Shopify checkout is initiated from cart.js.
 */
function goToCart() {
    const depth  = window.location.pathname.split('/').filter(p => p && !p.includes('.')).length;
    const prefix = depth > 0 ? '../'.repeat(depth) : '';
    window.location.href = prefix + 'shop/cart.html';
}

// ==========================================================================
// BANNER MANAGEMENT
// ==========================================================================

function closeBanner() {
    const banner = document.getElementById('promoBanner');
    if (!banner) return;
    banner.style.transform = 'translateY(-100%)';
    setTimeout(function() { banner.style.display = 'none'; }, 300);
    localStorage.setItem('promoBannerClosed', 'true');
}

function checkBanner() {
    const banner = document.getElementById('promoBanner');
    if (banner && localStorage.getItem('promoBannerClosed') === 'true') {
        banner.style.display = 'none';
    }
}

// ==========================================================================
// NAVIGATION & SCROLLING
// ==========================================================================

function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(function(a) {
        a.addEventListener('click', function(e) {
            var href = a.getAttribute('href');
            if (!href || href === '#' || href.length <= 1) return;
            try {
                var target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            } catch (err) {
                console.warn('initSmoothScrolling: invalid selector', href);
            }
        });
    });
}

function initMobileMenu() {
    var collapse = document.querySelector('.navbar-collapse');
    if (!collapse) return;

    collapse.addEventListener('click', function(e) {
        if (e.target.classList.contains('nav-link') || e.target.closest('.nav-link')) {
            var bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapse);
            bsCollapse.hide();
        }
    });
}

// ==========================================================================
// SCROLL ANIMATIONS
// ==========================================================================

function initAnimations() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity   = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, ANIMATION_CONFIG);

    document.querySelectorAll(
        '.service-card, .standard-card, .process-step, ' +
        '.product-line-card, .card, .hero-stats, .feature-card'
    ).forEach(function(el) {
        el.style.opacity    = '0';
        el.style.transform  = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ==========================================================================
// PRODUCT CATALOG READINESS CHECK
// Replaces the old window.shopifyIntegration check.
// Fires a 'productCatalogReady' event that cart.js and page scripts can
// listen to instead of polling.
// ==========================================================================

function checkProductCatalog() {
    if (typeof window.PRODUCT_CATALOG !== 'undefined' &&
        typeof window.findProduct      === 'function'  &&
        typeof window.getPricingTier   === 'function') {
        console.log('✅ Product catalog ready —',
            Object.keys(window.PRODUCT_CATALOG).length, 'products loaded.');
        window.dispatchEvent(new CustomEvent('productCatalogReady'));
        return true;
    }
    console.warn('⚠️ product-catalog.js not loaded yet — cart and pricing features unavailable.');
    return false;
}

// ==========================================================================
// SERVICE BOOKING HELPERS
// ==========================================================================

var BOOKING_FORM_BASE = 'https://docs.google.com/forms/d/1zSq8EoZG8xcQHYtjt5pBovLA3zitegR1aU_tcniZy40/viewform';

function bookResidentialService() {
    window.open(BOOKING_FORM_BASE + '?entry.service_type=Residential&entry.source=Website', '_blank');
    showNotification('🏠 Opening residential service booking form…', 'info');
    if (typeof gtag !== 'undefined') {
        gtag('event', 'book_residential_service', { event_category: 'Service Booking' });
    }
}

function bookCommercialService() {
    window.open(BOOKING_FORM_BASE + '?entry.service_type=Commercial&entry.source=Website', '_blank');
    showNotification('🏢 Opening commercial service booking form…', 'info');
    if (typeof gtag !== 'undefined') {
        gtag('event', 'book_commercial_service', { event_category: 'Service Booking' });
    }
}

function callNow() {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'phone_call', { event_category: 'Contact', event_label: 'Call Now' });
    }
    window.location.href = 'tel:+18017125663';
}

// ==========================================================================
// FORM ENHANCEMENTS
// ==========================================================================

function initFormEnhancements() {
    document.querySelectorAll('form').forEach(function(form) {
        form.addEventListener('submit', function() {
            var btn = form.querySelector('button[type="submit"], input[type="submit"]');
            if (!btn) return;
            var original    = btn.textContent;
            btn.disabled    = true;
            btn.textContent = 'Submitting…';
            setTimeout(function() {
                btn.disabled    = false;
                btn.textContent = original;
            }, 6000);
        });
    });
}

// ==========================================================================
// UTILITY FUNCTIONS
// ==========================================================================

function debounce(fn, wait, immediate) {
    var t;
    return function() {
        var args  = arguments;
        var ctx   = this;
        var later = function() { t = null; if (!immediate) fn.apply(ctx, args); };
        var now   = immediate && !t;
        clearTimeout(t);
        t = setTimeout(later, wait);
        if (now) fn.apply(ctx, args);
    };
}

function throttle(fn, limit) {
    var active = false;
    return function() {
        if (!active) {
            fn.apply(this, arguments);
            active = true;
            setTimeout(function() { active = false; }, limit);
        }
    };
}

function isInViewport(el) {
    var r = el.getBoundingClientRect();
    return r.top    >= 0 &&
           r.left   >= 0 &&
           r.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
           r.right  <= (window.innerWidth  || document.documentElement.clientWidth);
}

// ==========================================================================
// INITIALIZATION
// ==========================================================================

function init() {
    console.log('🔧 Initializing OHS Global Scripts…');
    updateCartBadge();
    checkBanner();
    initSmoothScrolling();
    initMobileMenu();
    initAnimations();
    initFormEnhancements();
    checkProductCatalog();
    console.log('✅ OHS Global Scripts initialized.');
}

document.addEventListener('DOMContentLoaded', init);

// ==========================================================================
// EVENT LISTENERS
// ==========================================================================

// Sync cart badge across tabs
window.addEventListener('storage', function(e) {
    if (e.key === CART_KEY) updateCartBadge();
});

// Refresh badge when tab regains focus
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) updateCartBadge();
});

// Internal cartUpdated event (fired by addItemToCart and cart.js)
window.addEventListener('cartUpdated', function() { updateCartBadge(); });

// Clear cart if returning from successful Shopify checkout
window.addEventListener('focus', function() {
    if (new URLSearchParams(window.location.search).get('checkout') === 'success') {
        localStorage.removeItem(CART_KEY);
        updateCartBadge();
        showNotification('🎉 Order completed! Thank you.', 'success');
    }
});

// ==========================================================================
// PUBLIC API
// ==========================================================================

window.OHS = {
    updateCartBadge:        updateCartBadge,
    addItemToCart:           addItemToCart,
    getCartTotalQuantity:   getCartTotalQuantity,
    isWholesaleEligible:    isWholesaleEligible,
    goToCart:                goToCart,
    closeBanner:            closeBanner,
    showNotification:       showNotification,
    bookResidentialService: bookResidentialService,
    bookCommercialService:  bookCommercialService,
    callNow:                callNow,
    debounce:               debounce,
    throttle:               throttle,
    isInViewport:           isInViewport,
    checkProductCatalog:    checkProductCatalog
};

// Flat globals for backward compat with inline onclick handlers
window.updateCartBadge        = updateCartBadge;
window.addItemToCart          = addItemToCart;
window.getCartTotalQuantity   = getCartTotalQuantity;
window.isWholesaleEligible    = isWholesaleEligible;
window.goToCart               = goToCart;
window.closeBanner            = closeBanner;
window.showNotification       = showNotification;
window.bookResidentialService = bookResidentialService;
window.bookCommercialService  = bookCommercialService;
window.callNow                = callNow;
window.debounce               = debounce;
window.throttle               = throttle;
window.isInViewport           = isInViewport;

console.log('🎉 OHS Global Scripts loaded.');



// ==========================================================================
// STATE SELECTOR — universal modal for all pages
// ==========================================================================

window.showStateModal = function () {
    let modal = document.getElementById('globalStateModal');

    if (!modal) {
        // Build the modal if it doesn't exist on this page
        modal = document.createElement('div');
        modal.id = 'globalStateModal';
        modal.className = 'state-modal';
        modal.innerHTML = `
            <div class="state-modal-content">
                <div class="state-modal-icon">
                    <i class="fas fa-map-marker-alt"></i>
                </div>
                <h3>Select Your State</h3>
                <p>Some products are only available in Utah due to EPA registration. USDA Organic products ship nationwide.</p>
                <select class="state-select" id="globalStateSelect">
                    <option value="">-- Select Your State --</option>
                </select>
                <button class="state-modal-btn" id="globalStateConfirmBtn" disabled>
                    <i class="fas fa-check me-2"></i>Confirm Location
                </button>
                <button onclick="document.getElementById('globalStateModal').classList.remove('show')"
                        style="background:none;border:none;color:#6c757d;margin-top:0.75rem;cursor:pointer;font-size:0.85rem;">
                    Cancel
                </button>
            </div>
        `;
        document.body.appendChild(modal);

        // Populate states
        const states = [
            {code:'AL',name:'Alabama'},{code:'AK',name:'Alaska'},{code:'AZ',name:'Arizona'},
            {code:'AR',name:'Arkansas'},{code:'CA',name:'California'},{code:'CO',name:'Colorado'},
            {code:'CT',name:'Connecticut'},{code:'DE',name:'Delaware'},{code:'FL',name:'Florida'},
            {code:'GA',name:'Georgia'},{code:'HI',name:'Hawaii'},{code:'ID',name:'Idaho'},
            {code:'IL',name:'Illinois'},{code:'IN',name:'Indiana'},{code:'IA',name:'Iowa'},
            {code:'KS',name:'Kansas'},{code:'KY',name:'Kentucky'},{code:'LA',name:'Louisiana'},
            {code:'ME',name:'Maine'},{code:'MD',name:'Maryland'},{code:'MA',name:'Massachusetts'},
            {code:'MI',name:'Michigan'},{code:'MN',name:'Minnesota'},{code:'MS',name:'Mississippi'},
            {code:'MO',name:'Missouri'},{code:'MT',name:'Montana'},{code:'NE',name:'Nebraska'},
            {code:'NV',name:'Nevada'},{code:'NH',name:'New Hampshire'},{code:'NJ',name:'New Jersey'},
            {code:'NM',name:'New Mexico'},{code:'NY',name:'New York'},{code:'NC',name:'North Carolina'},
            {code:'ND',name:'North Dakota'},{code:'OH',name:'Ohio'},{code:'OK',name:'Oklahoma'},
            {code:'OR',name:'Oregon'},{code:'PA',name:'Pennsylvania'},{code:'RI',name:'Rhode Island'},
            {code:'SC',name:'South Carolina'},{code:'SD',name:'South Dakota'},{code:'TN',name:'Tennessee'},
            {code:'TX',name:'Texas'},{code:'UT',name:'Utah'},{code:'VT',name:'Vermont'},
            {code:'VA',name:'Virginia'},{code:'WA',name:'Washington'},{code:'WV',name:'West Virginia'},
            {code:'WI',name:'Wisconsin'},{code:'WY',name:'Wyoming'},{code:'DC',name:'District of Columbia'}
        ];
        const select = document.getElementById('globalStateSelect');
        states.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.code;
            opt.textContent = s.name;
            select.appendChild(opt);
        });

        // Pre-select saved state
        const saved = localStorage.getItem('ohsUserState');
        if (saved) { select.value = saved; document.getElementById('globalStateConfirmBtn').disabled = false; }

        // Events
        select.addEventListener('change', function () {
            document.getElementById('globalStateConfirmBtn').disabled = !this.value;
        });

        document.getElementById('globalStateConfirmBtn').addEventListener('click', function () {
            const val = document.getElementById('globalStateSelect').value;
            if (!val) return;
            localStorage.setItem('ohsUserState', val);
            document.getElementById('globalStateModal').classList.remove('show');
            updateNavStateName(val);
            // Let products.html pick it up if it's the current page
            window.dispatchEvent(new CustomEvent('stateChanged', { detail: { state: val } }));
        });
    } else {
        // Modal already exists — just sync the saved state and show
        const saved = localStorage.getItem('ohsUserState');
        const select = document.getElementById('globalStateSelect');
        if (saved) { select.value = saved; document.getElementById('globalStateConfirmBtn').disabled = false; }
    }

    modal.classList.add('show');
};

function updateNavStateName(stateCode) {
    const el = document.getElementById('navStateName');
    if (!el) return;
    const names = {
        AL:'Alabama',AK:'Alaska',AZ:'Arizona',AR:'Arkansas',CA:'California',CO:'Colorado',
        CT:'Connecticut',DE:'Delaware',FL:'Florida',GA:'Georgia',HI:'Hawaii',ID:'Idaho',
        IL:'Illinois',IN:'Indiana',IA:'Iowa',KS:'Kansas',KY:'Kentucky',LA:'Louisiana',
        ME:'Maine',MD:'Maryland',MA:'Massachusetts',MI:'Michigan',MN:'Minnesota',MS:'Mississippi',
        MO:'Missouri',MT:'Montana',NE:'Nebraska',NV:'Nevada',NH:'New Hampshire',NJ:'New Jersey',
        NM:'New Mexico',NY:'New York',NC:'North Carolina',ND:'North Dakota',OH:'Ohio',OK:'Oklahoma',
        OR:'Oregon',PA:'Pennsylvania',RI:'Rhode Island',SC:'South Carolina',SD:'South Dakota',
        TN:'Tennessee',TX:'Texas',UT:'Utah',VT:'Vermont',VA:'Virginia',WA:'Washington',
        WV:'West Virginia',WI:'Wisconsin',WY:'Wyoming',DC:'District of Columbia'
    };
    el.textContent = names[stateCode] || stateCode;
}

// On every page load, update the nav state name if a state is already saved
document.addEventListener('DOMContentLoaded', function () {
    const saved = localStorage.getItem('ohsUserState');
    if (saved) updateNavStateName(saved);
});
