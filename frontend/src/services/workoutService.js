import api from './api';

export const workoutService = {
  async getWorkouts(params = {}) {
    return api.get('/workouts', { params });
  },

  async getActiveWorkout() {
    return api.get('/workouts/active');
  },

  async getWorkoutById(id) {
    return api.get(`/workouts/${id}`);
  },

  async createWorkout(data) {
    return api.post('/workouts', data);
  },

  async updateWorkout(id, data) {
    return api.put(`/workouts/${id}`, data);
  },

  async addSet(workoutId, setData) {
    return api.post(`/workouts/${workoutId}/sets`, setData);
  },

  async updateSet(workoutId, setId, setData) {
    return api.put(`/workouts/${workoutId}/sets/${setId}`, setData);
  },

  async deleteSet(workoutId, setId) {
    return api.delete(`/workouts/${workoutId}/sets/${setId}`);
  },

  async finishWorkout(workoutId, finishData = {}) {
    return api.post(`/workouts/${workoutId}/finish`, finishData);
  }
};

