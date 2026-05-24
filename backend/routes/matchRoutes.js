const express = require('express');
const router = express.Router();
const Match = require('../models/Match');
const { authMiddleware } = require('./authRoutes');

// GET all accepted matches for the logged-in user
router.get('/matches', authMiddleware, async (req, res) => {
  try {
    const matches = await Match.find({
      $or: [ { user1: req.user.userId }, { user2: req.user.userId } ],
      status: 'accepted'
    }).populate('user1 user2', '-password');
    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all match requests (pending and accepted) for the logged-in user
router.get('/matches/all', authMiddleware, async (req, res) => {
  try {
    const matches = await Match.find({
      $or: [ { user1: req.user.userId }, { user2: req.user.userId } ]
    });
    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST to request/accept a match
router.post('/matches', authMiddleware, async (req, res) => {
  try {
    const { targetUserId } = req.body;
    if (!targetUserId) {
      return res.status(400).json({ message: 'Target user ID is required' });
    }

    if (targetUserId === req.user.userId) {
      return res.status(400).json({ message: 'You cannot match with yourself' });
    }

    // Find if a match record already exists
    let match = await Match.findOne({
      $or: [
        { user1: req.user.userId, user2: targetUserId },
        { user1: targetUserId, user2: req.user.userId }
      ]
    });

    if (match) {
      // If the target user requested it and it's pending, we accept it
      if (match.user1.toString() === targetUserId && match.status === 'pending') {
        match.status = 'accepted';
        await match.save();
        return res.json({ message: 'Match request accepted!', match });
      }
      return res.json({ message: 'Match request already exists', match });
    }

    // Otherwise, create a new pending match request
    match = new Match({
      user1: req.user.userId,
      user2: targetUserId,
      status: 'pending'
    });

    await match.save();
    res.status(201).json({ message: 'Match request sent!', match });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
