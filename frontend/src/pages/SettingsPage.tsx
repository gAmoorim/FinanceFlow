import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, Lock, Trash2, Save, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useToast } from '../hooks/useToast';
import LoadingSpinner from '../components/LoadingSpinner';
import ThemeToggle from '../components/ThemeToggle';

interface UserFormData {
  nome: string;
  email: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const SettingsPage: React.FC = () => {
  const { user, updateUser, updatePassword, deleteAccount, isLoading } = useAuthStore();
  const { success, error } = useToast();
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register: registerUser,
    handleSubmit: handleSubmitUser,
    formState: { errors: userErrors },
  } = useForm<UserFormData>({
    defaultValues: {
      nome: user?.nome || '',
      email: user?.email || '',
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    watch,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormData>();

  const newPassword = watch('newPassword');

  const handleUpdateUser = async (data: UserFormData) => {
    try {
      await updateUser(data);
      success('Dados atualizados com sucesso!');
    } catch (err: any) {
      error(err.response?.data?.error || 'Erro ao atualizar dados');
    }
  };

  const handleUpdatePassword = async (data: PasswordFormData) => {
    try {
      await updatePassword(data.newPassword);
      success('Senha atualizada com sucesso!');
      resetPassword();
    } catch (err: any) {
      error(err.response?.data?.error || 'Erro ao atualizar senha');
    }
  };

  const handleDeleteAccount = async () => {
    const confirmMessage = `Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.\n\nDigite "CONFIRMAR" para continuar:`;
    const userInput = window.prompt(confirmMessage);
    
    if (userInput !== 'CONFIRMAR') {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteAccount();
      success('Conta excluída com sucesso!');
    } catch (err: any) {
      error(err.response?.data?.error || 'Erro ao excluir conta');
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Configurações
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Gerencie suas informações pessoais e preferências
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Information */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
              <User className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Informações Pessoais
            </h2>
          </div>

          <form onSubmit={handleSubmitUser(handleUpdateUser)} className="space-y-6">
            <div>
              <label className="label">
                <User className="w-4 h-4 inline mr-2" />
                Nome Completo
              </label>
              <input
                type="text"
                className={`input-field ${userErrors.nome ? 'border-danger-500' : ''}`}
                {...registerUser('nome', {
                  required: 'Nome é obrigatório',
                  minLength: {
                    value: 2,
                    message: 'Nome deve ter pelo menos 2 caracteres',
                  },
                })}
              />
              {userErrors.nome && (
                <p className="error-message">{userErrors.nome.message}</p>
              )}
            </div>

            <div>
              <label className="label">
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </label>
              <input
                type="email"
                className={`input-field ${userErrors.email ? 'border-danger-500' : ''}`}
                {...registerUser('email', {
                  required: 'Email é obrigatório',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email inválido',
                  },
                })}
              />
              {userErrors.email && (
                <p className="error-message">{userErrors.email.message}</p>
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
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Salvar Alterações
                </>
              )}
            </button>
          </form>
        </div>

        {/* Password Change */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <Lock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Alterar Senha
            </h2>
          </div>

          <form onSubmit={handleSubmitPassword(handleUpdatePassword)} className="space-y-6">
            <div>
              <label className="label">
                <Lock className="w-4 h-4 inline mr-2" />
                Nova Senha
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  className={`input-field pr-10 ${passwordErrors.newPassword ? 'border-danger-500' : ''}`}
                  {...registerPassword('newPassword', {
                    required: 'Nova senha é obrigatória',
                    minLength: {
                      value: 6,
                      message: 'Senha deve ter pelo menos 6 caracteres',
                    },
                  })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordErrors.newPassword && (
                <p className="error-message">{passwordErrors.newPassword.message}</p>
              )}
            </div>

            <div>
              <label className="label">
                <Lock className="w-4 h-4 inline mr-2" />
                Confirmar Nova Senha
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className={`input-field pr-10 ${passwordErrors.confirmPassword ? 'border-danger-500' : ''}`}
                  {...registerPassword('confirmPassword', {
                    required: 'Confirmação de senha é obrigatória',
                    validate: (value) =>
                      value === newPassword || 'As senhas não coincidem',
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
              {passwordErrors.confirmPassword && (
                <p className="error-message">{passwordErrors.confirmPassword.message}</p>
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
                  Atualizando...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Alterar Senha
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Preferences */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <span className="text-purple-600 dark:text-purple-400 text-lg">⚙️</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Preferências
          </h2>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">
              Tema da Aplicação
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Escolha entre tema claro ou escuro
            </p>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card p-6 border-danger-200 dark:border-danger-800 bg-danger-50 dark:bg-danger-900/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-danger-100 dark:bg-danger-800 rounded-lg">
            <Trash2 className="w-6 h-6 text-danger-600 dark:text-danger-400" />
          </div>
          <h2 className="text-xl font-semibold text-danger-700 dark:text-danger-300">
            Zona de Perigo
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-danger-700 dark:text-danger-300 mb-2">
              Excluir Conta
            </h3>
            <p className="text-sm text-danger-600 dark:text-danger-400 mb-4">
              Esta ação é irreversível. Todos os seus dados serão permanentemente excluídos.
            </p>
            <button
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="btn-danger flex items-center gap-2"
            >
              {isDeleting ? (
                <>
                  <LoadingSpinner size="sm" />
                  Excluindo...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Excluir Conta
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
