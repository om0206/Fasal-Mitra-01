import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const apiService = {
  // Get crop advisory with weather integration
  getAdvisory: async (cropType: string, growthStage: string, latitude?: number, longitude?: number) => {
    try {
      const response = await api.post('/advisor', {
        crop_type: cropType,
        growth_stage: growthStage,
        latitude: latitude || null,
        longitude: longitude || null,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching advisory:', error);
      throw error;
    }
  },

  // Get all available crops
  getCrops: async () => {
    try {
      const response = await api.get('/crops');
      return response.data;
    } catch (error) {
      console.error('Error fetching crops:', error);
      throw error;
    }
  },

  // Get weather data for location
  getWeather: async (latitude: number, longitude: number) => {
    try {
      const response = await api.post('/weather', {
        latitude,
        longitude,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching weather:', error);
      throw error;
    }
  },

  // Get advisory history
  getAdvisoryHistory: async (cropType?: string) => {
    try {
      const params = cropType ? { crop_type: cropType } : {};
      const response = await api.get('/history/advisories', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching advisory history:', error);
      throw error;
    }
  },

  // Get alert history
  getAlertHistory: async () => {
    try {
      const response = await api.get('/history/alerts');
      return response.data;
    } catch (error) {
      console.error('Error fetching alert history:', error);
      throw error;
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Error health check:', error);
      throw error;
    }
  },
};

export default api;
