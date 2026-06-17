require('dotenv').config();
const nodemailer = require('nodemailer');

// Verify environment variables
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  console.warn('⚠️  WARNING: Email credentials not configured in .env file');
  console.warn('   Set EMAIL_USER and EMAIL_PASSWORD to enable email functionality');
}

let transporter = null;

try {
  // Create transporter
  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use TLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Verify transporter connection asynchronously
  transporter.verify((error, success) => {
    if (error) {
      console.error('❌ Email transporter error:', error.message);
    } else {
      console.log('✅ Email transporter ready - emails can be sent');
    }
  });
} catch (error) {
  console.error('❌ Failed to initialize email transporter:', error.message);
}

// Send OTP email
const sendOtpEmail = async (email, otp) => {
  try {
    // Check if transporter is available
    if (!transporter || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.warn('⚠️  Email service not configured');
      throw new Error('Email service not configured. Set EMAIL_USER and EMAIL_PASSWORD in .env file');
    }

    const mailOptions = {
      from: `"BathEase" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'BathEase - Password Reset OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px 10px 0 0; color: white; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">BathEase</h1>
            <p style="margin: 5px 0 0 0; font-size: 14px;">Password Reset</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #eee; border-top: none;">
            <h2 style="color: #333; margin-top: 0;">Reset Your Password</h2>
            <p style="color: #666; line-height: 1.6;">Hi there,</p>
            <p style="color: #666; line-height: 1.6;">You requested to reset your password. Use the OTP below to proceed. This code will expire in 10 minutes.</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 30px 0; text-align: center; border: 2px solid #667eea;">
              <p style="margin: 0; color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Your OTP</p>
              <h1 style="color: #667eea; letter-spacing: 8px; margin: 15px 0 0 0; font-size: 36px; font-weight: bold;">${otp}</h1>
            </div>
            
            <p style="color: #999; font-size: 12px; text-align: center;">If you didn't request this, you can safely ignore this email.</p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="color: #999; font-size: 11px; text-align: center; margin: 0;">© 2026 BathEase. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent successfully to ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending OTP email:', error.message);
    throw new Error('Failed to send OTP email: ' + error.message);
  }
};

module.exports = { sendOtpEmail };
