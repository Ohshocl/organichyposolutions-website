/**
 * ORGANIC HYPOSOLUTIONS - CORS Helper Utility
 * ================================================================
 * File: /api/_utils/cors.js
 * Purpose: Centralized CORS handling for all API endpoints
 */

// Allowed origins for CORS
const allowedOrigins = [
  // Production domains
  'https://organichyposolutions.com',
  'https://www.organichyposolutions.com',
  
  // Vercel preview domains
  'https://organichyposolutions-website.vercel.app',
  'https://organichyposolutions-website-git-main-ohss-projects-e45c0d7a.vercel.app',
  'https://organichyposolutions-website-zsvji7i3s-ohss-projects-e45c0d7a.vercel.app',
  
  // Local development
  'http://localhost:3000'
];

/**
 * Sets up CORS headers for API responses
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
function setCorsHeaders(req, res) {
  const origin = req.headers.origin;
  
  // Set allowed origin
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    // For development/testing
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  
  // Additional CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader(
    'Access-Control-Allow-Headers', 
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );
}

/**
 * Handles OPTIONS preflight requests
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {boolean} - True if handled, false otherwise
 */
function handlePreflight(req, res) {
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }
  return false;
}

module.exports = {
  setCorsHeaders,
  handlePreflight,
  allowedOrigins
};
