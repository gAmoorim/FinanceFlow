import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, User, Mail, Lock } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useToast } from '../../hooks/useToast';
import LoadingSpinner from '../LoadingSpinner';

interface RegisterFormData {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
}

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser, isLoading } = useAuthStore();
  const { success, error } = useToast();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const password = watch('senha');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data.nome, data.email, data.senha);
      success('Conta criada com sucesso! Agora você pode fazer login.');
      onSwitchToLogin();
    } catch (err: any) {
      error(err.response?.data?.error || 'Erro ao criar conta');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Criar conta
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Preencha os dados abaixo para começar
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="label">
            <User className="w-4 h-4 inline mr-2" />
            Nome completo
          </label>
          <input
            type="text"
            className={`input-field ${errors.nome ? 'border-danger-500' : ''}`}
            placeholder="Seu nome completo"
            {...register('nome', {
              required: 'Nome é obrigatório',
              minLength: {
                value: 2,
                message: 'Nome deve ter pelo menos 2 caracteres',
              },
            })}
          />
          {errors.nome && (
            <p className="error-message">{errors.nome.message}</p>
          )}
        </div>

        <div>
          <label className="label">
            <Mail className="w-4 h-4 inline mr-2" />
            Email
          </label>
          <input
            type="email"
            className={`input-field ${errors.email ? 'border-danger-500' : ''}`}
            placeholder="seu@email.com"
            {...register('email', {
              required: 'Email é obrigatório',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Email inválido',
              },
            })}
          />
          {errors.email && (
            <p className="error-message">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="label">
            <Lock className="w-4 h-4 inline mr-2" />
            Senha
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className={`input-field pr-10 ${errors.senha ? 'border-danger-500' : ''}`}
              placeholder="Sua senha"
              {...register('senha', {
                required: 'Senha é obrigatória',
                minLength: {
                  value: 6,
                  message: 'Senha deve ter pelo menos 6 caracteres',
                },
              })}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.senha && (
            <p className="error-message">{errors.senha.message}</p>
          )}
        </div>

        <div>
          <label className="label">
            <Lock className="w-4 h-4 inline mr-2" />
            Confirmar senha
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              className={`input-field pr-10 ${errors.confirmarSenha ? 'border-danger-500' : ''}`}
              placeholder="Confirme sua senha"
              {...register('confirmarSenha', {
                required: 'Confirmação de senha é obrigatória',
                validate: (value) =>
                  value === password || 'As senhas não coincidem',
              })}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.confirmarSenha && (
            <p className="error-message">{errors.confirmarSenha.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" />
              Criando conta...
            </>
          ) : (
            'Criar conta'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Já tem uma conta?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors"
          >
            Faça login
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
