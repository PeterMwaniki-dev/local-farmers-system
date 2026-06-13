import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import AdminCharts from '../components/AdminCharts';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import API from '../services/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { darkMode } = useSettings();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFarmers: 0,
    totalBuyers: 0,
    totalExperts: 0,
    totalProduce: 0,
    totalRequests: 0,
    totalAdvisoryPosts: 0,
    totalForumPosts: 0,
    totalComments: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      // Fetch admin stats
      const statsResponse = await API.get('/admin/stats');
      setStats(statsResponse.data);

      // Fetch recent users
      const usersResponse = await API.get('/admin/recent-users');
      setRecentUsers(usersResponse.data);

      // Fetch recent activity
      const activityResponse = await API.get('/admin/recent-activity');
      setRecentActivity(activityResponse.data);

      // Fetch chart data
      const chartResponse = await API.get('/admin/chart-data');
      setChartData(chartResponse.data);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading admin dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-indigo-100">System Overview and Management</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Users</p>
                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{stats.totalUsers}</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <div className={`mt-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <span className="text-green-600 dark:text-green-400 font-semibold">{stats.totalFarmers}</span> Farmers · 
              <span className="text-blue-600 dark:text-blue-400 font-semibold ml-1">{stats.totalBuyers}</span> Buyers · 
              <span className="text-purple-600 dark:text-purple-400 font-semibold ml-1">{stats.totalExperts}</span> Experts
            </div>
          </div>

          {/* Total Produce */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Produce Listings</p>
                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{stats.totalProduce}</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <Link to="/admin/produce" className={`text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium`}>
                View all →
              </Link>
            </div>
          </div>

          {/* Advisory Posts */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Advisory Posts</p>
                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{stats.totalAdvisoryPosts}</p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
                <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <Link to="/advisory" className={`text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium`}>
                Manage posts →
              </Link>
            </div>
          </div>

          {/* Forum Activity */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Forum Posts</p>
                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{stats.totalForumPosts}</p>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-full">
                <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
            </div>
            <div className={`mt-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <span className="font-semibold">{stats.totalComments}</span> Comments
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md mb-8`}>
          <div className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-4 font-medium text-sm ${
                  activeTab === 'overview'
                    ? `${darkMode ? 'border-b-2 border-indigo-400 text-indigo-400' : 'border-b-2 border-indigo-600 text-indigo-600'}`
                    : `${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`px-6 py-4 font-medium text-sm ${
                  activeTab === 'users'
                    ? `${darkMode ? 'border-b-2 border-indigo-400 text-indigo-400' : 'border-b-2 border-indigo-600 text-indigo-600'}`
                    : `${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
                }`}
              >
                Recent Users
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`px-6 py-4 font-medium text-sm ${
                  activeTab === 'activity'
                    ? `${darkMode ? 'border-b-2 border-indigo-400 text-indigo-400' : 'border-b-2 border-indigo-600 text-indigo-600'}`
                    : `${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
                }`}
              >
                Recent Activity
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4`}>System Health</h3>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className={`border rounded-lg p-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h4 className={`text-sm font-semibold mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>User Distribution</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Farmers</span>
                        <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                          {((stats.totalFarmers / stats.totalUsers) * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className={`w-full rounded-full h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                        <div 
                          className="bg-green-600 dark:bg-green-400 h-2 rounded-full" 
                          style={{ width: `${(stats.totalFarmers / stats.totalUsers) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="space-y-2 mt-3">
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Buyers</span>
                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                          {((stats.totalBuyers / stats.totalUsers) * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className={`w-full rounded-full h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                        <div 
                          className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full" 
                          style={{ width: `${(stats.totalBuyers / stats.totalUsers) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="space-y-2 mt-3">
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Experts</span>
                        <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                          {((stats.totalExperts / stats.totalUsers) * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className={`w-full rounded-full h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                        <div 
                          className="bg-purple-600 dark:bg-purple-400 h-2 rounded-full" 
                          style={{ width: `${(stats.totalExperts / stats.totalUsers) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className={`border rounded-lg p-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h4 className={`text-sm font-semibold mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Content Overview</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Produce Listings</span>
                        <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{stats.totalProduce}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Buyer Requests</span>
                        <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{stats.totalRequests}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Advisory Posts</span>
                        <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{stats.totalAdvisoryPosts}</span>
                      </div>
                    </div>
                  </div>

                  <div className={`border rounded-lg p-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h4 className={`text-sm font-semibold mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Engagement</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Forum Posts</span>
                        <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{stats.totalForumPosts}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Comments</span>
                        <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{stats.totalComments}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Avg. per Post</span>
                        <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {stats.totalForumPosts > 0 ? (stats.totalComments / stats.totalForumPosts).toFixed(1) : 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-8">
                  <h4 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4`}>Quick Actions</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Link
                      to="/admin/users"
                      className={`border-2 border-blue-200 hover:border-blue-600 dark:border-blue-900 dark:hover:border-blue-400 rounded-lg p-4 text-center transition`}
                    >
                      <svg className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <span className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Manage Users</span>
                    </Link>

                    <Link
                      to="/admin/produce"
                      className={`border-2 border-green-200 hover:border-green-600 dark:border-green-900 dark:hover:border-green-400 rounded-lg p-4 text-center transition`}
                    >
                      <svg className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>View Produce</span>
                    </Link>

                    <Link
                      to="/admin/forum"
                      className={`border-2 border-yellow-200 hover:border-yellow-600 dark:border-yellow-900 dark:hover:border-yellow-400 rounded-lg p-4 text-center transition`}
                    >
                      <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                      </svg>
                      <span className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Moderate Forum</span>
                    </Link>

                    <Link
                      to="/admin/reports"
                      className={`border-2 border-purple-200 hover:border-purple-600 dark:border-purple-900 dark:hover:border-purple-400 rounded-lg p-4 text-center transition`}
                    >
                      <svg className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 012-2h2a2 2 0 012-2v14m-6 0a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 01-2-2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <span className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>View Reports</span>
                    </Link>
                  </div>
                </div>

                {/* Charts Section */}
                {chartData && <AdminCharts chartData={chartData} />}
              </div>
            )}

            {/* Recent Users Tab */}
            {activeTab === 'users' && (
              <div>
                <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4`}>Recently Registered Users</h3>
                {recentUsers.length === 0 ? (
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>No recent users found.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className={`${darkMode ? 'bg-gray-700 border-b border-gray-600' : 'bg-gray-50 border-b border-gray-200'}`}>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase ${darkMode ? 'text-gray-300' : 'text-gray-500'}">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase ${darkMode ? 'text-gray-300' : 'text-gray-500'}">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase ${darkMode ? 'text-gray-300' : 'text-gray-500'}">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase ${darkMode ? 'text-gray-300' : 'text-gray-500'}">Location</th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase ${darkMode ? 'text-gray-300' : 'text-gray-500'}">Registered</th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase ${darkMode ? 'text-gray-300' : 'text-gray-500'}">Status</th>
                        </tr>
                      </thead>
                      <tbody className={`${darkMode ? 'bg-gray-800 divide-y divide-gray-700' : 'bg-white divide-y divide-gray-200'}`}>
                        {recentUsers.map((user) => (
                          <tr key={user.user_id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user.full_name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}">
                              {user.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                                user.user_type === 'farmer' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                user.user_type === 'buyer' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                                'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                              }`}>
                                {user.user_type}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}">
                              {user.location}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}">
                              {new Date(user.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                user.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                              }`}>
                                {user.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Recent Activity Tab */}
            {activeTab === 'activity' && (
              <div>
                <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4`}>Recent Platform Activity</h3>
                {recentActivity.length === 0 ? (
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>No recent activity found.</p>
                ) : (
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className={`flex items-start gap-4 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <div className={`p-2 rounded-full ${
                          activity.type === 'produce' ? 'bg-green-100 dark:bg-green-900' :
                          activity.type === 'forum' ? 'bg-yellow-100 dark:bg-yellow-900' :
                          activity.type === 'advisory' ? 'bg-purple-100 dark:bg-purple-900' :
                          'bg-blue-100 dark:bg-blue-900'
                        }`}>
                          <svg className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            <span className="font-semibold">{activity.user_name}</span> {activity.action}
                          </p>
                          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{activity.description}</p>
                          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            {new Date(activity.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
