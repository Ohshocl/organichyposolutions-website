/**
 * ORGANIC HYPOSOLUTIONS - CONTACT FORM API ENDPOINT
 * ================================================================
 * File: /api/forms/contact.js
 */

export default async function handler(req, res) {
  // DIRECT CORS HANDLING - No imports needed
  const origin = req.headers.origin;
  // Allow any origin from our domains
  res.setHeader('Access-Control-Allow-Origin', origin || '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', '*');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Only allow POST requests for form submissions
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Your existing contact form handling logic here
    // This typically includes:
    // 1. Validating the form data
    // 2. Sending an email notification
    // 3. Possibly storing the submission in a database
    
    // Example placeholder (replace with your actual implementation):
    const { name, email, message } = req.body;
    
    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Email sending logic would go here
    // await sendEmail({ to: 'your@email.com', subject: 'New Contact Form', text: `From: ${name} (${email})\n\n${message}` });
    
    res.status(200).json({
      success: true,
      message: 'Contact form submitted successfully'
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}
