import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { BoltIcon } from '@heroicons/react/24/solid';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Navbar = ({ isLoggedIn = false, onLogout = () => {} }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const primaryBg = 'bg-blue-500';
  const primaryHover = 'hover:bg-blue-600';
  
 const navLinkStyle = ({ isActive }) => 
    `text-base font-medium px-3 py-2 ${isActive ? 'text-blue-500 font-semibold' : 'text-gray-700 hover:text-gray-900'}`;
  
  const mobileNavLinkStyle = ({ isActive }) =>
    `block px-3 py-2 rounded-md text-base font-medium ${isActive 
      ? `${primaryBg} text-white` 
      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`;
  
  const loginBtnStyle = `px-5 py-2 rounded-md text-sm font-semibold text-white ${primaryBg} ${primaryHover} focus:outline-none`;
  
  return (
    <header className="bg-gray-50 shadow-sm sticky top-0 z-50 w-full">
      <nav className="w-full">
        <div className="flex items-center justify-between h-14 px-10 mx-auto">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className={`p-2 ${primaryBg} rounded-md`}>
                <BoltIcon className="h-5 w-5 text-white" aria-hidden="true" />
              </span>
              <span className="ml-2 text-xl font-bold text-gray-900">FitBuddy</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center space-x-10">
              <NavLink to="/" className={navLinkStyle} end>Home</NavLink>
              <NavLink to="/matches" className={navLinkStyle}>Matches</NavLink>
              <NavLink to="/profile" className={navLinkStyle}>My Profile</NavLink>
            </div>
          </div>
                <div className="hidden md:block">
            {isLoggedIn ? (
              <button onClick={onLogout} className="text-base font-medium text-gray-600 hover:text-gray-900 px-3 py-2">
                Logout
              </button>
            ) : (
              <div className="flex space-x-2">
                <Link to="/register" className="px-5 py-2 rounded-md text-sm font-semibold text-blue-500 border border-blue-500 hover:bg-blue-50 focus:outline-none">Sign Up</Link>
                <Link to="/login" className={loginBtnStyle}>Login</Link>
              </div>
            )}
          </div>

         <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </nav>
        {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <NavLink to="/" className={mobileNavLinkStyle} onClick={() => setIsMobileMenuOpen(false)} end>Home</NavLink>
            <NavLink to="/matches" className={mobileNavLinkStyle} onClick={() => setIsMobileMenuOpen(false)}>Matches</NavLink>
            <NavLink to="/profile" className={mobileNavLinkStyle} onClick={() => setIsMobileMenuOpen(false)}>My Profile</NavLink>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-300">
            <div className="px-2 space-y-2">
              {isLoggedIn ? (
                <button
                  onClick={() => { onLogout(); setIsMobileMenuOpen(false); }}
                  className={`block w-full text-left px-4 py-2 rounded-md text-base font-medium text-white bg-red-500 hover:bg-red-600`}
                >
                  Logout
                </button>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/register"
                    className="block w-full text-left px-4 py-2 rounded-md text-base font-medium text-blue-500 border border-blue-500 bg-white hover:bg-blue-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                  <Link
                    to="/login"
                    className={`block w-full text-left px-4 py-2 rounded-md text-base font-medium text-white ${primaryBg} ${primaryHover}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar; 