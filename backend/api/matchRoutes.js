const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');
const Challenge = require('../models/Challenge');
const { getMatchingScore } = require('../utils/matchingUtils');

router.post('/match', async (req, res) => {
  try {
    const { candidateId, challengeId } = req.body;

    const candidate = await Candidate.findById(candidateId);
    const challenge = await Challenge.findById(challengeId);

    if (!candidate || !challenge) {
      return res.status(404).json({ message: 'Candidate or Challenge not found' });
    }

    const score = await getMatchingScore(candidate.skills, challenge.skills);

    res.json({
      message: 'Match result',
      score,
      candidateName: candidate.name,
      challengeTitle: challenge.title,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error during matching', error: error.toString() });
  }
});

module.exports = router;
