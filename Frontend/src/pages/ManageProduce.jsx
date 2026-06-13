import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useSettings } from '../contexts/SettingsContext';
import API from '../services/api';

const ManageProduce = () => {
  const { darkMode } = useSettings();
  const [produce, setProduce] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: ''
  });

  useEffect(() => {
    fetchProduce();
  }, [filters]);

  const fetchProduce = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.status) params.append('status', filters.status);

      const response = await API.get(`/produce?${params.toString()}`);
      
      // Handle different response formats
      const data = response.data;
      if (Array.isArray(data)) {
        setProduce(data);
      } else if (data.data && Array.isArray(data.data)) {
        setProduce(data.data);
      } else {
        setProduce([]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching produce:', error);
      setProduce([]);
      setLoading(false);
    }
  };

  const handleDeleteProduce = async (listingId, produceName, farmerName) => {
    if (!window.confirm(`Are you sure you want to DELETE "${produceName}" by ${farmerName}?`)) {
      return;
    }

    try {
      await API.delete(`/produce/${listingId}`);
      alert('Produce listing deleted successfully');
      fetchProduce();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete produce listing');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'sold':
        return 'bg-blue-100 text-blue-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Manage Produce</h1>
            <p className={`mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>View and moderate all produce listings</p>
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
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Listings</p>
            <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{produce.length}</p>
          </div>
          <div className={`rounded-lg shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-green-50'}`}>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Available</p>
            <p className="text-3xl font-bold text-green-600">
              {produce.filter(p => p.status === 'available').length}
            </p>
          </div>
          <div className={`rounded-lg shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-blue-50'}`}>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Sold</p>
            <p className="text-3xl font-bold text-blue-600">
              {produce.filter(p => p.status === 'sold').length}
            </p>
          </div>
          <div className={`rounded-lg shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-red-50'}`}>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Expired</p>
            <p className="text-3xl font-bold text-red-600">
              {produce.filter(p => p.status === 'expired').length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className={`rounded-lg shadow-md p-6 mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Search
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Search by produce name..."
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                }`}
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                }`}
              >
                <option value="">All Categories</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Fruits">Fruits</option>
                <option value="Grains">Grains</option>
                <option value="Legumes">Legumes</option>
                <option value="Tubers">Tubers</option>
                <option value="Dairy">Dairy</option>
                <option value="Poultry">Poultry</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                }`}
              >
                <option value="">All Statuses</option>
                <option value="available">Available</option>
                <option value="sold">Sold</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>
        </div>

        {/* Produce Table */}
        <div className={`rounded-lg shadow-md overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading produce listings...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={`border-b ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                    <tr>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>ID</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Image</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Produce</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Farmer</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Category</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Quantity</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Price/Unit</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Location</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Status</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Listed</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`${darkMode ? 'divide-gray-700' : 'divide-y divide-gray-200'}`}>
                    {produce.length === 0 ? (
                      <tr>
                        <td colSpan="11" className={`px-6 py-12 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          No produce listings found
                        </td>
                      </tr>
                    ) : (
                      produce.map((item) => (
                        <tr key={item.listing_id} className={`hover:${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {item.listing_id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.image_url ? (
                              <img
                                src={`http://localhost:5000${item.image_url}`}
                                alt={item.produce_name}
                                className="w-16 h-16 object-cover rounded"
                                onError={(e) => {
                                  e.target.src = 'https://via.placeholder.com/100?text=No+Image';
                                }}
                              />
                            ) : (
                              <div className={`w-16 h-16 rounded flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                <svg className={`w-8 h-8 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.produce_name}</div>
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {item.farmer_name}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {item.category}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {item.quantity} {item.unit}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            KES {item.price_per_unit}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {item.location}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(item.status)}`}>
                              {item.status}
                            </span>
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {new Date(item.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleDeleteProduce(item.listing_id, item.produce_name, item.farmer_name)}
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
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ManageProduce;
