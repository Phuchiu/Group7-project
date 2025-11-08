const mongoose = require('mongoose');
const User = require('../models/User');
const TokenGenerator = require('../utils/tokenGenerator');
require('dotenv').config();

// Create test users for password reset testing
const testUsers = [
  {
    name: 'Password Reset Test User 1',
    email: 'resettest1@example.com',
    password: 'password123',
    role: 'user'
  },
  {
    name: 'Password Reset Test User 2', 
    email: 'resettest2@example.com',
    password: 'password123',
    role: 'user'
  },
  {
    name: 'Admin Reset Test',
    email: 'adminreset@example.com', 
    password: 'admin123',
    role: 'admin'
  }
];

async function seedPasswordResetTestData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('🔐 Creating password reset test users...');

    for (const userData of testUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      
      if (!existingUser) {
        const user = new User(userData);
        await user.save();
        console.log(`✅ Created test user: ${userData.email}`);
      } else {
        console.log(`⚠️  User already exists: ${userData.email}`);
      }
    }

    // Create a user with active reset token for testing
    console.log('\n🧪 Creating user with active reset token...');
    const tokenTestUser = await User.findOne({ email: 'resettest1@example.com' });
    
    if (tokenTestUser) {
      const tokenData = TokenGenerator.generateTokenWithExpiry(1); // 1 hour
      tokenTestUser.resetPasswordToken = tokenData.token;
      tokenTestUser.resetPasswordExpires = tokenData.expires;
      await tokenTestUser.save();
      
      console.log(`✅ Added reset token to: ${tokenTestUser.email}`);
      console.log(`   Token: ${tokenData.token.substring(0, 16)}...`);
      console.log(`   Expires: ${tokenData.expires.toLocaleString()}`);
      console.log(`   Valid for: ${tokenData.expiresIn}`);
    }

    // Display all test users
    console.log('\n📋 Password Reset Test Users:');
    const users = await User.find({ 
      email: { $in: testUsers.map(u => u.email) } 
    }).select('name email role resetPasswordToken resetPasswordExpires');
    
    users.forEach(user => {
      console.log(`\n👤 ${user.name} (${user.email})`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Has Reset Token: ${user.resetPasswordToken ? 'Yes' : 'No'}`);
      if (user.resetPasswordToken) {
        const isExpired = TokenGenerator.isTokenExpired(user.resetPasswordExpires);
        console.log(`   Token Status: ${isExpired ? 'Expired' : 'Valid'}`);
        console.log(`   Expires: ${user.resetPasswordExpires.toLocaleString()}`);
      }
    });

    console.log('\n📧 Email Test Instructions:');
    console.log('1. Use these test emails for forgot password API');
    console.log('2. Check email service logs for reset URLs');
    console.log('3. Test token validation with generated tokens');
    console.log('4. Verify password reset functionality');

    console.log('\n🎉 Password reset test data seeding completed!');

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

// Run seeder
if (require.main === module) {
  seedPasswordResetTestData();
}

module.exports = seedPasswordResetTestData;