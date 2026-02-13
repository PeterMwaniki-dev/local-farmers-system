// src/services/advisoryService.js
// API calls for advisory posts and questions

import API from './api';

// ============ ADVISORY POSTS ============

// Get all advisory posts (public)
export const getAllPosts = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters).toString();
    const response = await API.get(`/advisory/posts?${params}`);
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get single post
export const getPostById = async (id) => {
  try {
    const response = await API.get(`/advisory/posts/${id}`);
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get expert's own posts
export const getMyPosts = async () => {
  try {
    const response = await API.get('/advisory/my-posts');
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Create advisory post
export const createPost = async (postData) => {
  try {
    const response = await API.post('/advisory/posts', postData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update advisory post
export const updatePost = async (id, postData) => {
  try {
    const response = await API.put(`/advisory/posts/${id}`, postData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Delete advisory post
export const deletePost = async (id) => {
  try {
    const response = await API.delete(`/advisory/posts/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ============ ADVISORY QUESTIONS ============

// Get all questions
export const getAllQuestions = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters).toString();
    const response = await API.get(`/advisory/questions?${params}`);
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get single question
export const getQuestionById = async (id) => {
  try {
    const response = await API.get(`/advisory/questions/${id}`);
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get farmer's own questions
export const getMyQuestions = async () => {
  try {
    const response = await API.get('/advisory/my-questions');
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Create question
export const createQuestion = async (questionData) => {
  try {
    const response = await API.post('/advisory/questions', questionData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update question
export const updateQuestion = async (id, questionData) => {
  try {
    const response = await API.put(`/advisory/questions/${id}`, questionData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Delete question
export const deleteQuestion = async (id) => {
  try {
    const response = await API.delete(`/advisory/questions/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ============ RESPONSES ============

// Get responses for a question
export const getQuestionResponses = async (questionId) => {
  try {
    const response = await API.get(`/advisory/questions/${questionId}/responses`);
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Create response to a question
export const createResponse = async (questionId, responseData) => {
  try {
    const response = await API.post(`/advisory/questions/${questionId}/responses`, responseData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Delete response
export const deleteResponse = async (responseId) => {
  try {
    const response = await API.delete(`/advisory/responses/${responseId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};