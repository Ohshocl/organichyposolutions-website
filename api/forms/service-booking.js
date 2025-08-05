/**
 * Service Booking API Endpoint
 * File: /api/forms/service-booking.js
 * 
 * Handles service booking form submissions from shop/book-service.html
 * Processes booking data, validates inputs, and sends notifications
 * 
 * Dependencies: nodemailer (npm install nodemailer)
 * Integration: Called by shop/book-service.html form submission
 * Email: Sends notifications to ohshocl@gmail.com
 */

import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    // Set CORS headers for frontend integration
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            error: 'Method not allowed',
            message: 'Only POST requests are accepted'
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
            address: 'Street address',
            city: 'City',
            state: 'State',
            zipCode: 'ZIP code',
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
                error: 'Missing required fields',
                missingFields: missingFields,
                message: `Please provide: ${missingFields.join(', ')}`
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                error: 'Invalid email format',
                message: 'Please provide a valid email address'
            });
        }

        // Validate phone format (basic US phone number validation)
        const phoneRegex = /^[\+]?[1]?[\s\-\.]?[(]?[\d\s\-\.\(\)]{10,}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({
                error: 'Invalid phone format',
                message: 'Please provide a valid phone number'
            });
        }

        // Validate service type
        const validServiceTypes = ['residential', 'commercial', 'emergency'];
        if (!validServiceTypes.includes(serviceType)) {
            return res.status(400).json({
                error: 'Invalid service type',
                message: 'Please select a valid service type'
            });
        }

        // Process add-ons (if any)
        const processedAddons = Array.isArray(addons) ? addons : (addons ? [addons] : []);
        const validAddons = ['organic-treatment', 'hvac-treatment', 'followup-products', 'certificate'];
        const invalidAddons = processedAddons.filter(addon => !validAddons.includes(addon));
        
        if (invalidAddons.length > 0) {
            return res.status(400).json({
                error: 'Invalid add-ons selected',
                invalidAddons: invalidAddons
            });
        }

        // Calculate pricing estimate
        function calculateEstimate() {
            let basePrice = 0;
            
            // Base pricing by service type
            switch (serviceType) {
                case 'residential':
                    basePrice = 125;
                    break;
                case 'commercial':
                    basePrice = 295;
                    break;
                case 'emergency':
                    basePrice = 200;
                    break;
            }

            // Property size multiplier
            const sizeMultipliers = {
                'under-1000': 1,
                '1000-2500': 1.5,
                '2500-5000': 2.2,
                '5000-10000': 3.5,
                'over-10000': 5
            };

            if (propertySize && sizeMultipliers[propertySize]) {
                basePrice *= sizeMultipliers[propertySize];
            }

            // Urgency multiplier
            const urgencyMultipliers = {
                'standard': 1,
                'priority': 1.3,
                'emergency': 1.8
            };

            if (urgency && urgencyMultipliers[urgency]) {
                basePrice *= urgencyMultipliers[urgency];
            }

            // Add-on costs
            let addonCost = 0;
            processedAddons.forEach(addon => {
                switch (addon) {
                    case 'organic-treatment':
                        addonCost += 25;
                        break;
                    case 'hvac-treatment':
                        addonCost += 75;
                        break;
                    case 'followup-products':
                        addonCost += 45;
                        break;
                    case 'certificate':
                        addonCost += 15;
                        break;
                }
            });

            return Math.round(basePrice + addonCost);
        }

        const estimatedCost = calculateEstimate();

        // Create booking record
        const bookingData = {
            id: `SB_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString(),
            serviceType,
            customer: {
                firstName,
                lastName,
                email,
                phone
            },
            location: {
                address,
                city,
                state,
                zipCode
            },
            serviceDetails: {
                propertySize: propertySize || 'Not specified',
                urgency: urgency || 'standard',
                description: serviceDescription || 'No additional details provided',
                addons: processedAddons
            },
            estimatedCost,
            status: 'pending',
            source: 'website_booking_form'
        };

        // Format email content
        const customerEmailContent = `
Dear ${firstName} ${lastName},

Thank you for booking a service with Organic HypoSolutions!

BOOKING DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Service Type: ${serviceType.charAt(0).toUpperCase() + serviceType.slice(1)}
Booking ID: ${bookingData.id}
Estimated Cost: $${estimatedCost}

SERVICE LOCATION:
${address}
${city}, ${state} ${zipCode}

SERVICE DETAILS:
Property Size: ${propertySize || 'Not specified'}
Urgency: ${urgency || 'Standard (2-3 days)'}
${serviceDescription ? `Description: ${serviceDescription}` : ''}

${processedAddons.length > 0 ? `SELECTED ADD-ONS:
${processedAddons.map(addon => {
    switch (addon) {
        case 'organic-treatment': return '• USDA Organic Treatment (+$25)';
        case 'hvac-treatment': return '• HVAC System Treatment (+$75)';
        case 'followup-products': return '• Follow-up Products (+$45)';
        case 'certificate': return '• Completion Certificate (+$15)';
        default: return `• ${addon}`;
    }
}).join('\n')}` : ''}

NEXT STEPS:
• Our team will contact you within 2 hours to confirm your appointment
• We'll schedule a convenient time for your service
• Payment is due upon completion of service
• We accept cash, check, and all major credit cards

Questions? Contact us:
Phone: (801) 712-5663
Email: ohshocl@gmail.com

Thank you for choosing Organic HypoSolutions for your disinfection needs!

Best regards,
The OHS Team
Utah's Premier Hypochlorous Acid Specialists
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `.trim();

        const teamNotificationContent = `
🚨 NEW SERVICE BOOKING ALERT 🚨

${urgency === 'emergency' ? '⚠️  EMERGENCY SERVICE - CONTACT IMMEDIATELY' : urgency === 'priority' ? '🟡 PRIORITY SERVICE - Contact within 1 hour' : '🟢 STANDARD SERVICE - Contact within 2 hours'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BOOKING DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Booking ID: ${bookingData.id}
Submitted: ${new Date().toLocaleString('en-US', { timeZone: 'America/Denver' })} MST
Service Type: ${serviceType.charAt(0).toUpperCase() + serviceType.slice(1)}
Estimated Value: ${estimatedCost}
Urgency Level: ${urgency || 'Standard (2-3 days)'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CUSTOMER CONTACT INFO (PRIORITY)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${firstName} ${lastName}
Phone: ${phone} ${urgency === 'emergency' ? '📞 CALL IMMEDIATELY' : urgency === 'priority' ? '📞 CALL WITHIN 1 HOUR' : '📞 CALL WITHIN 2 HOURS'}
Email: ${email}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SERVICE LOCATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${address}
${city}, ${state} ${zipCode}
Property Size: ${propertySize || 'Not specified'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SERVICE REQUIREMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${serviceDescription ? `Customer Notes: "${serviceDescription}"` : 'No additional notes provided'}

${processedAddons.length > 0 ? `Requested Add-ons:
${processedAddons.map(addon => {
    switch (addon) {
        case 'organic-treatment': return '• USDA Organic Treatment (+$25)';
        case 'hvac-treatment': return '• HVAC System Treatment (+$75)';
        case 'followup-products': return '• Follow-up Products (+$45)';
        case 'certificate': return '• Completion Certificate (+$15)';
        default: return `• ${addon}`;
    }
}).join('\n')}` : 'No add-ons selected'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REQUIRED ACTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. ${urgency === 'emergency' ? 'CALL CUSTOMER IMMEDIATELY' : urgency === 'priority' ? 'Call customer within 1 hour' : 'Call customer within 2 hours'}
2. Confirm service appointment date/time
3. Verify pricing and service requirements
4. Schedule technician and equipment
5. Send calendar invite to customer

Next Steps: Use booking ID ${bookingData.id} for all correspondence.

WEBSITE BOOKING SYSTEM - AUTO-GENERATED
        `.trim();

        // Send email notifications
        try {
            // Send confirmation email to customer
            await sendEmail({
                to: email,
                subject: `Service Booking Confirmation - ${bookingData.id}`,
                text: customerEmailContent
            });

            // Send notification email to OHS team
            await sendEmail({
                to: 'ohshocl@gmail.com',
                subject: `🚨 NEW SERVICE BOOKING: ${serviceType.toUpperCase()} - ${estimatedCost} (${urgency || 'standard'})`,
                text: teamNotificationContent
            });

            console.log('📧 Email notifications sent successfully');
        } catch (emailError) {
            console.error('📧 Email sending failed:', emailError);
            // Don't fail the booking if email fails - just log it
        }

        // Log booking for development/testing
        console.log('📋 New Service Booking:', JSON.stringify(bookingData, null, 2));

        // Return success response
        res.status(200).json({
            success: true,
            message: 'Service booking submitted successfully',
            bookingId: bookingData.id,
            estimatedCost: estimatedCost,
            nextSteps: [
                'Our team will contact you within 2 hours',
                'We will schedule a convenient appointment time',
                'Service will be performed by licensed professionals',
                'Payment is due upon completion'
            ]
        });

    } catch (error) {
        console.error('Service booking API error:', error);

        // Return error response
        res.status(500).json({
            error: 'Internal server error',
            message: 'Unable to process booking request. Please try again or call us at (801) 712-5663.',
            timestamp: new Date().toISOString()
        });
    }
}

/**
 * Gmail SMTP Email Service Implementation
 * Sends booking confirmations to customers and notifications to ohshocl@gmail.com
 */

// Configure Gmail SMTP transporter
const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER, // ohshocl@gmail.com
        pass: process.env.GMAIL_APP_PASSWORD // Gmail App Password (not your regular password)
    }
});

async function sendEmail({ to, subject, text }) {
    const mailOptions = {
        from: `"Organic HypoSolutions" <${process.env.GMAIL_USER}>`,
        to,
        subject,
        text,
        // Add HTML version for better formatting
        html: text.replace(/\n/g, '<br>').replace(/━/g, '─')
    };
    
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('📧 Email sent successfully:', info.messageId);
        return info;
    } catch (error) {
        console.error('📧 Gmail SMTP error:', error);
        throw error;
    }
}

/**
 * GMAIL SETUP INSTRUCTIONS
 * 
 * 1. Enable 2-Factor Authentication on ohshocl@gmail.com
 * 2. Generate an App Password:
 *    - Go to Google Account settings
 *    - Security → 2-Step Verification → App passwords
 *    - Select "Mail" and generate password
 * 3. Add environment variables to Vercel:
 *    GMAIL_USER=ohshocl@gmail.com
 *    GMAIL_APP_PASSWORD=your_16_character_app_password
 * 
 * For development (.env.local):
 * GMAIL_USER=ohshocl@gmail.com
 * GMAIL_APP_PASSWORD=your_app_password_here
 */
