const mongoose = require('mongoose');
const User = require('./models/User');
const crypto = require('crypto');
require('dotenv').config();

const testAdvancedFeatures = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Test forgot password token generation
    const user = await User.findOne({ email: 'user@test.com' });
    if (!user) {
      console.log('User not found. Run testData.js first');
      return;
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();
    
    console.log('Reset token generated:', resetToken);
    console.log('Token expires at:', new Date(user.resetPasswordExpires));
    
    // Test avatar update
    user.avatar = 'https://via.placeholder.com/150?text=TestAvatar';
    await user.save();
    
    console.log('Avatar updated:', user.avatar);
    
    // Verify token is valid
    const foundUser = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    console.log('Token validation:', foundUser ? 'Valid' : 'Invalid');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

testAdvancedFeatures();