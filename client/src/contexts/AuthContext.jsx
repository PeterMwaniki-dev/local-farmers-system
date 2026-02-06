// src/contexts/AuthContext.jsx
// Global authentication state management

import { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is logged in on app load
    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    // Login function
    const login = async (email, password) => {
        try {
            const response = await API.post('/auth/login', { email, password });
            const { token, ...userData } = response.data.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);

            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    // Register function
    const register = async (userData) => {
        try {
            const response = await API.post('/auth/register', userData);
            const { token, ...newUser } = response.data.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(newUser));
            setUser(newUser);

            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const value = {
        user,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!user,
        isFarmer: user?.user_type === 'farmer',
        isExpert: user?.user_type === 'expert',
        isBuyer: user?.user_type === 'buyer',
        isAdmin: user?.user_type === 'admin'
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
