import React from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

interface SummaryCardProps {
  title: string;
  value: number;
  type: 'entradas' | 'saidas' | 'saldo';
  isLoading?: boolean;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ 
  title, 
  value, 
  type, 
  isLoading = false 
}) => {
  const getIcon = () => {
    switch (type) {
      case 'entradas':
        return <TrendingUp className="w-6 h-6 text-success-600" />;
      case 'saidas':
        return <TrendingDown className="w-6 h-6 text-danger-600" />;
      case 'saldo':
        return <DollarSign className="w-6 h-6 text-primary-600" />;
      default:
        return null;
    }
  };

  const getValueColor = () => {
    switch (type) {
      case 'entradas':
        return 'text-success-600 dark:text-success-400';
      case 'saidas':
        return 'text-danger-600 dark:text-danger-400';
      case 'saldo':
        return value >= 0 
          ? 'text-success-600 dark:text-success-400' 
          : 'text-danger-600 dark:text-danger-400';
      default:
        return 'text-gray-900 dark:text-white';
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'entradas':
        return 'bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800';
      case 'saidas':
        return 'bg-danger-50 dark:bg-danger-900/20 border-danger-200 dark:border-danger-800';
      case 'saldo':
        return value >= 0 
          ? 'bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800'
          : 'bg-danger-50 dark:bg-danger-900/20 border-danger-200 dark:border-danger-800';
      default:
        return 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <div className={`card p-6 ${getBgColor()} transition-all duration-200 hover:shadow-md`}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-lg bg-white dark:bg-gray-700 shadow-sm">
          {getIcon()}
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          {isLoading ? (
            <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-2"></div>
          ) : (
            <p className={`text-2xl font-bold ${getValueColor()}`}>
              {formatCurrency(value)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
