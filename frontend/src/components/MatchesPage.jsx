import React, { useState, useEffect } from 'react';
import { BoltIcon, EnvelopeIcon, MapPinIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';
import { API_BASE_URL } from '../config';

const MatchesPage = () => {
  const [matches, setMatches] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('authToken');
    
    try {
      // 1. Fetch current user to distinguish user1 vs user2 in matches
      const meResponse = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!meResponse.ok) throw new Error('Authentication required');
      const meData = await meResponse.json();
      setCurrentUser(meData);

      // 2. Fetch accepted matches
      const response = await fetch(`${API_BASE_URL}/api/matches`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch matches');
      const data = await response.json();
      setMatches(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error loading matches');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Your Workout Matches</h2>
          <p className="mt-1 text-sm text-gray-500">
            These are your mutual fitness connections. Reach out to coordinate your next session!
          </p>
        </div>

        {/* Matches Feed */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-800 p-4 rounded-xl text-center shadow-sm">
            {error}
          </div>
        ) : matches.length === 0 ? (
          <div className="bg-gray-50 text-gray-500 py-16 rounded-2xl text-center border-2 border-dashed border-gray-200">
            <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No matches yet</h3>
            <p className="mt-1 text-sm">Head over to the Discover page to find potential fitness buddies!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {matches.map(match => {
              // Determine which populated user object belongs to the match buddy
              const buddy = match.user1._id === currentUser._id ? match.user2 : match.user1;
              const profileImageUrl = buddy.profileImage 
                ? `${API_BASE_URL}${buddy.profileImage}` 
                : null;

              return (
                <div key={match._id} className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex flex-col justify-between transition duration-300 hover:shadow-lg">
                  <div>
                    {/* Header Info */}
                    <div className="flex items-center space-x-4 mb-4">
                      {profileImageUrl ? (
                        <img 
                          src={profileImageUrl} 
                          alt={buddy.name} 
                          className="w-16 h-16 rounded-full object-cover border-2 border-green-500" 
                          onError={(e) => {
                            e.target.src = 'https://www.gravatar.com/avatar/?d=mp';
                          }}
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-green-500 to-emerald-500 flex items-center justify-center text-white text-xl font-bold border-2 border-white shadow-md">
                          {buddy.name ? buddy.name.split(' ').map(n=>n[0]).join('').toUpperCase().substring(0, 2) : 'FB'}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-xl font-bold text-gray-900">{buddy.name || buddy.username}</h3>
                          <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Matched
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 flex items-center mt-1">
                          <MapPinIcon className="h-4 w-4 text-red-500 mr-1" />
                          {buddy.location || 'Location not set'}
                        </p>
                      </div>
                    </div>

                    {/* Preferences */}
                    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl mb-6 border border-gray-100">
                      <div>
                        <span className="block text-[11px] font-bold text-gray-400 uppercase">Workout</span>
                        <span className="text-sm font-semibold text-gray-700">{buddy.workoutType || 'General'}</span>
                      </div>
                      <div>
                        <span className="block text-[11px] font-bold text-gray-400 uppercase">Experience</span>
                        <span className="text-sm font-semibold text-gray-700">{buddy.experienceLevel || 'Intermediate'}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="block text-[11px] font-bold text-gray-400 uppercase">Availability</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {buddy.availability && buddy.availability.length > 0 ? (
                            buddy.availability.map(avail => (
                              <span key={avail} className="bg-white text-gray-700 border border-gray-200 px-2 py-0.5 rounded text-[10px] font-semibold shadow-sm">
                                {avail}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-400 text-xs italic">Anytime</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Actions */}
                  <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-gray-600 text-sm">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                      <span className="font-medium select-all">{buddy.email || 'No email shared'}</span>
                    </div>
                    
                    {buddy.email && (
                      <a
                        href={`mailto:${buddy.email}?subject=FitBuddy Match! Let's work out together`}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition duration-300 flex items-center space-x-2"
                      >
                        <EnvelopeIcon className="h-4 w-4" />
                        <span>Email Buddy</span>
                      </a>
                    )}
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

export default MatchesPage;
