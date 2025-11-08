const mongoose = require('mongoose');
const RateLimit = require('../models/RateLimit');
require('dotenv').config();

// Demo Rate Limiting Progressive Blocking
async function demoRateLimit() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('\n🛡️  RATE LIMITING DEMO: Progressive Blocking');
    console.log('=' .repeat(60));

    const demoIP = '192.168.1.999'; // Fresh IP for demo
    const maxAttempts = 5;
    const windowMinutes = 15;

    // Clean up any existing records
    await RateLimit.deleteMany({ identifier: demoIP });

    console.log(`\n📋 Configuration:`);
    console.log(`   IP Address: ${demoIP}`);
    console.log(`   Max Attempts: ${maxAttempts}`);
    console.log(`   Time Window: ${windowMinutes} minutes`);
    console.log(`   Action: Login attempts`);

    console.log('\n🔄 Progressive Blocking Demonstration:');
    console.log('-'.repeat(50));

    // Demonstrate progressive blocking
    for (let attempt = 1; attempt <= 8; attempt++) {
      console.log(`\n🔍 Attempt ${attempt}:`);
      
      const result = await RateLimit.checkRateLimit(demoIP, 'login', maxAttempts, windowMinutes);
      
      if (result.allowed) {
        console.log(`   ✅ ALLOWED - Remaining attempts: ${result.remaining}`);
        console.log(`   📊 Status: Normal operation`);
      } else if (result.blocked) {
        console.log(`   ❌ BLOCKED - ${result.message}`);
        console.log(`   🚫 Status: Rate limit exceeded`);
        console.log(`   ⏰ Reset time: ${result.resetTime.toLocaleTimeString()}`);
      }

      // Show current status
      const status = await RateLimit.getRateLimitStatus(demoIP, 'login');
      console.log(`   📈 Total attempts: ${status.attempts}`);
      console.log(`   🔒 Currently blocked: ${status.blocked ? 'YES' : 'NO'}`);
    }

    // Show final statistics
    console.log('\n📊 Final Rate Limit Status:');
    console.log('-'.repeat(30));
    const finalStatus = await RateLimit.getRateLimitStatus(demoIP, 'login');
    console.log(`   IP Address: ${demoIP}`);
    console.log(`   Total Attempts: ${finalStatus.attempts}`);
    console.log(`   Blocked: ${finalStatus.blocked ? 'YES' : 'NO'}`);
    console.log(`   Last Attempt: ${finalStatus.lastAttempt.toLocaleString()}`);
    if (finalStatus.resetTime) {
      console.log(`   Block Expires: ${finalStatus.resetTime.toLocaleString()}`);
      const minutesLeft = Math.ceil((finalStatus.resetTime - new Date()) / (1000 * 60));
      console.log(`   Minutes Remaining: ${minutesLeft} minutes`);
    }

    console.log('\n🎯 Rate Limiting Summary:');
    console.log('-'.repeat(40));
    console.log(`   ✅ Attempts 1-${maxAttempts}: Progressively allowed with decreasing remaining count`);
    console.log(`   ❌ Attempts ${maxAttempts + 1}+: Blocked with error message`);
    console.log(`   ⏰ Block Duration: ${windowMinutes} minutes`);
    console.log(`   🔄 Auto-Reset: After time window expires`);

    // Cleanup
    await RateLimit.deleteMany({ identifier: demoIP });
    console.log('\n✅ Demo data cleaned up');

    console.log('\n🎉 Rate Limiting Demo Completed Successfully!');

  } catch (error) {
    console.error('❌ Demo failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

// Run demo
if (require.main === module) {
  demoRateLimit();
}

module.exports = demoRateLimit;