const mongoose = require('mongoose');
const ActivityLog = require('./models/ActivityLog');
const { logActivity } = require('./middleware/activityLogger');
require('dotenv').config();

const testLogging = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Test activity logging
    console.log('\n🧪 Testing Activity Logging...');
    
    // Create test logs
    await logActivity('507f1f77bcf86cd799439011', 'LOGIN_SUCCESS', 'Test login', null, { test: true });
    await logActivity('507f1f77bcf86cd799439011', 'PROFILE_UPDATE', 'Test profile update', null, { test: true });
    await logActivity(null, 'LOGIN_FAILED', 'Test failed login', null, { test: true });
    
    console.log('✅ Test logs created');

    // Query logs
    const logs = await ActivityLog.find({ 'metadata.test': true }).sort({ timestamp: -1 });
    console.log(`✅ Found ${logs.length} test logs`);

    // Test aggregation
    const stats = await ActivityLog.aggregate([
      { $match: { 'metadata.test': true } },
      { $group: { _id: '$action', count: { $sum: 1 } } }
    ]);
    console.log('✅ Activity stats:', stats);

    // Cleanup test logs
    await ActivityLog.deleteMany({ 'metadata.test': true });
    console.log('✅ Test logs cleaned up');

    console.log('\n📋 Activity Log API Endpoints:');
    console.log('📊 GET /api/activity/stats - Activity statistics (Admin)');
    console.log('📝 GET /api/activity/logs - All activity logs (Admin)');
    console.log('👤 GET /api/activity/my-logs - User\'s own logs');
    
    console.log('\n🛡️ Rate Limiting:');
    console.log('🔐 Login: 5 attempts per 15 minutes');
    console.log('📤 Upload: 3 attempts per minute');
    console.log('🔄 Password Reset: 3 attempts per hour');
    console.log('🌐 General API: 100 requests per 15 minutes');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

testLogging();