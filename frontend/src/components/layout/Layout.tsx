import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';
import Sidebar from './Sidebar';
import Header from './Header';
import { ToastContainer } from '../Toast';
import { useToast } from '../../hooks/useToast';

const Layout: React.FC = () => {
  const { sidebarOpen, toggleSidebar, setSidebarOpen } = useAppStore();
  const { toasts, removeToast } = useToast();

  const handleMenuClick = () => {
    toggleSidebar();
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />
      
      <div className="lg:ml-64">
        <Header onMenuClick={handleMenuClick} title="Dashboard" />
        
        <main className="p-6">
          <Outlet />
        </main>
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default Layout;
