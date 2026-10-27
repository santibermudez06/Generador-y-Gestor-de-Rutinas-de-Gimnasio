import api from './api';

export const statsService = {
  async getDashboardStats() {
    return api.get('/stats/dashboard');
  },

  async getProgressStats(params = {}) {
    return api.get('/stats/progress', { params });
  },

  async getExerciseStats(exerciseId) {
    return api.get(`/stats/exercises/${exerciseId}`);
  }
};

