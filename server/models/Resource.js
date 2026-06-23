// =============================================
// models/Resource.js — Study Resource Schema
// Notes, past papers, study guides
// =============================================

import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  subject: {
    type: String,
    required: [true, 'Subject is required']
  },
  grade: {
    type: String,
    required: [true, 'Grade is required']
  },
  type: {
    type: String,
    enum: ['Notes', 'Past Paper', 'Study Guide', 'Exercise', 'Other'],
    default: 'Notes'
  },
  description: {
    type: String,
    default: ''
  },
  fileUrl: {
    type: String,
    default: null
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  downloads: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export default mongoose.model('Resource', resourceSchema);
