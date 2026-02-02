
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Settings, Command, ShoppingBag, ShieldAlert, Package, MessageSquare, User, ArrowRight, LayoutDashboard, FileText, PieChart, CreditCard, X } from 'lucide-react';
import { useApp } from '../../App';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { 
    globalSearch, 
    setGlobalSearch, 
    unreadCount 
  } = useApp();
  
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

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
    <header className="h-16 sticky top-0 bg-white/80 backdrop-blur-md z-40 ml-64 flex items-center px-8 justify-between border-b border-slate-200">
      <div className="flex-1 max-w-lg relative">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={14} />
          <input 
            ref={searchInputRef}
            type="text"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg h-9 pl-10 pr-12 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/30 transition-all"
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
                      <item.icon size={14} className="text-slate-400 group-hover:text-indigo-600" />
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
        <button className="p-2 text-slate-400 hover:text-slate-900 transition-all rounded-lg hover:bg-slate-100 relative">
          <Bell size={18} strokeWidth={2} />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white"></span>
          )}
        </button>
        <button onClick={() => navigate('/settings')} className="p-2 text-slate-400 hover:text-slate-900 transition-all rounded-lg hover:bg-slate-100">
          <Settings size={18} strokeWidth={2} />
        </button>
        <div className="w-8 h-8 rounded-full border border-slate-200 overflow-hidden ml-2 cursor-pointer hover:border-indigo-400 transition-all">
          <img src="https://i.pravatar.cc/100?u=alex" alt="User" />
        </div>
      </div>
    </header>
  );
};
