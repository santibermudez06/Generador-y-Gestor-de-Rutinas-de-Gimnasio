import api from './api';

export const exerciseService = {
  async getMuscleGroups() {
    return api.get('/muscle-groups');
  },

  async getExercises(params = {}) {
    return api.get('/exercises', { params });
  },

  async getExerciseById(id) {
    return api.get(`/exercises/${id}`);
  }
};

