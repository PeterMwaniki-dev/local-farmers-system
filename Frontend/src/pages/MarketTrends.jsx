// src/pages/MarketTrends.jsx
// Market trends and price information

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import API from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MarketTrends = () => {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    produce_name: '',
    location: ''
  });

  useEffect(() => {
    fetchTrends();
  }, []);

  const fetchTrends = async () => {
    try {
      const filterParams = {};
      if (filters.produce_name) filterParams.produce_name = filters.produce_name;
      if (filters.location) filterParams.location = filters.location;

      const response = await API.get('/trends', { params: filterParams });
      setTrends(Array.isArray(response.data) ? response.data : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching trends:', error);
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
    fetchTrends();
  };

  // Prepare chart data - Price Trends Over Time
  const getPriceChartData = () => {
    if (trends.length === 0) return null;

    // Get unique produce names (limit to top 5 for readability)
    const produceNames = [...new Set(trends.map(t => t.produce_name))].slice(0, 5);
    
    // Get dates (last 10 entries)
    const dates = [...new Set(trends.map(t => 
      new Date(t.report_date).toLocaleDateString()
    ))].slice(-10);

    const datasets = produceNames.map((name, index) => {
      const produceData = trends.filter(t => t.produce_name === name);
      const colors = [
        'rgb(34, 197, 94)',   // green
        'rgb(59, 130, 246)',  // blue
        'rgb(168, 85, 247)',  // purple
        'rgb(234, 179, 8)',   // yellow
        'rgb(239, 68, 68)'    // red
      ];

      return {
        label: name,
        data: dates.map(date => {
          const entry = produceData.find(d => 
            new Date(d.report_date).toLocaleDateString() === date
          );
          return entry ? entry.average_price : null;
        }),
        borderColor: colors[index % colors.length],
        backgroundColor: colors[index % colors.length].replace('rgb', 'rgba').replace(')', ', 0.1)'),
        tension: 0.4
      };
    });

    return {
      labels: dates,
      datasets
    };
  };

  // Prepare chart data - Supply vs Demand Distribution
  const getSupplyDemandChartData = () => {
    if (trends.length === 0) return null;

    // Count occurrences of each level
    const supplyCounts = { low: 0, medium: 0, high: 0 };
    const demandCounts = { low: 0, medium: 0, high: 0 };

    trends.forEach(t => {
      const supply = (t.supply_level || '').toLowerCase();
      const demand = (t.demand_level || '').toLowerCase();
      
      if (supplyCounts.hasOwnProperty(supply)) supplyCounts[supply]++;
      if (demandCounts.hasOwnProperty(demand)) demandCounts[demand]++;
    });

    return {
      labels: ['Low', 'Medium', 'High'],
      datasets: [
        {
          label: 'Supply Level (Count)',
          data: [supplyCounts.low, supplyCounts.medium, supplyCounts.high],
          backgroundColor: 'rgba(34, 197, 94, 0.7)',
          borderColor: 'rgb(34, 197, 94)',
          borderWidth: 1
        },
        {
          label: 'Demand Level (Count)',
          data: [demandCounts.low, demandCounts.medium, demandCounts.high],
          backgroundColor: 'rgba(59, 130, 246, 0.7)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 1
        }
      ]
    };
  };

  const priceChartData = getPriceChartData();
  const supplyDemandChartData = getSupplyDemandChartData();

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading market trends...</p>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Market Trends & Prices</h1>
          <p className="text-gray-600 mt-2">
            Stay informed with the latest market data and price trends
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Produce Name
              </label>
              <input
                type="text"
                name="produce_name"
                value={filters.produce_name}
                onChange={handleFilterChange}
                placeholder="Search by produce..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="Filter by location..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Charts Section */}
        {trends.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Price Trends Chart */}
            {priceChartData && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Price Trends Over Time</h2>
                <div className="h-80">
                  <Line data={priceChartData} options={chartOptions} />
                </div>
              </div>
            )}

            {/* Supply vs Demand Chart */}
            {supplyDemandChartData && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Supply vs Demand Distribution</h2>
                <div className="h-80">
                  <Bar data={supplyDemandChartData} options={chartOptions} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Market Data Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Latest Market Data</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produce</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supply</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Demand</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {trends.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      No market trends data available
                    </td>
                  </tr>
                ) : (
                  trends.map((trend) => (
                    <tr key={trend.trend_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{trend.produce_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {trend.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-green-600 font-semibold">
                          KES {trend.average_price}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                          trend.supply_level?.toLowerCase() === 'high' ? 'bg-green-100 text-green-800' :
                          trend.supply_level?.toLowerCase() === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {trend.supply_level}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                          trend.demand_level?.toLowerCase() === 'high' ? 'bg-red-100 text-red-800' :
                          trend.demand_level?.toLowerCase() === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {trend.demand_level}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(trend.report_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {trend.notes || '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Cards */}
        {trends.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <h3 className="font-semibold text-green-800">High Supply</h3>
              </div>
              <p className="text-sm text-green-700">
                {trends.filter(t => t.supply_level?.toLowerCase() === 'high').length} produce items currently in high supply
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="font-semibold text-blue-800">Average Price</h3>
              </div>
              <p className="text-sm text-blue-700">
                KES {(trends.reduce((sum, t) => sum + parseFloat(t.average_price), 0) / trends.length).toFixed(2)} across all produce
              </p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h3 className="font-semibold text-purple-800">Market Activity</h3>
              </div>
              <p className="text-sm text-purple-700">
                {trends.length} market data entries available
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketTrends;