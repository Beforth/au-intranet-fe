
import React from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useApp } from '../../App';
import { Toast } from '../ui/Toast';

/**
 * Main Layout wrapper that provides the structural grid for all ERP pages.
 * Handles Sidebar positioning and the main scrollable area.
 */
interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { currentPath, onNavigate, toast, onCloseToast } = useApp();

  return (
    <div className="min-h-screen flex bg-[#fafafa] transition-colors duration-300">
      {/* Sidebar - Fixed width navigation */}
      <Sidebar currentPath={currentPath} onNavigate={onNavigate} />
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Navbar - Sticky header with search and notifications */}
        <Navbar />
        
        {/* Dynamic Page Content */}
        <div className="px-10 py-8 ml-64 max-w-[1600px] animate-in fade-in slide-in-from-bottom-2 duration-500">
          {children}
        </div>
      </main>

      {/* Global Notification System */}
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
