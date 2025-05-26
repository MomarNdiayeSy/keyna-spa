import api from './api';

export const getHistory = async () => {
  const response = await api.get('/api/history');
  return response.data;
};