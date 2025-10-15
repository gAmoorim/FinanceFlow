import React from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastProps {
  toast: ToastMessage;
  onRemove: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onRemove }) => {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <XCircle className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getToastClasses = () => {
    const baseClasses = 'toast flex items-center gap-3 p-4 rounded-lg shadow-lg transition-all duration-300 animate-slide-up';
    
    switch (toast.type) {
      case 'success':
        return `${baseClasses} toast-success`;
      case 'error':
        return `${baseClasses} toast-error`;
      case 'info':
        return `${baseClasses} toast-info`;
      default:
        return baseClasses;
    }
  };

  return (
    <div className={getToastClasses()}>
      {getIcon()}
      <span className="flex-1">{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        className="ml-2 hover:opacity-70 transition-opacity"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
};

export { ToastContainer };

export default Toast;
