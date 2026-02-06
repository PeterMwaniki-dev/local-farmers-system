// src/pages/BrowseAdvisory.jsx
// Public page to browse all advisory posts

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getAllPosts } from '../services/advisoryService';

const BrowseAdvisory = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    category: ''
  });

  const categories = [
    'All Categories',
    'Crop Management',
    'Pest Control',
    'Soil Health',
    'Irrigation',
    'Harvesting',
    'Post-Harvest',
    'Market Information',
    'Weather Advisory',
    'Livestock',
    'General Advice'
  ];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const filterParams = {};
      if (filters.category && filters.category !== 'All Categories') {
        filterParams.category = filters.category;
      }
      if (filters.search) {
        filterParams.search = filters.search;
      }

      const data = await getAllPosts(filterParams);
      setPosts(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err.message || 'Failed to load advisory posts');
      setPosts([]);
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    fetchPosts();
  };

  const clearFilters = () => {
    setFilters({ search: '', category: '' });
    setLoading(true);
    setTimeout(() => fetchPosts(), 100);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold mb-2">Agricultural Advisory</h1>
          <p className="text-green-100 text-lg">
            Expert guidance and tips to help you succeed in farming
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Filter Posts</h2>
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search by title or keywords..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Category */}
            <div>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat === 'All Categories' ? '' : cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Buttons */}
            <div className="md:col-span-3 flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition"
              >
                Search
              </button>
              <button
                type="button"
                onClick={clearFilters}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg transition"
              >
                Clear Filters
              </button>
            </div>
          </form>
        </div>

        {/* Posts Grid */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Advisory Posts ({posts.length})
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading advisory posts...</p>
            </div>
          ) : error ? (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              <p className="font-semibold">Note:</p>
              <p>{error}</p>
              <p className="text-sm mt-2">The backend advisory routes may not be implemented yet.</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-600 text-lg">No advisory posts found.</p>
              <p className="text-gray-500 text-sm mt-2">
                {filters.search || filters.category ? 'Try adjusting your filters.' : 'Check back later for expert advice.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <div key={post.post_id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden">
                  {/* Category Badge */}
                  <div className="bg-green-600 text-white px-4 py-2">
                    <span className="text-xs font-semibold uppercase">{post.category}</span>
                  </div>

                  <div className="p-6">
                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                      {post.title}
                    </h3>

                    {/* Expert Info */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>{post.expert_name || 'Expert'}</span>
                    </div>

                    {/* Content Preview */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.content}
                    </p>

                    {/* Tags */}
                    {post.tags && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.split(',').slice(0, 3).map((tag, index) => (
                          <span key={index} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                            #{tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span>{post.views_count || 0}</span>
                        </div>
                        <span className="text-xs">
                          {new Date(post.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <Link
                        to={`/advisory/posts/${post.post_id}`}
                        className="text-green-600 hover:text-green-700 font-medium text-sm"
                      >
                        Read More →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowseAdvisory;