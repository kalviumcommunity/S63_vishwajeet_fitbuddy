const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, password, name, email, location, workoutType, experienceLevel, availability } = req.body;
    
    // Check if username exists and create user
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'Username already exists' });
    
    const newUser = new User({
      username, password, name, email, location, workoutType, experienceLevel,
      availability: Array.isArray(availability) ? availability : []
    });
    
    await newUser.save();
    
    const userObj = newUser.toObject();
    delete userObj.password;
    res.status(201).json({ message: 'User registered successfully', user: userObj });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: 'Invalid username or password' });
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid username or password' });
    
    // Create token and return user data
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || 'your-default-secret-key',
      { expiresIn: '24h' }
    );
    
    const userObj = user.toObject();
    delete userObj.password;
    
    res.status(200).json({ message: 'Login successful', token, user: userObj });
  } catch (error) {
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
});

// Auth middleware
const authMiddleware = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Authentication required' });
    
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'your-default-secret-key');
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token', error: error.message });
  }
};

// Get current user (protected route)
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user data', error: error.message });
  }
});

module.exports = { router, authMiddleware }; 