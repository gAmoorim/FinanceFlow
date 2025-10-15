import React from 'react';
import { Edit, Trash2, Target, Calendar } from 'lucide-react';
import { Goal } from '../../types';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatMonthYear } from '../../utils/formatDate';

interface GoalItemProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (id: number) => void;
  isLoading?: boolean;
}

const GoalItem: React.FC<GoalItemProps> = ({
  goal,
  onEdit,
  onDelete,
  isLoading = false,
}) => {
  const calculateProgress = () => {
    return Math.min((goal.valor_atual / goal.valor_alvo) * 100, 100);
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'bg-success-500';
    if (progress >= 75) return 'bg-primary-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-danger-500';
  };

  const getStatusColor = (progress: number) => {
    if (progress >= 100) return 'text-success-600 dark:text-success-400';
    if (progress >= 75) return 'text-primary-600 dark:text-primary-400';
    if (progress >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-danger-600 dark:text-danger-400';
  };

  const progress = calculateProgress();
  const isCompleted = progress >= 100;
  const remainingAmount = Math.max(goal.valor_alvo - goal.valor_atual, 0);

  return (
    <div className="card p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-lg">
            <Target className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {goal.titulo}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              {formatMonthYear(goal.mes, goal.ano)}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(goal)}
            disabled={isLoading}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors duration-200 disabled:opacity-50"
            title="Editar meta"
          >
            <Edit className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => onDelete(goal.id)}
            disabled={isLoading}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-danger-600 dark:hover:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded-lg transition-colors duration-200 disabled:opacity-50"
            title="Excluir meta"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Progresso
            </span>
            <span className={`text-sm font-semibold ${getStatusColor(progress)}`}>
              {Math.round(progress)}%
            </span>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(progress)}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Values */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Valor Atual</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {formatCurrency(goal.valor_atual)}
            </p>
          </div>
          
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Valor Alvo</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {formatCurrency(goal.valor_alvo)}
            </p>
          </div>
        </div>

        {/* Status and Remaining */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              isCompleted ? 'bg-success-500' : 'bg-primary-500'
            }`} />
            <span className={`text-sm font-medium ${
              isCompleted ? 'text-success-600 dark:text-success-400' : 'text-primary-600 dark:text-primary-400'
            }`}>
              {isCompleted ? 'Meta Concluída!' : 'Em Progresso'}
            </span>
          </div>
          
          {!isCompleted && (
            <div className="text-right">
              <p className="text-xs text-gray-500 dark:text-gray-400">Faltam</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {formatCurrency(remainingAmount)}
              </p>
            </div>
          )}
        </div>

        {/* Completion Celebration */}
        {isCompleted && (
          <div className="bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-lg p-3">
            <div className="flex items-center gap-2 text-success-700 dark:text-success-300">
              <span className="text-lg">🎉</span>
              <span className="text-sm font-medium">
                Parabéns! Você atingiu sua meta!
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalItem;
