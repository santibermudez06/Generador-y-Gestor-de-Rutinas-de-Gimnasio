import api from './api';

export const routineService = {
  async getRoutines(params = {}) {
    return api.get('/routines', { params });
  },

  async getRoutineById(id) {
    return api.get(`/routines/${id}`);
  },

  async createRoutine(data) {
    return api.post('/routines', data);
  },

  async updateRoutine(id, data) {
    return api.put(`/routines/${id}`, data);
  },

  async deleteRoutine(id) {
    return api.delete(`/routines/${id}`);
  },

  async duplicateRoutine(id) {
    return api.post(`/routines/${id}/duplicate`);
  },

  async addExercise(routineId, data) {
    return api.post(`/routines/${routineId}/exercises`, data);
  },

  async updateExercise(routineId, exerciseId, data) {
    return api.put(`/routines/${routineId}/exercises/${exerciseId}`, data);
  },

  async removeExercise(routineId, exerciseId) {
    return api.delete(`/routines/${routineId}/exercises/${exerciseId}`);
  }
};

