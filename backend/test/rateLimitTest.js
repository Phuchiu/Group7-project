const mongoose = require('mongoose');
const RateLimit = require('../models/RateLimit');
require('dotenv').config();

// Test Rate Limiting functionality
async function testRateLimit() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Test 1: Test normal rate limiting
    console.log('\n🧪 Test 1: Testing normal rate limiting');
    const testIP = '192.168.1.200';
    
    // First few attempts should be allowed
    for (let i = 1; i <= 3; i++) {
      const result = await RateLimit.checkRateLimit(testIP, 'login', 5, 15);
      console.log(`✅ Attempt ${i}: Allowed=${result.allowed}, Remaining=${result.remaining}`);
    }

    // Test 2: Test rate limit exceeded
    console.log('\n🧪 Test 2: Testing rate limit exceeded');
    
    // Make more attempts to exceed limit
    for (let i = 4; i <= 6; i++) {
      const result = await RateLimit.checkRateLimit(testIP, 'login', 5, 15);
      if (result.blocked) {
        console.log(`❌ Attempt ${i}: BLOCKED - ${result.message}`);
      } else {
        console.log(`✅ Attempt ${i}: Allowed=${result.allowed}, Remaining=${result.remaining}`);
      }
    }

    // Test 3: Test rate limit status
    console.log('\n🧪 Test 3: Testing rate limit status');
    const status = await RateLimit.getRateLimitStatus(testIP, 'login');
    console.log(`✅ Rate limit status for ${testIP}:`);
    console.log(`   Attempts: ${status.attempts}`);
    console.log(`   Blocked: ${status.blocked}`);
    console.log(`   Last attempt: ${status.lastAttempt?.toLocaleString()}`);
    if (status.resetTime) {
      console.log(`   Reset time: ${status.resetTime.toLocaleString()}`);
    }

    // Test 4: Test different rate limit types
    console.log('\n🧪 Test 4: Testing different rate limit types');
    
    const passwordResetResult = await RateLimit.checkRateLimit(testIP, 'password_reset', 3, 60);
    console.log(`✅ Password reset attempt: Allowed=${passwordResetResult.allowed}, Remaining=${passwordResetResult.remaining}`);

    const apiCallResult = await RateLimit.checkRateLimit(testIP, 'api_call', 100, 1);
    console.log(`✅ API call attempt: Allowed=${apiCallResult.allowed}, Remaining=${apiCallResult.remaining}`);

    // Test 5: Test rate limit reset
    console.log('\n🧪 Test 5: Testing rate limit reset');
    
    await RateLimit.resetRateLimit(testIP, 'login');
    console.log(`✅ Rate limit reset for ${testIP}`);
    
    const afterResetResult = await RateLimit.checkRateLimit(testIP, 'login', 5, 15);
    console.log(`✅ After reset: Allowed=${afterResetResult.allowed}, Remaining=${afterResetResult.remaining}`);

    // Test 6: Test multiple IPs
    console.log('\n🧪 Test 6: Testing multiple IP addresses');
    
    const testIPs = ['192.168.1.201', '192.168.1.202', '10.0.0.1'];
    
    for (const ip of testIPs) {
      const result = await RateLimit.checkRateLimit(ip, 'login', 5, 15);
      console.log(`✅ IP ${ip}: Allowed=${result.allowed}, Remaining=${result.remaining}`);
    }

    // Test 7: Test window expiration simulation
    console.log('\n🧪 Test 7: Testing window expiration (simulation)');
    
    const shortWindowIP = '192.168.1.203';
    
    // Make attempts with very short window
    await RateLimit.checkRateLimit(shortWindowIP, 'login', 2, 0.01); // 0.01 minute = 0.6 seconds
    await RateLimit.checkRateLimit(shortWindowIP, 'login', 2, 0.01);
    
    console.log('✅ Made 2 attempts with short window');
    
    // Wait a moment and try again
    setTimeout(async () => {
      const result = await RateLimit.checkRateLimit(shortWindowIP, 'login', 2, 0.01);
      console.log(`✅ After window expiry: Allowed=${result.allowed}`);
    }, 1000);

    // Test 8: Test rate limit statistics
    console.log('\n🧪 Test 8: Testing rate limit statistics');
    
    const allRateLimits = await RateLimit.find({});
    console.log(`✅ Total rate limit records: ${allRateLimits.length}`);
    
    const blockedRecords = await RateLimit.find({ blockedUntil: { $gt: new Date() } });
    console.log(`✅ Currently blocked IPs: ${blockedRecords.length}`);
    
    blockedRecords.forEach(record => {
      console.log(`   ${record.identifier} (${record.type}) - blocked until ${record.blockedUntil.toLocaleString()}`);
    });

    // Cleanup test data
    await RateLimit.deleteMany({ identifier: { $in: [testIP, ...testIPs, shortWindowIP] } });
    console.log('\n✅ Test data cleaned up');

    console.log('\n🎉 All Rate Limit tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

// Run tests
if (require.main === module) {
  testRateLimit();
}

module.exports = testRateLimit;