// =============================================
// models/User.js — User Schema
// Supports: pupil, tutor, admin roles
// =============================================

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  role: {
    type: String,
    enum: ['pupil', 'tutor', 'admin'],
    default: 'pupil'
  },
  grade: {
    // For pupils: Grade 8-12
    type: String,
    enum: ['Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12', 'N/A'],
    default: 'N/A'
  },
  subjects: {
    // For tutors: subjects they can teach
    type: [String],
    default: []
  },
  bio: {
    type: String,
    default: ''
  },
  rating: {
    type: Number,
    default: 0
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  helpedCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);
