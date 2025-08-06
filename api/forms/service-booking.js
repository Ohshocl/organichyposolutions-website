/**
 * ORGANIC HYPOSOLUTIONS - SERVICE BOOKING FORM API ENDPOINT
 * ================================================================
 * File: /api/forms/service-booking.js
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
  
  // Only allow POST requests for booking submissions
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Your existing service booking handling logic here
    // This typically includes:
    // 1. Validating the booking data
    // 2. Checking availability
    // 3. Creating the booking record
    // 4. Sending confirmation emails
    
    // Example placeholder (replace with your actual implementation):
    const { name, email, phone, service, date, time, notes } = req.body;
    
    // Validation
    if (!name || !email || !phone || !service || !date || !time) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }
    
    // Booking creation logic would go here
    // const booking = await createBooking({ name, email, phone, service, date, time, notes });
    
    res.status(200).json({
      success: true,
      message: 'Service booking submitted successfully',
      bookingId: 'sample-booking-id'
    });
  } catch (error) {
    console.error('Service booking error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}
