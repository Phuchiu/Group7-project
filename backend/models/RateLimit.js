const mongoose = require('mongoose');

const rateLimitSchema = new mongoose.Schema({
  identifier: {
    type: String,
    required: true,
    unique: true
  },
  attempts: {
    type: Number,
    default: 0
  },
  lastAttempt: {
    type: Date,
    default: Date.now
  },
  blockedUntil: {
    type: Date,
    default: null
  },
  type: {
    type: String,
    enum: ['login', 'password_reset', 'api_call'],
    default: 'login'
  }
}, {
  timestamps: true
});

// TTL index - auto cleanup after 24 hours
rateLimitSchema.index({ lastAttempt: 1 }, { expireAfterSeconds: 24 * 60 * 60 });
rateLimitSchema.index({ identifier: 1, type: 1 });

// Static methods
rateLimitSchema.statics.checkRateLimit = async function(identifier, type = 'login', maxAttempts = 5, windowMinutes = 15) {
  const record = await this.findOne({ identifier, type });
  const now = new Date();
  
  if (!record) {
    // First attempt
    await this.create({
      identifier,
      type,
      attempts: 1,
      lastAttempt: now
    });
    return { allowed: true, remaining: maxAttempts - 1, resetTime: null };
  }

  // Check if blocked
  if (record.blockedUntil && record.blockedUntil > now) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.blockedUntil,
      blocked: true,
      message: `Too many attempts. Try again after ${record.blockedUntil.toLocaleTimeString()}`
    };
  }

  // Check if window has expired
  const windowStart = new Date(now.getTime() - windowMinutes * 60 * 1000);
  if (record.lastAttempt < windowStart) {
    // Reset counter
    record.attempts = 1;
    record.lastAttempt = now;
    record.blockedUntil = null;
    await record.save();
    return { allowed: true, remaining: maxAttempts - 1, resetTime: null };
  }

  // Increment attempts
  record.attempts += 1;
  record.lastAttempt = now;

  if (record.attempts >= maxAttempts) {
    // Block for windowMinutes
    record.blockedUntil = new Date(now.getTime() + windowMinutes * 60 * 1000);
    await record.save();
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.blockedUntil,
      blocked: true,
      message: `Too many attempts. Blocked until ${record.blockedUntil.toLocaleTimeString()}`
    };
  }

  await record.save();
  return {
    allowed: true,
    remaining: maxAttempts - record.attempts,
    resetTime: null
  };
};

// Reset rate limit for identifier
rateLimitSchema.statics.resetRateLimit = async function(identifier, type = 'login') {
  await this.deleteOne({ identifier, type });
};

// Get rate limit status
rateLimitSchema.statics.getRateLimitStatus = async function(identifier, type = 'login') {
  const record = await this.findOne({ identifier, type });
  const now = new Date();
  
  if (!record) {
    return { attempts: 0, blocked: false, resetTime: null };
  }

  const blocked = record.blockedUntil && record.blockedUntil > now;
  return {
    attempts: record.attempts,
    blocked,
    resetTime: record.blockedUntil,
    lastAttempt: record.lastAttempt
  };
};

module.exports = mongoose.model('RateLimit', rateLimitSchema);