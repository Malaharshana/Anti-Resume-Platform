// backend/routes/challengeRoutes.js

const express = require('express');
const router = express.Router();
const Challenge = require('../models/Challenge');
const { protect } = require('../middleware/authMiddleware');

// GET all challenges (public)
router.get('/', async (req, res) => {
  try {
    const challenges = await Challenge.find();
    res.json(challenges);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET a single challenge by ID (public)
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const challenge = await Challenge.findById(id);

    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    res.json(challenge);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST a new challenge (protected)
router.post('/post', protect, async (req, res) => {
    const {
      title,
      description,
      company,
      skills,
      postedBy,
      difficulty,
      duration,
      attachments
    } = req.body;
  
    try {
      const newChallenge = new Challenge({
        title,
        description,
        company,
        skills,
        postedBy,
        difficulty,
        duration,
        attachments
      });
  
      await newChallenge.save();
      res.status(201).json(newChallenge);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  });

// UPDATE a challenge (protected)
router.put('/:id', protect, async (req, res) => {
    const { id } = req.params;
  
    try {
      const updatedChallenge = await Challenge.findByIdAndUpdate(id, req.body, {
        new: true, // return the updated document
        runValidators: true
      });
  
      if (!updatedChallenge) {
        return res.status(404).json({ message: 'Challenge not found' });
      }
  
      res.json(updatedChallenge);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
// DELETE a challenge (protected)
router.delete('/:id', protect, async (req, res) => {
    const { id } = req.params;
  
    try {
      const challenge = await Challenge.findById(id);
  
      if (!challenge) {
        return res.status(404).json({ message: 'Challenge not found' });
      }
  
      await challenge.deleteOne(); // or challenge.remove()
  
      res.json({ message: 'Challenge deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
module.exports = router;
