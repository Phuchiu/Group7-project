const axios = require('axios');

const sendResetPasswordEmail = async (email, resetCode) => {
  // Cấu hình data gửi đi theo chuẩn của Brevo API
  const data = {
    sender: { name: "Group 7 Support", email: process.env.EMAIL_FROM },
    to: [{ email: email }],
    subject: "Mã xác nhận đặt lại mật khẩu",
    htmlContent: `
      <html><body>
        <h2>Yêu cầu đặt lại mật khẩu</h2>
        <p>Mã xác nhận của bạn là:</p>
        <h1 style="color: #007bff; letter-spacing: 5px;">${resetCode}</h1>
        <p>Mã này sẽ hết hạn sau 15 phút.</p>
        <p>Vui lòng không chia sẻ mã này cho ai khác.</p>
      </body></html>
    `
  };

  try {
    console.log('DEBUG: Sending reset code:', resetCode);
    console.log('DEBUG: BREVO_API_KEY:', process.env.BREVO_API_KEY ? 'SET' : 'NOT SET');
    console.log('DEBUG: EMAIL_FROM:', process.env.EMAIL_FROM);
    
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