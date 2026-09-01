
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../ui/Navbar';
import { useApp } from '../../App';
import { Toast } from '../ui/Toast';

export const DashboardLayout: React.FC = () => {
  const { toast, onCloseToast } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-blue-600 selection:text-white">
      <main className="flex-1 flex flex-col min-h-screen min-w-0 w-full bg-[#f8fafc]">
        <Navbar />

        <div className="flex-1 min-w-0 overflow-x-auto px-6 sm:px-8 lg:px-10 py-6 transition-all duration-500 relative">
          <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none -z-10" />

          <div className="relative mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
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
