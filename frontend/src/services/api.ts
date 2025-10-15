import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  AuthUser, 
  User, 
  Transaction, 
  TransactionCreate, 
  TransactionUpdate, 
  TransactionFilters, 
  TransactionSummary,
  Goal,
  GoalCreate,
  GoalUpdate
} from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: 'http://localhost:1000', // Ajuste conforme necessário
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para adicionar token nas requisições
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor para lidar com respostas
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async register(data: { nome: string; email: string; senha: string }): Promise<AuthUser> {
    const response: AxiosResponse<AuthUser> = await this.api.post('/cadastro', data);
    return response.data;
  }

  async login(data: { email: string; senha: string }): Promise<AuthUser> {
    const response: AxiosResponse<AuthUser> = await this.api.post('/login', data);
    return response.data;
  }

  async getUser(): Promise<User> {
    const response: AxiosResponse<User> = await this.api.get('/usuario');
    return response.data;
  }

  async updateUser(data: { nome?: string; email?: string }): Promise<User> {
    const response: AxiosResponse<User> = await this.api.put('/usuario', data);
    return response.data;
  }

  async updatePassword(data: { novasenha: string }): Promise<void> {
    await this.api.put('/atualizarsenha', data);
  }

  async deleteUser(): Promise<void> {
    await this.api.delete('/usuario');
  }

  // Transaction endpoints
  async getTransactions(filters?: TransactionFilters): Promise<Transaction[]> {
    const response: AxiosResponse<Transaction[]> = await this.api.get('/transacoes', {
      params: filters,
    });
    return response.data;
  }

  async getTransaction(id: number): Promise<Transaction> {
    const response: AxiosResponse<Transaction> = await this.api.get(`/transacoes/${id}`);
    return response.data;
  }

  async createTransaction(data: TransactionCreate): Promise<Transaction> {
    const response: AxiosResponse<Transaction> = await this.api.post('/transacoes', data);
    return response.data;
  }

  async updateTransaction(id: number, data: TransactionUpdate): Promise<Transaction> {
    const response: AxiosResponse<Transaction> = await this.api.put(`/transacoes/${id}`, data);
    return response.data;
  }

  async deleteTransaction(id: number): Promise<void> {
    await this.api.delete(`/transacoes/${id}`);
  }

  async getTransactionSummary(): Promise<TransactionSummary> {
    const response: AxiosResponse<TransactionSummary> = await this.api.get('/transacoes/resumo');
    return response.data;
  }

  // Goal endpoints
  async getGoals(): Promise<Goal[]> {
    const response: AxiosResponse<{ metas: Goal[] }> = await this.api.get('/metas');
    return response.data.metas;
  }

  async createGoal(data: GoalCreate): Promise<Goal> {
    const response: AxiosResponse<{ meta: Goal }> = await this.api.post('/metas', data);
    return response.data.meta;
  }

  async updateGoal(id: number, data: GoalUpdate): Promise<Goal> {
    const response: AxiosResponse<{ meta: Goal }> = await this.api.put(`/metas/${id}`, data);
    return response.data.meta;
  }

  async deleteGoal(id: number): Promise<void> {
    await this.api.delete(`/metas/${id}`);
  }
}

export const apiService = new ApiService();
export default apiService;
