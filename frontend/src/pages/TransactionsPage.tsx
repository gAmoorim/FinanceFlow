import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, TrendingUp, TrendingDown } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { apiService } from '../services/api';
import { useToast } from '../hooks/useToast';
import { Transaction, TransactionCreate, TransactionUpdate, TransactionFilters } from '../types';
import TransactionForm from '../components/transactions/TransactionForm';
import TransactionFiltersComponent from '../components/transactions/TransactionFilters';
import TransactionItem from '../components/transactions/TransactionItem';
import LoadingSpinner from '../components/LoadingSpinner';

const TransactionsPage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [filters, setFilters] = useState<TransactionFilters>({});

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Check URL params for quick actions
    const action = searchParams.get('action');
    const type = searchParams.get('type');
    
    if (action === 'create') {
      setIsFormOpen(true);
      if (type) {
        setEditingTransaction({ 
          descricao: '', 
          valor: 0, 
          tipo: type as 'entrada' | 'despesa' 
        } as Transaction);
      }
    }

    loadTransactions();
  }, [isAuthenticated, navigate, searchParams, filters]);

  const loadTransactions = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getTransactions(filters);
      setTransactions(data);
    } catch (err: any) {
      error(err.response?.data?.error || 'Erro ao carregar transações');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTransaction = async (data: TransactionCreate | TransactionUpdate) => {
    try {
      await apiService.createTransaction(data as TransactionCreate);
      success('Transação criada com sucesso!');
      await loadTransactions();
    } catch (err: any) {
      error(err.response?.data?.error || 'Erro ao criar transação');
      throw err;
    }
  };

  const handleUpdateTransaction = async (data: TransactionCreate | TransactionUpdate) => {
    if (!editingTransaction) return;
    
    try {
      await apiService.updateTransaction(editingTransaction.id, data as TransactionUpdate);
      success('Transação atualizada com sucesso!');
      await loadTransactions();
    } catch (err: any) {
      error(err.response?.data?.error || 'Erro ao atualizar transação');
      throw err;
    }
  };

  const handleDeleteTransaction = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir esta transação?')) {
      return;
    }

    try {
      await apiService.deleteTransaction(id);
      success('Transação excluída com sucesso!');
      await loadTransactions();
    } catch (err: any) {
      error(err.response?.data?.error || 'Erro ao excluir transação');
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTransaction(null);
  };

  const handleFiltersChange = (newFilters: TransactionFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const getTransactionSummary = () => {
    const entradas = transactions
      .filter(t => t.tipo === 'entrada')
      .reduce((acc, t) => acc + t.valor, 0);
    
    const despesas = transactions
      .filter(t => t.tipo === 'despesa')
      .reduce((acc, t) => acc + t.valor, 0);

    return { entradas, despesas, saldo: entradas - despesas };
  };

  const summary = getTransactionSummary();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Transações
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Gerencie suas receitas e despesas
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => {
              setEditingTransaction({ descricao: '', valor: 0, tipo: 'entrada' } as Transaction);
              setIsFormOpen(true);
            }}
            className="btn-success flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            Nova Receita
          </button>
          
          <button
            onClick={() => {
              setEditingTransaction({ descricao: '', valor: 0, tipo: 'despesa' } as Transaction);
              setIsFormOpen(true);
            }}
            className="btn-danger flex items-center gap-2"
          >
            <TrendingDown className="w-4 h-4" />
            Nova Despesa
          </button>
          
          <button
            onClick={() => setIsFormOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nova Transação
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-success-600 dark:text-success-400">
                Total de Entradas
              </p>
              <p className="text-2xl font-bold text-success-700 dark:text-success-300">
                {summary.entradas.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-success-600" />
          </div>
        </div>

        <div className="card p-6 bg-danger-50 dark:bg-danger-900/20 border-danger-200 dark:border-danger-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-danger-600 dark:text-danger-400">
                Total de Despesas
              </p>
              <p className="text-2xl font-bold text-danger-700 dark:text-danger-300">
                {summary.despesas.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </p>
            </div>
            <TrendingDown className="w-8 h-8 text-danger-600" />
          </div>
        </div>

        <div className={`card p-6 ${
          summary.saldo >= 0 
            ? 'bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800'
            : 'bg-danger-50 dark:bg-danger-900/20 border-danger-200 dark:border-danger-800'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${
                summary.saldo >= 0 
                  ? 'text-success-600 dark:text-success-400'
                  : 'text-danger-600 dark:text-danger-400'
              }`}>
                Saldo
              </p>
              <p className={`text-2xl font-bold ${
                summary.saldo >= 0 
                  ? 'text-success-700 dark:text-success-300'
                  : 'text-danger-700 dark:text-danger-300'
              }`}>
                {summary.saldo.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </p>
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              summary.saldo >= 0 ? 'bg-success-100 dark:bg-success-800' : 'bg-danger-100 dark:bg-danger-800'
            }`}>
              <span className={`text-lg ${
                summary.saldo >= 0 ? 'text-success-600' : 'text-danger-600'
              }`}>
                {summary.saldo >= 0 ? '💰' : '💸'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <TransactionFiltersComponent
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
      />

      {/* Transactions List */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Lista de Transações
          </h2>
          {isLoading && (
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <LoadingSpinner size="sm" />
              <span className="text-sm">Carregando...</span>
            </div>
          )}
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Nenhuma transação encontrada
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Comece adicionando sua primeira transação
            </p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="btn-primary flex items-center gap-2 mx-auto"
            >
              <Plus className="w-4 h-4" />
              Adicionar Transação
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                onEdit={handleEditTransaction}
                onDelete={handleDeleteTransaction}
                isLoading={isLoading}
              />
            ))}
          </div>
        )}
      </div>

      {/* Transaction Form Modal */}
      <TransactionForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={editingTransaction ? handleUpdateTransaction : handleCreateTransaction}
        initialData={editingTransaction || undefined}
        isLoading={isLoading}
      />
    </div>
  );
};

export default TransactionsPage;
