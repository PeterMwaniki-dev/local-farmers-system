import { Line, Bar, Doughnut } from 'react-chartjs-2';
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
  Legend,
  Filler
} from 'chart.js';

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
  Legend,
  Filler
);

const AdminCharts = ({ chartData }) => {
  // User Growth Chart Data
  const userGrowthData = {
    labels: chartData?.userGrowth?.labels || [],
    datasets: [
      {
        label: 'Total Users',
        data: chartData?.userGrowth?.data || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  // User Distribution Chart Data
  const userDistributionData = {
    labels: ['Farmers', 'Buyers', 'Experts'],
    datasets: [
      {
        data: [
          chartData?.userDistribution?.farmers || 0,
          chartData?.userDistribution?.buyers || 0,
          chartData?.userDistribution?.experts || 0
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)'
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(59, 130, 246)',
          'rgb(168, 85, 247)'
        ],
        borderWidth: 2
      }
    ]
  };

  // Platform Activity Chart Data
  const activityData = {
    labels: ['Produce', 'Requests', 'Advisory', 'Forum Posts', 'Comments'],
    datasets: [
      {
        label: 'Total Count',
        data: [
          chartData?.activity?.produce || 0,
          chartData?.activity?.requests || 0,
          chartData?.activity?.advisory || 0,
          chartData?.activity?.forumPosts || 0,
          chartData?.activity?.comments || 0
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(59, 130, 246)',
          'rgb(168, 85, 247)',
          'rgb(251, 191, 36)',
          'rgb(239, 68, 68)'
        ],
        borderWidth: 2
      }
    ]
  };

  // Popular Categories Chart Data
  const categoriesData = {
    labels: chartData?.categories?.labels || [],
    datasets: [
      {
        label: 'Listings',
        data: chartData?.categories?.data || [],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 2
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
      {/* User Growth Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">User Growth Over Time</h3>
        <div className="h-64">
          <Line data={userGrowthData} options={chartOptions} />
        </div>
      </div>

      {/* User Distribution Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">User Distribution</h3>
        <div className="h-64">
          <Doughnut data={userDistributionData} options={chartOptions} />
        </div>
      </div>

      {/* Platform Activity Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Platform Activity</h3>
        <div className="h-64">
          <Bar data={activityData} options={chartOptions} />
        </div>
      </div>

      {/* Popular Categories Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Popular Produce Categories</h3>
        <div className="h-64">
          <Bar data={categoriesData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default AdminCharts;