import React from 'react';
import { Target, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Goal } from '../../types';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatMonthYear } from '../../utils/formatDate';

interface GoalsProgressProps {
  goals: Goal[];
  isLoading?: boolean;
}

const GoalsProgress: React.FC<GoalsProgressProps> = ({ 
  goals, 
  isLoading = false 
}) => {
  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'bg-success-500';
    if (progress >= 75) return 'bg-primary-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-danger-500';
  };

  if (isLoading) {
    return (
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Metas Financeiras
          </h2>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex justify-between items-start mb-2">
                <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
              </div>
              <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded-full mb-2"></div>
              <div className="flex justify-between">
                <div className="h-3 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="h-3 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
              </div>
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
          Metas Financeiras
        </h2>
        <Link
          to="/metas"
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nova Meta
        </Link>
      </div>

      {goals.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Nenhuma meta cadastrada
          </p>
          <Link
            to="/metas"
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Criar primeira meta
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {goals.slice(0, 3).map((goal) => {
            const progress = calculateProgress(goal.valor_atual, goal.valor_alvo);
            const isCompleted = progress >= 100;
            
            return (
              <div key={goal.id} className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {goal.titulo}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatMonthYear(goal.mes, goal.ano)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {Math.round(progress)}%
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {isCompleted ? 'Concluída!' : 'Em progresso'}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(progress)}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {formatCurrency(goal.valor_atual)}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {formatCurrency(goal.valor_alvo)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          
          {goals.length > 3 && (
            <div className="text-center pt-4">
              <Link
                to="/metas"
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors"
              >
                Ver todas as metas ({goals.length})
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GoalsProgress;
