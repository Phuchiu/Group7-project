const nodemailer = require('nodemailer').default || require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS.replace(/\s/g, '') // Xóa khoảng trắng
  }
});

const sendResetPasswordEmail = async (email, resetToken) => {
  try {
    console.log('📧 Attempting to send email...');
    console.log('From:', process.env.EMAIL_USER);
    console.log('To:', email);
    console.log('Token:', resetToken);
    
    const mailOptions = {
      from: `"User Management System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Đặt lại mật khẩu - User Management System',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #667eea;">🔑 Đặt lại mật khẩu</h2>
          <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình.</p>
          <p>Mã xác nhận của bạn là:</p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; text-align: center; font-size: 24px; font-weight: bold; color: #667eea; letter-spacing: 5px;">
            ${resetToken}
          </div>
          <p style="color: #666; margin-top: 20px;">Mã này có hiệu lực trong <strong>1 giờ</strong>.</p>
          <p style="color: #666;">Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 12px;">Email này được gửi tự động, vui lòng không trả lời.</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Email send error:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Full error:', error);
    return false;
  }
};

module.exports = { sendResetPasswordEmail };
