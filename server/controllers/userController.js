// =============================================
// controllers/userController.js
// User profile management and tutor listing
// =============================================

import User from '../models/User.js';
import StudyRequest from '../models/StudyRequest.js';

// GET /api/users/tutors — list all tutors (with optional subject filter)
export const getTutors = async (req, res) => {
  try {
    const { subject } = req.query;
    const filter = { role: 'tutor' };
    if (subject) filter.subjects = subject;

    const tutors = await User.find(filter)
      .select('-password')
      .sort({ rating: -1 });

    res.json({ success: true, count: tutors.length, data: tutors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/users/:id — get a user profile
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/users/:id — update own profile
export const updateUser = async (req, res) => {
  try {
    if (req.params.id !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorised.' });
    }

    // Don't allow password or role update through this route
    const { password, role, ...updateData } = req.body;

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    }).select('-password');

    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/users/dashboard — get dashboard stats for logged-in user
export const getDashboardStats = async (req, res) => {
  try {
    let stats = {};

    if (req.user.role === 'pupil') {
      const myRequests = await StudyRequest.find({ postedBy: req.user._id });
      stats = {
        totalRequests: myRequests.length,
        openRequests: myRequests.filter(r => r.status === 'open').length,
        resolvedRequests: myRequests.filter(r => r.status === 'resolved').length,
        recentRequests: myRequests.slice(0, 5)
      };
    } else if (req.user.role === 'tutor') {
      const subjectRequests = await StudyRequest.find({
        subject: { $in: req.user.subjects },
        status: { $ne: 'resolved' }
      }).populate('postedBy', 'name grade').limit(10);

      stats = {
        helpedCount: req.user.helpedCount,
        rating: req.user.rating,
        openRequestsInMySubjects: subjectRequests.length,
        recentRequests: subjectRequests
      };
    } else if (req.user.role === 'admin') {
      const [totalUsers, totalRequests, totalResolved] = await Promise.all([
        User.countDocuments(),
        StudyRequest.countDocuments(),
        StudyRequest.countDocuments({ status: 'resolved' })
      ]);
      stats = { totalUsers, totalRequests, totalResolved };
    }

    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
