const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const FeedbackAnalytics = require('../models/FeedbackAnalytics'); // Added to handle feedback analytics

// GET: Fetch full company info by ID
router.get('/:companyId', async (req, res) => {
  try {
    const company = await Company.findById(req.params.companyId);
    if (!company) return res.status(404).json({ message: 'Company not found' });
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST: Create a new company
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email || email.trim() === '') {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if the email is already taken
    const existingCompany = await Company.findOne({ email });
    if (existingCompany) {
      return res.status(400).json({ message: 'Company with this email already exists' });
    }

    // Create and save the new company
    const newCompany = new Company(req.body);
    const savedCompany = await newCompany.save();
    res.status(201).json(savedCompany);
  } catch (error) {
    res.status(500).json({ message: 'Error creating company', error: error.message });
  }
});

// POST: Add culture metrics
router.post('/:companyId/metrics', async (req, res) => {
  try {
    const { teamwork, growth, inclusivity } = req.body;
    const company = await Company.findByIdAndUpdate(
      req.params.companyId,
      {
        $set: {
          'cultureMetrics.teamwork': teamwork,
          'cultureMetrics.growth': growth,
          'cultureMetrics.inclusivity': inclusivity
        }
      },
      { new: true }
    );
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST: Add a review
router.post('/:companyId/review', async (req, res) => {
  try {
    const { reviewer, comment, rating } = req.body;
    const company = await Company.findByIdAndUpdate(
      req.params.companyId,
      {
        $push: { reviews: { reviewer, comment, rating } }
      },
      { new: true }
    );
    
    // Save feedback analytics after each review
    await FeedbackAnalytics.create({
      companyId: req.params.companyId,
      reviewer: reviewer,
      rating: rating,
      comment: comment,
    });

    res.json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST: Add salary range
router.post('/:companyId/salary', async (req, res) => {
  try {
    const { role, minSalary, maxSalary, currency } = req.body;
    const company = await Company.findByIdAndUpdate(
      req.params.companyId,
      {
        $push: {
          salaryRanges: { role, minSalary, maxSalary, currency }
        }
      },
      { new: true }
    );
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST: Add feedback for a candidate to a company
router.post('/:companyId/:candidateId/feedback', async (req, res) => {
  try {
    const { rating, comment } = req.body; // Extract feedback data
    const { companyId, candidateId } = req.params; // Extract companyId and candidateId from URL

    // Find or create FeedbackAnalytics entry for the given company and candidate
    let feedbackAnalytics = await FeedbackAnalytics.findOne({ companyId, candidateId });
    if (!feedbackAnalytics) {
      feedbackAnalytics = new FeedbackAnalytics({ companyId, candidateId });
    }

    // Update feedback analytics with new feedback
    feedbackAnalytics.totalFeedbackCount += 1;
    feedbackAnalytics.averageRating = (feedbackAnalytics.averageRating * (feedbackAnalytics.totalFeedbackCount - 1) + rating) / feedbackAnalytics.totalFeedbackCount;
    feedbackAnalytics.feedbackTrends.push({ rating, comment });

    await feedbackAnalytics.save();

    res.status(200).json(feedbackAnalytics); // Return the updated feedback analytics
  } catch (error) {
    res.status(500).json({ message: 'Error processing feedback', error: error.message });
  }
});

module.exports = router;
