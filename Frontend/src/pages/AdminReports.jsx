import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
  getUserStats,
  getProduceStats,
  getActivityStats,
  getTopUsers,
  getGeographicDistribution,
  getEngagementMetrics,
  getOverviewSummary
} from '../services/reportService';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminReports = () => {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [produceStats, setProduceStats] = useState(null);
  const [activityStats, setActivityStats] = useState(null);
  const [topUsers, setTopUsers] = useState(null);
  const [geographic, setGeographic] = useState(null);
  const [engagement, setEngagement] = useState(null);

  useEffect(() => {
    fetchAllReports();
  }, []);

  const fetchAllReports = async () => {
    try {
      setLoading(true);

      const [
        overviewData,
        userStatsData,
        produceStatsData,
        activityStatsData,
        topUsersData,
        geographicData,
        engagementData
      ] = await Promise.all([
        getOverviewSummary(),
        getUserStats(),
        getProduceStats(),
        getActivityStats(),
        getTopUsers(),
        getGeographicDistribution(),
        getEngagementMetrics()
      ]);

      setOverview(overviewData.data);
      setUserStats(userStatsData.data);
      setProduceStats(produceStatsData.data);
      setActivityStats(activityStatsData.data);
      setTopUsers(topUsersData.data);
      setGeographic(geographicData.data);
      setEngagement(engagementData.data);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setLoading(false);
    }
  };

  // Chart: User Registration Trends
  const getUserRegistrationChart = () => {
    if (!userStats?.registrationsByMonth) return null;

    // Get unique months
    const months = [...new Set(userStats.registrationsByMonth.map(item => item.month))].sort();
    
    // Group by user type
    const userTypes = ['farmer', 'buyer', 'expert'];
    const datasets = userTypes.map((type, index) => {
      const colors = ['#10b981', '#3b82f6', '#8b5cf6'];
      return {
        label: type.charAt(0).toUpperCase() + type.slice(1) + 's',
        data: months.map(month => {
          const found = userStats.registrationsByMonth.find(
            item => item.month === month && item.user_type === type
          );
          return found ? found.count : 0;
        }),
        borderColor: colors[index],
        backgroundColor: colors[index],
        tension: 0.4
      };
    });

    return {
      labels: months.map(m => {
        const [year, month] = m.split('-');
        return new Date(year, month - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      }),
      datasets
    };
  };

  // Chart: Users by Type (Pie)
  const getUserTypeChart = () => {
    if (!userStats?.usersByType) return null;

    return {
      labels: userStats.usersByType.map(item => 
        item.user_type.charAt(0).toUpperCase() + item.user_type.slice(1) + 's'
      ),
      datasets: [{
        data: userStats.usersByType.map(item => item.count),
        backgroundColor: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'],
        borderWidth: 2,
        borderColor: '#fff'
      }]
    };
  };

  // Chart: Produce by Category (Doughnut)
  const getProduceCategoryChart = () => {
    if (!produceStats?.produceByCategory) return null;

    return {
      labels: produceStats.produceByCategory.map(item => item.category),
      datasets: [{
        data: produceStats.produceByCategory.map(item => item.count),
        backgroundColor: [
          '#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', 
          '#ef4444', '#06b6d4', '#ec4899', '#14b8a6'
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }]
    };
  };

  // Chart: Platform Activity by Month (Bar)
  const getActivityChart = () => {
    if (!activityStats) return null;

    // Get all unique months
    const allMonths = new Set();
    activityStats.forumByMonth?.forEach(item => allMonths.add(item.month));
    activityStats.advisoryByMonth?.forEach(item => allMonths.add(item.month));
    activityStats.requestsByMonth?.forEach(item => allMonths.add(item.month));
    
    const months = [...allMonths].sort();

    return {
      labels: months.map(m => {
        const [year, month] = m.split('-');
        return new Date(year, month - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      }),
      datasets: [
        {
          label: 'Forum Posts',
          data: months.map(month => {
            const found = activityStats.forumByMonth?.find(item => item.month === month);
            return found ? found.count : 0;
          }),
          backgroundColor: '#10b981'
        },
        {
          label: 'Advisory Posts',
          data: months.map(month => {
            const found = activityStats.advisoryByMonth?.find(item => item.month === month);
            return found ? found.count : 0;
          }),
          backgroundColor: '#3b82f6'
        },
        {
          label: 'Buyer Requests',
          data: months.map(month => {
            const found = activityStats.requestsByMonth?.find(item => item.month === month);
            return found ? found.count : 0;
          }),
          backgroundColor: '#8b5cf6'
        }
      ]
    };
  };

  // Chart: Geographic Distribution (Bar)
  const getGeographicChart = () => {
    if (!geographic?.usersByLocation) return null;

    return {
      labels: geographic.usersByLocation.map(item => item.location),
      datasets: [{
        label: 'Users',
        data: geographic.usersByLocation.map(item => item.count),
        backgroundColor: '#10b981'
      }]
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading reports...</p>
          </div>
        </div>
      </div>
    );
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Reports & Analytics</h1>
          <p className="text-gray-600 mt-2">Comprehensive platform statistics and insights</p>
        </div>

        {/* Overview Summary Cards */}
        {overview && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Users</p>
                  <p className="text-3xl font-bold text-gray-800">{overview.totalUsers}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">{overview.activeUsers} active in last 30 days</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Produce Listings</p>
                  <p className="text-3xl font-bold text-gray-800">{overview.totalProduce}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Forum Posts</p>
                  <p className="text-3xl font-bold text-gray-800">{overview.totalForumPosts}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">{overview.totalComments} comments</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Advisory Posts</p>
                  <p className="text-3xl font-bold text-gray-800">{overview.totalAdvisoryPosts}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Registration Trends */}
          {userStats && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">User Registration Trends</h3>
              <Line data={getUserRegistrationChart()} options={chartOptions} />
            </div>
          )}

          {/* Users by Type */}
          {userStats && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Users by Type</h3>
              <div className="flex justify-center">
                <div className="w-64 h-64">
                  <Pie data={getUserTypeChart()} options={chartOptions} />
                </div>
              </div>
            </div>
          )}

          {/* Produce by Category */}
          {produceStats && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Produce by Category</h3>
              <div className="flex justify-center">
                <div className="w-64 h-64">
                  <Doughnut data={getProduceCategoryChart()} options={chartOptions} />
                </div>
              </div>
            </div>
          )}

          {/* Platform Activity */}
          {activityStats && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Platform Activity by Month</h3>
              <Bar data={getActivityChart()} options={chartOptions} />
            </div>
          )}
        </div>

        {/* Geographic Distribution */}
        {geographic && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Geographic Distribution (Top 10 Locations)</h3>
            <Bar 
              data={getGeographicChart()} 
              options={{
                ...chartOptions,
                indexAxis: 'y',
                plugins: {
                  legend: {
                    display: false
                  }
                }
              }} 
            />
          </div>
        )}

        {/* Top Users */}
        {topUsers && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Top Farmers */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Farmers</h3>
              <div className="space-y-3">
                {topUsers.topFarmers.map((farmer, index) => (
                  <div key={farmer.user_id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-bold text-green-600">#{index + 1}</span>
                      <div>
                        <p className="font-semibold text-gray-800">{farmer.full_name}</p>
                        <p className="text-sm text-gray-500">{farmer.location}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-green-600">{farmer.listing_count} listings</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Buyers */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Buyers</h3>
              <div className="space-y-3">
                {topUsers.topBuyers.map((buyer, index) => (
                  <div key={buyer.user_id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-bold text-blue-600">#{index + 1}</span>
                      <div>
                        <p className="font-semibold text-gray-800">{buyer.full_name}</p>
                        <p className="text-sm text-gray-500">{buyer.location}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-blue-600">{buyer.request_count} requests</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Experts */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Experts</h3>
              <div className="space-y-3">
                {topUsers.topExperts.map((expert, index) => (
                  <div key={expert.user_id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-bold text-purple-600">#{index + 1}</span>
                      <div>
                        <p className="font-semibold text-gray-800">{expert.full_name}</p>
                        <p className="text-sm text-gray-500">{expert.location}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-purple-600">{expert.post_count} posts</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Engagement Metrics */}
        {engagement && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Most Viewed Produce */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Most Viewed Produce</h3>
              <div className="space-y-2">
                {engagement.mostViewedProduce.slice(0, 5).map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                    <div>
                      <p className="font-medium text-gray-800">{item.produce_name}</p>
                      <p className="text-xs text-gray-500">{item.category} • {item.location}</p>
                    </div>
                    <span className="text-sm font-semibold text-green-600">{item.views_count} views</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Most Viewed Advisory */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Most Viewed Advisory Posts</h3>
              <div className="space-y-2">
                {engagement.mostViewedAdvisory.slice(0, 5).map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                    <div>
                      <p className="font-medium text-gray-800">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.category}</p>
                    </div>
                    <span className="text-sm font-semibold text-blue-600">{item.views_count} views</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReports;