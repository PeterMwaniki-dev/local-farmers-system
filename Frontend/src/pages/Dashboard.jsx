import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import Layout from '../components/Layout';
import FarmerDashboard from './FarmerDashboard';
import BuyerDashboard from './BuyerDashboard';
import ExpertDashboard from './ExpertDashboard';
import AdminDashboard from './AdminDashboard';

const Dashboard = () => {
  const { user } = useAuth();
  const { darkMode } = useSettings();

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
    <Layout>
      <div className={`flex items-center justify-center min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-8 rounded-lg shadow-md`}>
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Debug Info</h2>
          <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>User Type: {user?.user_type || 'undefined'}</p>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Email: {user?.email || 'undefined'}</p>
          <p className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Full User Object:</p>
          <pre className={`text-xs p-2 rounded mt-2 ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100'}`}>
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;