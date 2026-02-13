// src/pages/ExpertMyAdvisory.jsx
// Expert's own advisory posts management page

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getMyPosts, deletePost } from '../services/advisoryService';

const ExpertMyAdvisory = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const fetchMyPosts = async () => {
    try {
      const data = await getMyPosts();
      setPosts(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
      setLoading(false);
    }
  };

  const handleDelete = async (postId, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      await deletePost(postId);
      alert('Post deleted successfully');
      fetchMyPosts();
    } catch (error) {
      alert(error.message || 'Failed to delete post');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading your advisory posts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Advisory Posts</h1>
            <p className="text-gray-600 mt-1">Manage your farming tips and guidance</p>
          </div>
          <Link
            to="/advisory/posts/create"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Post
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-500 text-sm">Total Posts</p>
            <p className="text-3xl font-bold text-gray-800">{posts.length}</p>
          </div>
          <div className="bg-green-50 rounded-lg shadow-md p-6">
            <p className="text-gray-500 text-sm">Total Views</p>
            <p className="text-3xl font-bold text-green-600">
              {posts.reduce((sum, post) => sum + (post.views_count || 0), 0)}
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg shadow-md p-6">
            <p className="text-gray-500 text-sm">Categories</p>
            <p className="text-3xl font-bold text-blue-600">
              {[...new Set(posts.map(p => p.category))].filter(Boolean).length}
            </p>
          </div>
        </div>

        {/* Posts List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-600 mb-4">You haven't created any advisory posts yet.</p>
              <Link
                to="/advisory/posts/create"
                className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
              >
                Create Your First Post
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {posts.map((post) => (
                <div key={post.post_id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {post.title}
                      </h3>
                      {post.category && (
                        <span className="inline-block bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium">
                          {post.category}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>{post.views_count || 0} views</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {post.content}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Posted {new Date(post.created_at).toLocaleDateString()}</span>
                      {post.updated_at && post.updated_at !== post.created_at && (
                        <span>• Updated {new Date(post.updated_at).toLocaleDateString()}</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Link
                        to={`/advisory/posts/${post.post_id}`}
                        className="bg-gray-600 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded transition"
                      >
                        View
                      </Link>
                      <Link
                        to={`/advisory/posts/edit/${post.post_id}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded transition"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(post.post_id, post.title)}
                        className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tips Section */}
        {posts.length > 0 && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Tips for Better Engagement</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Use clear, descriptive titles that highlight the main benefit</li>
                  <li>• Include practical, actionable advice that farmers can implement</li>
                  <li>• Add relevant categories to help farmers find your posts</li>
                  <li>• Share seasonal tips and timely farming advice</li>
                  <li>• Respond to comments and questions on your posts</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpertMyAdvisory;