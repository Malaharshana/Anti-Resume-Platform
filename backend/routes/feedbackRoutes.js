const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const Candidate = require('../models/candidate');
const Challenge = require('../models/Challenge');
const FeedbackAnalytics = require('../models/FeedbackAnalytics');

// POST: Add feedback after hiring a candidate
router.post('/', async (req, res) => {
  try {
    const { rating, comments, challengeId, candidateId } = req.body;

    // Ensure challenge and candidate exist
    const challenge = await Challenge.findById(challengeId);
    const candidate = await Candidate.findById(candidateId);

    if (!challenge || !candidate) {
      return res.status(404).json({ message: 'Challenge or Candidate not found' });
    }

    // Create and save feedback
    const feedback = new Feedback({
      rating,
      comments,
      challenge: challengeId,
      candidate: candidateId,
    });
    await feedback.save();

    // Now update feedback analytics
    let feedbackAnalytics = await FeedbackAnalytics.findOne({ candidateId, challengeId });

    if (!feedbackAnalytics) {
      // If no analytics found, create a new one
      feedbackAnalytics = new FeedbackAnalytics({ candidateId, challengeId });
    }

    // Use the updateFeedback method to update analytics
    await feedbackAnalytics.updateFeedback(rating, comments);

    // Send response with the feedback object
    res.status(201).json(feedback);
  } catch (err) {
    // Log error and send response with error message
    console.error('Error saving feedback or updating analytics:', err.message);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

// GET: Retrieve feedback for a specific candidate
router.get('/candidate/:candidateId', async (req, res) => {
  try {
    const feedback = await Feedback.find({ candidate: req.params.candidateId })
      .populate('challenge')
      .populate('candidate');

    if (!feedback || feedback.length === 0) {
      return res.status(404).json({ message: 'No feedback found for this candidate' });
    }

    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET: Retrieve feedback for a specific challenge
router.get('/challenge/:challengeId', async (req, res) => {
  try {
    const feedback = await Feedback.find({ challenge: req.params.challengeId })
      .populate('challenge')
      .populate('candidate');

    if (!feedback || feedback.length === 0) {
      return res.status(404).json({ message: 'No feedback found for this challenge' });
    }

    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET feedback for a specific candidate (feedback analytics)
router.get('/feedback/:candidateId', async (req, res) => {
    try {
      const candidateId = req.params.candidateId;
      console.log('Fetching feedback for candidate:', candidateId); // Log the candidate ID for debugging
  
      const feedbackAnalytics = await FeedbackAnalytics.findOne({ candidateId });
      
      if (!feedbackAnalytics) {
        return res.status(404).json({ message: 'No feedback found for this candidate.' });
      }
      
      res.json(feedbackAnalytics);
    } catch (error) {
      console.log('Error fetching feedback:', error); // Log the error if it happens
      res.status(500).json({ message: 'Error fetching feedback', error: error.message });
    }
  });
  

module.exports = router;
