const mongoose = require('mongoose');
const RefreshToken = require('../models/RefreshToken');
const User = require('../models/User');

class DatabaseOptimization {
  // Create indexes for better performance
  static async createIndexes() {
    try {
      // RefreshToken indexes
      await RefreshToken.collection.createIndex({ token: 1 }, { unique: true });
      await RefreshToken.collection.createIndex({ userId: 1 });
      await RefreshToken.collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
      await RefreshToken.collection.createIndex({ isRevoked: 1 });

      // User indexes
      await User.collection.createIndex({ email: 1 }, { unique: true });
      await User.collection.createIndex({ role: 1 });
      await User.collection.createIndex({ isActive: 1 });

      console.log('✅ Database indexes created successfully');
    } catch (error) {
      console.error('❌ Error creating indexes:', error.message);
    }
  }

  // Cleanup expired and revoked tokens
  static async cleanupTokens() {
    try {
      const result = await RefreshToken.deleteMany({
        $or: [
          { isRevoked: true },
          { expiresAt: { $lt: new Date() } }
        ]
      });
      console.log(`✅ Cleaned up ${result.deletedCount} expired/revoked tokens`);
      return result.deletedCount;
    } catch (error) {
      console.error('❌ Error cleaning up tokens:', error.message);
      return 0;
    }
  }

  // Get database statistics
  static async getStats() {
    try {
      const userCount = await User.countDocuments();
      const activeTokens = await RefreshToken.countDocuments({ 
        isRevoked: false,
        expiresAt: { $gt: new Date() }
      });
      const expiredTokens = await RefreshToken.countDocuments({
        $or: [
          { isRevoked: true },
          { expiresAt: { $lt: new Date() } }
        ]
      });

      const stats = {
        users: userCount,
        activeTokens,
        expiredTokens,
        totalTokens: activeTokens + expiredTokens
      };

      console.log('📊 Database Statistics:', stats);
      return stats;
    } catch (error) {
      console.error('❌ Error getting stats:', error.message);
      return null;
    }
  }

  // Optimize database connection
  static optimizeConnection() {
    mongoose.set('bufferCommands', false);
    mongoose.set('bufferMaxEntries', 0);
    
    // Connection pool settings
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
      bufferMaxEntries: 0
    };

    return options;
  }
}

module.exports = DatabaseOptimization;