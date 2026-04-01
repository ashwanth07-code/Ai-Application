import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.data);
      
      // Handle 401 unauthorized
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } else if (error.request) {
      // Request was made but no response
      console.error('No response from server');
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export const chatAPI = {
  sendMessage: (message) => api.post('/chat', { message }),
};

export const spamAPI = {
  checkEmail: (email) => api.post('/spam-check', { email }),
};

export const speechAPI = {
  transcribe: (audioFile) => {
    const formData = new FormData();
    formData.append('audio', audioFile);
    return api.post('/speech-to-text', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const qaAPI = {
  ask: (question, context) => api.post('/qa', { question, context }),
};

export default api;