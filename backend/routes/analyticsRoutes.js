// backend/routes/analyticsRoutes.js
const express = require('express');
const router = express.Router();
const FeedbackAnalytics = require('../models/FeedbackAnalytics');

// GET: Fetch feedback report for a candidate
router.get('/candidate/:candidateId', async (req, res) => {
  try {
    const feedbackReport = await FeedbackAnalytics.aggregate([
      { $match: { candidateId: req.params.candidateId } },
      { $group: { _id: "$challengeId", avgRating: { $avg: "$rating" }, feedbackCount: { $sum: 1 } } },
      { $sort: { avgRating: -1 } } // Sort by highest rating
    ]);

    res.json(feedbackReport); // Return feedback report
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET: Fetch feedback report for a challenge
router.get('/challenge/:challengeId', async (req, res) => {
  try {
    const feedbackReport = await FeedbackAnalytics.aggregate([
      { $match: { challengeId: req.params.challengeId } },
      { $group: { _id: "$candidateId", avgRating: { $avg: "$rating" }, feedbackCount: { $sum: 1 } } },
      { $sort: { avgRating: -1 } } // Sort by highest rating
    ]);

    res.json(feedbackReport); // Return feedback report
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
