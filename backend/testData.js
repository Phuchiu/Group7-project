const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const createTestUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Clear existing users
    await User.deleteMany({});
    
    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@test.com',
      password: '123456',
      role: 'admin'
    });
    
    // Create regular user
    const user = await User.create({
      name: 'Regular User',
      email: 'user@test.com',
      password: '123456',
      role: 'user'
    });
    
    console.log('Test users created:');
    console.log('Admin:', admin.email);
    console.log('User:', user.email);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createTestUsers();