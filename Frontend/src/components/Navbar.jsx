import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import { getUnreadCount } from '../services/messageService';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { darkMode, sidebarNav, sidebarOpen, toggleSidebarOpen } = useSettings();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const canUseMessaging = user && ['farmer', 'buyer', 'expert'].includes(user.user_type);

  const fetchUnreadCount = useCallback(async () => {
    if (!canUseMessaging) {
      setUnreadCount(0);
      return;
    }
    try {
      const response = await getUnreadCount();
      setUnreadCount(response.data?.count || 0);
    } catch {
      // Silently ignore — user may have logged out
    }
  }, [canUseMessaging]);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    const handleUpdate = () => fetchUnreadCount();
    window.addEventListener('messages-updated', handleUpdate);
    return () => {
      clearInterval(interval);
      window.removeEventListener('messages-updated', handleUpdate);
    };
  }, [fetchUnreadCount]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Role-specific navigation links
  const getNavLinks = () => {
    if (!user) return [];

    switch (user.user_type) {
      case 'farmer':
        return [
          { name: 'Dashboard', path: '/dashboard' },
          { name: 'My Produce', path: '/produce/my-listings' },
          { name: 'Messages', path: '/messages', showBadge: true },
          { name: 'Buyer Requests', path: '/buyer-requests' },
          { name: 'Advisory', path: '/advisory' },
          { name: 'Forum', path: '/forum' }
        ];

      case 'buyer':
        return [
          { name: 'Dashboard', path: '/dashboard' },
          { name: 'Browse Produce', path: '/produce' },
          { name: 'Messages', path: '/messages', showBadge: true },
          { name: 'My Requests', path: '/buyer-requests/my-requests' },
          { name: 'Forum', path: '/forum' }
        ];

      case 'expert':
        return [
          { name: 'Dashboard', path: '/dashboard' },
          { name: 'My Advisory', path: '/advisory/my-posts' },
          { name: 'Messages', path: '/messages', showBadge: true },
          { name: 'Forum', path: '/forum' },
          { name: 'Browse Produce', path: '/produce' }
        ];

      case 'admin':
        return [
          { name: 'Dashboard', path: '/dashboard' },
          { name: 'Users', path: '/admin/users' },
          { name: 'Produce', path: '/admin/produce' },
          { name: 'Forum', path: '/admin/forum' },
          { name: 'Market Trends', path: '/trends' }
        ];

      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  // Top navbar layout
  if (!sidebarNav) {
    return (
      <nav className={`${darkMode ? 'bg-gray-800' : 'bg-[#169646]'} shadow-lg sticky top-0 z-50`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <Link to="/dashboard" className="flex items-center gap-2">
              <img 
                src="/Images/canvas.png" 
                alt="Sonnet Shamba Logo" 
                className={`w-10 h-10 object-contain ${darkMode ? 'bg-gray-700' : 'bg-[#169646]'} rounded-md p-1`}
              />
              <span className="text-xl font-bold text-white">Sonnet Shamba</span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-white hover:text-green-200 font-medium transition relative px-3 py-2 rounded-lg hover:${darkMode ? 'bg-gray-700' : 'bg-green-700'}`}
                >
                  {link.name}
                  {link.showBadge && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </Link>
              ))}

              {/* Settings Icon */}
              <Link
                to="/settings"
                className={`text-white hover:text-green-200 p-2 rounded-lg transition hover:${darkMode ? 'bg-gray-700' : 'bg-green-700'}`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </Link>

              {/* Profile Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={`flex items-center gap-2 text-white hover:text-green-200 font-medium ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-green-700 hover:bg-green-600'} px-4 py-2 rounded-lg transition`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{user?.full_name}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className={`absolute right-0 mt-2 w-48 ${darkMode ? 'bg-gray-700' : 'bg-white'} rounded-lg shadow-lg py-2 z-50`}>
                    <Link
                      to="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className={`block px-4 py-2 ${darkMode ? 'text-white hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        My Profile
                      </div>
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setIsProfileOpen(false)}
                      className={`block px-4 py-2 ${darkMode ? 'text-white hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Settings
                      </div>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className={`w-full text-left px-4 py-2 ${darkMode ? 'text-white hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              {/* Settings Icon */}
              <Link
                to="/settings"
                className="text-white hover:text-green-200 p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </Link>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:text-green-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden pb-4">
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`text-white ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-green-700'} px-4 py-2 rounded transition flex items-center justify-between`}
                  >
                    <span>{link.name}</span>
                    {link.showBadge && unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </Link>
                ))}
                
                {/* Divider */}
                <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-green-500'} my-2`}></div>
                
                {/* Profile and Logout - Darker shade */}
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-white ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-green-800 hover:bg-green-900'} px-4 py-2 rounded transition flex items-center gap-2`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  My Profile
                </Link>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                  className={`text-white ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-green-800 hover:bg-green-900'} px-4 py-2 rounded transition text-left flex items-center gap-2`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
    );
  }

  // Sidebar layout
  return (
    <>
      {/* Toggle button for sidebar */}
      <button
        onClick={toggleSidebarOpen}
        className={`fixed top-4 z-50 p-2 rounded-lg shadow-lg transition-colors ${
          darkMode 
            ? 'bg-gray-800 text-white hover:bg-gray-700' 
            : 'bg-[#169646] text-white hover:bg-green-700'
        }`}
        style={{
          left: sidebarOpen ? '260px' : '16px',
          transition: 'left 0.3s ease'
        }}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {sidebarOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          )}
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`${darkMode ? 'bg-gray-800' : 'bg-[#169646]'} shadow-lg fixed left-0 top-0 h-full z-40 overflow-y-auto transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-0'
        }`}
      >
        {sidebarOpen && (
          <div className="p-4">
            {/* Logo/Brand */}
            <Link to="/dashboard" className="flex items-center gap-2 mb-8">
              <img 
                src="/Images/canvas.png" 
                alt="Sonnet Shamba Logo" 
                className={`w-10 h-10 object-contain ${darkMode ? 'bg-gray-700' : 'bg-[#169646]'} rounded-md p-1`}
              />
              <span className="text-xl font-bold text-white">Sonnet Shamba</span>
            </Link>

            {/* Navigation Links */}
            <nav className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-white hover:text-green-200 font-medium transition relative px-4 py-3 rounded-lg flex items-center gap-3 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-green-700'}`}
                >
                  {link.name}
                  {link.showBadge && unreadCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            {/* Divider */}
            <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-green-500'} my-6`}></div>

            {/* Settings */}
            <div className="space-y-2">
              <Link
                to="/settings"
                className={`text-white hover:text-green-200 font-medium transition px-4 py-3 rounded-lg flex items-center gap-3 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-green-700'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </Link>

              <Link
                to="/profile"
                className={`text-white hover:text-green-200 font-medium transition px-4 py-3 rounded-lg flex items-center gap-3 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-green-700'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {user?.full_name}
              </Link>

              <button
                onClick={handleLogout}
                className={`w-full text-left text-white hover:text-green-200 font-medium transition px-4 py-3 rounded-lg flex items-center gap-3 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-green-700'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Navbar;
