// backend/routes/matchRoutes.js
const express = require('express');
const router = express.Router();
const Challenge = require('../models/Challenge');
const Candidate = require('../models/andidate');
const FeedbackAnalytics = require('../models/FeedbackAnalytics');

// Function to calculate match score, adjusting based on feedback
const calculateMatchingScore = async (candidate, challenge) => {
  let baseMatchScore = 0;

  // Calculate base score based on overlapping skills
  baseMatchScore = candidate.skills.filter(skill => challenge.skills.includes(skill)).length;

  // Fetch feedback analytics for the candidate-challenge pair
  const feedbackAnalytics = await FeedbackAnalytics.findOne({
    candidateId: candidate._id,
    challengeId: challenge._id,
  });

  if (feedbackAnalytics) {
    const avgFeedbackRating = feedbackAnalytics.averageRating;

    // Adjust match score based on feedback
    if (avgFeedbackRating >= 4) {
      // High rating: Increase match score by 10%
      baseMatchScore = baseMatchScore * 1.1;
    } else if (avgFeedbackRating < 3) {
      // Low rating: Decrease match score by 10%
      baseMatchScore = baseMatchScore * 0.9;
    }
  }

  return baseMatchScore; // Return the adjusted match score
};

// POST route to match challenges with candidate skills
router.post('/match', async (req, res) => {
  const { candidateId } = req.body;  // Candidate ID to fetch skills

  try {
    // Fetch candidate by ID
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    const candidateSkills = candidate.skills;

    // Find challenges that have overlapping skills with candidate's skills
    const matchedChallenges = await Challenge.find({
      skills: { $in: candidateSkills }
    });

    if (matchedChallenges.length === 0) {
      return res.status(404).json({ message: 'No matching challenges found' });
    }

    // Calculate match scores for each challenge
    const matchedResults = [];
    for (let challenge of matchedChallenges) {
      const score = await calculateMatchingScore(candidate, challenge);
      matchedResults.push({ challengeId: challenge._id, score });
    }

    // Sort challenges by match score (highest first)
    matchedResults.sort((a, b) => b.score - a.score);

    res.json(matchedResults); // Return sorted list of matched challenges
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
