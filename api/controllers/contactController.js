const Contact = require('../models/Contact');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const nodemailer = require('nodemailer');

// Configure nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

// @desc    Send contact form message
// @route   POST /api/contact
// @access  Public
exports.sendContactMessage = asyncHandler(async (req, res, next) => {
    const { name, email, subject, message } = req.body;

    // Create contact message in database
    const contact = await Contact.create({
        name,
        email,
        subject,
        message
    });

    // Send email to admin
    const mailOptions = {
        from: `"PhoneTech Contact Form" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        subject: `New Contact Form Message: ${subject}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">New Contact Form Message</h2>
                <div style="background-color: #f4f4f4; padding: 20px; border-radius: 5px; margin: 20px 0;">
                    <p><strong>From:</strong> ${name} (${email})</p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <p><strong>Message:</strong></p>
                    <div style="background-color: white; padding: 15px; border-radius: 5px; margin-top: 10px;">
                        ${message.replace(/\n/g, '<br>')}
                    </div>
                </div>
                <p>This message was sent from the PhoneTech contact form.</p>
            </div>
        `
    };

    // Send email to user (confirmation)
    const userMailOptions = {
        from: `"PhoneTech Support" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Thank you for contacting PhoneTech',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Thank you for contacting us!</h2>
                <p>Dear ${name},</p>
                <p>We have received your message and will get back to you as soon as possible.</p>
                <div style="background-color: #f4f4f4; padding: 20px; border-radius: 5px; margin: 20px 0;">
                    <p><strong>Your message details:</strong></p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <p><strong>Message:</strong></p>
                    <div style="background-color: white; padding: 15px; border-radius: 5px; margin-top: 10px;">
                        ${message.replace(/\n/g, '<br>')}
                    </div>
                </div>
                <p>Best regards,<br>PhoneTech Team</p>
            </div>
        `
    };

    try {
        // Send both emails
        await Promise.all([
            transporter.sendMail(mailOptions),
            transporter.sendMail(userMailOptions)
        ]);

        res.status(200).json({
            success: true,
            message: 'Your message has been sent successfully'
        });
    } catch (error) {
        console.error('Contact Form Error:', error);
        return next(new ErrorResponse('Message could not be sent', 500));
    }
}); 