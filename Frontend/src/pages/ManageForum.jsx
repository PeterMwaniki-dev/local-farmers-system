import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useSettings } from '../contexts/SettingsContext';
import { getAllForumPosts, deleteForumPost } from '../services/forumService';

const ManageForum = () => {
  const { darkMode } = useSettings();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: ''
  });

  useEffect(() => {
    fetchPosts();
  }, [filters]);

  const fetchPosts = async () => {
    try {
      const data = await getAllForumPosts(filters);
      setPosts(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching forum posts:', error);
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId, title) => {
    if (!window.confirm(`Are you sure you want to DELETE forum post: "${title}"?`)) {
      return;
    }

    try {
      await deleteForumPost(postId);
      alert('Forum post deleted successfully');
      fetchPosts();
    } catch (error) {
      alert(error.message || 'Failed to delete forum post');
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Manage Forum</h1>
            <p className={`mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Moderate forum discussions and comments</p>
          </div>
          <Link
            to="/dashboard"
            className={`px-6 py-2 rounded-lg transition ${
              darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-600 hover:bg-gray-700 text-white'
            }`}
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`rounded-lg shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Posts</p>
            <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{posts.length}</p>
          </div>
          <div className={`rounded-lg shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-blue-50'}`}>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Comments</p>
            <p className="text-3xl font-bold text-blue-600">
              {posts.reduce((sum, post) => sum + (post.comment_count || 0), 0)}
            </p>
          </div>
          <div className={`rounded-lg shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-purple-50'}`}>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Views</p>
            <p className="text-3xl font-bold text-purple-600">
              {posts.reduce((sum, post) => sum + (post.views_count || 0), 0)}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className={`rounded-lg shadow-md p-6 mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Search</label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Search posts..."
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                }`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                }`}
              >
                <option value="">All Categories</option>
                <option value="Success Stories">Success Stories</option>
                <option value="Questions & Help">Questions & Help</option>
                <option value="Market Updates">Market Updates</option>
                <option value="General Discussion">General Discussion</option>
              </select>
            </div>
          </div>
        </div>

        {/* Posts List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading forum posts...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.length === 0 ? (
              <div className={`rounded-lg shadow-md p-12 text-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No forum posts found</p>
              </div>
            ) : (
              posts.map((post) => (
                <div key={post.post_id} className={`rounded-lg shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                          {post.category}
                        </span>
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          by {post.user_name} ({post.user_type})
                        </span>
                      </div>
                      <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{post.title}</h3>
                      <p className={`mb-3 line-clamp-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{post.content}</p>
                      <div className={`flex gap-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <span>👁 {post.views_count || 0} views</span>
                        <span>💬 {post.comment_count || 0} comments</span>
                        <span>📅 {new Date(post.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Link
                        to={`/forum/${post.post_id}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleDeletePost(post.post_id, post.title)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ManageForum;
