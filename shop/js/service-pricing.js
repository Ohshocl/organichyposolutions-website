/**
 * ORGANIC HYPOSOLUTIONS - SERVICE PRICING (one engine for every estimate)
 * File: /shop/js/service-pricing.js
 *
 * The ONE place service prices and their math live (sprint 2026-11-24).
 * calculator.html and book-service.html both use it, so their estimates can't
 * drift apart. Pages only read inputs and show the results.
 *
 * Approved rules (unchanged by this file; moved here from the two pages):
 *  - Fogging: rate per sq ft by service, with a minimum job charge.
 *  - Large facilities (over 20,000 sq ft), approved by Anthony 2026-11-24: the
 *    first 20,000 sq ft at the normal rate; every sq ft past 20,000 at 20% off,
 *    never below $0.08; plus a second-machine fee equal to the service minimum.
 *  - Complexity multiplier on the (discounted) base.
 *  - Travel: estimate assumes 30 miles; $0.70/mile past the 25-mile free radius.
 *  - Mold: mid-band rate x sq ft (minimum by property type), x moisture surcharge,
 *    shown as a low-high range from the band.
 *  - Contracts: 15% monthly, 10% bi-monthly, 20% annual off the per-visit price.
 *  - Frequency does NOT change the per-visit price (pending a business decision).
 */
(function (root) {
    'use strict';

    var PRICING = {
        // ── FOGGING base rates ($/sf) ──
        // Residential is intentionally lower: open plan, fast access, no compliance
        // documentation overhead.
        baseRates: {
            commercial:  0.125,
            residential: 0.10,
            healthcare:  0.14,
            education:   0.12,
            food:        0.135,
            fitness:     0.13
        },
        volumeRate: 0.08,   // floor $/sf for square footage past 20,000 (see largeFacility)
        largeFacility: { threshold: 20000, discountBeyond: 0.20 },
        frequencyMultipliers: {
            monthly:   1.0,
            biweekly:  1.8,
            weekly:    3.5,
            quarterly: 1.2,
            onetime:   1.4
        },
        complexityAdjustments: {
            standard: 1.0,
            moderate: 1.15,
            complex:  1.3
        },
        minimums: {
            commercial:  200,
            residential: 125,
            healthcare:  300,
            education:   200,
            food:        200,
            fitness:     175
        },

        // ── MOLD REMEDIATION rates (midpoints of published bands) ──
        // Surface: $2–$7 → $4.50 · Moderate: $8–$11 → $9.50 · Complex: $12–$15 → $13.50
        moldRates: {
            surface:  { low: 2,  high: 7,  mid: 4.50, label: 'Surface (hard surfaces, easy access)'  },
            moderate: { low: 8,  high: 11, mid: 9.50, label: 'Moderate (drywall/framing penetration)' },
            complex:  { low: 12, high: 15, mid: 13.50, label: 'Complex (attic/crawl, black mold)'     }
        },
        moldMinimums: {
            residential:  300,
            commercial:   400,
            healthcare:   500,
            'multi-family': 350
        },
        moistureMultipliers: {
            fixed:  1.0,
            active: 1.15,
            flood:  1.30
        },

        contractDiscounts: {
            payPerService:     0,
            monthlyContract:   0.15,
            bimonthlyContract: 0.10,
            annualContract:    0.20
        },
        travelRate:        0.70,
        baseTravelRadius:  25,
        estimatedDistance: 30
    };

    /** Travel cost of the standard estimate (30 miles assumed). */
    function travelCost() {
        return PRICING.estimatedDistance > PRICING.baseTravelRadius
            ? (PRICING.estimatedDistance - PRICING.baseTravelRadius) * PRICING.travelRate
            : 0;
    }

    /** Large-facility rule. Returns { isLarge, standardArea, savings, discountedBase, secondMachineFee }. */
    function largeFacilityPricing(sqft, rate, minimum) {
        var lf = PRICING.largeFacility;
        var isLarge = sqft > lf.threshold;
        var standardArea = sqft * rate;
        var savings = 0, secondMachineFee = 0;
        if (isLarge) {
            var rateBeyond = Math.max(rate * (1 - lf.discountBeyond), PRICING.volumeRate);
            savings = (sqft - lf.threshold) * (rate - rateBeyond);
            secondMachineFee = minimum;
        }
        var discountedBase = Math.max(standardArea - savings, minimum);
        return { isLarge: isLarge, standardArea: standardArea, savings: savings, discountedBase: discountedBase, secondMachineFee: secondMachineFee };
    }

    /**
     * Fogging / disinfection estimate for one visit (unrounded numbers).
     * @param {string} service  commercial | residential | healthcare | education | food | fitness
     * @param {number} sqft
     * @param {string} complexity standard | moderate | complex
     */
    function foggingEstimate(service, sqft, complexity) {
        var rate    = PRICING.baseRates[service] || 0.125;
        var minimum = PRICING.minimums[service] || 150;
        var lfp     = largeFacilityPricing(Math.max(0, Number(sqft) || 0), rate, minimum);
        var mult    = PRICING.complexityAdjustments[complexity] || 1.0;
        var travel  = travelCost();
        return {
            rate: rate, minimum: minimum,
            isLarge: lfp.isLarge, standardArea: lfp.standardArea, discountedBase: lfp.discountedBase,
            // "Base Service" line shows the normal-rate price; the volume discount is its own line
            basePrice: lfp.isLarge ? lfp.standardArea : lfp.discountedBase,
            volumeDiscount: lfp.savings,
            complexityMultiplier: mult,
            complexityAdjustment: lfp.discountedBase * (mult - 1),
            secondMachineFee: lfp.secondMachineFee,
            travelCosts: travel,
            totalPrice: lfp.discountedBase * mult + lfp.secondMachineFee + travel
        };
    }

    /**
     * Mold remediation estimate (unrounded numbers).
     * @param {number} sqft
     * @param {string} propertyType residential | commercial | healthcare | multi-family
     * @param {string} moisture fixed | active | flood
     * @param {string} complexity surface | moderate | complex
     */
    function moldEstimate(sqft, propertyType, moisture, complexity) {
        var rateData = PRICING.moldRates[complexity] || PRICING.moldRates.surface;
        var minimum  = PRICING.moldMinimums[propertyType] || 300;
        var mult     = PRICING.moistureMultipliers[moisture] || 1.0;
        var travel   = travelCost();
        var basePrice = Math.max(sqft * rateData.mid, minimum);
        return {
            rateData: rateData, minimum: minimum, moistureMultiplier: mult,
            basePrice: basePrice,
            moistureAdjustment: basePrice * (mult - 1),
            travelCosts: travel,
            totalPrice: basePrice * mult + travel,
            lowTotal:  Math.max(sqft * rateData.low,  minimum) * mult + travel,
            highTotal: Math.max(sqft * rateData.high, minimum) * mult + travel
        };
    }

    /** Contract price for a per-visit total: { discount, price, savings }. */
    function contractPrice(total, contract) {
        var d = PRICING.contractDiscounts[contract] || 0;
        return { discount: d, price: total * (1 - d), savings: total * d };
    }

    root.OHSServicePricing = {
        PRICING: PRICING,
        travelCost: travelCost,
        largeFacilityPricing: largeFacilityPricing,
        foggingEstimate: foggingEstimate,
        moldEstimate: moldEstimate,
        contractPrice: contractPrice
    };
})(typeof window !== 'undefined' ? window : this);
