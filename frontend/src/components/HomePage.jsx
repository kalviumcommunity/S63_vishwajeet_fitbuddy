import React from 'react';
import { Link } from 'react-router-dom';
import { BoltIcon, MapPinIcon, ShieldCheckIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';

const HomePage = ({ isLoggedIn = false }) => {
  return (
    <div className="relative overflow-hidden bg-gray-50 min-h-[calc(100vh-4rem)] flex flex-col justify-between">
      {/* Background Gradient Orbs */}
      <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-1/3 right-0 translate-x-1/3 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 flex-grow flex flex-col justify-center">
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide uppercase mb-6 shadow-sm border border-blue-100">
            <BoltIcon className="h-4 w-4" />
            <span>Power Up Your Workouts</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
            Find Your Perfect <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Workout Buddy
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 mb-10 leading-relaxed">
            Stop working out alone. Connect with local fitness enthusiasts who share your schedule, workout routine, and experience level.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            {isLoggedIn ? (
              <Link
                to="/discover"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-0.5 text-center"
              >
                Discover Buddies
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-0.5 text-center"
                >
                  Join FitBuddy Today
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-8 py-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold rounded-xl shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-0.5 text-center"
                >
                  Log In
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Feature Grid */}
        <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 transition duration-300 hover:shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6 shadow-inner">
              <MapPinIcon className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Location Matching</h3>
            <p className="text-gray-600 leading-relaxed">
              Find partners in your neighborhood, gym, or running track for hassle-free scheduling.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 transition duration-300 hover:shadow-md">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-6 shadow-inner">
              <BoltIcon className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Targeted Workouts</h3>
            <p className="text-gray-600 leading-relaxed">
              Whether you prefer powerlifting, yoga, running, or cycling, find someone who shares your routine.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 transition duration-300 hover:shadow-md">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-6 shadow-inner">
              <ChatBubbleLeftRightIcon className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Quick Contact</h3>
            <p className="text-gray-600 leading-relaxed">
              Once mutually matched, easily get in touch via email or WhatsApp to coordinate your workouts.
            </p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="py-6 border-t border-gray-200 bg-white text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} FitBuddy. All rights reserved. Keep moving, stay fit.
      </footer>
    </div>
  );
};

export default HomePage;
