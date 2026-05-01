// src/services/forumService.js
// API calls for discussion forum

import API from './api';

// ============ FORUM POSTS ============

// Get all forum posts
export const getAllForumPosts = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters).toString();
    const response = await API.get(`/forum/posts?${params}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get single forum post
export const getForumPostById = async (id) => {
  try {
    const response = await API.get(`/forum/posts/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Record a view for a forum post (dedicated endpoint)
export const recordForumPostView = async (id) => {
  try {
    const response = await API.post(`/forum/posts/${id}/view`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get user's own forum posts
export const getMyForumPosts = async () => {
  try {
    const response = await API.get('/forum/my-posts');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Create forum post
export const createForumPost = async (postData) => {
  try {
    const response = await API.post('/forum/posts', postData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update forum post
export const updateForumPost = async (id, postData) => {
  try {
    const response = await API.put(`/forum/posts/${id}`, postData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Delete forum post
export const deleteForumPost = async (id) => {
  try {
    const response = await API.delete(`/forum/posts/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ============ FORUM COMMENTS ============

// Get comments for a post
export const getPostComments = async (postId) => {
  try {
    const response = await API.get(`/forum/posts/${postId}/comments`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Create comment
export const createComment = async (postId, commentData) => {
  try {
    const response = await API.post(`/forum/posts/${postId}/comments`, commentData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Delete comment
export const deleteComment = async (commentId) => {
  try {
    const response = await API.delete(`/forum/comments/${commentId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};