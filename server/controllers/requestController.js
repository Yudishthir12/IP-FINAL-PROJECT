// =============================================
// controllers/requestController.js
// CRUD for study requests + tutor responses
// =============================================

import StudyRequest from '../models/StudyRequest.js';
import User from '../models/User.js';

// GET /api/requests — get all open requests (with filters)
export const getRequests = async (req, res) => {
  try {
    const { subject, grade, status } = req.query;
    const filter = {};
    if (subject) filter.subject = subject;
    if (grade) filter.grade = grade;
    if (status) filter.status = status;
    else filter.status = { $ne: 'resolved' };

    const requests = await StudyRequest.find(filter)
      .populate('postedBy', 'name grade')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: requests.length, data: requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/requests/:id — get a single request
export const getRequest = async (req, res) => {
  try {
    const request = await StudyRequest.findById(req.params.id)
      .populate('postedBy', 'name grade')
      .populate('responses.tutor', 'name rating subjects');

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    res.json({ success: true, data: request });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/requests — pupil creates a request
export const createRequest = async (req, res) => {
  try {
    const { title, description, subject, grade } = req.body;

    if (!title || !description || !subject || !grade) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const request = await StudyRequest.create({
      title,
      description,
      subject,
      grade,
      postedBy: req.user._id
    });

    res.status(201).json({ success: true, message: 'Request posted!', data: request });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/requests/:id — update a request (owner only)
export const updateRequest = async (req, res) => {
  try {
    const request = await StudyRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found.' });

    if (request.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorised.' });
    }

    const updated = await StudyRequest.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/requests/:id — delete a request (owner or admin)
export const deleteRequest = async (req, res) => {
  try {
    const request = await StudyRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found.' });

    if (request.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorised.' });
    }

    await request.deleteOne();
    res.json({ success: true, message: 'Request deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/requests/:id/respond — tutor responds to a request
export const respondToRequest = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ success: false, message: 'Message is required.' });

    const request = await StudyRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found.' });

    request.responses.push({ tutor: req.user._id, message });
    if (request.status === 'open') request.status = 'in-progress';
    await request.save();

    // Increment tutor's helped count
    await User.findByIdAndUpdate(req.user._id, { $inc: { helpedCount: 1 } });

    res.status(201).json({ success: true, message: 'Response submitted!', data: request });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/requests/:id/rate/:responseId — pupil rates a tutor's response
export const rateResponse = async (req, res) => {
  try {
    const { rating } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5.' });
    }

    const request = await StudyRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found.' });

    const response = request.responses.id(req.params.responseId);
    if (!response) return res.status(404).json({ success: false, message: 'Response not found.' });

    response.rating = rating;
    request.status = 'resolved';
    await request.save();

    // Update tutor's average rating
    const tutor = await User.findById(response.tutor);
    const newTotal = tutor.totalRatings + 1;
    const newRating = ((tutor.rating * tutor.totalRatings) + rating) / newTotal;
    tutor.rating = Math.round(newRating * 10) / 10;
    tutor.totalRatings = newTotal;
    await tutor.save();

    res.json({ success: true, message: 'Rating submitted. Request resolved!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
