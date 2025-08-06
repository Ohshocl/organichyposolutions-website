/**
 * ORGANIC HYPOSOLUTIONS - CONTACT FORM API ENDPOINT
 * ================================================================
 * File: /api/forms/contact.js
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
  
  // Only allow POST requests for form submissions
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Extract form data from request body
    const { 
      name,
      email,
      phone,
      subject,
      message,
      newsletter = false,
      source = 'website' 
    } = req.body;
    
    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields. Name, email, and message are required.' 
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
    const emailSubject = subject || `New Contact Form Submission from ${name}`;
    const emailText = `
      New contact form submission from the website:
      
      Name: ${name}
      Email: ${email}
      ${phone ? `Phone: ${phone}` : ''}
      ${subject ? `Subject: ${subject}` : ''}
      
      Message:
      ${message}
      
      ${newsletter ? 'The user has opted in to receive the newsletter.' : ''}
      Source: ${source}
      Date: ${new Date().toISOString()}
    `;
    
    const emailHtml = `
      <h2>New Contact Form Submission</h2>
      <p><strong>From:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
      ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
      
      <h3>Message:</h3>
      <p>${message.replace(/\n/g, '<br>')}</p>
      
      <p><small>
        ${newsletter ? 'The user has opted in to receive the newsletter.<br>' : ''}
        Source: ${source}<br>
        Date: ${new Date().toISOString()}
      </small></p>
    `;
    
    // Send email to staff
    await transporter.sendMail({
      from: `"Organic Hyposolutions Website" <${process.env.EMAIL_FROM}>`,
      to: process.env.CONTACT_FORM_RECIPIENT,
      subject: emailSubject,
      text: emailText,
      html: emailHtml
    });
    
    // Send confirmation email to the user
    if (process.env.SEND_CONFIRMATION_EMAIL === 'true') {
      const confirmationText = `
        Dear ${name},
        
        Thank you for contacting Organic Hyposolutions. We have received your message and will get back to you as soon as possible.
        
        Your message:
        ${message}
        
        Best regards,
        The Organic Hyposolutions Team
      `;
      
      const confirmationHtml = `
        <h2>Thank You for Contacting Us</h2>
        <p>Dear ${name},</p>
        <p>Thank you for contacting Organic Hyposolutions. We have received your message and will get back to you as soon as possible.</p>
        
        <h3>Your message:</h3>
        <p>${message.replace(/\n/g, '<br>')}</p>
        
        <p>Best regards,<br>
        The Organic Hyposolutions Team</p>
      `;
      
      await transporter.sendMail({
        from: `"Organic Hyposolutions" <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: 'Thank You for Contacting Organic Hyposolutions',
        text: confirmationText,
        html: confirmationHtml
      });
    }
    
    // Store in database if configured (optional)
    // if (process.env.STORE_FORM_SUBMISSIONS === 'true') {
    //   const db = await connectToDatabase();
    //   await db.collection('contactSubmissions').insertOne({
    //     name,
    //     email,
    //     phone,
    //     subject,
    //     message,
    //     newsletter,
    //     source,
    //     timestamp: new Date()
    //   });
    // }
    
    // Return success response
    res.status(200).json({
      success: true,
      message: 'Contact form submitted successfully. We will get back to you soon.'
    });
    
  } catch (error) {
    console.error('Contact form submission error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process your contact form submission. Please try again later.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
