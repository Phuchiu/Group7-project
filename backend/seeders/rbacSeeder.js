const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

// Sample data for RBAC testing
const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'Moderator User',
    email: 'moderator@example.com',
    password: 'moderator123',
    role: 'moderator'
  },
  {
    name: 'Regular User',
    email: 'user@example.com',
    password: 'user123',
    role: 'user'
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'moderator'
  }
];

async function seedRBACData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing users (optional)
    const existingCount = await User.countDocuments();
    console.log(`📊 Existing users: ${existingCount}`);

    // Create sample users
    console.log('🌱 Seeding RBAC sample data...');
    
    for (const userData of sampleUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      
      if (!existingUser) {
        const user = new User(userData);
        await user.save();
        console.log(`✅ Created ${userData.role}: ${userData.email}`);
      } else {
        console.log(`⚠️  User already exists: ${userData.email}`);
      }
    }

    // Display created users with their permissions
    console.log('\n📋 RBAC Users Summary:');
    const users = await User.find().select('name email role permissions');
    
    users.forEach(user => {
      console.log(`\n👤 ${user.name} (${user.email})`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Permissions: ${user.permissions.join(', ')}`);
    });

    console.log('\n🎉 RBAC seeding completed successfully!');

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

// Run seeder
if (require.main === module) {
  seedRBACData();
}

module.exports = seedRBACData;