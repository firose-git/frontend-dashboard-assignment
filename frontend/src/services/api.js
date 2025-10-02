import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to add token
api.interceptors.request.use(
  (config) => {
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

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = 
      error.response?.data?.message || 
      'Something went wrong. Please try again.';
      
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    
    return Promise.reject({ message });
  }
);

// Auth API
export const register = async (name, email, password) => {
  return api.post('/auth/register', { name, email, password });
};

export const login = async (email, password) => {
  return api.post('/auth/login', { email, password });
};

export const getProfile = async () => {
  return api.get('/auth/profile');
};

export const updateProfile = async (userData) => {
  return api.put('/auth/profile', userData);
};

// Tasks API
export const getTasks = async () => {
  return api.get('/tasks');
};

export const createTask = async (taskData) => {
  return api.post('/tasks', taskData);
};

export const updateTask = async (id, taskData) => {
  return api.put(`/tasks/${id}`, taskData);
};

export const deleteTask = async (id) => {
  return api.delete(`/tasks/${id}`);
};

export const getTaskStats = async () => {
  return api.get('/tasks/stats');
};

export default api;
