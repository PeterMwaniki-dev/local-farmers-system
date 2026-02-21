// src/pages/Dashboard.jsx
// Main dashboard that routes to role-specific dashboards

import { useAuth } from '../contexts/AuthContext';
import FarmerDashboard from './FarmerDashboard';
import BuyerDashboard from './BuyerDashboard';
import ExpertDashboard from './ExpertDashboard';
import AdminDashboard from './AdminDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  // Route to admin dashboard (check by email for now)
  if (user?.email === 'admin@shambasense.com') {
    return <AdminDashboard />;
  }

  // Route to role-specific dashboard
  if (user?.user_type === 'admin') {
    return <FarmerDashboard />;
  }

  if (user?.user_type === 'buyer') {
    return <BuyerDashboard />;
  }

  if (user?.user_type === 'expert') {
    return <ExpertDashboard />;
  }

  // Default fallback
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800">Welcome!</h2>
        <p className="text-gray-600 mt-2">Your dashboard is loading...</p>
      </div>
    </div>
  );
};

export default Dashboard;