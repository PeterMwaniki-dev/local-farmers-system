import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getPostById, recordAdvisoryPostView } from '../services/advisoryService';

const ViewAdvisoryPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const hasRecordedViewRef = useRef(false);

  useEffect(() => {
    hasRecordedViewRef.current = false;
    const fetchPost = async () => {
      try {
        // Prevent double-counting in React 18 StrictMode dev remounts.
        // We only suppress duplicate view events in a short time window.
        const viewKey = `viewed:advisory:${id}`;
        const now = Date.now();
        const lastViewedAt = Number(sessionStorage.getItem(viewKey) || '0');
        const shouldRecord = !lastViewedAt || now - lastViewedAt > 3000;

        if (!hasRecordedViewRef.current) {
          hasRecordedViewRef.current = true;
          if (shouldRecord) {
            sessionStorage.setItem(viewKey, String(now));
            recordAdvisoryPostView(id).catch(() => {});
          }
        }

        const data = await getPostById(id);
        setPost(data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to load post');
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading post...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Post Not Found</h2>
                <p className="text-gray-600 mb-6">{error || 'This advisory post could not be found.'}</p>
                <Link
                  to="/advisory"
                  className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition"
                >
                  Back to Advisory Posts
                </Link>
              </div>
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
          {/* Back Button */}
          <Link
            to="/advisory"
            className="inline-flex items-center text-green-600 hover:text-green-700 mb-6"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to All Posts
          </Link>

          {/* Post Card */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-8">
              <div className="flex items-center gap-2 text-green-100 text-sm mb-3">
                <span className="bg-green-500 px-3 py-1 rounded-full uppercase font-semibold">
                  {post.category}
                </span>
                <span>•</span>
                <span>{new Date(post.created_at).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
              
              {/* Expert Info */}
              <div className="flex items-center gap-3">
                <div className="bg-green-500 rounded-full p-2">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold">{post.expert_name || 'Agricultural Expert'}</p>
                  <p className="text-green-100 text-sm">{post.expert_specialization || 'Expert Advisor'}</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Stats */}
              <div className="flex items-center gap-6 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>{post.views_count || 0} views</span>
                </div>
              </div>

              {/* Main Content */}
              <div className="prose prose-lg max-w-none">
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {post.content}
                </div>
              </div>

              {/* Tags */}
              {post.tags && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Tags:</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.split(',').map((tag, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-8 py-6">
              <p className="text-sm text-gray-600 text-center">
                Was this advisory helpful? Contact the expert or explore more agricultural advice.
              </p>
              <div className="flex justify-center gap-4 mt-4">
                <Link
                  to="/advisory"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
                >
                  Browse More Posts
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAdvisoryPost;