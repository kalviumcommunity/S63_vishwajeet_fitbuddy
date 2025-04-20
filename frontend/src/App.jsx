// src/App.jsx

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Added Navigate for redirects

import Navbar from './components/Navbar';
import SignUpPage from './components/SignUpPage';

// --- Page Components ---
const HomePage = () => <div className="p-4">Welcome to FitBuddy! (Public Home)</div>;
const LoginPage = ({ onLogin }) => (
  <div className="p-4">
    <h2>Login Page</h2>
    {/* In a real component, you'd have a form here */}
    <button
      onClick={() => onLogin('fake-auth-token')} // Simulate login success
      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Simulate Login
    </button>
  </div>
);
// RegisterPage is imported as SignUpPage from components
const DiscoverPage = () => <div className="p-4">Discover Potential Matches Page (Protected)</div>;
const MatchesPage = () => <div className="p-4">Your Matches Page (Protected)</div>;
const ProfilePage = () => <div className="p-4">Your Profile Page (Protected)</div>;
const NotFoundPage = () => <div className="p-4 text-center text-red-500">404 - Page Not Found</div>;
// --- End Placeholder Page Components ---


function App() {
  // --- Authentication State ---
  // Initialize state by checking localStorage for a token
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem('authToken'); // Check if token exists on initial load
  });
  const [isLoadingAuth, setIsLoadingAuth] = useState(true); // Optional: for initial auth check loading state

  // Simulate verifying the token perhaps (or just use the initial check)
  useEffect(() => {
    // In a real app, you might verify the token with the backend here
    // For now, we just rely on its presence in localStorage
    setIsLoadingAuth(false); // Assume check is done
  }, []);

  // --- Authentication Handlers ---
  const handleLogin = (token) => {
    console.log("Simulating login, received token:", token);
    localStorage.setItem('authToken', token); // Store token in localStorage
    setIsLoggedIn(true);
    // Optionally redirect user after login using useNavigate() hook within LoginPage
  };

  const handleLogout = () => {
    console.log("Logging out");
    localStorage.removeItem('authToken'); // Remove token from localStorage
    setIsLoggedIn(false);
    // No need to redirect here usually, Navbar state change handles link visibility
    // User might navigate away manually or stay on a public page
  };

  // --- Optional: Loading state while checking auth ---
  if (isLoadingAuth) {
    // You can return a loading spinner component here
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    // Router should ideally be in main.jsx, but works here too for simplicity
    // If Router is in main.jsx, remove it from here.
    <Router>
      <div className="min-h-screen bg-gray-50"> {/* Optional: Background color for the app */}

        {/* Render the Navbar, passing auth state and logout handler */}
        <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />

        {/* Main content area - Add padding top matching navbar height */}
        {/* Adjust pt-16 if your navbar height is different */}
        <main className="pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <Routes>
            {/* --- Public Routes --- */}
            <Route path="/" element={<HomePage />} />
            <Route
              path="/login"
              element={isLoggedIn ? <Navigate to="/discover" replace /> : <LoginPage onLogin={handleLogin} />}
              // If already logged in, redirect from /login to /discover
            />
            <Route
              path="/register"
              element={isLoggedIn ? <Navigate to="/discover" replace /> : <SignUpPage />}
              // If already logged in, redirect from /register to /discover
            />

            {/* --- Protected Routes --- */}
            {/* These routes require the user to be logged in */}
            <Route
              path="/discover"
              element={isLoggedIn ? <DiscoverPage /> : <Navigate to="/login" replace />}
              // If not logged in, redirect to /login
            />
            <Route
              path="/matches"
              element={isLoggedIn ? <MatchesPage /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/profile"
              element={isLoggedIn ? <ProfilePage /> : <Navigate to="/login" replace />}
            />

            {/* --- Not Found Route --- */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        {/* Optional: Footer component could go here */}
        {/* <Footer /> */}
      </div>
    </Router>
  );
}

export default App;