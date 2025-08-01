/**
 * Organic HypoSolutions - Service Cost Calculator
 * File: /assets/js/calculator.js
 * Dependencies: global-scripts.js, analytics.js
 * Last Updated: August 2025
 */

console.log('🧮 OHS Calculator Loading...');

// ==========================================================================
// PRICING CONFIGURATION
// ==========================================================================

const PRICING = {
    // Base rates per square foot by service type
    baseRates: {
        'disinfection': 0.12,      // Standard disinfection
        'deepClean': 0.18,         // Deep cleaning + disinfection
        'maintenance': 0.08,       // Maintenance cleaning
        'specialty': 0.22,         // Specialty/medical grade
        'commercial': 0.15,        // Commercial standard
        'industrial': 0.25         // Industrial/manufacturing
    },

    // Volume rate for large facilities (20,000+ sq ft)
    volumeRate: 0.10,

    // Minimum charges by service type
    minimums: {
        'disinfection': 150,
        'deepClean': 225,
        'maintenance': 100,
        'specialty': 300,
        'commercial': 200,
        'industrial': 400
    },

    // Complexity adjustments
    complexityAdjustments: {
        'simple': 1.0,       // Open areas, minimal obstacles
        'standard': 1.2,     // Normal office/retail
        'complex': 1.5,      // Healthcare, food service
        'specialized': 1.8   // Clean rooms, laboratories
    },

    // Frequency multipliers
    frequencyMultipliers: {
        'onetime': 1.0,
        'weekly': 0.85,      // 15% discount for weekly
        'biweekly': 0.90,    // 10% discount for bi-weekly
        'monthly': 0.95,     // 5% discount for monthly
        'quarterly': 1.1     // 10% premium for quarterly
    },

    // Subscription contract discounts
    subscriptionDiscounts: {
        'payPerService': 0,     // No contract discount
        '6month': 0.05,         // 5% discount for 6-month contract
        '12month': 0.10,        // 10% discount for 12-month contract
        '24month': 0.15         // 15% discount for 24-month contract
    },

    // Travel costs
    baseTravelRadius: 25,      // Free travel within 25 miles
    travelRate: 0.65,          // Rate per mile beyond base radius

    // Emergency/rush service multipliers
    urgencyMultipliers: {
        'standard': 1.0,
        'priority': 1.25,      // 25% premium for priority
        'emergency': 1.5       // 50% premium for emergency
    }
};

// Service type descriptions
const SERVICE_DESCRIPTIONS = {
    'disinfection': 'EPA-approved disinfection treatment',
    'deepClean': 'Complete cleaning + disinfection service',
    'maintenance': 'Regular maintenance cleaning',
    'specialty': 'Medical-grade specialized treatment',
    'commercial': 'Commercial facility cleaning',
    'industrial': 'Industrial/manufacturing cleaning'
};

// ==========================================================================
// CALCULATOR STATE MANAGEMENT
// ==========================================================================

let calculatorState = {
    serviceType: 'disinfection',
    sqft: 1000,
    complexity: 'standard',
    frequency: 'onetime',
    subscription: 'payPerService',
    urgency: 'standard',
    location: '',
    estimatedDistance: 30,
    lastCalculation: null,
    userInputs: {}
};

// ==========================================================================
// MAIN CALCULATOR FUNCTION
// ==========================================================================

/**
 * Main calculation function - updates all pricing displays
 */
function updateCalculator() {
    try {
        // Get current input values
        const serviceType = getSelectValue('serviceType') || calculatorState.serviceType;
        const sqft = parseInt(getInputValue('sqft')) || calculatorState.sqft;
        const complexity = getSelectValue('complexity') || calculatorState.complexity;
        const frequency = getSelectValue('frequency') || calculatorState.frequency;
        const subscription = getSelectValue('subscription') || calculatorState.subscription;
        const urgency = getSelectValue('urgency') || calculatorState.urgency;

        // Validate inputs
        if (!sqft || sqft < 100) {
            showCalculatorError('Please enter a valid square footage (minimum 100)');
            return;
        }

        if (sqft > 1000000) {
            showCalculatorError('Please contact us directly for facilities over 1,000,000 sq ft');
            return;
        }

        // Update state
        calculatorState = {
            ...calculatorState,
            serviceType,
            sqft,
            complexity,
            frequency,
            subscription,
            urgency,
            userInputs: {
                serviceType,
                sqft,
                complexity,
                frequency,
                subscription,
                urgency
            }
        };

        // Perform calculations
        const calculation = calculateServiceCost(calculatorState);
        
        // Update all displays
        updatePriceDisplays(calculation);
        updateBreakdownDisplays(calculation);
        updateSubscriptionDisplays(calculation);
        updateNoticesAndMessages(calculation);

        // Store calculation for analytics and quote requests
        calculatorState.lastCalculation = calculation;

        // Track calculator usage
        if (typeof window.OHSAnalytics !== 'undefined') {
            window.OHSAnalytics.services.calculatorUse(
                serviceType,
                calculation.totalPrice,
                calculatorState.userInputs
            );
        }

        console.log('💰 Calculator updated:', calculation);

    } catch (error) {
        console.error('Calculator error:', error);
        showCalculatorError('Calculation error. Please refresh and try again.');
    }
}

/**
 * Core cost calculation logic
 */
function calculateServiceCost(state) {
    const { serviceType, sqft, complexity, frequency, subscription, urgency } = state;

    // 1. Calculate base price
    let baseRate = sqft > 20000 ? PRICING.volumeRate : PRICING.baseRates[serviceType];
    let basePrice = sqft * baseRate;
    
    // Apply minimum charge
    const minimum = PRICING.minimums[serviceType];
    basePrice = Math.max(basePrice, minimum);

    // 2. Apply complexity adjustment
    const complexityMultiplier = PRICING.complexityAdjustments[complexity];
    const complexityAdjustment = basePrice * (complexityMultiplier - 1);
    const adjustedPrice = basePrice * complexityMultiplier;

    // 3. Apply urgency multiplier if not standard
    const urgencyMultiplier = PRICING.urgencyMultipliers[urgency];
    const urgencyAdjustment = urgency !== 'standard' ? adjustedPrice * (urgencyMultiplier - 1) : 0;
    let servicePrice = adjustedPrice * urgencyMultiplier;

    // 4. Apply frequency multiplier
    const frequencyMultiplier = PRICING.frequencyMultipliers[frequency];
    const frequencyDiscount = frequency !== 'onetime' ? servicePrice * (1 - frequencyMultiplier) : 0;
    servicePrice *= frequencyMultiplier;

    // 5. Calculate travel costs
    let travelCosts = 0;
    if (state.estimatedDistance > PRICING.baseTravelRadius) {
        const extraMiles = state.estimatedDistance - PRICING.baseTravelRadius;
        travelCosts = extraMiles * PRICING.travelRate;
        if (frequency !== 'onetime') {
            travelCosts *= frequencyMultiplier;
        }
    }

    // 6. Calculate volume discount for large facilities
    let volumeDiscount = 0;
    if (sqft > 20000) {
        const standardRate = PRICING.baseRates[serviceType];
        volumeDiscount = (standardRate - PRICING.volumeRate) * sqft * frequencyMultiplier;
    }

    // 7. Apply dual machine cost for very large facilities
    let equipmentMultiplier = 1;
    if (sqft > 50000) {
        equipmentMultiplier = 2;
        servicePrice *= equipmentMultiplier;
    }

    // 8. Calculate total before subscription discount
    const subtotal = servicePrice + travelCosts;

    // 9. Apply subscription discount
    const subscriptionDiscount = PRICING.subscriptionDiscounts[subscription];
    const contractDiscount = subtotal * subscriptionDiscount;
    const totalPrice = subtotal - contractDiscount;

    // 10. Calculate savings displays
    const totalSavings = frequencyDiscount + volumeDiscount + contractDiscount;

    return {
        // Base calculations
        basePrice,
        baseRate,
        sqft,
        
        // Adjustments
        complexity,
        complexityMultiplier,
        complexityAdjustment,
        
        // Urgency
        urgency,
        urgencyMultiplier,
        urgencyAdjustment,
        
        // Frequency
        frequency,
        frequencyMultiplier,
        frequencyDiscount,
        
        // Travel
        travelCosts,
        estimatedDistance: state.estimatedDistance,
        
        // Volume
        volumeDiscount,
        isVolumeEligible: sqft > 20000,
        
        // Equipment
        equipmentMultiplier,
        isDualMachine: sqft > 50000,
        
        // Subscription
        subscription,
        subscriptionDiscount,
        contractDiscount,
        
        // Totals
        servicePrice,
        subtotal,
        totalPrice,
        totalSavings,
        
        // Meta
        serviceType,
        minimum,
        timestamp: new Date().toISOString()
    };
}

// ==========================================================================
// DISPLAY UPDATE FUNCTIONS
// ==========================================================================

/**
 * Update main price displays
 */
function updatePriceDisplays(calc) {
    updateElement('totalPrice', formatCurrency(calc.totalPrice));
    updateElement('breakdownTotal', formatCurrency(calc.totalPrice));
    
    // Update price frequency text
    const frequencyText = calc.frequency === 'onetime' ? 'one-time service' : 
                         `per ${calc.frequency.replace('ly', '').replace('time', '-time')}`;
    updateElement('priceFrequency', frequencyText);
    
    // Update service description
    updateElement('serviceDescription', SERVICE_DESCRIPTIONS[calc.serviceType] || 'Professional cleaning service');
}

/**
 * Update detailed breakdown displays
 */
function updateBreakdownDisplays(calc) {
    // Base service price
    updateElement('basePrice', formatCurrency(calc.basePrice));
    updateElement('basePriceRate', `$${calc.baseRate.toFixed(3)}/sq ft`);
    updateElement('serviceArea', `${calc.sqft.toLocaleString()} sq ft`);
    
    // Complexity adjustment
    updateElement('complexityPrice', calc.complexityAdjustment > 0 ? 
        formatCurrency(calc.complexityAdjustment) : 'Included');
    updateElement('complexityLevel', calc.complexity.charAt(0).toUpperCase() + calc.complexity.slice(1));
    
    // Urgency adjustment
    const urgencyRow = document.getElementById('urgencyRow');
    if (calc.urgencyAdjustment > 0) {
        updateElement('urgencyPrice', formatCurrency(calc.urgencyAdjustment));
        updateElement('urgencyLevel', calc.urgency.charAt(0).toUpperCase() + calc.urgency.slice(1));
        showElement('urgencyRow');
    } else {
        hideElement('urgencyRow');
    }
    
    // Travel costs
    if (calc.travelCosts > 0) {
        updateElement('travelPrice', formatCurrency(calc.travelCosts));
        updateElement('travelDistance', `${calc.estimatedDistance} miles`);
        showElement('travelRow');
    } else {
        updateElement('travelPrice', 'Included');
        hideElement('travelDistanceInfo');
    }
    
    // Volume discount
    if (calc.volumeDiscount > 0) {
        updateElement('volumeDiscount', '-' + formatCurrency(calc.volumeDiscount));
        showElement('volumeDiscountRow');
    } else {
        hideElement('volumeDiscountRow');
    }
    
    // Frequency discount
    if (calc.frequencyDiscount > 0) {
        updateElement('frequencyDiscount', '-' + formatCurrency(calc.frequencyDiscount));
        updateElement('frequencyType', calc.frequency);
        showElement('frequencyDiscountRow');
    } else {
        hideElement('frequencyDiscountRow');
    }
    
    // Dual machine notice
    if (calc.isDualMachine) {
        showElement('dualMachineNotice');
    } else {
        hideElement('dualMachineNotice');
    }
}

/**
 * Update subscription pricing displays
 */
function updateSubscriptionDisplays(calc) {
    const subscriptionResults = document.getElementById('subscriptionResults');
    
    if (calc.subscription !== 'payPerService') {
        // Show subscription pricing section
        showElement('subscriptionResults');
        
        // Contract pricing breakdown
        updateElement('contractServicePrice', formatCurrency(calc.subtotal));
        updateElement('contractDiscountAmount', '-' + formatCurrency(calc.contractDiscount));
        updateElement('contractPrice', formatCurrency(calc.totalPrice));
        updateElement('contractSavings', `Save ${formatCurrency(calc.contractDiscount)}`);
        
        // Contract terms
        const contractTerms = {
            '6month': '6-month contract (5% discount)',
            '12month': '12-month contract (10% discount)',
            '24month': '24-month contract (15% discount)'
        };
        updateElement('contractTerms', contractTerms[calc.subscription] || 'Contract pricing');
        
        // Annual bonus for 12+ month contracts
        if (calc.subscription === '12month' || calc.subscription === '24month') {
            showElement('annualBonusRow');
        } else {
            hideElement('annualBonusRow');
        }
        
    } else {
        hideElement('subscriptionResults');
    }
}

/**
 * Update notices and informational messages
 */
function updateNoticesAndMessages(calc) {
    // High-value service notice
    if (calc.totalPrice > 5000) {
        showElement('highValueNotice');
    } else {
        hideElement('highValueNotice');
    }
    
    // Large facility notice
    if (calc.sqft > 100000) {
        showElement('largeFacilityNotice');
    } else {
        hideElement('largeFacilityNotice');
    }
    
    // Emergency service notice
    if (calc.urgency === 'emergency') {
        showElement('emergencyNotice');
    } else {
        hideElement('emergencyNotice');
    }
    
    // Total savings summary
    if (calc.totalSavings > 0) {
        updateElement('totalSavingsAmount', formatCurrency(calc.totalSavings));
        showElement('totalSavingsRow');
    } else {
        hideElement('totalSavingsRow');
    }
}

// ==========================================================================
// UTILITY FUNCTIONS
// ==========================================================================

/**
 * Safely get input value
 */
function getInputValue(id) {
    const element = document.getElementById(id);
    return element ? element.value : '';
}

/**
 * Safely get select value
 */
function getSelectValue(id) {
    const element = document.getElementById(id);
    return element ? element.value : '';
}

/**
 * Safely update element content
 */
function updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

/**
 * Show element
 */
function showElement(id) {
    const element = document.getElementById(id);
    if (element) {
        element.style.display = 'block';
    }
}

/**
 * Hide element
 */
function hideElement(id) {
    const element = document.getElementById(id);
    if (element) {
        element.style.display = 'none';
    }
}

/**
 * Format currency
 */
function formatCurrency(amount) {
    return '$' + Math.round(amount).toLocaleString();
}

/**
 * Show calculator error
 */
function showCalculatorError(message) {
    const errorElement = document.getElementById('calculatorError');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        // Hide after 5 seconds
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 5000);
    }
    
    // Also show notification if available
    if (typeof window.OHS !== 'undefined' && window.OHS.showNotification) {
        window.OHS.showNotification(message, 'error');
    }
}

/**
 * Clear calculator error
 */
function clearCalculatorError() {
    const errorElement = document.getElementById('calculatorError');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

// ==========================================================================
// QUOTE AND BOOKING FUNCTIONS
// ==========================================================================

/**
 * Request detailed quote
 */
function requestQuote() {
    try {
        const calc = calculatorState.lastCalculation;
        if (!calc) {
            updateCalculator();
            setTimeout(requestQuote, 100);
            return;
        }

        // Prepare quote parameters
        const quoteParams = new URLSearchParams({
            service_type: calc.serviceType,
            square_footage: calc.sqft,
            complexity: calc.complexity,
            frequency: calc.frequency,
            estimated_cost: Math.round(calc.totalPrice),
            subscription: calc.subscription,
            urgency: calc.urgency,
            source: 'calculator',
            calculation_id: Date.now()
        });

        // Open quote form with pre-filled data
        const quoteUrl = `https://docs.google.com/forms/d/1zSq8EoZG8xcQHYtjt5pBovLA3zitegR1aU_tcniZy40/viewform?${quoteParams.toString()}`;
        window.open(quoteUrl, '_blank');

        // Track quote request
        if (typeof window.OHSAnalytics !== 'undefined') {
            window.OHSAnalytics.conversions.requestQuote(
                calc.serviceType,
                calc.totalPrice,
                calc.urgency || 'normal'
            );
        }

        // Show success message
        if (typeof window.OHS !== 'undefined' && window.OHS.showNotification) {
            window.OHS.showNotification(
                '📋 Quote form opened! We\'ll respond within 24 hours.',
                'success'
            );
        }

        console.log('📋 Quote requested:', calc);

    } catch (error) {
        console.error('Quote request error:', error);
        if (typeof window.OHS !== 'undefined' && window.OHS.showNotification) {
            window.OHS.showNotification('Error opening quote form. Please try again.', 'error');
        }
    }
}

/**
 * Request contract quote for subscription services
 */
function requestContractQuote() {
    try {
        const calc = calculatorState.lastCalculation;
        if (!calc || calc.subscription === 'payPerService') {
            if (typeof window.OHS !== 'undefined' && window.OHS.showNotification) {
                window.OHS.showNotification('Please select a contract option first.', 'warning');
            }
            return;
        }

        // Prepare contract quote parameters
        const contractParams = new URLSearchParams({
            service_type: calc.serviceType,
            square_footage: calc.sqft,
            complexity: calc.complexity,
            frequency: calc.frequency,
            contract_length: calc.subscription,
            estimated_cost: Math.round(calc.totalPrice),
            contract_savings: Math.round(calc.contractDiscount),
            urgency: calc.urgency,
            source: 'calculator_contract',
            calculation_id: Date.now()
        });

        // Open contract quote form
        const contractUrl = `https://docs.google.com/forms/d/1zSq8EoZG8xcQHYtjt5pBovLA3zitegR1aU_tcniZy40/viewform?${contractParams.toString()}`;
        window.open(contractUrl, '_blank');

        // Track contract quote request
        if (typeof window.OHSAnalytics !== 'undefined') {
            window.OHSAnalytics.conversions.requestQuote(
                `${calc.serviceType}_contract`,
                calc.totalPrice,
                'contract'
            );
        }

        // Show success message
        if (typeof window.OHS !== 'undefined' && window.OHS.showNotification) {
            window.OHS.showNotification(
                `💼 Contract quote requested for ${calc.subscription} plan!`,
                'success'
            );
        }

        console.log('💼 Contract quote requested:', calc);

    } catch (error) {
        console.error('Contract quote request error:', error);
        if (typeof window.OHS !== 'undefined' && window.OHS.showNotification) {
            window.OHS.showNotification('Error opening contract quote form. Please try again.', 'error');
        }
    }
}

/**
 * Call now function with calculator context
 */
function callNow() {
    try {
        const calc = calculatorState.lastCalculation;
        
        // Track call with calculator context
        if (typeof window.OHSAnalytics !== 'undefined') {
            window.OHSAnalytics.conversions.phoneCall('calculator', {
                estimated_value: calc ? calc.totalPrice : 0,
                service_type: calc ? calc.serviceType : 'unknown',
                facility_size: calc ? calc.sqft : 0
            });
        }

        // Initiate call
        window.open('tel:+18017125663');

        // Show helper message
        if (typeof window.OHS !== 'undefined' && window.OHS.showNotification) {
            window.OHS.showNotification(
                '📞 Calling OHS! Mention your calculator estimate for faster service.',
                'info',
                4000
            );
        }

    } catch (error) {
        console.error('Call initiation error:', error);
    }
}

// ==========================================================================
// SUBSCRIPTION SELECTION FUNCTIONS
// ==========================================================================

/**
 * Handle subscription option selection
 */
function selectSubscription(subscriptionType) {
    try {
        // Update subscription in state
        calculatorState.subscription = subscriptionType;
        
        // Update UI selection
        document.querySelectorAll('.subscription-option').forEach(option => {
            option.classList.remove('selected', 'active');
        });
        
        const selectedOption = document.getElementById(`subscription-${subscriptionType}`);
        if (selectedOption) {
            selectedOption.classList.add('selected', 'active');
        }
        
        // Update form select if it exists
        const subscriptionSelect = document.getElementById('subscription');
        if (subscriptionSelect) {
            subscriptionSelect.value = subscriptionType;
        }
        
        // Recalculate with new subscription
        updateCalculator();
        
        // Track subscription interest
        if (typeof window.OHSAnalytics !== 'undefined') {
            window.OHSAnalytics.services.serviceInterest(
                'subscription_' + subscriptionType,
                'selection',
                subscriptionType === 'payPerService' ? 3 : 7
            );
        }
        
        console.log('📋 Subscription selected:', subscriptionType);
        
    } catch (error) {
        console.error('Subscription selection error:', error);
    }
}

// ==========================================================================
// EVENT LISTENERS AND INITIALIZATION
// ==========================================================================

/**
 * Setup event listeners for calculator inputs
 */
function setupEventListeners() {
    // Input change listeners
    const inputs = ['serviceType', 'sqft', 'complexity', 'frequency', 'subscription', 'urgency'];
    
    inputs.forEach(inputId => {
        const element = document.getElementById(inputId);
        if (element) {
            element.addEventListener('change', () => {
                clearCalculatorError();
                updateCalculator();
            });
            
            // Also listen for input events on number fields
            if (inputId === 'sqft') {
                element.addEventListener('input', debounce(() => {
                    clearCalculatorError();
                    updateCalculator();
                }, 500));
            }
        }
    });

    // Subscription option buttons
    document.querySelectorAll('.subscription-option').forEach(option => {
        const subscriptionId = option.id.replace('subscription-', '');
        option.addEventListener('click', () => selectSubscription(subscriptionId));
    });

    // Action buttons
    const requestQuoteBtn = document.getElementById('requestQuoteBtn');
    if (requestQuoteBtn) {
        requestQuoteBtn.addEventListener('click', requestQuote);
    }

    const requestContractBtn = document.getElementById('requestContractBtn');
    if (requestContractBtn) {
        requestContractBtn.addEventListener('click', requestContractQuote);
    }

    const callNowBtn = document.getElementById('callNowBtn');
    if (callNowBtn) {
        callNowBtn.addEventListener('click', callNow);
    }

    console.log('👂 Calculator event listeners setup complete');
}

/**
 * Debounce function for input events
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Initialize calculator when page loads
 */
function initializeCalculator() {
    console.log('🧮 Initializing OHS Service Calculator...');
    
    try {
        // Setup event listeners
        setupEventListeners();
        
        // Run initial calculation
        setTimeout(() => {
            updateCalculator();
            console.log('✅ Calculator initialized successfully');
        }, 100);
        
        // Track calculator page view
        if (typeof window.OHSAnalytics !== 'undefined') {
            window.OHSAnalytics.trackPageView('/calculator.html', 'Service Calculator');
        }
        
    } catch (error) {
        console.error('Calculator initialization error:', error);
        showCalculatorError('Calculator failed to initialize. Please refresh the page.');
    }
}

// ==========================================================================
// GLOBAL FUNCTION EXPOSURE
// ==========================================================================

// Expose calculator functions globally
window.OHSCalculator = {
    updateCalculator,
    calculateServiceCost,
    requestQuote,
    requestContractQuote,
    callNow,
    selectSubscription,
    getCalculation: () => calculatorState.lastCalculation,
    getState: () => calculatorState,
    pricing: PRICING
};

// Legacy function names for backward compatibility
window.updateCalculator = updateCalculator;
window.requestQuote = requestQuote;
window.requestContractQuote = requestContractQuote;
window.callNow = callNow;
window.selectSubscription = selectSubscription;

// ==========================================================================
// INITIALIZATION
// ==========================================================================

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeCalculator);

// Backup initialization
window.addEventListener('load', function() {
    if (!calculatorState.lastCalculation) {
        updateCalculator();
    }
});

// Integration with global scripts
if (typeof window.OHS !== 'undefined') {
    window.OHS.calculator = window.OHSCalculator;
    console.log('🔗 Calculator integrated with OHS global scripts');
}

console.log('🎉 OHS Calculator JavaScript Loaded Successfully');
