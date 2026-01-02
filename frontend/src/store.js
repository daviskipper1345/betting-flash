import { create } from 'zustand';
import { authAPI } from './api';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  register: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await authAPI.register(formData);
      localStorage.setItem('token', data.token);
      set({ user: data.user, token: data.token, isLoading: false });
      return data;
    } catch (error) {
      const message = error.response?.data?.error || 'Registration failed';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await authAPI.login(email, password);
      localStorage.setItem('token', data.token);
      set({ user: data.user, token: data.token, isLoading: false });
      return data;
    } catch (error) {
      const message = error.response?.data?.error || 'Login failed';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, error: null });
  },

  loadUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    set({ isLoading: true });
    try {
      const { data } = await authAPI.getProfile();
      set({ user: data, token, isLoading: false });
    } catch (error) {
      localStorage.removeItem('token');
      set({ token: null, isLoading: false });
    }
  }
}));

export const useWalletStore = create((set) => ({
  wallet: null,
  isLoading: false,
  error: null,

  fetchWallet: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await walletAPI.getWallet();
      set({ wallet: data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  }
}));
