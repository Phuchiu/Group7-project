const axios = require('axios');

const sendResetPasswordEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  // Cấu hình data gửi đi theo chuẩn của Brevo API
  const data = {
    sender: { name: "Group 7 Support", email: process.env.EMAIL_FROM },
    to: [{ email: email }],
    subject: "Đặt lại mật khẩu - Group 7",
    htmlContent: `
      <html><body>
        <h2>Yêu cầu đặt lại mật khẩu</h2>
        <p>Bấm vào link dưới đây để đặt lại mật khẩu của bạn:</p>
        <a href="${resetUrl}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Đặt lại mật khẩu ngay</a>
        <p>Link này sẽ hết hạn sau 15 phút.</p>
      </body></html>
    `
  };

  try {
    console.log('DEBUG: BREVO_API_KEY:', process.env.BREVO_API_KEY ? 'SET' : 'NOT SET');
    console.log('DEBUG: EMAIL_FROM:', process.env.EMAIL_FROM);
    console.log('DEBUG: FRONTEND_URL:', process.env.FRONTEND_URL);
    
    // Gọi trực tiếp đến API của Brevo (cổng 443 - không bị chặn)
    const response = await axios.post('https://api.brevo.com/v3/smtp/email', data, {
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    console.log("✅ Email sent via API successfully!", response.data);
    return true;
  } catch (error) {
    // In lỗi chi tiết nếu có
    console.error("❌ API Email Error:", error.response ? error.response.data : error.message);
    console.error("❌ Full error:", error);
    return false;
  }
};

module.exports = { sendResetPasswordEmail };