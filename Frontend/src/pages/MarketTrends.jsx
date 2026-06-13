import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useSettings } from '../contexts/SettingsContext';
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
  const { darkMode } = useSettings();
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
      new Date(t.recorded_date).toLocaleDateString()
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
            new Date(d.recorded_date).toLocaleDateString() === date
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
        labels: {
          color: darkMode ? 'rgb(229, 231, 235)' : 'rgb(31, 41, 55)'
        }
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: darkMode ? 'rgb(229, 231, 235)' : 'rgb(31, 41, 55)'
        },
        grid: {
          color: darkMode ? 'rgba(107, 114, 128, 0.3)' : 'rgba(209, 213, 219, 0.5)'
        }
      },
      x: {
        ticks: {
          color: darkMode ? 'rgb(229, 231, 235)' : 'rgb(31, 41, 55)'
        },
        grid: {
          color: darkMode ? 'rgba(107, 114, 128, 0.3)' : 'rgba(209, 213, 219, 0.5)'
        }
      }
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Market Trends & Prices</h1>
          <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Stay informed with the latest market data and price trends
          </p>
        </div>

        {/* Filters */}
        <div className={`rounded-lg shadow-md p-6 mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Produce Name
              </label>
              <input
                type="text"
                name="produce_name"
                value={filters.produce_name}
                onChange={handleFilterChange}
                placeholder="Search by produce..."
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                }`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Location
              </label>
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="Filter by location..."
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                }`}
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

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading market trends...</p>
          </div>
        ) : (
          <>
            {/* Charts Section */}
            {trends.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Price Trends Chart */}
                {priceChartData && (
                  <div className={`rounded-lg shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Price Trends Over Time</h2>
                    <div className="h-80">
                      <Line data={priceChartData} options={chartOptions} />
                    </div>
                  </div>
                )}

                {/* Supply vs Demand Chart */}
                {supplyDemandChartData && (
                  <div className={`rounded-lg shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Supply vs Demand Distribution</h2>
                    <div className="h-80">
                      <Bar data={supplyDemandChartData} options={chartOptions} />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Market Data Table */}
            <div className={`rounded-lg shadow-md overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Latest Market Data</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <tr>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Produce</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Location</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Avg Price</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Supply</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Demand</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Date</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Notes</th>
                    </tr>
                  </thead>
                  <tbody className={`${darkMode ? 'divide-gray-700' : 'divide-y divide-gray-200'}`}>
                    {trends.length === 0 ? (
                      <tr>
                        <td colSpan="7" className={`px-6 py-12 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          No market trends data available
                        </td>
                      </tr>
                    ) : (
                      trends.map((trend) => (
                        <tr key={trend.trend_id} className={`hover:${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{trend.produce_name}</div>
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {trend.location}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-green-600 dark:text-green-400 font-semibold">
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
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {new Date(trend.recorded_date).toLocaleDateString()}
                          </td>
                          <td className={`px-6 py-4 text-sm max-w-xs truncate ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
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
                <div className={`border rounded-lg p-6 ${darkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <h3 className={`font-semibold ${darkMode ? 'text-green-300' : 'text-green-800'}`}>High Supply</h3>
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-green-200' : 'text-green-700'}`}>
                    {trends.filter(t => t.supply_level?.toLowerCase() === 'high').length} produce items currently in high supply
                  </p>
                </div>

                <div className={`border rounded-lg p-6 ${darkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className={`font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>Average Price</h3>
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-blue-200' : 'text-blue-700'}`}>
                    KES {(trends.reduce((sum, t) => sum + parseFloat(t.average_price), 0) / trends.length).toFixed(2)} across all produce
                  </p>
                </div>

                <div className={`border rounded-lg p-6 ${darkMode ? 'bg-purple-900/20 border-purple-800' : 'bg-purple-50 border-purple-200'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <h3 className={`font-semibold ${darkMode ? 'text-purple-300' : 'text-purple-800'}`}>Market Activity</h3>
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-purple-200' : 'text-purple-700'}`}>
                    {trends.length} market data entries available
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default MarketTrends;
