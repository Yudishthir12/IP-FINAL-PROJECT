// =============================================
// controllers/authController.js
// Handles user registration and login
// =============================================

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });
};

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password, role, grade, subjects, bio } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }

    // Validate grade for pupils
    if (role === 'pupil' && !grade) {
      return res.status(400).json({ success: false, message: 'Grade is required for pupils.' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'pupil',
      grade: role === 'pupil' ? grade : 'N/A',
      subjects: role === 'tutor' ? (subjects || []) : [],
      bio: bio || ''
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        grade: user.grade,
        subjects: user.subjects
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        grade: user.grade,
        subjects: user.subjects,
        rating: user.rating,
        helpedCount: user.helpedCount
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/auth/me
export const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};
