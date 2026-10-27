import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  withCredentials: true, // Envía cookies HttpOnly en cada petición
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adjuntar token Bearer si existe en localStorage (complemento de cookies)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('forge_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para normalizar mensajes de error de la API
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      (error.response?.data?.errors ? error.response.data.errors.join(', ') : null) ||
      error.message ||
      'Error de comunicación con el servidor';

    const customError = new Error(message);
    customError.statusCode = error.response?.status || 500;
    customError.data = error.response?.data;
    return Promise.reject(customError);
  }
);

export default api;

