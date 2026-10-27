import api from './api';

export const authService = {
  async register(data) {
    const res = await api.post('/auth/register', data);
    if (res.token) {
      localStorage.setItem('forge_token', res.token);
    }
    return res;
  },

  async login(credentials) {
    const res = await api.post('/auth/login', credentials);
    if (res.token) {
      localStorage.setItem('forge_token', res.token);
    }
    return res;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('forge_token');
    }
  },

  async getMe() {
    return api.get('/auth/me');
  },

  async updatePreferences(data) {
    return api.put('/auth/preferences', data);
  }
};

