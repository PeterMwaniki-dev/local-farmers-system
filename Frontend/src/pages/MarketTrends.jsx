// src/pages/MarketTrends.jsx
// Market trends and price information

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getAllTrends } from '../services/trendsService';

const MarketTrends = () => {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    produce: '',
    location: '',
    date: ''
  });

  useEffect(() => {
    fetchTrends();
  }, []);

  const fetchTrends = async () => {
    try {
      const filterParams = {};
      if (filters.produce) filterParams.produce = filters.produce;
      if (filters.location) filterParams.location = filters.location;
      if (filters.date) filterParams.date = filters.date;

      const data = await getAllTrends(filterParams);
      setTrends(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching trends:', err);
      setError(err.message || 'Failed to load market trends');
      setTrends([]);
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
    fetchTrends();
  };

  const clearFilters = () => {
    setFilters({ produce: '', location: '', date: '' });
    setLoading(true);
    setTimeout(() => fetchTrends(), 100);
  };

  const getDemandColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'high':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSupplyColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'high':
        return 'bg-blue-100 text-blue-800';
      case 'medium':
        return 'bg-indigo-100 text-indigo-800';
      case 'low':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold mb-2">Market Trends</h1>
          <p className="text-purple-100 text-lg">
            Track produce prices, demand, and supply across different markets
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-sm">High Demand</p>
                <p className="text-2xl font-bold text-gray-800">
                  {trends.filter(t => t.demand_level === 'high').length}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-600">Produce types with strong market demand</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Products Tracked</p>
                <p className="text-2xl font-bold text-gray-800">{trends.length}</p>
              </div>
            </div>
            <p className="text-xs text-gray-600">Total produce types in market trends</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-purple-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Locations</p>
                <p className="text-2xl font-bold text-gray-800">
                  {[...new Set(trends.map(t => t.location))].length}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-600">Markets with available data</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Filter Trends</h2>
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Produce Name */}
            <div>
              <input
                type="text"
                name="produce"
                value={filters.produce}
                onChange={handleFilterChange}
                placeholder="Search produce..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Location */}
            <div>
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="Location..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Date */}
            <div>
              <input
                type="date"
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition"
              >
                Search
              </button>
              <button
                type="button"
                onClick={clearFilters}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg transition"
              >
                Clear
              </button>
            </div>
          </form>
        </div>

        {/* Legend */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="font-bold text-gray-800 mb-4">Understanding Market Indicators</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Demand Levels:</p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">High Demand</span>
                <span className="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full">Medium Demand</span>
                <span className="bg-red-100 text-red-800 text-xs px-3 py-1 rounded-full">Low Demand</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Supply Levels:</p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">High Supply</span>
                <span className="bg-indigo-100 text-indigo-800 text-xs px-3 py-1 rounded-full">Medium Supply</span>
                <span className="bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full">Low Supply</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trends Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">
              Market Data ({trends.length})
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading market trends...</p>
            </div>
          ) : error ? (
            <div className="p-6">
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                <p className="font-semibold">Note:</p>
                <p>{error}</p>
                <p className="text-sm mt-2">The backend trends routes may not be implemented yet.</p>
              </div>
            </div>
          ) : trends.length === 0 ? (
            <div className="text-center py-12 px-6">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-gray-600 text-lg">No market trends available.</p>
              <p className="text-gray-500 text-sm mt-2">
                {filters.produce || filters.location || filters.date 
                  ? 'Try adjusting your filters.' 
                  : 'Market data will appear here once available.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produce
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avg. Price (KES)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Demand
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Supply
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {trends.map((trend, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{trend.produce_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-gray-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          {trend.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-lg font-bold text-purple-600">
                          {trend.average_price ? `KES ${parseFloat(trend.average_price).toFixed(2)}` : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${getDemandColor(trend.demand_level)}`}>
                          {trend.demand_level || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${getSupplyColor(trend.supply_level)}`}>
                          {trend.supply_level || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(trend.recorded_date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Market Insights */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-blue-800 mb-3">💡 How to Use Market Trends:</h3>
          <ul className="space-y-2 text-sm text-blue-700">
            <li>• <strong>High Demand + Low Supply:</strong> Best time to sell - prices likely higher</li>
            <li>• <strong>Low Demand + High Supply:</strong> Consider holding or diversifying crops</li>
            <li>• <strong>Track price changes:</strong> Monitor trends over time to plan harvest timing</li>
            <li>• <strong>Location matters:</strong> Prices vary by market - consider transport costs</li>
            <li>• <strong>Plan ahead:</strong> Use trends to decide what to plant next season</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MarketTrends;