const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'moderator', 'admin'],
    default: 'user'
  },
  permissions: {
    type: [String],
    default: function() {
      return this.getDefaultPermissions();
    }
  },
  avatar: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Get default permissions based on role
userSchema.methods.getDefaultPermissions = function() {
  const rolePermissions = {
    user: ['read:profile', 'update:profile'],
    moderator: ['read:profile', 'update:profile', 'read:users', 'moderate:content'],
    admin: ['read:profile', 'update:profile', 'read:users', 'create:users', 'update:users', 'delete:users', 'manage:roles']
  };
  return rolePermissions[this.role] || rolePermissions.user;
};

// Check if user has specific permission
userSchema.methods.hasPermission = function(permission) {
  return this.permissions.includes(permission);
};

// Check if user has any of the specified roles
userSchema.methods.hasRole = function(roles) {
  if (typeof roles === 'string') roles = [roles];
  return roles.includes(this.role);
};

// Update permissions when role changes
userSchema.pre('save', function(next) {
  if (this.isModified('role')) {
    this.permissions = this.getDefaultPermissions();
  }
  next();
});

module.exports = mongoose.model('User', userSchema);