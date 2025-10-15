import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { GoalCreate, GoalUpdate, Goal } from '../../types';
import LoadingSpinner from '../LoadingSpinner';

interface GoalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GoalCreate | GoalUpdate) => Promise<void>;
  initialData?: Partial<GoalCreate> | Goal;
  isLoading?: boolean;
}

const GoalForm: React.FC<GoalFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GoalCreate>({
    defaultValues: initialData,
  });

  useEffect(() => {
    if (isOpen && initialData) {
      reset(initialData);
    } else if (isOpen) {
      reset({ 
        titulo: '', 
        valor_atual: 0, 
        valor_alvo: 0, 
        mes: new Date().getMonth() + 1, 
        ano: new Date().getFullYear() 
      });
    }
  }, [isOpen, initialData, reset]);

  const handleFormSubmit = async (data: GoalCreate) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const getMonthOptions = () => {
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    return months.map((month, index) => (
      <option key={index + 1} value={index + 1}>
        {month}
      </option>
    ));
  };

  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    
    for (let year = currentYear; year <= currentYear + 5; year++) {
      years.push(year);
    }
    
    return years.map(year => (
      <option key={year} value={year}>
        {year}
      </option>
    ));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {initialData ? 'Editar Meta' : 'Nova Meta'}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
          <div>
            <label className="label">Título da Meta</label>
            <input
              type="text"
              className={`input-field ${errors.titulo ? 'border-danger-500' : ''}`}
              placeholder="Ex: Viagem para Europa, Carro novo..."
              {...register('titulo', {
                required: 'Título é obrigatório',
                minLength: {
                  value: 3,
                  message: 'Título deve ter pelo menos 3 caracteres',
                },
              })}
            />
            {errors.titulo && (
              <p className="error-message">{errors.titulo.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Valor Atual</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className={`input-field ${errors.valor_atual ? 'border-danger-500' : ''}`}
                placeholder="0,00"
                {...register('valor_atual', {
                  required: 'Valor atual é obrigatório',
                  min: {
                    value: 0,
                    message: 'Valor atual não pode ser negativo',
                  },
                  valueAsNumber: true,
                })}
              />
              {errors.valor_atual && (
                <p className="error-message">{errors.valor_atual.message}</p>
              )}
            </div>

            <div>
              <label className="label">Valor Alvo</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                className={`input-field ${errors.valor_alvo ? 'border-danger-500' : ''}`}
                placeholder="0,00"
                {...register('valor_alvo', {
                  required: 'Valor alvo é obrigatório',
                  min: {
                    value: 0.01,
                    message: 'Valor alvo deve ser maior que zero',
                  },
                  valueAsNumber: true,
                })}
              />
              {errors.valor_alvo && (
                <p className="error-message">{errors.valor_alvo.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Mês</label>
              <select
                className={`input-field ${errors.mes ? 'border-danger-500' : ''}`}
                {...register('mes', {
                  required: 'Mês é obrigatório',
                  valueAsNumber: true,
                })}
              >
                {getMonthOptions()}
              </select>
              {errors.mes && (
                <p className="error-message">{errors.mes.message}</p>
              )}
            </div>

            <div>
              <label className="label">Ano</label>
              <select
                className={`input-field ${errors.ano ? 'border-danger-500' : ''}`}
                {...register('ano', {
                  required: 'Ano é obrigatório',
                  valueAsNumber: true,
                })}
              >
                {getYearOptions()}
              </select>
              {errors.ano && (
                <p className="error-message">{errors.ano.message}</p>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="btn-secondary flex-1"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary flex-1 flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" />
                  Salvando...
                </>
              ) : (
                `${initialData ? 'Atualizar' : 'Criar'} Meta`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalForm;
