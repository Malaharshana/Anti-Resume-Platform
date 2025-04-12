const mongoose = require('mongoose');

// Define schema for candidate
const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  skills: { type: [String], required: true },
  challengesCompleted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' }],
}, { timestamps: true });

// Check if model exists before creating
const Candidate = mongoose.models.Candidate || mongoose.model('Candidate', candidateSchema);

module.exports = Candidate;
