import API from './api';

export const sendMessage = async ({ receiver_id, message_text, subject }) => {
  try {
    const response = await API.post('/messages', { receiver_id, message_text, subject });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getConversations = async () => {
  try {
    const response = await API.get('/messages/conversations');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getMessageThread = async (userId) => {
  try {
    const response = await API.get(`/messages/thread/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getUnreadCount = async () => {
  try {
    const response = await API.get('/messages/unread-count');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const markMessagesAsRead = async (userId) => {
  try {
    const response = await API.patch(`/messages/read/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
