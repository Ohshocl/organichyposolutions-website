/**
 * ORGANIC HYPOSOLUTIONS - SERVICE BOOKING API ENDPOINT
 * ================================================================
 * File: /api/forms/service-booking.js
 * Purpose: Processes service booking form submissions
 */

// Import CORS helper
const { setCorsHeaders, handlePreflight } = require('../_utils/cors');

export default async function handler(req, res) {
  // Set CORS headers
  setCorsHeaders(req, res);
  
  // Handle preflight requests
  if (handlePreflight(req, res)) {
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
      message: 'This endpoint only accepts POST requests'
    });
  }

  try {
    // Extract form data
    const {
      serviceType,
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      propertySize,
      urgency,
      serviceDescription,
      addons,
      termsAccepted
    } = req.body;

    // Validate required fields
    const requiredFields = {
      serviceType: 'Service type',
      firstName: 'First name',
      lastName: 'Last name',
      email: 'Email address',
      phone: 'Phone number',
      termsAccepted: 'Terms acceptance'
    };

    const missingFields = [];
    for (const [field, label] of Object.entries(requiredFields)) {
      if (!req.body[field] || req.body[field] === '') {
        missingFields.push(label);
      }
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        missingFields: missingFields,
        message: `Please provide: ${missingFields.join(', ')}`
      });
    }

    // Check email configuration
    if (!process.env.CONTACT_EMAIL) {
      return res.status(500).json({
        success: false,
        error: 'Configuration error',
        message: 'Email service not properly configured'
      });
    }

    // Here you would implement the actual service booking logic
    // including email notifications
    
    // For now, return a success response to test the endpoint
    res.status(200).json({
      success: true,
      message: "Service booking request received",
      bookingReference: `SB-${Date.now()}`,
      debug: {
        emailConfigured: !!process.env.CONTACT_EMAIL,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Service booking error:', error);
    
    res.status(500).json({
      success: false,
      error: "Booking submission failed",
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

export const config = {
  runtime: 'nodejs',
  maxDuration: 30
};
