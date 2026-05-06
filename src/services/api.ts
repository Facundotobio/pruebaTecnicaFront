import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7136/api',   // ← Asegúrate que el puerto coincida con tu Backend
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores comunes
api.interceptors.response.use(
  response => response,
  error => {
    console.error('Error en la API:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;