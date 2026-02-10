// src/services/userService.js
// API calls for user profile management

import API from './api';

// Get current user profile
export const getMyProfile = async () => {
  try {
    const response = await API.get('/users/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get user by ID
export const getUserById = async (id) => {
  try {
    const response = await API.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update user profile
export const updateProfile = async (profileData) => {
  try {
    const response = await API.put('/users/profile', profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Change password
export const changePassword = async (passwordData) => {
  try {
    const response = await API.put('/users/change-password', passwordData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Upload profile image
export const uploadProfileImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await API.post('/users/profile-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get user statistics
export const getUserStats = async () => {
  try {
    const response = await API.get('/users/stats');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};