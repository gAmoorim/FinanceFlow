import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { apiService } from '../services/api';
import { useToast } from '../hooks/useToast';
import { TransactionSummary, Transaction, Goal } from '../types';
import SummaryCard from '../components/dashboard/SummaryCard';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import GoalsProgress from '../components/dashboard/GoalsProgress';
import LoadingSpinner from '../components/LoadingSpinner';

const DashboardPage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const { error } = useToast();
  const navigate = useNavigate();
  
  const [summary, setSummary] = useState<TransactionSummary | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    loadDashboardData();
  }, [isAuthenticated, navigate]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      const [summaryData, transactionsData, goalsData] = await Promise.all([
        apiService.getTransactionSummary(),
        apiService.getTransactions(),
        apiService.getGoals(),
      ]);

      setSummary(summaryData);
      setRecentTransactions(transactionsData);
      setGoals(goalsData);
    } catch (err: any) {
      error(err.response?.data?.error || 'Erro ao carregar dados do dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Visão geral das suas finanças
          </p>
        </div>
        
        {isLoading && (
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <LoadingSpinner size="sm" />
            <span className="text-sm">Carregando...</span>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SummaryCard
          title="Total de Entradas"
          value={summary?.entradas || 0}
          type="entradas"
          isLoading={isLoading}
        />
        <SummaryCard
          title="Total de Saídas"
          value={summary?.saidas || 0}
          type="saidas"
          isLoading={isLoading}
        />
        <SummaryCard
          title="Saldo Atual"
          value={summary?.saldo || 0}
          type="saldo"
          isLoading={isLoading}
        />
      </div>

      {/* Charts and Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentTransactions 
          transactions={recentTransactions} 
          isLoading={isLoading} 
        />
        <GoalsProgress 
          goals={goals} 
          isLoading={isLoading} 
        />
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Ações Rápidas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/transacoes?action=create&type=entrada')}
            className="p-4 bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-lg hover:bg-success-100 dark:hover:bg-success-900/30 transition-colors duration-200"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-success-100 dark:bg-success-800 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-success-600 dark:text-success-400 font-bold text-xl">+</span>
              </div>
              <h3 className="font-medium text-gray-900 dark:text-white">Nova Receita</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Adicionar entrada</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/transacoes?action=create&type=despesa')}
            className="p-4 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-lg hover:bg-danger-100 dark:hover:bg-danger-900/30 transition-colors duration-200"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-danger-100 dark:bg-danger-800 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-danger-600 dark:text-danger-400 font-bold text-xl">-</span>
              </div>
              <h3 className="font-medium text-gray-900 dark:text-white">Nova Despesa</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Registrar gasto</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/metas?action=create')}
            className="p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors duration-200"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary-600 dark:text-primary-400 font-bold text-lg">🎯</span>
              </div>
              <h3 className="font-medium text-gray-900 dark:text-white">Nova Meta</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Definir objetivo</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/transacoes')}
            className="p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-gray-600 dark:text-gray-400 font-bold text-lg">📊</span>
              </div>
              <h3 className="font-medium text-gray-900 dark:text-white">Relatórios</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Ver análises</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
