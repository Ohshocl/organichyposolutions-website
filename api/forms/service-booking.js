// /api/forms/service-booking.js
// API endpoint for handling service booking form submissions

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            success: false, 
            message: 'Method not allowed. Use POST.' 
        });
    }

    try {
        // Extract form data
        const {
            serviceType,
            customerName,
            customerEmail,
            customerPhone,
            preferredDate,
            preferredTime,
            serviceLocation,
            propertySize,
            additionalServices,
            specialRequirements,
            hearAboutUs,
            notes
        } = req.body;

        // Validate required fields
        const requiredFields = {
            serviceType: 'Service type',
            customerName: 'Full name',
            customerEmail: 'Email address',
            customerPhone: 'Phone number',
            preferredDate: 'Preferred date'
        };

        const missingFields = [];
        for (const [field, label] of Object.entries(requiredFields)) {
            if (!req.body[field] || req.body[field].trim() === '') {
                missingFields.push(label);
            }
        }

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(customerEmail)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        // Validate phone number (basic validation)
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        const cleanPhone = customerPhone.replace(/\D/g, '');
        if (cleanPhone.length < 10) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid phone number'
            });
        }

        // Validate date (must be in the future)
        const selectedDate = new Date(preferredDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            return res.status(400).json({
                success: false,
                message: 'Please select a future date for your service'
            });
        }

        // Format the booking data
        const bookingData = {
            serviceType: serviceType.trim(),
            customer: {
                name: customerName.trim(),
                email: customerEmail.trim().toLowerCase(),
                phone: customerPhone.trim()
            },
            scheduling: {
                preferredDate: preferredDate,
                preferredTime: preferredTime || 'Flexible',
                location: serviceLocation?.trim() || 'Not specified'
            },
            serviceDetails: {
                propertySize: propertySize || 'Not specified',
                additionalServices: additionalServices || [],
                specialRequirements: specialRequirements?.trim() || 'None',
                notes: notes?.trim() || 'None'
            },
            marketing: {
                hearAboutUs: hearAboutUs || 'Not specified'
            },
            submission: {
                date: new Date().toISOString(),
                ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
            }
        };

        // Generate booking reference number
        const bookingRef = `OHS-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
        bookingData.bookingReference = bookingRef;

        // Log the booking (in production, you'd save to database)
        console.log('New Service Booking:', bookingData);

        // Send confirmation email (you'll need to implement email service)
        await sendBookingConfirmation(bookingData);
        
        // Send notification to business (you'll need to implement this)
        await sendBusinessNotification(bookingData);

        // Return success response
        res.status(200).json({
            success: true,
            message: 'Service booking request submitted successfully!',
            bookingReference: bookingRef,
            data: {
                serviceType: bookingData.serviceType,
                preferredDate: bookingData.scheduling.preferredDate,
                customerName: bookingData.customer.name
            }
        });

    } catch (error) {
        console.error('Service booking error:', error);
        
        res.status(500).json({
            success: false,
            message: 'Internal server error. Please try again later.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

// Email confirmation function (implement based on your email service)
async function sendBookingConfirmation(bookingData) {
    try {
        // Example implementation - replace with your email service
        const emailData = {
            to: bookingData.customer.email,
            subject: `Service Booking Confirmation - ${bookingData.bookingReference}`,
            html: generateConfirmationEmail(bookingData)
        };

        // Send email using your preferred service (SendGrid, Mailgun, etc.)
        // await emailService.send(emailData);
        
        console.log('Confirmation email would be sent to:', bookingData.customer.email);
    } catch (error) {
        console.error('Failed to send confirmation email:', error);
        // Don't throw error - booking should still succeed even if email fails
    }
}

// Business notification function
async function sendBusinessNotification(bookingData) {
    try {
        const businessEmail = process.env.BUSINESS_EMAIL || 'info@ohshomeservices.com';
        
        const emailData = {
            to: businessEmail,
            subject: `New Service Booking Request - ${bookingData.serviceType}`,
            html: generateBusinessNotificationEmail(bookingData)
        };

        // Send email using your preferred service
        // await emailService.send(emailData);
        
        console.log('Business notification would be sent to:', businessEmail);
    } catch (error) {
        console.error('Failed to send business notification:', error);
    }
}

// Generate customer confirmation email HTML
function generateConfirmationEmail(bookingData) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Booking Confirmation</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #28a745;">Service Booking Confirmation</h2>
                
                <p>Dear ${bookingData.customer.name},</p>
                
                <p>Thank you for choosing OHS Home Services! We've received your service booking request.</p>
                
                <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h3>Booking Details:</h3>
                    <p><strong>Booking Reference:</strong> ${bookingData.bookingReference}</p>
                    <p><strong>Service Type:</strong> ${bookingData.serviceType}</p>
                    <p><strong>Preferred Date:</strong> ${new Date(bookingData.scheduling.preferredDate).toLocaleDateString()}</p>
                    <p><strong>Preferred Time:</strong> ${bookingData.scheduling.preferredTime}</p>
                    <p><strong>Location:</strong> ${bookingData.scheduling.location}</p>
                </div>
                
                <p><strong>What's Next?</strong></p>
                <ul>
                    <li>Our team will review your request within 24 hours</li>
                    <li>We'll contact you at ${bookingData.customer.phone} to confirm details</li>
                    <li>You'll receive a final confirmation with appointment details</li>
                </ul>
                
                <p>If you have any questions, please don't hesitate to contact us:</p>
                <p>📞 Phone: [Your Phone Number]<br>
                📧 Email: [Your Email]<br>
                🌐 Website: [Your Website]</p>
                
                <p>Thank you for choosing OHS Home Services!</p>
                
                <hr style="margin: 30px 0;">
                <p style="font-size: 12px; color: #666;">
                    This is an automated confirmation. Please keep this email for your records.
                </p>
            </div>
        </body>
        </html>
    `;
}

// Generate business notification email HTML
function generateBusinessNotificationEmail(bookingData) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>New Service Booking</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #dc3545;">New Service Booking Request</h2>
                
                <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h3>Booking Information:</h3>
                    <p><strong>Reference:</strong> ${bookingData.bookingReference}</p>
                    <p><strong>Service:</strong> ${bookingData.serviceType}</p>
                    <p><strong>Date Requested:</strong> ${new Date(bookingData.scheduling.preferredDate).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> ${bookingData.scheduling.preferredTime}</p>
                </div>
                
                <div style="background: #e9f7ef; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h3>Customer Details:</h3>
                    <p><strong>Name:</strong> ${bookingData.customer.name}</p>
                    <p><strong>Email:</strong> ${bookingData.customer.email}</p>
                    <p><strong>Phone:</strong> ${bookingData.customer.phone}</p>
                    <p><strong>Location:</strong> ${bookingData.scheduling.location}</p>
                </div>
                
                <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h3>Service Details:</h3>
                    <p><strong>Property Size:</strong> ${bookingData.serviceDetails.propertySize}</p>
                    <p><strong>Additional Services:</strong> ${Array.isArray(bookingData.serviceDetails.additionalServices) ? bookingData.serviceDetails.additionalServices.join(', ') : bookingData.serviceDetails.additionalServices}</p>
                    <p><strong>Special Requirements:</strong> ${bookingData.serviceDetails.specialRequirements}</p>
                    <p><strong>Notes:</strong> ${bookingData.serviceDetails.notes}</p>
                    <p><strong>How they heard about us:</strong> ${bookingData.marketing.hearAboutUs}</p>
                </div>
                
                <p><strong>Action Required:</strong> Contact customer within 24 hours to confirm booking details.</p>
                
                <hr style="margin: 30px 0;">
                <p style="font-size: 12px; color: #666;">
                    Submitted: ${new Date(bookingData.submission.date).toLocaleString()}<br>
                    IP Address: ${bookingData.submission.ip}
                </p>
            </div>
        </body>
        </html>
    `;
}
