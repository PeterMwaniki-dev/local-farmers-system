// src/pages/AdminReports.jsx
// Admin reports and analytics page

import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const AdminReports = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Reports & Analytics</h1>
            <p className="text-gray-600 mt-1">System reports and insights</p>
          </div>
          <Link
            to="/dashboard"
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <svg className="w-24 h-24 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Reports Coming Soon</h2>
          <p className="text-gray-600 mb-6">
            Advanced analytics and reporting features will be available here, including:
          </p>
          <ul className="text-left max-w-md mx-auto space-y-2 text-gray-600">
            <li>✓ User growth trends</li>
            <li>✓ Platform engagement metrics</li>
            <li>✓ Revenue analytics</li>
            <li>✓ Geographic distribution</li>
            <li>✓ Export capabilities</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;