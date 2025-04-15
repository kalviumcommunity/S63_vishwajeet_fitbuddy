const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  location: String,
  workoutType: String,
  experienceLevel: String,
  availability: [String], // e.g., ['Morning', 'Evening']
});

module.exports = mongoose.model('User', userSchema);
