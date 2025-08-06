/**
 * ORGANIC HYPOSOLUTIONS - CORS Helper Utility
 * ================================================================
 * File: /api/_utils/cors.js
 */

/**
 * Sets up CORS headers for API responses
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
function setCorsHeaders(req, res) {
  const origin = req.headers.origin;
  
  // Allow any origin from organichyposolutions domain
  if (origin && (
      origin.includes('organichyposolutions.com') || 
      origin.includes('organichyposolutions-website') ||
      origin.includes('ohss-projects') ||
      origin.includes('localhost')
    )) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    // More permissive for development
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
  handlePreflight
};
