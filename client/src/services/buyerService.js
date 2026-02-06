// src/services/buyerService.js
// API calls for buyer requests

import API from './api';

// Get all buyer requests (public)
export const getAllRequests = async (filters = {}) => {
    try {
        const params = new URLSearchParams(filters).toString();
        const response = await API.get(`/buyers/requests?${params}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Get single request
export const getRequestById = async (id) => {
    try {
        const response = await API.get(`/buyers/requests/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Get buyer's own requests
export const getMyRequests = async () => {
    try {
        const response = await API.get('/buyers/my-requests');
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Create buyer request
export const createRequest = async (requestData) => {
    try {
        const response = await API.post('/buyers/requests', requestData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Update buyer request
export const updateRequest = async (id, requestData) => {
    try {
        const response = await API.put(`/buyers/requests/${id}`, requestData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Delete buyer request
export const deleteRequest = async (id) => {
    try {
        const response = await API.delete(`/buyers/requests/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};