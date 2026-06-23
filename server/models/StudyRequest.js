// =============================================
// models/StudyRequest.js — Study Request Schema
// Pupils post requests; tutors respond
// =============================================

import mongoose from 'mongoose';

const studyRequestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required']
  },
  grade: {
    type: String,
    required: [true, 'Grade is required']
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved'],
    default: 'open'
  },
  responses: [{
    tutor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: String,
    rating: { type: Number, default: null },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default mongoose.model('StudyRequest', studyRequestSchema);
