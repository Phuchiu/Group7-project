const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const testAvatarFeature = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Test avatar field in User model
    const testUser = await User.findOne({ email: 'admin@example.com' });
    if (testUser) {
      console.log('✅ Test user found');
      console.log('📸 Current avatar:', testUser.avatar || 'No avatar');
      
      // Test avatar update
      testUser.avatar = 'https://example.com/test-avatar.jpg';
      await testUser.save();
      console.log('✅ Avatar field updated successfully');
      
      // Reset avatar
      testUser.avatar = '';
      await testUser.save();
      console.log('✅ Avatar field reset');
    } else {
      console.log('❌ Test user not found. Run create_rbac_users.js first');
    }

    console.log('\n🧪 Avatar Upload API Endpoints:');
    console.log('📤 POST /api/avatar/upload - Upload avatar');
    console.log('📋 GET /api/avatar/info - Get avatar info');
    console.log('🗑️ DELETE /api/avatar/delete - Delete avatar');
    
    console.log('\n📋 Required Headers:');
    console.log('Authorization: Bearer YOUR_JWT_TOKEN');
    console.log('Content-Type: multipart/form-data');
    
    console.log('\n📋 Form Data:');
    console.log('avatar: [IMAGE_FILE]');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

testAvatarFeature();