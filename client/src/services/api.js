import axios from 'axios';

// Every API call in the app goes through this one instance,
// so the base URL only needs to be set in one place.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // reads from .env
});

// Automatically attaches the login token (if one exists) to every request.
// This means protected routes work without you manually adding
// the Authorization header every time.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
