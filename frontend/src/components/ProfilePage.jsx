import React, { useState, useEffect, useRef } from 'react';
import { BoltIcon, MapPinIcon, CameraIcon, CheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import { API_BASE_URL } from '../config';

const ProfilePage = () => {
  const fileInputRef = useRef(null);
  
  // Loading & State
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    location: '',
    workoutType: '',
    experienceLevel: '',
    availability: [],
    profileImage: null
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Dropdown options
  const workoutTypes = ['Strength Training', 'Cardio', 'Yoga', 'CrossFit', 'Running', 'Running/Jogging', 'Swimming', 'Cycling', 'Other'];
  const experienceLevels = ['Beginner', 'Intermediate', 'Advanced', 'Professional'];
  const availabilityOptions = ['Morning', 'Afternoon', 'Evening', 'Weekend'];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    const token = localStorage.getItem('authToken');
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to load profile details');
      
      const user = await response.json();
      setUserId(user._id);
      setFormData({
        username: user.username || '',
        name: user.name || '',
        email: user.email || '',
        location: user.location || '',
        workoutType: user.workoutType || '',
        experienceLevel: user.experienceLevel || '',
        availability: Array.isArray(user.availability) ? user.availability : [],
        profileImage: null // holds new image if uploaded
      });

      if (user.profileImage) {
        setImagePreview(`${API_BASE_URL}${user.profileImage}`);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Error loading profile info');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleAvailabilityChange = (option) => {
    const updated = formData.availability.includes(option)
      ? formData.availability.filter(x => x !== option)
      : [...formData.availability, option];
    
    setFormData({ ...formData, availability: updated });
    if (errors.availability) {
      setErrors({ ...errors, availability: '' });
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        profileImage: file
      });
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.workoutType) newErrors.workoutType = 'Workout type is required';
    if (!formData.experienceLevel) newErrors.experienceLevel = 'Experience level is required';
    if (formData.availability.length === 0) newErrors.availability = 'Select at least one option';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);
    setSuccessMsg('');
    setErrorMsg('');

    const token = localStorage.getItem('authToken');
    const updateData = new FormData();
    updateData.append('name', formData.name);
    updateData.append('email', formData.email);
    updateData.append('location', formData.location);
    updateData.append('workoutType', formData.workoutType);
    updateData.append('experienceLevel', formData.experienceLevel);
    updateData.append('availability', JSON.stringify(formData.availability));
    
    if (formData.profileImage) {
      updateData.append('profileImage', formData.profileImage);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: updateData
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.message || 'Failed to update profile details');
      }

      setSuccessMsg('Profile updated successfully!');
      
      // Update image url if backend returned an updated profileImage path
      if (resData.user?.profileImage) {
        setImagePreview(`${API_BASE_URL}${resData.user.profileImage}`);
      }
      
      // clear select image state
      setFormData(prev => ({ ...prev, profileImage: null }));
    } catch (err) {
      setErrorMsg(err.message || 'Error occurred during save');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="py-6 max-w-4xl mx-auto px-4">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Profile Settings</h2>
        <p className="mt-1 text-sm text-gray-500">Manage your workout goals, schedule availability, and personal details.</p>
      </div>

      {successMsg && (
        <div className="mb-6 p-4 bg-green-50 text-green-800 rounded-xl flex items-center border border-green-200 shadow-sm font-semibold">
          <CheckIcon className="h-5 w-5 mr-2 text-green-600" />
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-xl flex items-center border border-red-200 shadow-sm font-semibold">
          <ExclamationTriangleIcon className="h-5 w-5 mr-2 text-red-600" />
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        {/* Profile Card Header Banner */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600 relative">
          <div className="absolute -bottom-16 left-8 flex items-end">
            <div 
              onClick={handleImageClick}
              className="w-28 h-28 rounded-full border-4 border-white bg-gray-100 shadow-lg overflow-hidden relative cursor-pointer group"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Profile avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                  <span className="text-xl font-bold uppercase">{formData.name ? formData.name.split(' ').map(n=>n[0]).join('').substring(0, 2) : 'FB'}</span>
                </div>
              )}
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                <CameraIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              accept="image/*"
              className="hidden" 
            />
            <div className="mb-2 ml-4">
              <h3 className="text-xl font-bold text-gray-900 leading-none">{formData.name || 'Set Name'}</h3>
              <p className="text-sm text-gray-500 mt-1">@{formData.username}</p>
            </div>
          </div>
        </div>

        {/* Form Body Fields */}
        <div className="pt-24 px-8 pb-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-lg p-2.5 border ${errors.name ? 'border-red-500' : ''}`}
                placeholder="Enter full name"
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-lg p-2.5 border ${errors.email ? 'border-red-500' : ''}`}
                placeholder="Enter email address"
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <MapPinIcon className="h-4 w-4 text-red-500 mr-1" /> Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-lg p-2.5 border ${errors.location ? 'border-red-500' : ''}`}
                placeholder="City or neighborhood"
              />
              {errors.location && <p className="mt-1 text-xs text-red-500">{errors.location}</p>}
            </div>

            {/* Workout Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred Workout Type</label>
              <select
                name="workoutType"
                value={formData.workoutType}
                onChange={handleChange}
                className={`focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-lg p-2.5 border ${errors.workoutType ? 'border-red-500' : ''}`}
              >
                <option value="">Select workout type</option>
                {workoutTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              {errors.workoutType && <p className="mt-1 text-xs text-red-500">{errors.workoutType}</p>}
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Experience Level</label>
              <select
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                className={`focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-lg p-2.5 border ${errors.experienceLevel ? 'border-red-500' : ''}`}
              >
                <option value="">Select experience level</option>
                {experienceLevels.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
              </select>
              {errors.experienceLevel && <p className="mt-1 text-xs text-red-500">{errors.experienceLevel}</p>}
            </div>

            {/* Availability Option */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Workout Schedule Availability</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                {availabilityOptions.map(option => (
                  <div key={option} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`avail-${option}`}
                      checked={formData.availability.includes(option)}
                      onChange={() => handleAvailabilityChange(option)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`avail-${option}`} className="ml-2 text-sm text-gray-700 font-medium cursor-pointer">
                      {option}
                    </label>
                  </div>
                ))}
              </div>
              {errors.availability && <p className="mt-1 text-xs text-red-500">{errors.availability}</p>}
            </div>

          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving Changes...' : 'Save Profile Details'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
