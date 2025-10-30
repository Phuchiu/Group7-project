const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const testProfileOperations = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Tìm user test
    const user = await User.findOne({ email: 'user@test.com' });
    if (!user) {
      console.log('User not found. Run testData.js first');
      return;
    }
    
    console.log('Original user:', {
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar
    });
    
    // Test update profile
    user.name = 'Updated User Name';
    user.avatar = 'https://example.com/avatar.jpg';
    await user.save();
    
    console.log('Updated user:', {
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar
    });
    
    // Test password update
    user.password = 'newpassword123';
    await user.save();
    console.log('Password updated successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

testProfileOperations();