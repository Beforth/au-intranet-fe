
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchInput } from './SearchInput';
import { Search, Bell, Settings, Command, ShoppingBag, ShieldAlert, Package, MessageSquare, ArrowRight, LayoutDashboard, FileText, PieChart, CreditCard, LogOut } from 'lucide-react';
import { useApp } from '../../App';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const {
    globalSearch,
    setGlobalSearch,
    unreadCount,
    notifications,
    markAsRead,
    markAllAsRead,
    logout,
    authUser,
    authEmployee,
  } = useApp();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Derive display values from real auth data
  const displayName =
    authUser
      ? `${authUser.first_name} ${authUser.last_name}`.trim() || authUser.username
      : 'User';

  const displayRole =
    authEmployee?.designation ?? (authUser?.is_superuser ? 'Administrator' : 'User');

  const initials =
    authUser
      ? ((authUser.first_name?.[0] ?? '') + (authUser.last_name?.[0] ?? '')).toUpperCase() ||
        authUser.username.slice(0, 2).toUpperCase()
      : 'U';

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
      case 'follow_up': return <MessageSquare size={14} className="text-blue-500" />;
      case 'new_inquiry': return <MessageSquare size={14} className="text-emerald-500" />;
      default: return <Bell size={14} className="text-slate-400" />;
    }
  };

  const SEARCHABLE_ITEMS = useMemo(() => [
    { id: 'nav-1', title: 'Dashboard', icon: LayoutDashboard, href: '/admin', keywords: ['admin', 'home', 'desk'] },
    { id: 'nav-2', title: 'Orders Registry', icon: ShoppingBag, href: '/orders', keywords: ['orders', 'sales'] },
    { id: 'nav-3', title: 'Customer Base', icon: LayoutDashboard, href: '/customers', keywords: ['customers', 'clients'] },
    { id: 'nav-4', title: 'Inventory Logs', icon: Package, href: '/inventory', keywords: ['inventory', 'stock'] },
    { id: 'nav-5', title: 'Financial Ledger', icon: CreditCard, href: '/financials', keywords: ['finance', 'ledger', 'accounting'] },
    { id: 'nav-6', title: 'Analytics Reports', icon: PieChart, href: '/reports', keywords: ['analytics', 'reports'] },
    { id: 'nav-7', title: 'Invoice Manager', icon: FileText, href: '/invoices', keywords: ['invoices', 'billing'] },
    { id: 'nav-8', title: 'Settings', icon: Settings, href: '/settings', keywords: ['settings', 'preferences'] },
  ], []);

  const searchResults = useMemo(() => {
    const term = globalSearch.trim().toLowerCase();
    if (!term) return [];

    return SEARCHABLE_ITEMS.filter((item) => {
      const title = item.title.toLowerCase();
      const words = title.split(/[\s/_-]+/).filter(Boolean);

      // Single-character queries: only match word/keyword starts (avoids noisy substring hits)
      if (term.length === 1) {
        return (
          words.some((word) => word.startsWith(term)) ||
          item.keywords.some((keyword) => keyword.startsWith(term))
        );
      }

      return (
        title.includes(term) ||
        words.some((word) => word.startsWith(term)) ||
        item.keywords.some((keyword) => keyword.startsWith(term) || keyword.includes(term))
      );
    });
  }, [globalSearch, SEARCHABLE_ITEMS]);

  const trimmedSearch = globalSearch.trim();
  const showSearchDropdown = isSearchFocused && trimmedSearch.length > 0;

  return (
    <header className="h-16 sticky top-0 bg-white/80 backdrop-blur-md z-40 flex items-center justify-between relative transition-all duration-300 border-b border-slate-200/60">
      {/* Search */}
      <div className="w-full max-w-[480px] relative px-6 sm:px-8 lg:px-10 shrink-0">
        <SearchInput
          ref={searchInputRef}
          placeholder="Quick search... (⌘K)"
          value={globalSearch}
          onChange={(e) => setGlobalSearch(e.target.value)}
          onClear={() => setGlobalSearch('')}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
          rightElement={(
            <>
              <Command size={10} />
              <span className="text-[10px] font-bold uppercase">K</span>
            </>
          )}
          className="!h-9 !bg-slate-50/50 !border-slate-200/50 focus:!bg-white focus:!border-blue-500/30 transition-all font-medium"
        />

        {showSearchDropdown && (
          <div className="absolute top-full left-6 right-6 sm:left-8 sm:right-8 lg:left-10 lg:right-10 mt-2 bg-white border border-slate-200 shadow-xl rounded-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="p-1.5 max-h-[380px] overflow-y-auto">
              {searchResults.length > 0 ? (
                <div className="space-y-1">
                  {searchResults.map(item => (
                    <button
                      key={item.id}
                      onClick={() => { navigate(item.href); setGlobalSearch(''); setIsSearchFocused(false); }}
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

      {/* Right section */}
      <div className="flex items-center gap-3 px-6 sm:px-8 lg:px-10">
        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all active:scale-95 ${showNotifications ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-blue-50/50 border-blue-100 text-blue-600 hover:bg-blue-50'}`}
          >
            <Bell size={16} strokeWidth={2} />
            {unreadCount > 0 && (
              <span className={`text-sm font-semibold ${showNotifications ? 'text-blue-50' : 'text-blue-600'}`}>
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute top-full right-0 mt-3 w-80 bg-white border border-slate-200 shadow-2xl rounded-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <span className="text-xs font-semibold text-slate-500">Notifications</span>
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
                      key={String(notif.id)}
                      onClick={() => markAsRead(String(notif.id))}
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

        {/* Settings */}
        <button onClick={() => navigate('/settings')} className="p-2 text-slate-400 hover:text-slate-900 transition-all rounded-lg hover:bg-slate-100">
          <Settings size={20} strokeWidth={1.5} />
        </button>

        {/* User pill — avatar + name + logout */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold border-2 border-white shadow-sm shrink-0">
            {initials}
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-semibold text-slate-900 leading-tight">{displayName}</p>
            <p className="text-[10px] text-slate-500 leading-tight">{displayRole}</p>
          </div>
          {/* Logout — pushed further right with ml-3 */}
          <button
            onClick={handleLogout}
            title="Logout"
            className="ml-3 p-1.5 text-slate-400 hover:text-rose-600 transition-all rounded-lg hover:bg-rose-50 active:scale-95"
          >
            <LogOut size={17} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
