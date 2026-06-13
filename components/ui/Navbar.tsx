
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Settings, Command, ShoppingBag, ShieldAlert, Package, MessageSquare, User, ArrowRight, LayoutDashboard, FileText, PieChart, CreditCard, X } from 'lucide-react';
import { useApp } from '../../App';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const {
    globalSearch,
    setGlobalSearch,
    unreadCount,
    notifications,
    markAsRead,
    markAllAsRead
  } = useApp();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order': return <ShoppingBag size={14} className="text-blue-500" />;
      case 'system': return <ShieldAlert size={14} className="text-amber-500" />;
      case 'inventory': return <Package size={14} className="text-rose-500" />;
      case 'customer': return <MessageSquare size={14} className="text-emerald-500" />;
      default: return <Bell size={14} className="text-slate-400" />;
    }
  };

  const SEARCHABLE_ITEMS = useMemo(() => [
    { id: 'nav-1', category: 'Pages', title: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { id: 'nav-2', category: 'Pages', title: 'Orders Registry', icon: ShoppingBag, href: '/orders' },
    { id: 'nav-3', category: 'Pages', title: 'Customer Base', icon: User, href: '/customers' },
    { id: 'nav-4', category: 'Pages', title: 'Inventory Logs', icon: Package, href: '/inventory' },
    { id: 'nav-5', category: 'Pages', title: 'Financial Ledger', icon: CreditCard, href: '/financials' },
    { id: 'nav-6', category: 'Pages', title: 'Analytics Reports', icon: PieChart, href: '/reports' },
    { id: 'nav-7', category: 'Pages', title: 'Invoice Manager', icon: FileText, href: '/invoices' },
  ], []);

  const searchResults = useMemo(() => {
    const term = globalSearch.trim().toLowerCase();
    if (!term) return [];
    return SEARCHABLE_ITEMS.filter(item =>
      item.title.toLowerCase().includes(term) ||
      item.category.toLowerCase().includes(term)
    );
  }, [globalSearch, SEARCHABLE_ITEMS]);

  return (
    <header
      className="h-16 sticky top-0 bg-white/5 backdrop-blur-md z-40 ml-60 flex items-center justify-between relative transition-all duration-300"
      style={{ paddingLeft: 'var(--ui-padding)', paddingRight: 'var(--ui-padding)' }}
    >
      <div className="absolute bottom-0 left-8 right-8 h-px bg-slate-200/50" />
      <div className="flex-1 max-w-lg relative">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={14} />
          <input
            ref={searchInputRef}
            type="text"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg h-9 pl-10 pr-12 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[var(--primary-accent)]/5 focus:border-[var(--primary-accent)]/30 transition-all"
            placeholder="Quick search... (⌘K)"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-40 group-focus-within:opacity-80 transition-opacity">
            <Command size={10} />
            <span className="text-[10px] font-bold">K</span>
          </div>
        </div>

        {isSearchFocused && globalSearch.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 shadow-xl rounded-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="p-1.5 max-h-[380px] overflow-y-auto">
              {searchResults.length > 0 ? (
                <div className="space-y-1">
                  {searchResults.map(item => (
                    <button
                      key={item.id}
                      onClick={() => { navigate(item.href); setGlobalSearch(''); }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-slate-50 transition-colors group"
                    >
                      <item.icon size={14} className="text-slate-400 group-hover:text-blue-600" />
                      <span className="text-xs font-medium text-slate-700">{item.title}</span>
                      <ArrowRight size={12} className="ml-auto text-slate-300 opacity-0 group-hover:opacity-100" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-4 text-center text-slate-400 text-xs">No matches found</div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all active:scale-95 ${showNotifications ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-blue-50/50 border-blue-100 text-blue-600 hover:bg-blue-50'}`}
          >
            <Bell size={16} strokeWidth={2} />
            {unreadCount > 0 && (
              <span className={`text-[11px] font-black tracking-tight ${showNotifications ? 'text-blue-50' : 'text-blue-600'}`}>
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute top-full right-0 mt-3 w-80 bg-white border border-slate-200 shadow-2xl rounded-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Notifications</span>
                <button
                  onClick={markAllAsRead}
                  className="text-[10px] font-bold text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-tight"
                >
                  Clear all
                </button>
              </div>
              <div className="max-h-[320px] overflow-y-auto custom-scrollbar">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markAsRead(notif.id)}
                      className="px-4 py-2.5 hover:bg-slate-50 transition-colors cursor-pointer group flex gap-3 items-start border-b border-slate-50 last:border-0"
                    >
                      <div className="shrink-0 mt-0.5 opacity-80 group-hover:opacity-100 transition-opacity">
                        {getNotificationIcon(notif.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-[11px] truncate tracking-tight ${notif.read ? 'text-slate-500' : 'text-slate-900 font-bold'}`}>
                            {notif.title}
                          </p>
                          {!notif.read && <div className="w-1 h-1 rounded-full bg-blue-600 shrink-0 shadow-[0_0_8px_rgba(37,99,235,0.4)]" />}
                        </div>
                        <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 leading-snug">
                          {notif.message}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-slate-300">
                    <p className="text-[10px] font-medium uppercase tracking-widest">No updates found</p>
                  </div>
                )}
              </div>
              <div className="p-3 bg-slate-50/50 border-t border-slate-100">
                <button
                  onClick={() => { navigate('/reports'); setShowNotifications(false); }}
                  className="w-full py-1.5 text-[10px] font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest flex items-center gap-2 justify-center"
                >
                  Full Activity Log <ArrowRight size={10} />
                </button>
              </div>
            </div>
          )}
        </div>
        <button onClick={() => navigate('/settings')} className="p-2 text-slate-400 hover:text-slate-900 transition-all rounded-lg hover:bg-slate-100">
          <Settings size={20} strokeWidth={1.5} />
        </button>
        <div
          onClick={() => navigate('/settings')}
          className="w-8 h-8 rounded-full border border-slate-200 overflow-hidden ml-1 cursor-pointer hover:border-blue-400 transition-all shadow-sm"
        >
          <img src="https://i.pravatar.cc/100?u=alex" alt="User" className="w-full h-full object-cover" />
        </div>
      </div>
    </header>
  );
};
