const mongoose = require('mongoose');
const ActivityLog = require('../models/ActivityLog');
const User = require('../models/User');
require('dotenv').config();

// Sample activity data for testing
const sampleActivities = [
  { action: 'login', details: { method: 'email', browser: 'Chrome' } },
  { action: 'profile_update', details: { field: 'name', oldValue: 'John', newValue: 'John Doe' } },
  { action: 'avatar_upload', details: { fileName: 'profile.jpg', size: '250KB' } },
  { action: 'password_change', details: { method: 'profile_settings' } },
  { action: 'failed_login', details: { reason: 'invalid_password', attempts: 1 } },
  { action: 'failed_login', details: { reason: 'invalid_password', attempts: 2 } },
  { action: 'failed_login', details: { reason: 'invalid_password', attempts: 3 } },
  { action: 'password_reset_request', details: { method: 'email' } },
  { action: 'password_reset_complete', details: { method: 'email_link' } },
  { action: 'admin_user_create', details: { targetUser: 'newuser@example.com', role: 'user' } },
  { action: 'admin_role_change', details: { targetUser: 'user@example.com', oldRole: 'user', newRole: 'moderator' } },
  { action: 'logout', details: { duration: '1h 45m', method: 'manual' } }
];

async function seedActivityLogTestData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get existing users for logging
    const users = await User.find().limit(5);
    if (users.length === 0) {
      console.log('⚠️  No users found. Please run user seeder first.');
      return;
    }

    console.log(`📊 Found ${users.length} users for activity logging`);
    console.log('📝 Creating sample activity logs...');

    // Create activity logs for each user
    let totalLogs = 0;
    
    for (const user of users) {
      console.log(`\n👤 Creating logs for ${user.name} (${user.email})`);
      
      // Create random activities for each user
      const userActivities = sampleActivities
        .sort(() => 0.5 - Math.random()) // Shuffle
        .slice(0, Math.floor(Math.random() * 8) + 4); // 4-12 activities per user

      for (let i = 0; i < userActivities.length; i++) {
        const activity = userActivities[i];
        
        // Create mock request object
        const mockReq = {
          ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
          get: () => ['Chrome/91.0', 'Firefox/89.0', 'Safari/14.0', 'Edge/91.0'][Math.floor(Math.random() * 4)]
        };

        // Add timestamp variation (spread over last 7 days)
        const timestamp = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
        
        const log = await ActivityLog.logActivity(
          user._id,
          activity.action,
          activity.details,
          mockReq
        );

        if (log) {
          // Update timestamp to create realistic spread
          log.timestamp = timestamp;
          await log.save();
          totalLogs++;
        }

        console.log(`   ✅ ${activity.action} - ${timestamp.toLocaleDateString()}`);
      }
    }

    // Create some failed login attempts from specific IPs (for rate limiting demo)
    console.log('\n🚫 Creating failed login attempts for rate limiting demo...');
    
    const suspiciousIPs = ['192.168.1.100', '10.0.0.50', '172.16.0.25'];
    
    for (const ip of suspiciousIPs) {
      const attempts = Math.floor(Math.random() * 10) + 5; // 5-15 attempts
      
      for (let i = 0; i < attempts; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const timestamp = new Date(Date.now() - Math.random() * 2 * 60 * 60 * 1000); // Last 2 hours
        
        const log = await ActivityLog.logActivity(
          randomUser._id,
          'failed_login',
          { 
            reason: 'brute_force_attempt', 
            attempt: i + 1,
            targetEmail: randomUser.email
          },
          { ip, get: () => 'Automated Bot/1.0' }
        );

        if (log) {
          log.timestamp = timestamp;
          await log.save();
          totalLogs++;
        }
      }
      
      console.log(`   ❌ ${attempts} failed attempts from ${ip}`);
    }

    // Display statistics
    console.log('\n📊 Activity Log Statistics:');
    const stats = await ActivityLog.getActivityStats(24);
    
    stats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} total (${stat.successCount} success, ${stat.failureCount} failed)`);
    });

    // Display recent logs by user
    console.log('\n📋 Recent Activity Summary:');
    for (const user of users.slice(0, 3)) { // Show first 3 users
      const recentLogs = await ActivityLog.getUserLogs(user._id, 5);
      console.log(`\n👤 ${user.name}:`);
      recentLogs.forEach(log => {
        console.log(`   ${log.action} - ${log.timestamp.toLocaleString()}`);
      });
    }

    console.log(`\n🎉 Activity log test data seeding completed!`);
    console.log(`📊 Total logs created: ${totalLogs}`);
    console.log(`🔍 Use admin panel to view detailed logs`);
    console.log(`⚠️  Failed login attempts created for rate limiting tests`);

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

// Run seeder
if (require.main === module) {
  seedActivityLogTestData();
}

module.exports = seedActivityLogTestData;