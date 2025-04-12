// backend/api/candidateRoutes.js
const express = require('express');
const router = express.Router();
const Candidate = require('../models/candidate'); // Assuming the Candidate model exists

// GET all candidates
router.get('/', async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST a new candidate
router.post('/add', async (req, res) => {
  const { name, skills } = req.body;

  try {
    const newCandidate = new Candidate({
      name,
      skills
    });
    await newCandidate.save();
    res.status(201).json({ message: 'Candidate added successfully', candidate: newCandidate });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
