const express = require('express');
const router = express.Router();
const Match = require('../models/Match');

// GET all matches
router.get('/matches', async (req, res) => {
  try {
    const matches = await Match.find().populate('user1 user2');
    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
