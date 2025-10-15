export interface User {
  id: number;
  nome: string;
  email: string;
  criado_em: string;
}

export interface AuthUser {
  usuario: User;
  token: string;
}

export interface Transaction {
  id: number;
  descricao: string;
  valor: number;
  tipo: 'entrada' | 'despesa';
  data: string;
  usuario_id: number;
}

export interface TransactionCreate {
  descricao: string;
  valor: number;
  tipo: 'entrada' | 'despesa';
}

export interface TransactionUpdate {
  descricao?: string;
  valor?: number;
  tipo?: 'entrada' | 'despesa';
}

export interface TransactionFilters {
  data_inicio?: string;
  data_fim?: string;
  tipo?: 'entrada' | 'despesa';
}

export interface TransactionSummary {
  entradas: number;
  saidas: number;
  saldo: number;
}

export interface Goal {
  id: number;
  titulo: string;
  valor_atual: number;
  valor_alvo: number;
  mes: number;
  ano: number;
  usuario_id: number;
  criado_em: string;
  atualizado_em: string;
}

export interface GoalCreate {
  titulo: string;
  valor_atual: number;
  valor_alvo: number;
  mes: number;
  ano: number;
}

export interface GoalUpdate {
  titulo?: string;
  valor_atual?: number;
  valor_alvo?: number;
  mes?: number;
  ano?: number;
}

export interface ApiResponse<T> {
  data?: T;
  mensagem?: string;
  error?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AppState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  duration?: number;
}
