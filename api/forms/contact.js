/**
 * ORGANIC HYPOSOLUTIONS - CONTACT FORM API ENDPOINT
 * ================================================================
 * File: /api/forms/contact.js
 * Purpose: Processes contact form submissions and sends email notifications
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
    const { name, email, message, phone, subject, company } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Name, email, and message are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format',
        message: 'Please provide a valid email address'
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

    // Here you would implement the actual email sending
    // using nodemailer or another email service
    
    // For now, return a success response to test the endpoint
    res.status(200).json({
      success: true,
      message: "Contact form submission received",
      debug: {
        emailConfigured: !!process.env.CONTACT_EMAIL,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Contact form error:', error);
    
    res.status(500).json({
      success: false,
      error: "Form submission failed",
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

export const config = {
  runtime: 'nodejs',
  maxDuration: 30
};
