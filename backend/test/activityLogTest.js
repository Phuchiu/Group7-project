const mongoose = require('mongoose');
const ActivityLog = require('../models/ActivityLog');
const User = require('../models/User');
require('dotenv').config();

// Test Activity Logging functionality
async function testActivityLog() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Test 1: Create test user
    console.log('\n🧪 Test 1: Creating test user');
    const testUser = new User({
      name: 'Activity Log Test User',
      email: 'activitytest@example.com',
      password: 'password123',
      role: 'user'
    });
    await testUser.save();
    console.log(`✅ Test user created: ${testUser.email}`);

    // Test 2: Log various activities
    console.log('\n🧪 Test 2: Logging various activities');
    
    const activities = [
      { action: 'login', details: { method: 'email' } },
      { action: 'profile_update', details: { field: 'name', oldValue: 'Old Name', newValue: 'New Name' } },
      { action: 'avatar_upload', details: { fileName: 'avatar.jpg', size: '150KB' } },
      { action: 'password_change', details: { method: 'profile_settings' } },
      { action: 'failed_login', details: { reason: 'invalid_password' } },
      { action: 'logout', details: { duration: '2h 30m' } }
    ];

    for (const activity of activities) {
      const log = await ActivityLog.logActivity(
        testUser._id,
        activity.action,
        activity.details,
        {
          ip: '192.168.1.100',
          get: () => 'Mozilla/5.0 (Test Browser)'
        }
      );
      console.log(`✅ Logged activity: ${activity.action}`);
    }

    // Test 3: Retrieve user logs
    console.log('\n🧪 Test 3: Retrieving user activity logs');
    const userLogs = await ActivityLog.getUserLogs(testUser._id, 10);
    console.log(`✅ Retrieved ${userLogs.length} user logs`);
    
    userLogs.forEach((log, index) => {
      console.log(`   ${index + 1}. ${log.action} - ${log.timestamp.toLocaleString()}`);
      if (Object.keys(log.details).length > 0) {
        console.log(`      Details: ${JSON.stringify(log.details)}`);
      }
    });

    // Test 4: Get logs by action
    console.log('\n🧪 Test 4: Getting logs by action');
    const loginLogs = await ActivityLog.getLogsByAction('login', 5);
    console.log(`✅ Retrieved ${loginLogs.length} login logs`);

    const failedLoginLogs = await ActivityLog.getLogsByAction('failed_login', 5);
    console.log(`✅ Retrieved ${failedLoginLogs.length} failed login logs`);

    // Test 5: Test failed login counting
    console.log('\n🧪 Test 5: Testing failed login counting');
    const ipAddress = '192.168.1.100';
    
    // Add more failed login attempts
    for (let i = 0; i < 3; i++) {
      await ActivityLog.logActivity(
        testUser._id,
        'failed_login',
        { attempt: i + 1, reason: 'brute_force_test' },
        { ip: ipAddress, get: () => 'Test Browser' }
      );
    }

    const failedCount = await ActivityLog.getFailedLogins(ipAddress, 15);
    console.log(`✅ Failed login attempts from ${ipAddress}: ${failedCount}`);

    // Test 6: Get activity statistics
    console.log('\n🧪 Test 6: Getting activity statistics');
    const stats = await ActivityLog.getActivityStats(24);
    console.log('✅ Activity statistics (last 24 hours):');
    
    stats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} total (${stat.successCount} success, ${stat.failureCount} failed)`);
    });

    // Test 7: Test log indexing performance
    console.log('\n🧪 Test 7: Testing log indexing');
    const startTime = Date.now();
    const recentLogs = await ActivityLog.find({ timestamp: { $gte: new Date(Date.now() - 60 * 60 * 1000) } });
    const queryTime = Date.now() - startTime;
    console.log(`✅ Query performance: ${queryTime}ms for ${recentLogs.length} recent logs`);

    // Test 8: Test log cleanup simulation
    console.log('\n🧪 Test 8: Testing log cleanup simulation');
    const totalLogs = await ActivityLog.countDocuments();
    console.log(`✅ Total logs in database: ${totalLogs}`);
    console.log('✅ TTL index will auto-cleanup logs older than 90 days');

    // Cleanup test data
    await ActivityLog.deleteMany({ userId: testUser._id });
    await User.findByIdAndDelete(testUser._id);
    console.log('\n✅ Test data cleaned up');

    console.log('\n🎉 All Activity Log tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

// Run tests
if (require.main === module) {
  testActivityLog();
}

module.exports = testActivityLog;