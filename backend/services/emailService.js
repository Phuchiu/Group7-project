const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: true
  }
});

const sendResetPasswordEmail = async (email, resetToken) => {
  try {
    console.log('Bắt đầu gửi email cho:', email);
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
    
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/reset-password/${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Đặt lại mật khẩu - Group 7 User Management',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Đặt lại mật khẩu</h2>
          <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình.</p>
          <p>Nhấp vào liên kết bên dưới để đặt lại mật khẩu:</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #667eea; color: white; text-decoration: none; border-radius: 5px;">Đặt lại mật khẩu</a>
          <p style="margin-top: 20px;">Liên kết này sẽ hết hạn sau 1 giờ.</p>
          <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
          <hr style="margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">Group 7 - User Management System</p>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Gửi email thành công:', result.messageId);
    return result;
  } catch (error) {
    console.error('LỖI GỬI EMAIL CHI TIẾT:', error);
    throw error;
  }
};

module.exports = { sendResetPasswordEmail };