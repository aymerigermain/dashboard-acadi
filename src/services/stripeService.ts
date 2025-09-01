import axios from 'axios';
import type { ApiResponse, DashboardStats, Payment } from '../types';

const API_BASE_URL = '/api';
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Server connection failed. Please ensure the server is running.');
    }
    throw error;
  }
);

export const stripeService = {
  async getStats(): Promise<DashboardStats> {
    try {
      const endpoint = USE_MOCK_DATA ? '/mock-data' : '/stats';
      const response = await api.get<ApiResponse<DashboardStats>>(endpoint);
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to fetch statistics');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(`API Error: ${error.message}`);
      }
      throw error;
    }
  },

  async getPayments(params?: {
    startDate?: string;
    endDate?: string;
    limit?: number;
  }): Promise<Payment[]> {
    try {
      const response = await api.get<ApiResponse<Payment[]>>('/payments', {
        params
      });
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to fetch payments');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('Error fetching payments:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(`API Error: ${error.message}`);
      }
      throw error;
    }
  },

  async healthCheck(): Promise<boolean> {
    try {
      const response = await api.get('/health');
      return response.data.status === 'OK';
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
};