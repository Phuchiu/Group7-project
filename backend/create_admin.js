// Script tạo admin user để test
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Kiểm tra admin đã tồn tại chưa
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    if (existingAdmin) {
      console.log('Admin đã tồn tại:', existingAdmin.email);
      return;
    }

    // Tạo admin user
    const admin = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: '123456',
      role: 'admin'
    });

    await admin.save();
    console.log('✅ Tạo admin thành công:');
    console.log('Email: admin@example.com');
    console.log('Password: 123456');
    console.log('Role: admin');

  } catch (error) {
    console.error('❌ Lỗi tạo admin:', error.message);
  } finally {
    mongoose.disconnect();
  }
}

createAdmin();