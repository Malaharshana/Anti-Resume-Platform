const express = require('express');
const router = express.Router();
const Candidate = require('../models/candidate');  // Adjust the path to your Candidate model

// POST route to add a candidate
router.post('/add', async (req, res) => {
  const { name, skills } = req.body;  // Candidate name and skills

  try {
    const newCandidate = new Candidate({
      name,
      skills,
    });

    await newCandidate.save();
    res.status(201).json({ message: 'Candidate added successfully', candidate: newCandidate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

const Challenge = require('../models/Challenge');

// POST /api/candidate/match
router.post('/match', async (req, res) => {
  const { candidateId } = req.body;

  try {
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    console.log("Matching candidate:", candidate.skills);

    const matchedChallenges = await Challenge.find({
      skills: { $in: candidate.skills }
    });

    console.log("Challenges found:", matchedChallenges.length);

    if (matchedChallenges.length === 0) {
      return res.status(404).json({ message: 'No matching challenges found' });
    }

    res.json(matchedChallenges);
  } catch (error) {
    console.error("Error matching challenges:", error);
    res.status(500).json({ message: 'Server error' });
  }
});
