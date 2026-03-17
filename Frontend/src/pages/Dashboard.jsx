import { useAuth } from '../contexts/AuthContext';
import FarmerDashboard from './FarmerDashboard';
import BuyerDashboard from './BuyerDashboard';
import ExpertDashboard from './ExpertDashboard';
import AdminDashboard from './AdminDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  console.log('Dashboard - Current user:', user); // Debug log

  // Route to admin dashboard
  if (user?.email === 'admin@sonnetshamba.com' || user?.user_type === 'admin') {
    return <AdminDashboard />;
  }

  // Route to role-specific dashboard
  if (user?.user_type === 'farmer') {
    return <FarmerDashboard />;
  }

  if (user?.user_type === 'buyer') {
    return <BuyerDashboard />;
  }

  if (user?.user_type === 'expert') {
    return <ExpertDashboard />;
  }

  // Debug fallback
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800">Debug Info</h2>
        <p className="text-gray-600 mt-2">User Type: {user?.user_type || 'undefined'}</p>
        <p className="text-gray-600">Email: {user?.email || 'undefined'}</p>
        <p className="text-gray-600 mt-4">Full User Object:</p>
        <pre className="text-xs bg-gray-100 p-2 rounded mt-2">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default Dashboard;