import React, { useState, useEffect } from 'react';
import { BoltIcon, MapPinIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/solid';
import { API_BASE_URL } from '../config';

const DiscoverPage = () => {
  const [users, setUsers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search & Filter State
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedWorkoutType, setSelectedWorkoutType] = useState('');
  const [selectedExperienceLevel, setSelectedExperienceLevel] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState('');

  // Dropdown options
  const workoutTypes = ['Strength Training', 'Cardio', 'Yoga', 'CrossFit', 'Running', 'Running/Jogging', 'Swimming', 'Cycling', 'Other'];
  const experienceLevels = ['Beginner', 'Intermediate', 'Advanced', 'Professional'];
  const availabilityOptions = ['Morning', 'Afternoon', 'Evening', 'Weekend'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('authToken');
    
    try {
      // 1. Fetch current user
      const meResponse = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!meResponse.ok) throw new Error('Failed to fetch auth user details');
      const meData = await meResponse.json();
      setCurrentUser(meData);

      // 2. Fetch all users
      const usersResponse = await fetch(`${API_BASE_URL}/api/users`);
      if (!usersResponse.ok) throw new Error('Failed to fetch users list');
      const usersData = await usersResponse.json();
      // Filter out the current user from the main discovery feed
      const filteredUsers = usersData.filter(u => u._id !== meData._id && u.username !== meData.username);
      setUsers(filteredUsers);

      // 3. Fetch matches list
      const matchesResponse = await fetch(`${API_BASE_URL}/api/matches/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (matchesResponse.ok) {
        const matchesData = await matchesResponse.json();
        setMatches(matchesData);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error loading discovery data');
    } finally {
      setLoading(false);
    }
  };

  // Check the match status with a specific user
  const getMatchStatus = (targetUserId) => {
    if (!currentUser) return null;
    const match = matches.find(m => 
      (m.user1 === currentUser._id && m.user2 === targetUserId) ||
      (m.user2 === currentUser._id && m.user1 === targetUserId)
    );

    if (!match) return 'none';
    if (match.status === 'accepted') return 'accepted';
    
    // Pending status: check who requested
    if (match.user1 === currentUser._id) {
      return 'sent_pending';
    } else {
      return 'received_pending';
    }
  };

  const handleConnect = async (targetUserId) => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await fetch(`${API_BASE_URL}/api/matches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ targetUserId })
      });
      
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to send match request');
      }

      // Re-fetch matches to update status
      const matchesResponse = await fetch(`${API_BASE_URL}/api/matches/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (matchesResponse.ok) {
        const matchesData = await matchesResponse.json();
        setMatches(matchesData);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // Filtered Users list based on current filters
  const filteredUsers = users.filter(user => {
    const matchesLocation = user.location?.toLowerCase().includes(searchLocation.toLowerCase());
    
    const matchesWorkout = selectedWorkoutType === '' || 
      user.workoutType?.toLowerCase() === selectedWorkoutType.toLowerCase();
      
    const matchesExperience = selectedExperienceLevel === '' || 
      user.experienceLevel?.toLowerCase() === selectedExperienceLevel.toLowerCase();
      
    const matchesAvailability = selectedAvailability === '' || 
      (Array.isArray(user.availability) && user.availability.includes(selectedAvailability));

    return matchesLocation && matchesWorkout && matchesExperience && matchesAvailability;
  });

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Discover Workout Partners
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Browse profiles, filter by fitness preferences, and find the perfect match.
            </p>
          </div>
        </div>

        {/* Search and Filters panel */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Location */}
            <div className="relative">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Location</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPinIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-2.5 border"
                  placeholder="City or neighborhood"
                />
              </div>
            </div>

            {/* Workout Type Filter */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Workout Type</label>
              <select
                value={selectedWorkoutType}
                onChange={(e) => setSelectedWorkoutType(e.target.value)}
                className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-lg p-2.5 border"
              >
                <option value="">All Workouts</option>
                {workoutTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Experience Level Filter */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Experience Level</label>
              <select
                value={selectedExperienceLevel}
                onChange={(e) => setSelectedExperienceLevel(e.target.value)}
                className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-lg p-2.5 border"
              >
                <option value="">All Levels</option>
                {experienceLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            {/* Availability Filter */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Availability</label>
              <select
                value={selectedAvailability}
                onChange={(e) => setSelectedAvailability(e.target.value)}
                className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-lg p-2.5 border"
              >
                <option value="">All Times</option>
                {availabilityOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Content list */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-800 p-4 rounded-xl text-center shadow-sm">
            {error}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="bg-gray-50 text-gray-500 py-16 rounded-2xl text-center border-2 border-dashed border-gray-200">
            <BoltIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No workout partners found</h3>
            <p className="mt-1 text-sm">Try widening your search filters or changing locations.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map(user => {
              const status = getMatchStatus(user._id);
              
              // Determine button styling based on match status
              let buttonText = 'Connect';
              let buttonClass = 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white';
              let isButtonDisabled = false;

              if (status === 'accepted') {
                buttonText = 'Connected';
                buttonClass = 'bg-green-100 text-green-700 cursor-default';
                isButtonDisabled = true;
              } else if (status === 'sent_pending') {
                buttonText = 'Requested';
                buttonClass = 'bg-gray-100 text-gray-500 cursor-default';
                isButtonDisabled = true;
              } else if (status === 'received_pending') {
                buttonText = 'Accept Connection';
                buttonClass = 'bg-blue-100 text-blue-700 hover:bg-blue-200';
              }

              const profileImageUrl = user.profileImage 
                ? `${API_BASE_URL}${user.profileImage}` 
                : null;

              return (
                <div key={user._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition duration-300 overflow-hidden flex flex-col justify-between h-full">
                  <div className="p-6">
                    {/* User profile picture / Avatar */}
                    <div className="flex items-center space-x-4 mb-4">
                      {profileImageUrl ? (
                        <img 
                          src={profileImageUrl} 
                          alt={user.name} 
                          className="w-16 h-16 rounded-full object-cover border-2 border-blue-500" 
                          onError={(e) => {
                            // fallback if load fails
                            e.target.src = 'https://www.gravatar.com/avatar/?d=mp';
                          }}
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold border-2 border-white shadow-md">
                          {user.name ? user.name.split(' ').map(n=>n[0]).join('').toUpperCase().substring(0, 2) : 'FB'}
                        </div>
                      )}
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 leading-tight">{user.name || user.username}</h3>
                        <p className="text-sm text-gray-500 flex items-center mt-1">
                          <MapPinIcon className="h-4 w-4 text-red-500 mr-1" />
                          {user.location || 'Location not set'}
                        </p>
                      </div>
                    </div>

                    {/* Stats/Badges */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-sm">
                        <span className="font-semibold text-gray-600 w-24">Workout:</span>
                        <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-xs font-bold border border-blue-100">
                          {user.workoutType || 'General'}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="font-semibold text-gray-600 w-24">Level:</span>
                        <span className="bg-purple-50 text-purple-700 px-2.5 py-1 rounded-md text-xs font-bold border border-purple-100">
                          {user.experienceLevel || 'Intermediate'}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 items-center text-sm">
                        <span className="font-semibold text-gray-600 w-24">Availability:</span>
                        {user.availability && user.availability.length > 0 ? (
                          user.availability.map(avail => (
                            <span key={avail} className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-[11px] font-medium">
                              {avail}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 text-xs italic">Anytime</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Connect Action Button */}
                  <div className="p-4 bg-gray-50 border-t border-gray-100">
                    <button
                      onClick={() => handleConnect(user._id)}
                      disabled={isButtonDisabled}
                      className={`w-full py-2.5 px-4 rounded-xl font-bold text-sm shadow-sm transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${buttonClass}`}
                    >
                      {buttonText}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscoverPage;
