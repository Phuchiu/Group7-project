const nodemailer = require('nodemailer');

// Gmail SMTP Configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify transporter configuration
const verifyEmailConfig = async () => {
  try {
    await transporter.verify();
    console.log('✅ Email server is ready to send messages');
    return true;
  } catch (error) {
    console.error('❌ Email configuration error:', error.message);
    return false;
  }
};

// Send password reset email
const sendResetPasswordEmail = async (email, resetToken, userName = 'User') => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/reset-password?token=${resetToken}`;
  
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: email,
    subject: '🔐 Password Reset Request - Group7 Project',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #007bff; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
          .button { display: inline-block; background: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset Request</h1>
          </div>
          <div class="content">
            <h2>Hello ${userName}!</h2>
            <p>We received a request to reset your password for your Group7 Project account.</p>
            <p>Click the button below to reset your password:</p>
            <a href="${resetUrl}" class="button">Reset My Password</a>
            <div class="warning">
              <strong>⚠️ Important:</strong>
              <ul>
                <li>This link will expire in <strong>1 hour</strong></li>
                <li>If you didn't request this reset, please ignore this email</li>
                <li>Your password will remain unchanged until you create a new one</li>
              </ul>
            </div>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #f1f1f1; padding: 10px; border-radius: 3px;">${resetUrl}</p>
          </div>
          <div class="footer">
            <p>This email was sent by Group7 Project System</p>
            <p>If you have any questions, please contact our support team</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Password Reset Request
      
      Hello ${userName}!
      
      We received a request to reset your password for your Group7 Project account.
      
      Please visit this link to reset your password:
      ${resetUrl}
      
      This link will expire in 1 hour.
      
      If you didn't request this reset, please ignore this email.
      
      Group7 Project Team
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent:', info.messageId);
    return {
      success: true,
      messageId: info.messageId,
      resetUrl // For testing purposes
    };
  } catch (error) {
    console.error('❌ Email send error:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

// Send welcome email
const sendWelcomeEmail = async (email, userName) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: email,
    subject: '🎉 Welcome to Group7 Project!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #007bff;">Welcome to Group7 Project!</h2>
        <p>Hello ${userName},</p>
        <p>Thank you for joining our platform. Your account has been successfully created.</p>
        <p>You can now:</p>
        <ul>
          <li>Upload and manage your avatar</li>
          <li>Access your profile</li>
          <li>Enjoy all platform features</li>
        </ul>
        <p>If you have any questions, feel free to contact our support team.</p>
        <p>Best regards,<br>Group7 Project Team</p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Welcome email error:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = { 
  sendResetPasswordEmail, 
  sendWelcomeEmail, 
  verifyEmailConfig 
};