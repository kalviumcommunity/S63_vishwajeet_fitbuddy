import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SignUpPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // Form state
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
    email: '',
    location: '',
    workoutType: '',
    experienceLevel: '',
    availability: [],
    profileImage: null
  });
  
  // Error state
  const [errors, setErrors] = useState({});
  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  // For image preview
  const [imagePreview, setImagePreview] = useState(null);
  
  // Available options for form selects
  const workoutTypes = ['Strength Training', 'Cardio', 'Yoga', 'CrossFit', 'Running', 'Swimming', 'Cycling', 'Other'];
  const experienceLevels = ['Beginner', 'Intermediate', 'Advanced', 'Professional'];
  const availabilityOptions = ['Morning', 'Afternoon', 'Evening', 'Weekend'];
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  // Handle checkbox changes for availability
  const handleAvailabilityChange = (option) => {
    const updatedAvailability = formData.availability.includes(option)
      ? formData.availability.filter(item => item !== option)
      : [...formData.availability, option];
    
    setFormData({
      ...formData,
      availability: updatedAvailability
    });
    
    // Clear error when user selects options
    if (errors.availability) {
      setErrors({
        ...errors,
        availability: ''
      });
    }
  };
  
  // Handle image upload button click
  const handleUploadButtonClick = () => {
    fileInputRef.current.click();
  };
  
  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        profileImage: file
      });
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Clear error when user uploads an image
      if (errors.profileImage) {
        setErrors({
          ...errors,
          profileImage: ''
        });
      }
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Validate username and password fields
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    // Validate existing fields
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.workoutType) newErrors.workoutType = 'Workout type is required';
    if (!formData.experienceLevel) newErrors.experienceLevel = 'Experience level is required';
    if (formData.availability.length === 0) newErrors.availability = 'Please select at least one availability option';
    if (!formData.profileImage) newErrors.profileImage = 'Please upload a profile picture';
    
    return newErrors;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // First step: Register user with authentication credentials
      const registrationData = {
        username: formData.username,
        password: formData.password,
        name: formData.name,
        email: formData.email,
        location: formData.location,
        workoutType: formData.workoutType,
        experienceLevel: formData.experienceLevel,
        availability: formData.availability
      };
      
      // Register user first to create account with auth credentials
      const authResponse = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData)
      });
      
      const authData = await authResponse.json();
      
      if (!authResponse.ok) {
        throw new Error(authData?.message || `Failed to create account: ${authResponse.status}`);
      }
      
      // Second step: If user has a profile image, upload it
      if (formData.profileImage) {
        const imageData = new FormData();
        imageData.append('profileImage', formData.profileImage);
        
        // Update user profile with image
        // We'll need to modify the userRoutes to handle this separately
        // For now, we'll use the existing route but only for the image
        const imageResponse = await fetch(`http://localhost:5000/api/users/${authData.user._id}`, {
          method: 'PUT',
          body: imageData
        });
        
        if (!imageResponse.ok) {
          console.warn('Profile image upload failed, but account was created');
        }
      }
      
      console.log('User registered successfully:', authData);
      
      // Success - show success message and redirect after a delay
      setSubmitSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      setSubmitError(error.message || 'An error occurred during registration');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create Your FitBuddy Account</h2>
      
      {submitSuccess && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          Registration successful! Redirecting to login...
        </div>
      )}
      
      {submitError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {submitError}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Username Field */}
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.username ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Choose a username"
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-500">{errors.username}</p>
          )}
        </div>
        
        {/* Password Field */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password}</p>
          )}
        </div>
        
        {/* Confirm Password Field */}
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
          )}
        </div>
        
        {/* Profile Image Upload */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2 text-center">
            Profile Picture
          </label>
          
          <div className="flex flex-col items-center">
            {/* Image Preview Area */}
            <div className={`w-32 h-32 rounded-full border-2 flex items-center justify-center overflow-hidden mb-2 ${
              errors.profileImage ? 'border-red-500' : 'border-gray-300'
            }`}>
              {imagePreview ? (
                <img src={imagePreview} alt="Profile preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-gray-400 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="text-sm">No Photo</span>
                </div>
              )}
            </div>
            
            {/* Upload Button */}
            <button
              type="button"
              onClick={handleUploadButtonClick}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Upload Photo
            </button>
            
            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
              accept="image/*"
            />
            
            {errors.profileImage && (
              <p className="mt-1 text-sm text-red-500 text-center">{errors.profileImage}</p>
            )}
          </div>
        </div>
        
        {/* Name Field */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your full name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </div>
        
        {/* Email Field */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your email address"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>
        
        {/* Location Field */}
        <div className="mb-4">
          <label htmlFor="location" className="block text-gray-700 font-medium mb-2">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.location ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your city or neighborhood"
          />
          {errors.location && (
            <p className="mt-1 text-sm text-red-500">{errors.location}</p>
          )}
        </div>
        
        {/* Workout Type Field */}
        <div className="mb-4">
          <label htmlFor="workoutType" className="block text-gray-700 font-medium mb-2">
            Preferred Workout Type
          </label>
          <select
            id="workoutType"
            name="workoutType"
            value={formData.workoutType}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.workoutType ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select workout type</option>
            {workoutTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors.workoutType && (
            <p className="mt-1 text-sm text-red-500">{errors.workoutType}</p>
          )}
        </div>
        
        {/* Experience Level Field */}
        <div className="mb-4">
          <label htmlFor="experienceLevel" className="block text-gray-700 font-medium mb-2">
            Experience Level
          </label>
          <select
            id="experienceLevel"
            name="experienceLevel"
            value={formData.experienceLevel}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.experienceLevel ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select experience level</option>
            {experienceLevels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
          {errors.experienceLevel && (
            <p className="mt-1 text-sm text-red-500">{errors.experienceLevel}</p>
          )}
        </div>
        
        {/* Availability Field */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Availability
          </label>
          <div className="grid grid-cols-2 gap-2">
            {availabilityOptions.map(option => (
              <div key={option} className="flex items-center">
                <input
                  type="checkbox"
                  id={`availability-${option}`}
                  checked={formData.availability.includes(option)}
                  onChange={() => handleAvailabilityChange(option)}
                  className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={`availability-${option}`} className="ml-2 text-gray-700">
                  {option}
                </label>
              </div>
            ))}
          </div>
          {errors.availability && (
            <p className="mt-1 text-sm text-red-500">{errors.availability}</p>
          )}
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
      
      {/* Login link */}
      <div className="mt-4 text-center">
        <p className="text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:text-blue-700 font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;