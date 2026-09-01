
import React, { useState, useMemo, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { LoginPage } from './pages/LoginPage';
import { SettingsPage } from './pages/SettingsPage';
import { SupportPage } from './pages/SupportPage';
import AdminPage from './pages/AdminPage';
import { ToastType } from './components/ui/Toast';
import { AppNotification } from './types';
import {
  isAuthenticated,
  getToken,
  getStoredUser,
  getStoredEmployee,
  getStoredPermissions,
  clearAuth,
  logoutFromHRMS,
  AuthUser,
  AuthEmployee,
  AuthPermission,
} from './lib/auth';

interface AppContextType {
  showToast: (message: string, type?: ToastType) => void;
  globalSearch: string;
  setGlobalSearch: (val: string) => void;
  notifications: AppNotification[];
  setNotifications: React.Dispatch<React.SetStateAction<AppNotification[]>>;
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  toast: { message: string; type: ToastType } | null;
  onCloseToast: () => void;
  simulateDemo: () => void;
  clearDemo: () => void;
  isDemoActive: boolean;
  orders: any[];
  customers: any[];
  // Auth
  authUser: AuthUser | null;
  authEmployee: AuthEmployee | null;
  authPermissions: AuthPermission[];
  setAuthUser: (user: AuthUser | null) => void;
  setAuthEmployee: (employee: AuthEmployee | null) => void;
  setAuthPermissions: (permissions: AuthPermission[]) => void;
  logout: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

// Protected route — redirects to /login if no token is stored
const ProtectedRoute: React.FC = () => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

const INITIAL_NOTIFICATIONS: AppNotification[] = [];

const AppMain: React.FC = () => {
  const [globalSearch, setGlobalSearch] = useState('');
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [isDemoActive, setIsDemoActive] = useState(false);

  // Hydrate from localStorage on first render
  const [authUser, setAuthUser] = useState<AuthUser | null>(getStoredUser);
  const [authEmployee, setAuthEmployee] = useState<AuthEmployee | null>(getStoredEmployee);
  const [authPermissions, setAuthPermissions] = useState<AuthPermission[]>(() => getStoredPermissions() ?? []);

  const showToast = (message: string, type: ToastType = 'success') => setToast({ message, type });

  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read');
  };

  const simulateDemo = () => {
    import('./demoData').then(data => {
      setNotifications(prev => [...data.DEMO_NOTIFICATIONS, ...prev]);
      setOrders(data.DEMO_ORDERS);
      setCustomers(data.DEMO_CUSTOMERS);
      setIsDemoActive(true);
      showToast('System-wide demo data simulated', 'success');
    });
  };

  const clearDemo = () => {
    setNotifications(INITIAL_NOTIFICATIONS);
    setOrders([]);
    setCustomers([]);
    setIsDemoActive(false);
    showToast('Demo data flushed from system', 'info');
  };

  const logout = async () => {
    const token = getToken();
    if (token) {
      await logoutFromHRMS(token);
    } else {
      clearAuth();
    }
    setAuthUser(null);
    setAuthEmployee(null);
    setAuthPermissions([]);
  };

  const contextValue = useMemo(() => ({
    showToast,
    globalSearch,
    setGlobalSearch,
    notifications,
    setNotifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    toast,
    onCloseToast: () => setToast(null),
    simulateDemo,
    clearDemo,
    isDemoActive,
    orders,
    customers,
    authUser,
    authEmployee,
    authPermissions,
    setAuthUser,
    setAuthEmployee,
    setAuthPermissions,
    logout,
  }), [globalSearch, notifications, unreadCount, toast, isDemoActive, orders, customers, authUser, authEmployee, authPermissions]);

  return (
    <AppContext.Provider value={contextValue}>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected shell */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<Navigate to="/admin" replace />} />
              <Route path="admin" element={<AdminPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="support" element={<SupportPage />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
};

const App: React.FC = () => <AppMain />;

export default App;
