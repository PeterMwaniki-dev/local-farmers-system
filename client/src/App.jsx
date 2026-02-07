// src/App.jsx
// Main App component with routing

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateProduce from './pages/CreateProduce';
import EditProduce from './pages/EditProduce';
import BrowseProduce from './pages/BrowseProduce';
import CreateRequest from './pages/CreateRequest';
import EditRequest from './pages/EditRequest';
import CreateAdvisoryPost from './pages/CreateAdvisoryPost';
import EditAdvisoryPost from './pages/EditAdvisoryPost';
import BrowseAdvisory from './pages/BrowseAdvisory';
import ViewAdvisoryPost from './pages/ViewAdvisoryPost';
import Forum from './pages/Forum';
import CreateForumPost from './pages/CreateForumPost';
import ViewForumPost from './pages/ViewForumPost';
import MarketTrends from './pages/MarketTrends';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import ChangePassword from './pages/ChangePassword';
import ManageUsers from './pages/ManageUsers';
import ManageProduce from './pages/ManageProduce';
import ManageForum from './pages/ManageForum';
import AdminReports from './pages/AdminReports';

// Home redirect component
const HomeRedirect = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Landing />;
  }
  return <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/produce" element={<BrowseProduce />} />
          <Route path="/advisory" element={<BrowseAdvisory />} />
          <Route path="/advisory/posts/:id" element={<ViewAdvisoryPost />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/forum/:id" element={<ViewForumPost />} />
          <Route path="/trends" element={<MarketTrends />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Profile Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/edit"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/change-password"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <ManageUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/produce"
            element={
              <ProtectedRoute>
                <ManageProduce />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/forum"
            element={
              <ProtectedRoute>
                <ManageForum />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute>
                <AdminReports />
              </ProtectedRoute>
            }
          />

          {/* Farmer Routes */}
          <Route
            path="/produce/create"
            element={
              <ProtectedRoute allowedRoles={['farmer']}>
                <CreateProduce />
              </ProtectedRoute>
            }
          />
          <Route
            path="/produce/edit/:id"
            element={
              <ProtectedRoute allowedRoles={['farmer']}>
                <EditProduce />
              </ProtectedRoute>
            }
          />

          {/* Buyer Routes */}
          <Route
            path="/requests/create"
            element={
              <ProtectedRoute allowedRoles={['buyer']}>
                <CreateRequest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/requests/edit/:id"
            element={
              <ProtectedRoute allowedRoles={['buyer']}>
                <EditRequest />
              </ProtectedRoute>
            }
          />

          {/* Expert/Advisory Routes */}
          <Route
            path="/advisory/posts/create"
            element={
              <ProtectedRoute allowedRoles={['expert']}>
                <CreateAdvisoryPost />
              </ProtectedRoute>
            }
          />
          <Route
            path="/advisory/posts/edit/:id"
            element={
              <ProtectedRoute allowedRoles={['expert']}>
                <EditAdvisoryPost />
              </ProtectedRoute>
            }
          />

          {/* Forum Routes - Protected */}
          <Route
            path="/forum/create"
            element={
              <ProtectedRoute>
                <CreateForumPost />
              </ProtectedRoute>
            }
          />

          {/* Redirect root to landing or dashboard */}
          <Route path="/" element={<HomeRedirect />} />

          {/* 404 - Not Found */}
          <Route
            path="*"
            element={
              <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                  <h2 className="text-4xl font-bold text-gray-800 mb-4">404</h2>
                  <p className="text-gray-600">Page not found</p>
                </div>
              </div>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;