// src/pages/EditAdvisoryPost.jsx
// Form to edit existing advisory post

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getPostById, updatePost } from '../services/advisoryService';

const EditAdvisoryPost = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Crop Management',
    tags: ''
  });

  const categories = [
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

  // Fetch post data on component mount
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPostById(id);
        
        setFormData({
          title: data.title || '',
          content: data.content || '',
          category: data.category || 'Crop Management',
          tags: data.tags || ''
        });

        setLoadingData(false);
      } catch (err) {
        setError(err.message || 'Failed to load post');
        setLoadingData(false);
      }
    };

    fetchPost();
  }, [id]);

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

    if (formData.title.length < 10) {
      setError('Title must be at least 10 characters long');
      return;
    }

    if (formData.content.length < 50) {
      setError('Content must be at least 50 characters long');
      return;
    }

    setLoading(true);

    try {
      await updatePost(id, formData);
      alert('Advisory post updated successfully!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to update post');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading post details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Edit Advisory Post</h1>
              <p className="text-gray-600 mt-2">Update your agricultural advisory content</p>
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
                  Post Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  maxLength="200"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Best Practices for Tomato Farming in Kenya"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.title.length}/200 characters (minimum 10)
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  rows="12"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Write your advisory content here. Include detailed information, step-by-step instructions, tips, and recommendations..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.content.length} characters (minimum 50)
                </p>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (Optional)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  maxLength="255"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., tomato, planting, fertilizer, organic"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Separate tags with commas. This helps farmers find your post.
                </p>
              </div>

              {/* Tips Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">📝 Writing Tips:</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Be clear and concise in your explanations</li>
                  <li>• Use simple language that farmers can understand</li>
                  <li>• Include practical examples and real-world applications</li>
                  <li>• Organize information with headings or numbered lists</li>
                  <li>• Mention specific crop varieties or conditions when relevant</li>
                </ul>
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Updating...' : 'Update Post'}
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
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

export default EditAdvisoryPost;