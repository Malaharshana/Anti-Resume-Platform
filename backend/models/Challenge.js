const mongoose = require('mongoose');

// Define schema for challenge
const challengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  skills: { type: [String], required: true },
  difficulty: { type: String, required: true },
  postedBy: { type: String, required: true },
}, { timestamps: true });

// Check if model exists before creating
const Challenge = mongoose.models.Challenge || mongoose.model('Challenge', challengeSchema);

module.exports = Challenge;
