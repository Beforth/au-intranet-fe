
import React, { useState, useMemo, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ThemeProvider } from './context/ThemeContext';
import { DashboardPage } from './pages/DashboardPage';
import { OrdersPage } from './pages/OrdersPage';
import { QuotationsPage } from './pages/QuotationsPage';
import { CustomersPage } from './pages/CustomersPage';
import { InventoryPage } from './pages/InventoryPage';
import { FinancialsPage } from './pages/FinancialsPage';
import { ReportsPage } from './pages/ReportsPage';
import { InvoicesPage } from './pages/InvoicesPage';
import { SettingsPage } from './pages/SettingsPage';
import { SupportPage } from './pages/SupportPage';
import { ToastType } from './components/ui/Toast';
import { AppNotification } from './types';

interface AppContextType {
  showToast: (message: string, type?: ToastType) => void;
  globalSearch: string;
  setGlobalSearch: (val: string) => void;
  notifications: AppNotification[];
  setNotifications: React.Dispatch<React.SetStateAction<AppNotification[]>>;
  unreadCount: number;
  toast: { message: string; type: ToastType } | null;
  onCloseToast: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  { id: '1', title: 'New Order Received', message: 'Order #ORD-7237 processed for Sarah Jenkins.', time: '2m ago', type: 'order', read: false },
  { id: '2', title: 'System Security Alert', message: 'New login detected from Austin, TX.', time: '15m ago', type: 'system', read: false },
  { id: '3', title: 'Inventory Warning', message: 'Premium ERP License stock is below 15%.', time: '1h ago', type: 'inventory', read: false },
];

const AppMain: React.FC = () => {
  const [globalSearch, setGlobalSearch] = useState('');
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = (message: string, type: ToastType = 'success') => setToast({ message, type });

  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

  const contextValue = useMemo(() => ({
    showToast,
    globalSearch,
    setGlobalSearch,
    notifications,
    setNotifications,
    unreadCount,
    toast,
    onCloseToast: () => setToast(null)
  }), [globalSearch, notifications, unreadCount, toast]);

  return (
    <AppContext.Provider value={contextValue}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="quotations" element={<QuotationsPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="financials" element={<FinancialsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="invoices" element={<InvoicesPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="support" element={<SupportPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
};

const App: React.FC = () => (
  <ThemeProvider>
    <AppMain />
  </ThemeProvider>
);

export default App;
