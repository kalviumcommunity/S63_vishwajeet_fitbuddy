const express = require('express');
const router = express.Router();
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads/profiles');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'profile-' + uniqueSuffix + ext);
  }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Initialize multer upload
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// GET all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new user with profile image upload
router.post('/users', upload.single('profileImage'), async (req, res) => {
  try {
    // Parse availability if it's a JSON string
    let availability = req.body.availability;
    if (typeof availability === 'string') {
      try {
        availability = JSON.parse(availability);
      } catch (e) {
        // If it's not valid JSON, keep it as is
      }
    }

    // Get file path if an image was uploaded
    const profileImage = req.file ? `/uploads/profiles/${req.file.filename}` : '';
    
    // Create new user with all fields including profile image
    const { name, email, location, workoutType, experienceLevel } = req.body;
    const newUser = new User({ 
      name, 
      email, 
      location, 
      workoutType, 
      experienceLevel, 
      availability,
      profileImage 
    });

  try {
    await newUser.save();
    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (err) {
    res.status(400).json({ message: "Error creating user", error: err.message });
  }
  } catch (err) {
    res.status(400).json({ message: "Error creating user", error: err.message });
  }
});

// GET a single user by ID
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT: Update a user by ID
router.put('/users/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Error updating user", error: err.message });
  }
});

// 🗑️ DELETE: Delete a user by ID
router.delete('/users/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully", user: deletedUser });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user", error: err.message });
  }
});

module.exports = router;
