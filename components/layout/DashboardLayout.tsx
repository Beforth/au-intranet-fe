
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useApp } from '../../App';
import { Toast } from '../ui/Toast';

export const DashboardLayout: React.FC = () => {
  const { toast, onCloseToast } = useApp();

  return (
    <div className="min-h-screen flex bg-[#f8fafc]">
      <Sidebar />
      
      <main className="flex-1 flex flex-col min-h-screen">
        <Navbar />
        
        <div className="px-8 py-8 ml-64 max-w-[1600px] flex-1">
          <Outlet />
        </div>
      </main>

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={onCloseToast} 
        />
      )}
    </div>
  );
};
