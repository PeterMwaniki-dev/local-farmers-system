// src/components/Navbar.jsx
// Main navigation bar with role-based menu

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-green-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center gap-2">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-4.41 0-8-3.59-8-8V8.3l8-4.5 8 4.5V12c0 4.41-3.59 8-8 8z"/>
              <path d="M12 6c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/>
            </svg>
            <span className="text-xl font-bold">Farmers Hub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {/* Public Links */}
            <Link to="/produce" className="hover:text-green-200 transition">
              Browse Produce
            </Link>
            <Link to="/advisory" className="hover:text-green-200 transition">
              Advisory
            </Link>
            <Link to="/forum" className="hover:text-green-200 transition">
              Forum
            </Link>
            <Link to="/trends" className="hover:text-green-200 transition">
              Market Trends
            </Link>

            {/* Authenticated Links */}
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="hover:text-green-200 transition font-medium"
                >
                  Dashboard
                </Link>

                {user?.user_type === 'farmer' && (
                  <Link
                    to="/produce/create"
                    className="bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition font-medium"
                  >
                    + List Produce
                  </Link>
                )}

                {user?.user_type === 'buyer' && (
                  <Link
                    to="/requests/create"
                    className="bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition font-medium"
                  >
                    + New Request
                  </Link>
                )}

                {user?.user_type === 'expert' && (
                  <Link
                    to="/advisory/posts/create"
                    className="bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition font-medium"
                  >
                    + New Post
                  </Link>
                )}

                {/* User Menu - NOW WITH PROFILE LINK */}
                <div className="flex items-center gap-3 border-l border-green-500 pl-6">
                  <Link to="/profile" className="text-right hover:text-green-200 transition">
                    <p className="font-semibold text-sm">{user?.full_name}</p>
                    <p className="text-xs text-green-200 capitalize">
                      {user?.user_type}
                    </p>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-green-700 hover:bg-green-800 px-4 py-2 rounded-lg transition text-sm"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-green-200 transition">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-green-500 pt-4">
            <div className="flex flex-col gap-3">
              {/* Public Links */}
              <Link
                to="/produce"
                className="hover:text-green-200 transition py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse Produce
              </Link>
              <Link
                to="/advisory"
                className="hover:text-green-200 transition py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Advisory
              </Link>
              <Link
                to="/forum"
                className="hover:text-green-200 transition py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Forum
              </Link>
              <Link
                to="/trends"
                className="hover:text-green-200 transition py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Market Trends
              </Link>

              {/* Authenticated Links */}
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="hover:text-green-200 transition py-2 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>

                  {/* Mobile User Info - NOW WITH PROFILE LINK */}
                  <Link
                    to="/profile"
                    className="bg-green-700 rounded-lg p-3 my-2 hover:bg-green-800 transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <p className="font-semibold">{user?.full_name}</p>
                    <p className="text-xs text-green-200 capitalize">
                      {user?.user_type}
                    </p>
                  </Link>

                  {user?.user_type === 'farmer' && (
                    <Link
                      to="/produce/create"
                      className="bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition font-medium text-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      + List Produce
                    </Link>
                  )}

                  {user?.user_type === 'buyer' && (
                    <Link
                      to="/requests/create"
                      className="bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition font-medium text-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      + New Request
                    </Link>
                  )}

                  {user?.user_type === 'expert' && (
                    <Link
                      to="/advisory/posts/create"
                      className="bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition font-medium text-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      + New Post
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="bg-green-700 hover:bg-green-800 px-4 py-2 rounded-lg transition text-sm mt-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="hover:text-green-200 transition py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition font-medium text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;