const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

// Sample avatar URLs for testing
const sampleAvatars = [
  'https://res.cloudinary.com/demo/image/upload/w_300,h_300,c_fill/sample.jpg',
  'https://res.cloudinary.com/demo/image/upload/w_300,h_300,c_fill/woman.jpg',
  'https://res.cloudinary.com/demo/image/upload/w_300,h_300,c_fill/man.jpg',
  'https://res.cloudinary.com/demo/image/upload/w_300,h_300,c_fill/face_top.jpg',
  'https://res.cloudinary.com/demo/image/upload/w_300,h_300,c_fill/face_left.jpg'
];

async function seedAvatarTestData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get existing users
    const users = await User.find().limit(5);
    console.log(`📊 Found ${users.length} users to update with avatars`);

    if (users.length === 0) {
      console.log('⚠️  No users found. Please run user seeder first.');
      return;
    }

    // Update users with sample avatars
    console.log('🖼️  Adding sample avatars to users...');
    
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const avatarUrl = sampleAvatars[i % sampleAvatars.length];
      
      user.avatar = avatarUrl;
      await user.save();
      
      console.log(`✅ Updated ${user.name} (${user.email})`);
      console.log(`   Avatar: ${avatarUrl}`);
    }

    // Display updated users
    console.log('\n📋 Users with Avatars:');
    const updatedUsers = await User.find({ avatar: { $ne: '' } }).select('name email avatar');
    
    updatedUsers.forEach(user => {
      console.log(`\n👤 ${user.name} (${user.email})`);
      console.log(`   🖼️  Avatar: ${user.avatar}`);
    });

    console.log('\n🎉 Avatar test data seeding completed!');

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

// Run seeder
if (require.main === module) {
  seedAvatarTestData();
}

module.exports = seedAvatarTestData;