import React from 'react';
import { Edit, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { Transaction } from '../../types';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

interface TransactionItemProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: number) => void;
  isLoading?: boolean;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onEdit,
  onDelete,
  isLoading = false,
}) => {
  const getTransactionIcon = () => {
    return transaction.tipo === 'entrada' ? (
      <TrendingUp className="w-5 h-5 text-success-600" />
    ) : (
      <TrendingDown className="w-5 h-5 text-danger-600" />
    );
  };

  const getTransactionColor = () => {
    return transaction.tipo === 'entrada'
      ? 'text-success-600 dark:text-success-400'
      : 'text-danger-600 dark:text-danger-400';
  };

  const getTransactionBgColor = () => {
    return transaction.tipo === 'entrada'
      ? 'bg-success-50 dark:bg-success-900/20'
      : 'bg-danger-50 dark:bg-danger-900/20';
  };

  return (
    <div className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
      transaction.tipo === 'entrada'
        ? 'border-success-200 dark:border-success-800 bg-success-50 dark:bg-success-900/10'
        : 'border-danger-200 dark:border-danger-800 bg-danger-50 dark:bg-danger-900/10'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-lg ${getTransactionBgColor()}`}>
            {getTransactionIcon()}
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">
              {transaction.descricao}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatDate(transaction.data)}
            </p>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
              transaction.tipo === 'entrada'
                ? 'bg-success-100 dark:bg-success-800 text-success-700 dark:text-success-300'
                : 'bg-danger-100 dark:bg-danger-800 text-danger-700 dark:text-danger-300'
            }`}>
              {transaction.tipo === 'entrada' ? 'Receita' : 'Despesa'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className={`text-lg font-semibold ${getTransactionColor()}`}>
              {transaction.tipo === 'entrada' ? '+' : '-'}
              {formatCurrency(transaction.valor)}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onEdit(transaction)}
              disabled={isLoading}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors duration-200 disabled:opacity-50"
              title="Editar transação"
            >
              <Edit className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => onDelete(transaction.id)}
              disabled={isLoading}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-danger-600 dark:hover:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded-lg transition-colors duration-200 disabled:opacity-50"
              title="Excluir transação"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;
