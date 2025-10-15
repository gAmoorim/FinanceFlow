import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User } from '../types';
import { apiService } from '../services/api';

interface AuthStore extends AuthState {
  login: (email: string, senha: string) => Promise<void>;
  register: (nome: string, email: string, senha: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: { nome?: string; email?: string }) => Promise<void>;
  updatePassword: (novasenha: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, senha: string) => {
        set({ isLoading: true });
        try {
          const response = await apiService.login({ email, senha });
          set({
            user: response.usuario,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.usuario));
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (nome: string, email: string, senha: string) => {
        set({ isLoading: true });
        try {
          await apiService.register({ nome, email, senha });
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      },

      updateUser: async (data: { nome?: string; email?: string }) => {
        set({ isLoading: true });
        try {
          const updatedUser = await apiService.updateUser(data);
          set({
            user: { ...get().user, ...updatedUser },
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      updatePassword: async (novasenha: string) => {
        set({ isLoading: true });
        try {
          await apiService.updatePassword({ novasenha });
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      deleteAccount: async () => {
        set({ isLoading: true });
        try {
          await apiService.deleteUser();
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      checkAuth: async () => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        
        if (token && user) {
          set({
            user: JSON.parse(user),
            token,
            isAuthenticated: true,
          });
          
          try {
            // Verificar se o token ainda é válido
            await apiService.getUser();
          } catch (error) {
            // Token inválido, fazer logout
            get().logout();
          }
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
