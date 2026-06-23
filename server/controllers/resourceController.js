// =============================================
// controllers/resourceController.js
// CRUD for study resources (notes, past papers)
// =============================================

import Resource from '../models/Resource.js';

// GET /api/resources
export const getResources = async (req, res) => {
  try {
    const { subject, grade, type } = req.query;
    const filter = {};
    if (subject) filter.subject = subject;
    if (grade) filter.grade = grade;
    if (type) filter.type = type;

    const resources = await Resource.find(filter)
      .populate('uploadedBy', 'name role')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: resources.length, data: resources });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/resources/:id
export const getResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id).populate('uploadedBy', 'name role');
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found.' });
    res.json({ success: true, data: resource });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/resources — upload a new resource
export const createResource = async (req, res) => {
  try {
    const { title, subject, grade, type, description } = req.body;

    if (!title || !subject || !grade) {
      return res.status(400).json({ success: false, message: 'Title, subject and grade are required.' });
    }

    const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const resource = await Resource.create({
      title,
      subject,
      grade,
      type: type || 'Notes',
      description: description || '',
      fileUrl,
      uploadedBy: req.user._id
    });

    res.status(201).json({ success: true, message: 'Resource uploaded!', data: resource });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/resources/:id
export const updateResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found.' });

    if (resource.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorised.' });
    }

    const updated = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/resources/:id
export const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found.' });

    if (resource.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorised.' });
    }

    await resource.deleteOne();
    res.json({ success: true, message: 'Resource deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/resources/:id/download — increment download count
export const downloadResource = async (req, res) => {
  try {
    await Resource.findByIdAndUpdate(req.params.id, { $inc: { downloads: 1 } });
    res.json({ success: true, message: 'Download counted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
