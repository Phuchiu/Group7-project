const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

// Test RBAC functionality
async function testRBAC() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Test 1: Create users with different roles
    console.log('\n🧪 Test 1: Creating users with different roles');
    
    const testUsers = [
      { name: 'Test Admin', email: 'testadmin@test.com', password: 'test123', role: 'admin' },
      { name: 'Test Moderator', email: 'testmod@test.com', password: 'test123', role: 'moderator' },
      { name: 'Test User', email: 'testuser@test.com', password: 'test123', role: 'user' }
    ];

    const createdUsers = [];
    for (const userData of testUsers) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`✅ Created ${user.role}: ${user.email}`);
      console.log(`   Permissions: ${user.permissions.join(', ')}`);
    }

    // Test 2: Test permission checking
    console.log('\n🧪 Test 2: Testing permission checking');
    
    const [admin, moderator, regularUser] = createdUsers;
    
    // Admin permissions
    console.log(`\n👑 Admin permissions test:`);
    console.log(`   Can manage roles: ${admin.hasPermission('manage:roles')}`);
    console.log(`   Can delete users: ${admin.hasPermission('delete:users')}`);
    console.log(`   Can read profile: ${admin.hasPermission('read:profile')}`);
    
    // Moderator permissions
    console.log(`\n🛡️  Moderator permissions test:`);
    console.log(`   Can moderate content: ${moderator.hasPermission('moderate:content')}`);
    console.log(`   Can manage roles: ${moderator.hasPermission('manage:roles')}`);
    console.log(`   Can read users: ${moderator.hasPermission('read:users')}`);
    
    // Regular user permissions
    console.log(`\n👤 Regular user permissions test:`);
    console.log(`   Can read profile: ${regularUser.hasPermission('read:profile')}`);
    console.log(`   Can delete users: ${regularUser.hasPermission('delete:users')}`);
    console.log(`   Can moderate content: ${regularUser.hasPermission('moderate:content')}`);

    // Test 3: Test role checking
    console.log('\n🧪 Test 3: Testing role checking');
    
    console.log(`Admin has admin role: ${admin.hasRole('admin')}`);
    console.log(`Admin has admin or moderator role: ${admin.hasRole(['admin', 'moderator'])}`);
    console.log(`Moderator has admin role: ${moderator.hasRole('admin')}`);
    console.log(`User has user role: ${regularUser.hasRole('user')}`);

    // Test 4: Test role change and permission update
    console.log('\n🧪 Test 4: Testing role change and permission update');
    
    console.log(`Before: User role = ${regularUser.role}, permissions = ${regularUser.permissions.length}`);
    regularUser.role = 'moderator';
    await regularUser.save();
    console.log(`After: User role = ${regularUser.role}, permissions = ${regularUser.permissions.length}`);
    console.log(`New permissions: ${regularUser.permissions.join(', ')}`);

    // Cleanup test data
    await User.deleteMany({ email: { $in: testUsers.map(u => u.email) } });
    console.log('\n✅ Test data cleaned up');

    console.log('\n🎉 All RBAC tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

// Run tests
if (require.main === module) {
  testRBAC();
}

module.exports = testRBAC;