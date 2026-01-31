import axios from 'axios';
import { useAuthStore } from '../hooks/useAuthStore';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },
  logout: async () => {
    await api.post('/auth/logout');
  },
};

// Proposals API
export const proposalsApi = {
  list: async () => {
    const { data } = await api.get('/proposals');
    return data;
  },
  get: async (id: number) => {
    const { data } = await api.get(`/proposals/${id}`);
    return data;
  },
  create: async (proposal: any) => {
    const { data } = await api.post('/proposals', proposal);
    return data;
  },
  update: async (id: number, proposal: any) => {
    const { data } = await api.put(`/proposals/${id}`, proposal);
    return data;
  },
  submit: async (id: number) => {
    const { data } = await api.post(`/proposals/${id}/submit`);
    return data;
  },
};

// Dashboard API
export const dashboardApi = {
  getKPIs: async () => {
    const { data } = await api.get('/dashboard');
    return data;
  },
};
