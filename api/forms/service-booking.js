/**
 * ORGANIC HYPOSOLUTIONS - SERVICE BOOKING FORM API ENDPOINT
 * ================================================================
 * File: /api/forms/service-booking.js
 */

// Email service import (example using Nodemailer)
import nodemailer from 'nodemailer';

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
    // Extract booking data from request body
    const { 
      name,
      email,
      phone,
      service,
      preferredDate,
      preferredTime,
      alternativeDate,
      alternativeTime,
      address,
      city,
      postalCode,
      specialRequirements,
      hearAboutUs,
      agreedToTerms = false 
    } = req.body;
    
    // Validate required fields
    if (!name || !email || !phone || !service || !preferredDate || !preferredTime) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields. Name, email, phone, service, preferred date and time are required.' 
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid email format.' 
      });
    }
    
    // Validate phone format (simple validation)
    const phoneRegex = /^[0-9+\-\s()]{7,20}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid phone number format.' 
      });
    }
    
    // Validate terms agreement
    if (!agreedToTerms) {
      return res.status(400).json({ 
        success: false, 
        error: 'You must agree to the terms and conditions.' 
      });
    }
    
    // Generate a unique booking reference
    const bookingReference = `OHS-${Date.now().toString().substr(-6)}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    
    // Create email transport
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    
    // Format email message to staff
    const emailSubject = `New Service Booking: ${service} - ${name}`;
    const emailText = `
      New service booking from the website:
      
      Reference: ${bookingReference}
      
      Customer Information:
      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      
      Service Details:
      Service: ${service}
      Preferred Date: ${preferredDate}
      Preferred Time: ${preferredTime}
      ${alternativeDate ? `Alternative Date: ${alternativeDate}` : ''}
      ${alternativeTime ? `Alternative Time: ${alternativeTime}` : ''}
      
      ${address ? `Address: ${address}` : ''}
      ${city ? `City: ${city}` : ''}
      ${postalCode ? `Postal Code: ${postalCode}` : ''}
      
      ${specialRequirements ? `Special Requirements: ${specialRequirements}` : ''}
      How they heard about us: ${hearAboutUs || 'Not specified'}
      
      Date of booking request: ${new Date().toISOString()}
    `;
    
    const emailHtml = `
      <h2>New Service Booking</h2>
      <p><strong>Reference:</strong> ${bookingReference}</p>
      
      <h3>Customer Information:</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      
      <h3>Service Details:</h3>
      <p><strong>Service:</strong> ${service}</p>
      <p><strong>Preferred Date:</strong> ${preferredDate}</p>
      <p><strong>Preferred Time:</strong> ${preferredTime}</p>
      ${alternativeDate ? `<p><strong>Alternative Date:</strong> ${alternativeDate}</p>` : ''}
      ${alternativeTime ? `<p><strong>Alternative Time:</strong> ${alternativeTime}</p>` : ''}
      
      ${address || city || postalCode ? `<h3>Location:</h3>` : ''}
      ${address ? `<p><strong>Address:</strong> ${address}</p>` : ''}
      ${city ? `<p><strong>City:</strong> ${city}</p>` : ''}
      ${postalCode ? `<p><strong>Postal Code:</strong> ${postalCode}</p>` : ''}
      
      ${specialRequirements ? `<h3>Special Requirements:</h3><p>${specialRequirements.replace(/\n/g, '<br>')}</p>` : ''}
      
      <p><strong>How they heard about us:</strong> ${hearAboutUs || 'Not specified'}</p>
      
      <p><small>Date of booking request: ${new Date().toISOString()}</small></p>
    `;
    
    // Send email to staff
    await transporter.sendMail({
      from: `"Organic Hyposolutions Website" <${process.env.EMAIL_FROM}>`,
      to: process.env.BOOKING_FORM_RECIPIENT,
      subject: emailSubject,
      text: emailText,
      html: emailHtml
    });
    
    // Send confirmation email to the user
    const confirmationText = `
      Dear ${name},
      
      Thank you for booking a service with Organic Hyposolutions. Your booking request has been received and we will contact you soon to confirm the details.
      
      Your Booking Reference: ${bookingReference}
      
      Service: ${service}
      Preferred Date: ${preferredDate}
      Preferred Time: ${preferredTime}
      
      If you need to make any changes to your booking, please contact us and quote your booking reference.
      
      Best regards,
      The Organic Hyposolutions Team
    `;
    
    const confirmationHtml = `
      <h2>Service Booking Confirmation</h2>
      <p>Dear ${name},</p>
      <p>Thank you for booking a service with Organic Hyposolutions. Your booking request has been received and we will contact you soon to confirm the details.</p>
      
      <p><strong>Your Booking Reference:</strong> ${bookingReference}</p>
      
      <p><strong>Service:</strong> ${service}<br>
      <strong>Preferred Date:</strong> ${preferredDate}<br>
      <strong>Preferred Time:</strong> ${preferredTime}</p>
      
      <p>If you need to make any changes to your booking, please contact us and quote your booking reference.</p>
      
      <p>Best regards,<br>
      The Organic Hyposolutions Team</p>
    `;
    
    await transporter.sendMail({
      from: `"Organic Hyposolutions" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Your Service Booking Confirmation - Organic Hyposolutions',
      text: confirmationText,
      html: confirmationHtml
    });
    
    // Store in database (optional)
    // const db = await connectToDatabase();
    // const bookingRecord = await db.collection('bookings').insertOne({
    //   reference: bookingReference,
    //   name,
    //   email,
    //   phone,
    //   service,
    //   preferredDate,
    //   preferredTime,
    //   alternativeDate,
    //   alternativeTime,
    //   address,
    //   city,
    //   postalCode,
    //   specialRequirements,
    //   hearAboutUs,
    //   status: 'pending', // Initial status
    //   createdAt: new Date(),
    //   updatedAt: new Date()
    // });
    
    // Return success response
    res.status(200).json({
      success: true,
      message: 'Service booking submitted successfully. We will contact you soon to confirm your appointment.',
      bookingReference: bookingReference
    });
    
  } catch (error) {
    console.error('Service booking error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process your service booking. Please try again later or contact us directly.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
