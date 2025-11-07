const mongoose = require('mongoose');
const User = require('./models/User');
const RefreshToken = require('./models/RefreshToken');
require('dotenv').config();

const testRefreshToken = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Create test user
    const testUser = new User({
      name: 'Test User',
      email: 'test@refresh.com',
      password: '123456'
    });
    await testUser.save();
    console.log('✅ Test user created');

    // Create refresh token
    const refreshToken = new RefreshToken({
      token: 'test-refresh-token-123',
      userId: testUser._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
    await refreshToken.save();
    console.log('✅ Refresh token created');

    // Test retrieval
    const foundToken = await RefreshToken.findOne({ token: 'test-refresh-token-123' }).populate('userId');
    console.log('✅ Token retrieved:', {
      token: foundToken.token,
      user: foundToken.userId.name,
      expiresAt: foundToken.expiresAt
    });

    // Cleanup
    await User.deleteOne({ email: 'test@refresh.com' });
    await RefreshToken.deleteOne({ token: 'test-refresh-token-123' });
    console.log('✅ Cleanup completed');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

testRefreshToken();