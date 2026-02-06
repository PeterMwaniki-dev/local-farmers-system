// src/pages/Dashboard.jsx
// Main dashboard - routes to role-specific dashboards

import { useAuth } from '../contexts/AuthContext';
import FarmerDashboard from './FarmerDashboard';
import BuyerDashboard from './BuyerDashboard';
import ExpertDashboard from './ExpertDashboard';  

const Dashboard = () => {
  const { user } = useAuth();

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

  // For admin and others, show placeholder
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-green-600 text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Local Farmers System</h1>
        </div>
      </nav>

      <div className="container mx-auto p-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-4">
            Welcome, {user?.full_name}!
          </h2>
          <p className="text-gray-600 mb-4">
            Role: <span className="capitalize font-semibold">{user?.user_type}</span>
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-blue-800">
              🚧 Dashboard for this role is coming soon!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;