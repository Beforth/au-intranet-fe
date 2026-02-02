
import React, { useState, useMemo, createContext, useContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { DASHBOARD_STATS } from './constants';
import { StatCard } from './components/StatCard';
import { Card } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { TransactionTable } from './components/TransactionTable';
import { RevenueChart, SalesTargetChart } from './components/ChartsSection';
import { Download, Layout as LayoutIcon, Check } from 'lucide-react';
import { ThemeProvider } from './context/ThemeContext';
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

type WidgetId = 'revenue-chart' | 'goal-chart' | 'activity-table' | 'global-reach';
interface WidgetConfig {
  id: WidgetId;
  span: 1 | 2 | 3;
}

const DEFAULT_LAYOUT: WidgetConfig[] = [
  { id: 'revenue-chart', span: 2 },
  { id: 'goal-chart', span: 1 },
  { id: 'activity-table', span: 2 },
  { id: 'global-reach', span: 1 },
];

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  { id: '1', title: 'New Order Received', message: 'Order #ORD-7237 processed for Sarah Jenkins.', time: '2m ago', type: 'order', read: false },
  { id: '2', title: 'System Security Alert', message: 'New login detected from Austin, TX.', time: '15m ago', type: 'system', read: false },
  { id: '3', title: 'Inventory Warning', message: 'Premium ERP License stock is below 15%.', time: '1h ago', type: 'inventory', read: false },
];

const DashboardView: React.FC = () => {
  const { showToast } = useApp();
  const [isExporting, setIsExporting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [layout, setLayout] = useState<WidgetConfig[]>(() => {
    try {
      const saved = localStorage.getItem('dashboard-layout');
      return saved ? JSON.parse(saved) : DEFAULT_LAYOUT;
    } catch (e) {
      return DEFAULT_LAYOUT;
    }
  });
  
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem('dashboard-layout', JSON.stringify(layout));
  }, [layout]);

  const toggleResize = (id: WidgetId) => {
    setLayout(prev => prev.map(w => {
      if (w.id === id) {
        const nextSpan = (w.span % 3) + 1 as 1 | 2 | 3;
        return { ...w, span: nextSpan };
      }
      return w;
    }));
  };

  const handleDragStart = (index: number) => {
    if (!isEditMode) return;
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleDrop = (index: number) => {
    if (draggedIndex === null) return;
    const newOrder = [...layout];
    const itemToMove = newOrder[draggedIndex];
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(index, 0, itemToMove);
    setLayout(newOrder);
    setDraggedIndex(null);
  };

  const renderWidget = (config: WidgetConfig) => {
    const commonProps = {
      isDraggable: isEditMode,
      showHandle: isEditMode,
      onDragStart: () => handleDragStart(layout.indexOf(config)),
      onDragOver: handleDragOver,
      onDrop: () => handleDrop(layout.indexOf(config)),
      onResize: () => toggleResize(config.id),
      className: `${config.span === 1 ? 'col-span-1' : config.span === 2 ? 'col-span-2' : 'col-span-3'} 
                  ${isEditMode ? 'ring-2 ring-dashed ring-slate-200' : ''}`
    };

    switch (config.id) {
      case 'revenue-chart':
        return (
          <Card key={config.id} {...commonProps} title="Revenue Stream" description="Fiscal performance tracking.">
            <RevenueChart />
          </Card>
        );
      case 'goal-chart':
        return (
          <Card key={config.id} {...commonProps} title="Goal Progress" description="Quarterly targets achievement.">
            <SalesTargetChart />
          </Card>
        );
      case 'activity-table':
        return (
          <Card key={config.id} {...commonProps} title="Recent Activity" description="Latest verified system events." className={`${commonProps.className} p-0`} maxHeight="none">
            <TransactionTable />
          </Card>
        );
      case 'global-reach':
        return (
          <Card key={config.id} {...commonProps} title="Global Reach" description="Operational distribution.">
            <div className="space-y-6">
              {[
                { region: 'Americas', val: 75 },
                { region: 'EMEA', val: 45 },
                { region: 'APAC', val: 32 },
                { region: 'LATAM', val: 18 },
              ].map((item) => (
                <div key={item.region} className="space-y-2">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-500 uppercase tracking-tight">
                    <span>{item.region}</span>
                    <span className="text-slate-900">{item.val}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-[var(--primary)] h-full rounded-full transition-all duration-1000" style={{ width: `${item.val}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        );
      default:
        return null;
    }
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      showToast('Enterprise data exported successfully');
    }, 1500);
  };

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Enterprise Overview</h1>
          <p className="text-slate-500 text-sm mt-1">Monitoring real-time operational status and metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant={isEditMode ? 'primary' : 'outline'}
            size="sm"
            onClick={() => {
              setIsEditMode(!isEditMode);
              if (isEditMode) showToast('Dashboard configuration saved', 'success');
              else showToast('Layout unlocked.', 'info');
            }}
            leftIcon={isEditMode ? <Check size={14} /> : <LayoutIcon size={14} />}
          >
            {isEditMode ? 'Save Layout' : 'Customize Dashboard'}
          </Button>
          <Button 
            size="sm"
            onClick={handleExport}
            isLoading={isExporting}
            leftIcon={<Download size={14} />}
          >
            Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {DASHBOARD_STATS.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-300">
        {layout.map(config => renderWidget(config))}
      </div>
    </div>
  );
};

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
            <Route index element={<DashboardView />} />
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
