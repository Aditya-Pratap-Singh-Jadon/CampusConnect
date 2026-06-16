const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^[\w.]+@(vitstudent\.ac\.in|vit\.ac\.in)$/, 'Only VIT email addresses are allowed']
  },
  
  // 1. CHANGED: Removed 'required: true' so Google users can register without a password
  password: { type: String },
  
  // 2. ADDED: This keeps track of whether they used Google or the manual form
  authProvider: { type: String, enum: ['manual', 'google'], default: 'manual' },

  role: { type: String, enum: ['student', 'mentor'], default: 'student' },

  // Common profile fields
  college: { type: String, default: 'VIT Vellore' },
  bio: { type: String },
  github: { type: String },
  linkedin: { type: String },
  portfolio: { type: String },
  interests: [String],

  // Student fields
  year: { type: Number },
  branch: { type: String },
  skills: [String],

  // Mentor fields
  achievements: [String],
  mentorAvailability: {
    type: String,
    enum: ['open', 'limited', 'unavailable'],
    default: 'open'
  },

}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);