import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { TransactionCreate, TransactionUpdate, Transaction } from '../../types';
import LoadingSpinner from '../LoadingSpinner';

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TransactionCreate | TransactionUpdate) => Promise<void>;
  initialData?: Partial<TransactionCreate> | Transaction;
  isLoading?: boolean;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
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
    watch,
    formState: { errors },
  } = useForm<TransactionCreate>({
    defaultValues: initialData,
  });

  const tipo = watch('tipo');

  useEffect(() => {
    if (isOpen && initialData) {
      reset(initialData);
    } else if (isOpen) {
      reset({ descricao: '', valor: 0, tipo: 'entrada' });
    }
  }, [isOpen, initialData, reset]);

  const handleFormSubmit = async (data: TransactionCreate) => {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {initialData ? 'Nova Receita' : 'Nova Transação'}
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
            <label className="label">Descrição</label>
            <input
              type="text"
              className={`input-field ${errors.descricao ? 'border-danger-500' : ''}`}
              placeholder="Ex: Salário, Aluguel, Compras..."
              {...register('descricao', {
                required: 'Descrição é obrigatória',
                minLength: {
                  value: 3,
                  message: 'Descrição deve ter pelo menos 3 caracteres',
                },
              })}
            />
            {errors.descricao && (
              <p className="error-message">{errors.descricao.message}</p>
            )}
          </div>

          <div>
            <label className="label">Valor</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className={`input-field ${errors.valor ? 'border-danger-500' : ''}`}
              placeholder="0,00"
              {...register('valor', {
                required: 'Valor é obrigatório',
                min: {
                  value: 0.01,
                  message: 'Valor deve ser maior que zero',
                },
                valueAsNumber: true,
              })}
            />
            {errors.valor && (
              <p className="error-message">{errors.valor.message}</p>
            )}
          </div>

          <div>
            <label className="label">Tipo</label>
            <div className="grid grid-cols-2 gap-4">
              <label className={`relative cursor-pointer rounded-lg p-4 border-2 transition-all duration-200 ${
                tipo === 'entrada'
                  ? 'border-success-500 bg-success-50 dark:bg-success-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-success-300'
              }`}>
                <input
                  type="radio"
                  value="entrada"
                  className="sr-only"
                  {...register('tipo', { required: 'Tipo é obrigatório' })}
                />
                <div className="text-center">
                  <div className="text-2xl mb-2">💰</div>
                  <div className="font-medium text-gray-900 dark:text-white">Entrada</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Receita</div>
                </div>
              </label>

              <label className={`relative cursor-pointer rounded-lg p-4 border-2 transition-all duration-200 ${
                tipo === 'despesa'
                  ? 'border-danger-500 bg-danger-50 dark:bg-danger-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-danger-300'
              }`}>
                <input
                  type="radio"
                  value="despesa"
                  className="sr-only"
                  {...register('tipo', { required: 'Tipo é obrigatório' })}
                />
                <div className="text-center">
                  <div className="text-2xl mb-2">💸</div>
                  <div className="font-medium text-gray-900 dark:text-white">Despesa</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Gasto</div>
                </div>
              </label>
            </div>
            {errors.tipo && (
              <p className="error-message">{errors.tipo.message}</p>
            )}
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
              className={`${
                tipo === 'entrada' ? 'btn-success' : 'btn-danger'
              } flex-1 flex items-center justify-center gap-2`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" />
                  Salvando...
                </>
              ) : (
                `${initialData ? 'Atualizar' : 'Adicionar'} ${tipo === 'entrada' ? 'Receita' : 'Despesa'}`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
