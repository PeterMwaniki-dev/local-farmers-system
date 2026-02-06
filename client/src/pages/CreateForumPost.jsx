// src/pages/CreateForumPost.jsx
// Form to create new forum discussion

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { createForumPost } from '../services/forumService';

const CreateForumPost = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'General Discussion'
  });

  const categories = [
    'Success Stories',
    'Questions & Help',
    'Market Updates',
    'Equipment & Tools',
    'Weather & Climate',
    'General Discussion',
    'Tips & Tricks'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.title || !formData.content) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.title.length < 5) {
      setError('Title must be at least 5 characters long');
      return;
    }

    if (formData.content.length < 20) {
      setError('Content must be at least 20 characters long');
      return;
    }

    setLoading(true);

    try {
      await createForumPost(formData);
      alert('Discussion posted successfully!');
      navigate('/forum');
    } catch (err) {
      setError(err.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Start a Discussion</h1>
              <p className="text-gray-600 mt-2">Share your thoughts, ask questions, or start a conversation</p>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discussion Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  maxLength="200"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Best irrigation methods for small farms"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.title.length}/200 characters (minimum 5)
                </p>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  rows="10"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Share details, ask your question, or describe your experience..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.content.length} characters (minimum 20)
                </p>
              </div>

              {/* Tips Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">💡 Discussion Tips:</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Be respectful and constructive</li>
                  <li>• Provide context and details</li>
                  <li>• Use clear and descriptive titles</li>
                  <li>• Stay on topic and relevant to farming</li>
                  <li>• Share your experiences to help others</li>
                </ul>
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Posting...' : 'Post Discussion'}
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/forum')}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 rounded-lg font-medium transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateForumPost;