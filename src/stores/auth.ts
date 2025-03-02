// src/stores/auth.ts
import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import { Router } from 'vue-router';
import { Notify } from 'quasar';

interface AuthState {
  token: string | null;
  loading: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem('token'),
    loading: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async login(credentials: { username: string; password: string }) {
      this.loading = true;
      try {
        // Convert to form data as expected by PHPMaker
        const formData = new URLSearchParams();
        formData.append('username', credentials.username);
        formData.append('password', credentials.password);

        const { data } = await api.post('/UAC/api/login', formData);

        if (data.JWT) {
          this.setAuthData(data.JWT);
          this.token = data.JWT;
          Notify.create({
            type: 'positive',
            message: 'Login successful',
            position: 'top',
          });
          return true;
        }
        throw new Error('Login failed');
      } catch (error) {
        Notify.create({
          type: 'negative',
          message: 'Login failed',
          position: 'top',
        });
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async logout() {
      try {
        // Call logout API if needed
        // await api.post('/api/logout');

        // Clear local auth data
        this.clearAuthData();

        // Optional: Clear other stores/state
        // Reset any other app state here

        return true;
      } catch (error) {
        console.error('Logout error:', error);
        throw error;
      }
    },
    setAuthData(token: string) {
      this.token = token;
      localStorage.setItem('token', token);
      // Use X-Authorization as specified by PHPMaker
      api.defaults.headers.common['X-Authorization'] = `Bearer ${token}`;
    },

    clearAuthData() {
      this.token = null;
      localStorage.removeItem('token');
      delete api.defaults.headers.common['X-Authorization'];
    },
  },
});
