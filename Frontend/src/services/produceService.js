// src/services/produceService.js
// API calls for produce management

import API from './api';

// Get all produce (public)
export const getAllProduce = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters).toString();
    const response = await API.get(`/produce?${params}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get single produce
export const getProduceById = async (id) => {
  try {
    const response = await API.get(`/produce/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Record a view for a produce listing (dedicated endpoint)
export const recordProduceView = async (id) => {
  try {
    const response = await API.post(`/produce/${id}/view`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get farmer's own listings
export const getMyListings = async () => {
  try {
    const response = await API.get('/produce/farmer/my-listings');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Create produce listing
export const createProduce = async (produceData) => {
  try {
    // If produceData is FormData, don't set Content-Type (browser will set it with boundary)
    const config = produceData instanceof FormData 
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {};
    
    const response = await API.post('/produce', produceData, config);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update produce listing
export const updateProduce = async (id, produceData) => {
  try {
    // If produceData is FormData, don't set Content-Type (browser will set it with boundary)
    const config = produceData instanceof FormData 
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {};
    
    const response = await API.put(`/produce/${id}`, produceData, config);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Delete produce listing
export const deleteProduce = async (id) => {
  try {
    const response = await API.delete(`/produce/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get categories
export const getCategories = async () => {
  try {
    const response = await API.get('/produce/categories');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};