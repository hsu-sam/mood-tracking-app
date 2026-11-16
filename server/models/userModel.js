import crypto from 'crypto';
import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email name'],
    unique: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
    lowercase: true,
  },
  photo: {
    type: String,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  tokenVersion: {
    type: Number,
    default: 0,
    select: false,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    validate: {
      validator: function (el) {
        // Only validate when passwordConfirm is provided (reset/update flows)
        if (!el) return true;
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
    select: false,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordRestExpires: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Internal/security fields that must never leave the server.
const INTERNAL_FIELDS = [
  'passwordResetToken',
  'passwordRestExpires',
  'passwordChangedAt',
  'tokenVersion',
  'password',
  'passwordConfirm',
  '__v',
];

// Fields only admin-facing endpoints need.
const ADMIN_ONLY_FIELDS = ['role', 'createdAt'];

const omit = (obj, fields) => {
  fields.forEach((field) => delete obj[field]);
  return obj;
};

// Default serialization (used by res.json): always strip internal fields.
userSchema.set('toJSON', {
  transform: (doc, ret) => omit(ret, INTERNAL_FIELDS),
});

// Serialization for the user's own profile: also strip role and createdAt.
userSchema.methods.toProfile = function () {
  return omit(this.toJSON(), ADMIN_ONLY_FIELDS);
};

userSchema.pre('save', async function () {
  // Only hash the password if it was modified
  if (!this.isModified('password')) return;

  // Hash the password with a cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
});

userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.isNew) return;

  this.passwordChangedAt = Date.now() - 1000;
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

userSchema.methods.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordRestExpires = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

export default User;
