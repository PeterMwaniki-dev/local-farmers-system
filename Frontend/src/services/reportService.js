// src/services/reportService.js
// API calls for reports and analytics

import API from './api';

// Get user statistics
export const getUserStats = async () => {
  try {
    const response = await API.get('/reports/users');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get produce statistics
export const getProduceStats = async () => {
  try {
    const response = await API.get('/reports/produce');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get activity statistics
export const getActivityStats = async () => {
  try {
    const response = await API.get('/reports/activity');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get top users
export const getTopUsers = async () => {
  try {
    const response = await API.get('/reports/top-users');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get geographic distribution
export const getGeographicDistribution = async () => {
  try {
    const response = await API.get('/reports/geographic');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get engagement metrics
export const getEngagementMetrics = async () => {
  try {
    const response = await API.get('/reports/engagement');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get overview summary
export const getOverviewSummary = async () => {
  try {
    const response = await API.get('/reports/overview');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};