import React from 'react';
import { Plus, TrendingUp, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Transaction } from '../../types';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

interface RecentTransactionsProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ 
  transactions, 
  isLoading = false 
}) => {
  const getTransactionIcon = (type: 'entrada' | 'despesa') => {
    return type === 'entrada' ? (
      <TrendingUp className="w-4 h-4 text-success-600" />
    ) : (
      <TrendingDown className="w-4 h-4 text-danger-600" />
    );
  };

  const getTransactionColor = (type: 'entrada' | 'despesa') => {
    return type === 'entrada' 
      ? 'text-success-600 dark:text-success-400' 
      : 'text-danger-600 dark:text-danger-400';
  };

  if (isLoading) {
    return (
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Transações Recentes
          </h2>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                <div>
                  <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                  <div className="h-3 w-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
                </div>
              </div>
              <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Transações Recentes
        </h2>
        <Link
          to="/transacoes"
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nova Transação
        </Link>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Nenhuma transação encontrada
          </p>
          <Link
            to="/transacoes"
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Adicionar primeira transação
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.slice(0, 5).map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white dark:bg-gray-600 rounded-lg shadow-sm">
                  {getTransactionIcon(transaction.tipo)}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {transaction.descricao}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(transaction.data)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${getTransactionColor(transaction.tipo)}`}>
                  {transaction.tipo === 'entrada' ? '+' : '-'}
                  {formatCurrency(transaction.valor)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {transaction.tipo}
                </p>
              </div>
            </div>
          ))}
          
          {transactions.length > 5 && (
            <div className="text-center pt-4">
              <Link
                to="/transacoes"
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors"
              >
                Ver todas as transações ({transactions.length})
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;
