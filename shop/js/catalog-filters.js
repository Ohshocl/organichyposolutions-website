/**
 * ORGANIC HYPOSOLUTIONS - CATALOG FILTERS
 * File: /shop/js/catalog-filters.js
 *
 * Search, filter and sort for the products page (sprint 2026-11-24, Priority 1-2).
 * Pure logic only: no page code, no Shopify requests, no DOM. Products come from
 * product-catalog.js (the only source of product data); which products are
 * eligible (for sale + allowed in the shipping state) is decided by the page
 * BEFORE they get here, so filters can never show something that isn't for sale.
 *
 *   window.OHSCatalogFilters.apply(products, filters)  -> filtered + sorted array
 *   window.OHSCatalogFilters.facets(products, filters)  -> options with counts
 *   window.OHSCatalogFilters.parse(searchString)        -> filters from a URL (?q=&category=…)
 *   window.OHSCatalogFilters.toQuery(filters)           -> "?q=…" (defaults left out)
 *
 * Filters: { q, category, cert, size, sort }. Empty string = "All".
 * Sort: featured (catalog order) | price-asc | price-desc | name. Prices are always
 * the one-time RETAIL unit price, never wholesale or subscription.
 */
(function (root) {
    'use strict';

    var SORTS = ['featured', 'price-asc', 'price-desc', 'name'];
    var SORT_LABELS = { 'featured': 'Featured', 'price-asc': 'Price: low–high', 'price-desc': 'Price: high–low', 'name': 'Name: A–Z' };
    var CERTS = { epa: 'EPA Registered', usda: 'USDA Certified Organic' };
    var DEFAULTS = { q: '', category: '', cert: '', size: '', sort: 'featured' };

    function slug(s) { return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }

    /** Certification key of a product ('' when it has none of the filterable ones). */
    function certOf(p) {
        if (p.type === 'epa') return 'epa';
        var c = (p.certifications || []).join(' ');
        return /USDA/i.test(c) ? 'usda' : '';
    }

    /** Sizes that are real measurements (32oz, 1gal, 100ml); packs like "wipes" are not a size. */
    function sizeOf(p) { return /^\d/.test(String(p.size || '')) ? String(p.size).toLowerCase() : ''; }
    function sizeLabel(v) {
        var m = /^(\d+(?:\.\d+)?)\s*(oz|gal|ml|l)$/i.exec(v || '');
        if (!m) return v;
        var unit = { oz: 'oz', gal: 'gallon', ml: 'ml', l: 'L' }[m[2].toLowerCase()];
        return m[1] + ' ' + unit;
    }
    // Smallest first within each unit, units in a fixed order
    function sizeRank(v) {
        var m = /^(\d+(?:\.\d+)?)\s*(oz|gal|ml|l)$/i.exec(v || ''); if (!m) return 1e9;
        var order = { ml: 0, l: 1, oz: 2, gal: 3 }[m[2].toLowerCase()];
        return order * 1e6 + parseFloat(m[1]);
    }

    function searchText(p) {
        return [p.name, p.shortName, p.description, p.category, [].concat(p.useCase || []).join(' ').replace(/,/g, ' '), CERTS[certOf(p)] || '', p.size]
            .join(' ').toLowerCase();
    }
    function retail(p) { return p && p.pricing && typeof p.pricing.retail === 'number' ? p.pricing.retail : Infinity; }

    /** Does a product match the filters? `skip` leaves one filter out (for option counts). */
    function matches(p, f, skip) {
        if (skip !== 'q' && f.q) {
            var text = searchText(p);
            var words = f.q.toLowerCase().split(/\s+/).filter(Boolean);
            for (var i = 0; i < words.length; i++) if (text.indexOf(words[i]) === -1) return false;
        }
        if (skip !== 'category' && f.category && slug(p.category) !== f.category) return false;
        if (skip !== 'cert' && f.cert && certOf(p) !== f.cert) return false;
        if (skip !== 'size' && f.size && sizeOf(p) !== f.size) return false;
        return true;
    }

    function normalise(f) {
        f = f || {};
        return {
            q: String(f.q || '').replace(/\s+/g, ' ').trim().slice(0, 80),
            category: slug(f.category),
            cert: CERTS[f.cert] ? f.cert : '',
            size: String(f.size || '').toLowerCase().replace(/[^a-z0-9.]/g, ''),
            sort: SORTS.indexOf(f.sort) !== -1 ? f.sort : 'featured'
        };
    }

    /** Filtered and sorted products. Ties keep catalog order (stable). */
    function apply(products, filters) {
        var f = normalise(filters);
        var list = products.map(function (p, i) { return { p: p, i: i }; }).filter(function (x) { return matches(x.p, f); });
        list.sort(function (a, b) {
            if (f.sort === 'price-asc' && retail(a.p) !== retail(b.p)) return retail(a.p) - retail(b.p);
            if (f.sort === 'price-desc' && retail(a.p) !== retail(b.p)) return retail(b.p) - retail(a.p);
            if (f.sort === 'name') { var c = String(a.p.name).localeCompare(String(b.p.name), 'en', { sensitivity: 'base' }); if (c) return c; }
            return a.i - b.i;
        });
        return list.map(function (x) { return x.p; });
    }

    /**
     * Options for each filter, built only from the given (eligible) products.
     * Each count is how many products you'd get with that option and the OTHER
     * current filters. A selected option is always listed, even at 0.
     */
    function facets(products, filters) {
        var f = normalise(filters);
        function build(key, valueOf, labelOf, rankOf) {
            var seen = {};
            products.forEach(function (p) {
                var v = valueOf(p); if (!v) return;
                if (!seen[v]) seen[v] = { value: v, label: labelOf(v, p), count: 0, rank: rankOf ? rankOf(v) : 0 };
                if (matches(p, f, key)) seen[v].count++;
            });
            if (f[key] && !seen[f[key]]) seen[f[key]] = { value: f[key], label: labelOf(f[key]), count: 0, rank: rankOf ? rankOf(f[key]) : 0 };
            return Object.keys(seen).map(function (k) { return seen[k]; })
                .sort(function (a, b) { return (a.rank - b.rank) || a.label.localeCompare(b.label); });
        }
        var catLabels = {};
        products.forEach(function (p) { if (p.category) catLabels[slug(p.category)] = p.category; });
        var certOrder = { epa: 0, usda: 1 };
        return {
            category: build('category', function (p) { return slug(p.category); }, function (v) { return catLabels[v] || v; }),
            cert: build('cert', certOf, function (v) { return CERTS[v] || v; }, function (v) { return certOrder[v] || 0; }),
            size: build('size', sizeOf, sizeLabel, sizeRank),
            sort: SORTS.map(function (s) { return { value: s, label: SORT_LABELS[s] }; }),
            total: products.filter(function (p) { return matches(p, f); }).length
        };
    }

    function parse(search) {
        var params = new URLSearchParams(search || '');
        return normalise({ q: params.get('q'), category: params.get('category'), cert: params.get('cert'), size: params.get('size'), sort: params.get('sort') });
    }

    function toQuery(filters) {
        var f = normalise(filters), params = new URLSearchParams();
        Object.keys(DEFAULTS).forEach(function (k) { if (f[k] && f[k] !== DEFAULTS[k]) params.set(k, f[k]); });
        var s = params.toString();
        return s ? '?' + s : '';
    }

    /** Drop a category or size that no product for sale has (e.g. a hand-edited URL). */
    function sanitize(filters, products) {
        var f = normalise(filters);
        if (f.category && !products.some(function (p) { return slug(p.category) === f.category; })) f.category = '';
        if (f.size && !products.some(function (p) { return sizeOf(p) === f.size; })) f.size = '';
        return f;
    }

    function isDefault(filters) { var f = normalise(filters); return Object.keys(DEFAULTS).every(function (k) { return f[k] === DEFAULTS[k]; }); }

    root.OHSCatalogFilters = {
        apply: apply, facets: facets, matches: matches, parse: parse, toQuery: toQuery, sanitize: sanitize,
        normalise: normalise, isDefault: isDefault, certOf: certOf, sizeOf: sizeOf, sizeLabel: sizeLabel,
        DEFAULTS: DEFAULTS, CERT_LABELS: CERTS
    };
})(typeof window !== 'undefined' ? window : this);
