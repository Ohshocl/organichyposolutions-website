/**
 * ORGANIC HYPOSOLUTIONS - CONTACT FORM API ENDPOINT
 * ================================================================
 * File: /api/forms/contact.js
 * Purpose: Handle contact form submissions from contact.html and other pages
 * Dependencies: nodemailer for email delivery
 * Business Email: ohshocl@gmail.com
 * Phone: (801) 712-5663
 * ================================================================
 */

import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    
    // =================================================================
    // CORS HEADERS & PREFLIGHT
    // =================================================================
    
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
    
    if (req.method === 'OPTIONS') {
        console.log('🔄 Handling CORS preflight request');
        res.status(200).end();
        return;
    }

    // =================================================================
    // METHOD VALIDATION
    // =================================================================
    
    if (req.method !== 'POST') {
        console.warn(`❌ Invalid method: ${req.method}`);
        return res.status(405).json({ 
            success: false,
            error: 'Method not allowed',
            allowedMethods: ['POST'],
            message: 'Only POST requests are accepted for contact form submissions'
        });
    }

    console.log('📧 Processing contact form submission...');

    try {
        
        // =================================================================
        // ENVIRONMENT VALIDATION
        // =================================================================
        
        const GMAIL_USER = process.env.GMAIL_USER || process.env.CONTACT_EMAIL;
        const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD || process.env.EMAIL_SERVICE_API_KEY;

        if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
            console.error('❌ Missing email configuration');
            return res.status(500).json({
                success: false,
                error: 'Server configuration error',
                details: ['Email service not configured'],
                helpText: 'Please contact us directly at ohshocl@gmail.com or call (801) 712-5663'
            });
        }
        
        // =================================================================
        // REQUEST BODY VALIDATION
        // =================================================================
        
        const { 
            firstName, 
            lastName, 
            email, 
            phone, 
            subject, 
            message,
            company,
            serviceType,
            preferredContact,
            urgency
        } = req.body;
        
        console.log('📊 Contact form data received:', {
            hasFirstName: !!firstName,
            hasLastName: !!lastName,
            hasEmail: !!email,
            hasPhone: !!phone,
            hasSubject: !!subject,
            hasMessage: !!message,
            messageLength: message?.length || 0
        });

        // =================================================================
        // REQUIRED FIELD VALIDATION
        // =================================================================
        
        const requiredFields = {
            firstName: 'First name',
            lastName: 'Last name', 
            email: 'Email address',
            subject: 'Subject',
            message: 'Message'
        };

        const missingFields = [];
        for (const [field, label] of Object.entries(requiredFields)) {
            if (!req.body[field] || req.body[field].toString().trim() === '') {
                missingFields.push(label);
            }
        }

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields',
                details: missingFields,
                message: `Please provide the following required fields: ${missingFields.join(', ')}`
            });
        }

        // =================================================================
        // DATA VALIDATION
        // =================================================================
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            return res.status(400).json({
                success: false,
                error: 'Invalid email format',
                details: ['Please provide a valid email address'],
                message: 'The email address format is invalid'
            });
        }

        // Validate phone format (if provided)
        if (phone && phone.trim() !== '') {
            const phoneRegex = /^[\+]?[1]?[\s\-\.]?[(]?[\d\s\-\.)]+$/;
            if (!phoneRegex.test(phone.trim())) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid phone format',
                    details: ['Please provide a valid phone number'],
                    message: 'The phone number format is invalid'
                });
            }
        }

        // Validate message length
        if (message.trim().length < 10) {
            return res.status(400).json({
                success: false,
                error: 'Message too short',
                details: ['Message must be at least 10 characters long'],
                message: 'Please provide a more detailed message'
            });
        }

        if (message.trim().length > 5000) {
            return res.status(400).json({
                success: false,
                error: 'Message too long',
                details: ['Message must be less than 5000 characters'],
                message: 'Please shorten your message'
            });
        }

        // =================================================================
        // SPAM PROTECTION (Basic)
        // =================================================================
        
        const spamKeywords = ['casino', 'viagra', 'lottery', 'winner', 'congratulations', 'click here', 'buy now'];
        const messageText = `${subject} ${message}`.toLowerCase();
        const hasSpamContent = spamKeywords.some(keyword => messageText.includes(keyword));
        
        if (hasSpamContent) {
            console.warn('🚨 Potential spam detected:', { email, subject });
            return res.status(400).json({
                success: false,
                error: 'Message flagged by spam filter',
                message: 'Your message was flagged by our spam filter. Please contact us directly at ohshocl@gmail.com'
            });
        }

        // =================================================================
        // PREPARE EMAIL CONTENT
        // =================================================================
        
        const customerName = `${firstName.trim()} ${lastName.trim()}`;
        const timestamp = new Date().toLocaleString('en-US', { 
            timeZone: 'America/Denver',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        // Email to business (ohshocl@gmail.com)
        const businessEmailSubject = `🔔 New Contact Form: ${subject.trim()}`;
        const businessEmailBody = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 NEW CONTACT FORM SUBMISSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 DATE & TIME: ${timestamp} (Mountain Time)
👤 FROM: ${customerName}
📧 EMAIL: ${email.trim()}
📞 PHONE: ${phone?.trim() || 'Not provided'}
🏢 COMPANY: ${company?.trim() || 'Not provided'}
🛠️ SERVICE TYPE: ${serviceType?.trim() || 'General Inquiry'}
📞 PREFERRED CONTACT: ${preferredContact?.trim() || 'Email'}
⚡ URGENCY: ${urgency?.trim() || 'Standard'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 SUBJECT: ${subject.trim()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💬 MESSAGE:
${message.trim()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 QUICK ACTIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📧 Reply to customer: ${email.trim()}
📞 Call customer: ${phone?.trim() || 'No phone provided'}
🌐 Website: https://organichyposolutions.com

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This message was sent from the Organic HypoSolutions website contact form.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `.trim();

        // Auto-reply email to customer
        const customerEmailSubject = `✅ Thank you for contacting Organic HypoSolutions`;
        const customerEmailBody = `
Hello ${firstName.trim()},

Thank you for reaching out to Organic HypoSolutions! We have received your message and appreciate your interest in our organic sanitization services.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 YOUR MESSAGE DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Subject: ${subject.trim()}
Submitted: ${timestamp} (Mountain Time)
Reference: Contact-${Date.now()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏰ WHAT HAPPENS NEXT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ We typically respond within 2-4 business hours
✅ For urgent matters, please call us at (801) 712-5663
✅ We'll provide a detailed quote and service timeline
✅ All consultations are FREE and no-obligation

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌿 ABOUT ORGANIC HYPOSOLUTIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Utah's leading provider of organic sanitization services
🔹 EPA-registered organic products
🔹 USDA-certified organic solutions  
🔹 Safe for families, pets, and the environment
🔹 Professional, licensed, and insured

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📞 CONTACT INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📞 Phone: (801) 712-5663
📧 Email: ohshocl@gmail.com
🌐 Website: https://organichyposolutions.com
📍 Service Area: Utah (Salt Lake City, Provo, Ogden & surrounding areas)

Thank you for choosing Organic HypoSolutions for your sanitization needs!

Best regards,
The Organic HypoSolutions Team

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This is an automated response. Please do not reply to this email.
For immediate assistance, call (801) 712-5663 or email ohshocl@gmail.com
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `.trim();

        // =================================================================
        // SEND EMAILS
        // =================================================================
        
        console.log('📧 Configuring email transporter...');
        
        // Configure Gmail SMTP transporter
        const transporter = nodemailer.createTransporter({
            service: 'gmail',
            auth: {
                user: GMAIL_USER,
                pass: GMAIL_APP_PASSWORD
            }
        });

        // Send notification to business
        console.log('📤 Sending notification to business...');
        
        const businessMailOptions = {
            from: `"Organic HypoSolutions Website" <${GMAIL_USER}>`,
            to: GMAIL_USER, // ohshocl@gmail.com
            subject: businessEmailSubject,
            text: businessEmailBody,
            html: businessEmailBody.replace(/\n/g, '<br>').replace(/━/g, '─'),
            replyTo: email.trim()
        };

        await transporter.sendMail(businessMailOptions);
        console.log('✅ Business notification sent successfully');

        // Send auto-reply to customer
        console.log('📤 Sending auto-reply to customer...');
        
        const customerMailOptions = {
            from: `"Organic HypoSolutions" <${GMAIL_USER}>`,
            to: email.trim(),
            subject: customerEmailSubject,
            text: customerEmailBody,
            html: customerEmailBody.replace(/\n/g, '<br>').replace(/━/g, '─')
        };

        await transporter.sendMail(customerMailOptions);
        console.log('✅ Customer auto-reply sent successfully');

        // =================================================================
        // SUCCESS RESPONSE
        // =================================================================
        
        console.log('✅ Contact form processed successfully');

        const response = {
            success: true,
            message: 'Your message has been sent successfully!',
            details: {
                customerName: customerName,
                submittedAt: timestamp,
                reference: `Contact-${Date.now()}`,
                responseTime: 'We typically respond within 2-4 business hours',
                urgentContact: 'For urgent matters, please call (801) 712-5663'
            },
            nextSteps: [
                'Check your email for a confirmation message',
                'We will respond within 2-4 business hours',
                'For urgent matters, call (801) 712-5663',
                'All consultations are FREE and no-obligation'
            ]
        };

        res.status(200).json(response);

    } catch (error) {
        
        // =================================================================
        // ERROR HANDLING
        // =================================================================
        
        console.error('❌ Contact form error:', error);
        console.error('Stack trace:', error.stack);

        let statusCode = 500;
        let errorMessage = 'Failed to send your message';
        const errorDetails = [error.message];

        // Handle specific error types
        if (error.message.includes('Invalid email')) {
            statusCode = 400;
            errorMessage = 'Invalid email configuration';
        } else if (error.message.includes('SMTP') || error.message.includes('authentication')) {
            statusCode = 503;
            errorMessage = 'Email service temporarily unavailable';
            errorDetails.push('Please try again in a few minutes or contact us directly');
        } else if (error.message.includes('timeout')) {
            statusCode = 504;
            errorMessage = 'Request timeout - message may still be delivered';
        }

        res.status(statusCode).json({
            success: false,
            error: errorMessage,
            details: errorDetails,
            fallbackContact: {
                email: 'ohshocl@gmail.com',
                phone: '(801) 712-5663',
                message: 'You can contact us directly using the information above'
            },
            timestamp: new Date().toISOString()
        });
    }
}

// =================================================================
// EXPORT CONFIGURATION - VERCEL COMPATIBLE
// =================================================================

// ✅ CURRENT: Using supported Node.js runtime
export const config = {
    runtime: 'nodejs',      // Current supported runtime (Node.js 20.x)
    maxDuration: 30         // 30 seconds timeout for email delivery
};
