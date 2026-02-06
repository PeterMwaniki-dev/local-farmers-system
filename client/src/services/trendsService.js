// src/services/trendsService.js
// API calls for market trends

import API from './api';

// Get all market trends
export const getAllTrends = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters).toString();
    const response = await API.get(`/trends?${params}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get trends for specific produce
export const getTrendsByProduce = async (produceName) => {
  try {
    const response = await API.get(`/trends/produce/${produceName}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get latest trends
export const getLatestTrends = async () => {
  try {
    const response = await API.get('/trends/latest');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Create/Update trend (Admin only)
export const createTrend = async (trendData) => {
  try {
    const response = await API.post('/trends', trendData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get trend statistics
export const getTrendStats = async () => {
  try {
    const response = await API.get('/trends/stats');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};