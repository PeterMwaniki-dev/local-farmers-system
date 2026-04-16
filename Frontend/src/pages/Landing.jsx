// src/pages/Landing.jsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import API from '../services/api';

const Landing = () => {
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState({
    farmers: 0,
    buyers: 0,
    experts: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await API.get('/users/public/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
      // Keep default values if fetch fails
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="/Images/canvas.png" 
                alt="Sonnet Shamba Logo" 
                className="w-10 h-10 object-contain"
              />
              <span className="text-2xl font-bold text-green-600">Sonnet Shamba</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-gray-700 hover:text-green-600 transition">Features</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-green-600 transition">How It Works</a>
              <a href="#about" className="text-gray-700 hover:text-green-600 transition">About</a>

              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition font-medium"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <div className="flex gap-3">
                  <Link
                    to="/login"
                    className="text-green-600 hover:text-green-700 px-4 py-2 rounded-lg transition font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition font-medium"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Background Image */}
      <section 
        className="relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/Images/hero-farmers.jpeg)',
          minHeight: '600px'
        }}
      >
        {/* Dark Overlay for text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        
        {/* Content */}
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
              Empowering Kenyan Farmers with <span className="text-green-400">Information & Markets</span>
            </h1>
            <p className="text-xl text-gray-100 mb-8 drop-shadow-md">
              Connect with buyers, access expert agricultural advice, and stay updated with market trends—all in one platform designed for smallholder farmers.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link
                to="/register"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition text-center shadow-lg hover:shadow-xl"
              >
                Join Now - It's Free!
              </Link>
              <Link
                to="/produce"
                className="bg-white hover:bg-gray-50 text-green-600 px-8 py-4 rounded-lg text-lg font-semibold transition text-center shadow-lg"
              >
                Browse Produce
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white bg-opacity-90 p-4 rounded-lg backdrop-blur-sm">
                <p className="text-3xl font-bold text-green-600">{stats.farmers}+</p>
                <p className="text-gray-700 text-sm font-medium">Farmers</p>
              </div>
              <div className="bg-white bg-opacity-90 p-4 rounded-lg backdrop-blur-sm">
                <p className="text-3xl font-bold text-green-600">{stats.buyers}+</p>
                <p className="text-gray-700 text-sm font-medium">Buyers</p>
              </div>
              <div className="bg-white bg-opacity-90 p-4 rounded-lg backdrop-blur-sm">
                <p className="text-3xl font-bold text-green-600">{stats.experts}+</p>
                <p className="text-gray-700 text-sm font-medium">Experts</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need to Succeed</h2>
            <p className="text-xl text-gray-600">Comprehensive tools for modern farming</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-green-50 p-8 rounded-xl hover:shadow-lg transition">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Direct Market Access</h3>
              <p className="text-gray-600">
                Connect directly with buyers and eliminate middlemen. List your produce and get fair prices for your harvest.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-blue-50 p-8 rounded-xl hover:shadow-lg transition">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Expert Advice</h3>
              <p className="text-gray-600">
                Get guidance from agricultural experts. Access articles, ask questions, and improve your farming practices.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-purple-50 p-8 rounded-xl hover:shadow-lg transition">
              <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Market Trends</h3>
              <p className="text-gray-600">
                Stay informed with real-time market prices, demand levels, and supply trends to make better decisions.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-yellow-50 p-8 rounded-xl hover:shadow-lg transition">
              <div className="bg-yellow-600 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Community Forum</h3>
              <p className="text-gray-600">
                Join discussions with fellow farmers, share experiences, and learn from the community.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-red-50 p-8 rounded-xl hover:shadow-lg transition">
              <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Buyer Requests</h3>
              <p className="text-gray-600">
                See what buyers are looking for and fulfill orders directly. No more wondering if your produce will sell.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-indigo-50 p-8 rounded-xl hover:shadow-lg transition">
              <div className="bg-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Mobile Friendly</h3>
              <p className="text-gray-600">
                Access the platform from any device. Manage your farm business on the go, anytime, anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Get started in three simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-6 mx-auto">
                1
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Create Account</h3>
              <p className="text-gray-600">
                Sign up as a farmer, buyer, or expert. It's free and takes less than 2 minutes.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-6 mx-auto">
                2
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Complete Profile</h3>
              <p className="text-gray-600">
                Add your details, farm information, or business type to help others connect with you.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-6 mx-auto">
                3
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Start Trading</h3>
              <p className="text-gray-600">
                List produce, browse buyer requests, ask experts, and grow your farming business!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Who Can Join?</h2>
            <p className="text-xl text-gray-600">Our platform serves everyone in the agricultural value chain</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Farmers */}
            <div className="border-2 border-green-200 rounded-xl p-8 hover:border-green-600 hover:shadow-xl transition">
              <div className="text-center">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Farmers</h3>
                <ul className="text-left text-gray-600 space-y-2 mb-6">
                  <li>✓ List your produce for sale</li>
                  <li>✓ Connect with verified buyers</li>
                  <li>✓ Get expert farming advice</li>
                  <li>✓ Track market prices</li>
                  <li>✓ Join farmer community</li>
                </ul>
                <Link
                  to="/register"
                  className="block bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition text-center"
                >
                  Join as Farmer
                </Link>
              </div>
            </div>

            {/* Buyers */}
            <div className="border-2 border-blue-200 rounded-xl p-8 hover:border-blue-600 hover:shadow-xl transition">
              <div className="text-center">
                <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Buyers</h3>
                <ul className="text-left text-gray-600 space-y-2 mb-6">
                  <li>✓ Browse fresh produce</li>
                  <li>✓ Post buying requests</li>
                  <li>✓ Direct farmer contact</li>
                  <li>✓ Quality assurance</li>
                  <li>✓ Competitive prices</li>
                </ul>
                <Link
                  to="/register"
                  className="block bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition text-center"
                >
                  Join as Buyer
                </Link>
              </div>
            </div>

            {/* Experts */}
            <div className="border-2 border-purple-200 rounded-xl p-8 hover:border-purple-600 hover:shadow-xl transition">
              <div className="text-center">
                <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Experts</h3>
                <ul className="text-left text-gray-600 space-y-2 mb-6">
                  <li>✓ Share your expertise</li>
                  <li>✓ Publish advisory articles</li>
                  <li>✓ Answer farmer questions</li>
                  <li>✓ Build your reputation</li>
                  <li>✓ Help the community</li>
                </ul>
                <Link
                  to="/register"
                  className="block bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition text-center"
                >
                  Join as Expert
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">About Sonnet Shamba</h2>
              <p className="text-xl text-gray-600">Transforming Kenyan Agriculture Through Technology</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                Sonnet Shamba is dedicated to empowering Kenyan smallholder farmers by providing a digital platform 
                that connects them directly with buyers, agricultural experts and essential market information. 
                We believe that by eliminating middlemen and providing access to real-time market data, we can help 
                farmers earn fair prices for their produce and build sustainable farming businesses.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">What We Do</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                Our platform bridges the gap between farmers, buyers and agricultural experts by offering:
              </p>
              <ul className="space-y-3 text-gray-700 mb-6">
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Direct Market Access:</strong> Farmers can list their produce and connect directly with buyers, ensuring fair prices and reducing dependency on middlemen.</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Expert Agricultural Advice:</strong> Access to verified agricultural experts who share knowledge, answer questions and provide guidance on best farming practices.</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Market Intelligence:</strong> Real-time market trends, price information and supply-demand data to help farmers make informed decisions.</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Community Support:</strong> A vibrant forum where farmers can share experiences, learn from each other and build a supportive agricultural community.</span>
                </li>
              </ul>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                We envision a future where every Kenyan farmer has access to the information, markets and resources 
                they need to thrive. By leveraging technology, we aim to create a more transparent, efficient, and 
                equitable agricultural sector that benefits farmers, buyers, and consumers alike.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Sonnet Shamba?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Fair Pricing</h4>
                    <p className="text-sm text-gray-600">Direct connections eliminate middlemen, ensuring farmers get fair prices for their produce.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Trusted Platform</h4>
                    <p className="text-sm text-gray-600">Verified users, secure transactions, and a supportive community you can trust.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Knowledge Sharing</h4>
                    <p className="text-sm text-gray-600">Learn from experts and fellow farmers to improve your farming practices and productivity.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-yellow-100 p-2 rounded-full">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Easy to Use</h4>
                    <p className="text-sm text-gray-600">Simple, intuitive platform designed for farmers with varying levels of tech experience.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-600 text-white rounded-xl p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Join Our Growing Community</h3>
              <p className="text-green-100 mb-6 max-w-2xl mx-auto">
                Be part of the agricultural revolution. Connect with thousands of farmers, buyers, and experts who are already transforming Kenya's farming sector.
              </p>
              <Link
                to="/register"
                className="inline-block bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg"
              >
                Get Started Today
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Farming Business?</h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of farmers, buyers, and experts already using our platform to grow their agricultural businesses.
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-green-600 px-12 py-4 rounded-lg text-xl font-bold hover:bg-gray-100 transition shadow-xl"
          >
            Get Started Free Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* About */}
            <div>
              <h3 className="text-xl font-bold mb-4">Sonnet Shamba</h3>
              <p className="text-gray-400">
                Empowering Kenyan smallholder farmers with digital tools for success.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/produce" className="hover:text-white transition">Browse Produce</Link></li>
                <li><Link to="/advisory" className="hover:text-white transition">Advisory</Link></li>
                <li><Link to="/forum" className="hover:text-white transition">Forum</Link></li>
                <li><Link to="/trends" className="hover:text-white transition">Market Trends</Link></li>
              </ul>
            </div>

            {/* Account */}
            <div>
              <h3 className="text-xl font-bold mb-4">Account</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/login" className="hover:text-white transition">Login</Link></li>
                <li><Link to="/register" className="hover:text-white transition">Register</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-xl font-bold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Email: info@sonnetshamba.co.ke</li>
                <li>Phone: +254 700 000 000</li>
                <li>Nairobi, Kenya</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 Sonnet Shamba. All rights reserved. Built for Kenyan Farmers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;