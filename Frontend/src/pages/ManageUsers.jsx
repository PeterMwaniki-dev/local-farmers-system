import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useSettings } from '../contexts/SettingsContext';
import API from '../services/api';

const ManageUsers = () => {
  const { darkMode } = useSettings();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    user_type: '',
    page: 1
  });
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1
  });

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.user_type) params.append('user_type', filters.user_type);
      params.append('page', filters.page);
      params.append('limit', 20);

      const response = await API.get(`/admin/users?${params.toString()}`);
      setUsers(response.data.users);
      setPagination({
        total: response.data.total,
        totalPages: response.data.totalPages,
        currentPage: response.data.page
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ ...filters, page: 1 });
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    if (!window.confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this user?`)) {
      return;
    }

    try {
      await API.put(`/admin/users/${userId}/toggle-status`);
      alert('User status updated successfully');
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to DELETE ${userName}? This action cannot be undone!`)) {
      return;
    }

    const confirmDelete = window.prompt('Type "DELETE" to confirm deletion:');
    if (confirmDelete !== 'DELETE') {
      alert('Deletion cancelled');
      return;
    }

    try {
      await API.delete(`/admin/users/${userId}`);
      alert('User deleted successfully');
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Manage Users</h1>
            <p className={`mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>View and manage all system users</p>
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

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className={`rounded-lg shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Users</p>
            <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{pagination.total}</p>
          </div>
          <div className={`rounded-lg shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-green-50'}`}>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Farmers</p>
            <p className="text-3xl font-bold text-green-600">
              {users.filter(u => u.user_type === 'farmer').length}
            </p>
          </div>
          <div className={`rounded-lg shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-blue-50'}`}>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Buyers</p>
            <p className="text-3xl font-bold text-blue-600">
              {users.filter(u => u.user_type === 'buyer').length}
            </p>
          </div>
          <div className={`rounded-lg shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-purple-50'}`}>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Experts</p>
            <p className="text-3xl font-bold text-purple-600">
              {users.filter(u => u.user_type === 'expert').length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className={`rounded-lg shadow-md p-6 mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Search
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Search by name or email..."
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                }`}
              />
            </div>

            {/* User Type Filter */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                User Type
              </label>
              <select
                value={filters.user_type}
                onChange={(e) => setFilters({ ...filters, user_type: e.target.value, page: 1 })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                }`}
              >
                <option value="">All Types</option>
                <option value="farmer">Farmers</option>
                <option value="buyer">Buyers</option>
                <option value="expert">Experts</option>
              </select>
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition"
              >
                Apply Filters
              </button>
            </div>
          </form>
        </div>

        {/* Users Table */}
        <div className={`rounded-lg shadow-md overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading users...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={`border-b ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                    <tr>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>ID</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Name</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Email</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Phone</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Type</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Location</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Status</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Joined</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`${darkMode ? 'divide-gray-700' : 'divide-y divide-gray-200'}`}>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan="9" className={`px-6 py-12 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          No users found
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user.user_id} className={`hover:${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {user.user_id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user.full_name}</div>
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {user.email}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {user.phone_number}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                              user.user_type === 'farmer' ? 'bg-green-100 text-green-800' :
                              user.user_type === 'buyer' ? 'bg-blue-100 text-blue-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {user.user_type}
                            </span>
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {user.location}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {user.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleToggleStatus(user.user_id, user.is_active)}
                                className={`px-3 py-1 rounded text-white text-xs font-medium ${
                                  user.is_active
                                    ? 'bg-yellow-600 hover:bg-yellow-700'
                                    : 'bg-green-600 hover:bg-green-700'
                                }`}
                              >
                                {user.is_active ? 'Deactivate' : 'Activate'}
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.user_id, user.full_name)}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-medium"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className={`px-6 py-4 border-t ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center justify-between">
                    <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Showing page {pagination.currentPage} of {pagination.totalPages} ({pagination.total} total users)
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                        disabled={filters.page === 1}
                        className={`px-4 py-2 border rounded-lg text-sm font-medium ${
                          darkMode ? 'bg-gray-600 border-gray-500 text-gray-300 hover:bg-gray-500' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                        disabled={filters.page >= pagination.totalPages}
                        className={`px-4 py-2 border rounded-lg text-sm font-medium ${
                          darkMode ? 'bg-gray-600 border-gray-500 text-gray-300 hover:bg-gray-500' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ManageUsers;
