import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Target, TrendingUp } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { apiService } from '../services/api';
import { useToast } from '../hooks/useToast';
import { Goal, GoalCreate, GoalUpdate } from '../types';
import GoalForm from '../components/goals/GoalForm';
import GoalItem from '../components/goals/GoalItem';
import LoadingSpinner from '../components/LoadingSpinner';

const GoalsPage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Check URL params for quick actions
    const action = searchParams.get('action');
    
    if (action === 'create') {
      setIsFormOpen(true);
    }

    loadGoals();
  }, [isAuthenticated, navigate, searchParams]);

  const loadGoals = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getGoals();
      setGoals(data);
    } catch (err: any) {
      error(err.response?.data?.error || 'Erro ao carregar metas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateGoal = async (data: GoalCreate | GoalUpdate) => {
    try {
      await apiService.createGoal(data as GoalCreate);
      success('Meta criada com sucesso!');
      await loadGoals();
    } catch (err: any) {
      error(err.response?.data?.error || 'Erro ao criar meta');
      throw err;
    }
  };

  const handleUpdateGoal = async (data: GoalCreate | GoalUpdate) => {
    if (!editingGoal) return;
    
    try {
      await apiService.updateGoal(editingGoal.id, data as GoalUpdate);
      success('Meta atualizada com sucesso!');
      await loadGoals();
    } catch (err: any) {
      error(err.response?.data?.error || 'Erro ao atualizar meta');
      throw err;
    }
  };

  const handleDeleteGoal = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir esta meta?')) {
      return;
    }

    try {
      await apiService.deleteGoal(id);
      success('Meta excluída com sucesso!');
      await loadGoals();
    } catch (err: any) {
      error(err.response?.data?.error || 'Erro ao excluir meta');
    }
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingGoal(null);
  };

  const getGoalsSummary = () => {
    const totalGoals = goals.length;
    const completedGoals = goals.filter(goal => 
      (goal.valor_atual / goal.valor_alvo) >= 1
    ).length;
    const totalTargetValue = goals.reduce((sum, goal) => sum + goal.valor_alvo, 0);
    const totalCurrentValue = goals.reduce((sum, goal) => sum + goal.valor_atual, 0);
    const overallProgress = totalTargetValue > 0 ? (totalCurrentValue / totalTargetValue) * 100 : 0;

    return {
      totalGoals,
      completedGoals,
      totalTargetValue,
      totalCurrentValue,
      overallProgress: Math.round(overallProgress),
    };
  };

  const summary = getGoalsSummary();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Metas Financeiras
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Defina e acompanhe seus objetivos financeiros
          </p>
        </div>
        
        <button
          onClick={() => setIsFormOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nova Meta
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6 bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-primary-600 dark:text-primary-400">
                Total de Metas
              </p>
              <p className="text-2xl font-bold text-primary-700 dark:text-primary-300">
                {summary.totalGoals}
              </p>
            </div>
            <Target className="w-8 h-8 text-primary-600" />
          </div>
        </div>

        <div className="card p-6 bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-success-600 dark:text-success-400">
                Metas Concluídas
              </p>
              <p className="text-2xl font-bold text-success-700 dark:text-success-300">
                {summary.completedGoals}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-success-600" />
          </div>
        </div>

        <div className="card p-6 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Valor Investido
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {summary.totalCurrentValue.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </p>
            </div>
            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-gray-600 dark:text-gray-400 text-sm font-bold">R$</span>
            </div>
          </div>
        </div>

        <div className="card p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                Meta Total
              </p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {summary.totalTargetValue.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </p>
            </div>
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-400 text-sm font-bold">🎯</span>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Progresso Geral
          </h2>
          <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {summary.overallProgress}%
          </span>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
          <div
            className="h-4 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500"
            style={{ width: `${summary.overallProgress}%` }}
          />
        </div>
        
        <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
          <span>R$ {summary.totalCurrentValue.toLocaleString('pt-BR')}</span>
          <span>R$ {summary.totalTargetValue.toLocaleString('pt-BR')}</span>
        </div>
      </div>

      {/* Goals List */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Suas Metas
          </h2>
          {isLoading && (
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <LoadingSpinner size="sm" />
              <span className="text-sm">Carregando...</span>
            </div>
          )}
        </div>

        {goals.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Nenhuma meta cadastrada
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Comece criando sua primeira meta financeira
            </p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="btn-primary flex items-center gap-2 mx-auto"
            >
              <Plus className="w-4 h-4" />
              Criar Primeira Meta
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {goals.map((goal) => (
              <GoalItem
                key={goal.id}
                goal={goal}
                onEdit={handleEditGoal}
                onDelete={handleDeleteGoal}
                isLoading={isLoading}
              />
            ))}
          </div>
        )}
      </div>

      {/* Goal Form Modal */}
      <GoalForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={editingGoal ? handleUpdateGoal : handleCreateGoal}
        initialData={editingGoal || undefined}
        isLoading={isLoading}
      />
    </div>
  );
};

export default GoalsPage;
