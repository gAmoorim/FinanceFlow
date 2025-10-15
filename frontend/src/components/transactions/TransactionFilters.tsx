import React from 'react';
import { Calendar, Filter, X } from 'lucide-react';
import { TransactionFilters } from '../../types';

interface TransactionFiltersProps {
  filters: TransactionFilters;
  onFiltersChange: (filters: TransactionFilters) => void;
  onClearFilters: () => void;
}

const TransactionFiltersComponent: React.FC<TransactionFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  const hasActiveFilters = filters.data_inicio || filters.data_fim || filters.tipo;

  const handleFilterChange = (key: keyof TransactionFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined,
    });
  };

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        <h3 className="font-semibold text-gray-900 dark:text-white">Filtros</h3>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="ml-auto flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            <X className="w-4 h-4" />
            Limpar filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="label">
            <Calendar className="w-4 h-4 inline mr-1" />
            Data Início
          </label>
          <input
            type="date"
            className="input-field"
            value={filters.data_inicio || ''}
            onChange={(e) => handleFilterChange('data_inicio', e.target.value)}
          />
        </div>

        <div>
          <label className="label">
            <Calendar className="w-4 h-4 inline mr-1" />
            Data Fim
          </label>
          <input
            type="date"
            className="input-field"
            value={filters.data_fim || ''}
            onChange={(e) => handleFilterChange('data_fim', e.target.value)}
          />
        </div>

        <div>
          <label className="label">Tipo</label>
          <select
            className="input-field"
            value={filters.tipo || ''}
            onChange={(e) => handleFilterChange('tipo', e.target.value)}
          >
            <option value="">Todos os tipos</option>
            <option value="entrada">Entradas</option>
            <option value="despesa">Despesas</option>
          </select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-4 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
          <div className="flex flex-wrap gap-2">
            {filters.data_inicio && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-300 rounded-full text-sm">
                Início: {new Date(filters.data_inicio).toLocaleDateString('pt-BR')}
                <button
                  onClick={() => handleFilterChange('data_inicio', '')}
                  className="hover:bg-primary-200 dark:hover:bg-primary-700 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.data_fim && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-300 rounded-full text-sm">
                Fim: {new Date(filters.data_fim).toLocaleDateString('pt-BR')}
                <button
                  onClick={() => handleFilterChange('data_fim', '')}
                  className="hover:bg-primary-200 dark:hover:bg-primary-700 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.tipo && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-300 rounded-full text-sm">
                Tipo: {filters.tipo === 'entrada' ? 'Entradas' : 'Despesas'}
                <button
                  onClick={() => handleFilterChange('tipo', '')}
                  className="hover:bg-primary-200 dark:hover:bg-primary-700 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionFiltersComponent;
