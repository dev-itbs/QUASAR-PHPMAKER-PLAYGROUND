// src/boot/axios.ts
import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

// ✅ Use Vite-compatible environment variable access
const baseURL = import.meta.env.VITE_API_URL || '';
console.log('API Base URL:', baseURL);

const api = axios.create({ baseURL });

// ✅ Only add the Authorization token if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['X-Authorization'] = token; // ✅ Ensuring only valid tokens are set
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { api };
