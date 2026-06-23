// =============================================
// models/AILog.js — AI Q&A Log Schema
// Stores questions and answers for analytics
// =============================================

import mongoose from 'mongoose';

const aiLogSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  subject: { type: String, default: 'General' },
  askedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  relatedResources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }]
}, { timestamps: true });

export default mongoose.model('AILog', aiLogSchema);
