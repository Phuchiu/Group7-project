const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const createRBACUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if users already exist
    const existingUsers = await User.find({
      email: { $in: ['admin@example.com', 'moderator@example.com', 'user@example.com'] }
    });

    if (existingUsers.length > 0) {
      console.log('⚠️ RBAC users already exist');
      
      // Update existing users with correct roles
      await User.updateOne({ email: 'admin@example.com' }, { role: 'admin' });
      console.log('✅ Updated admin user');
      
      process.exit(0);
    }

    // Create sample users for each role
    const users = [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: '123456',
        role: 'admin'
      },
      {
        name: 'Moderator User', 
        email: 'moderator@example.com',
        password: '123456',
        role: 'moderator'
      },
      {
        name: 'Regular User',
        email: 'user@example.com', 
        password: '123456',
        role: 'user'
      },
      {
        name: 'Test User 1',
        email: 'test1@example.com',
        password: '123456', 
        role: 'user'
      },
      {
        name: 'Test User 2',
        email: 'test2@example.com',
        password: '123456',
        role: 'user'
      }
    ];

    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      console.log(`✅ Created ${userData.role}: ${userData.email}`);
    }

    console.log('\n🎉 RBAC users created successfully!');
    console.log('\n📋 Login credentials:');
    console.log('👑 Admin: admin@example.com / 123456');
    console.log('🛡️ Moderator: moderator@example.com / 123456'); 
    console.log('👤 User: user@example.com / 123456');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating RBAC users:', error);
    process.exit(1);
  }
};

createRBACUsers();