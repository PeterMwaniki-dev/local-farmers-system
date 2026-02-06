// src/components/ProtectedRoute.jsx
// Protect routes that require authentication

import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, isAuthenticated } = useAuth();

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // If specific roles are required, check if user has the right role
    if (allowedRoles && !allowedRoles.includes(user.user_type)) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
                    <p className="text-gray-600">
                        You don't have permission to access this page.
                    </p>
                </div>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;