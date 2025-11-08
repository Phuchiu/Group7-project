const { sendResetPasswordEmail } = require('./services/emailService');
require('dotenv').config();

// Test email functionality
const testEmail = async () => {
  try {
    console.log('Testing email service...');
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***configured***' : 'NOT SET');
    
    const testToken = 'test-token-123456789';
    const testEmailAddress = 'test@example.com'; // Replace with your test email
    
    await sendResetPasswordEmail(testEmailAddress, testToken);
    console.log('✅ Email sent successfully!');
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
  }
};

testEmail();