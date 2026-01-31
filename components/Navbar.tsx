
import React, { useState, useMemo } from 'react';
import { Search, Bell, Settings, Command, X, ShoppingBag, ShieldAlert, Package, MessageSquare } from 'lucide-react';
import { ThemeSwitcher } from './ThemeSwitcher';
import { useApp } from '../App';

export const Navbar: React.FC = () => {
  const { showToast, onNavigate, globalSearch, setGlobalSearch, notifications, setNotifications, unreadCount } = useApp();
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications cleared', 'success');
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'order': return <ShoppingBag size={14} className="text-blue-500" />;
      case 'system': return <ShieldAlert size={14} className="text-rose-500" />;
      case 'inventory': return <Package size={14} className="text-amber-500" />;
      default: return <MessageSquare size={14} className="text-slate-400" />;
    }
  };

  // The functional part: filtering based on globalSearch
  const filteredNotifications = useMemo(() => {
    const term = globalSearch.trim().toLowerCase();
    if (!term) return notifications;
    
    return notifications.filter(
      n => n.title.toLowerCase().includes(term) || 
           n.message.toLowerCase().includes(term)
    );
  }, [notifications, globalSearch]);

  return (
    <header className="h-16 sticky top-0 bg-[#fafafa]/80 backdrop-blur-md z-20 ml-64 flex items-center px-10 justify-between w-auto border-b border-slate-100">
      <div className="flex-1 max-w-xl group">
        <div className="relative flex items-center">
          <Search 
            className="absolute left-4 text-slate-400 group-focus-within:text-[var(--primary)] transition-all pointer-events-none" 
            size={16} 
            strokeWidth={2.5}
          />
          <input 
            type="text" 
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Search enterprise indices..." 
            className="w-full h-10 pl-11 pr-14 bg-white border border-slate-200 rounded-full text-[13px] font-medium placeholder:text-slate-400 focus:outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all shadow-sm focus:shadow-md"
          />
          <div className="absolute right-4 flex items-center gap-2">
            {globalSearch && (
              <button 
                onClick={() => setGlobalSearch('')}
                className="p-1 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
              >
                <X size={14} strokeWidth={2.5} />
              </button>
            )}
            <div className="hidden md:flex items-center gap-1 opacity-40 group-focus-within:opacity-100 transition-opacity pointer-events-none border-l border-slate-200 pl-2 ml-1">
               <Command size={11} strokeWidth={3} />
               <span className="text-[10px] font-black uppercase tracking-tighter">K</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <ThemeSwitcher />
          
          <div className="relative">
            <button 
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className={`p-2 transition-all relative active:scale-90 rounded-full hover:bg-slate-100 ${
                unreadCount > 0 || isNotifOpen ? 'text-slate-600' : 'text-slate-300'
              }`}
              title={unreadCount > 0 ? `${unreadCount} unread notifications` : 'No notifications'}
            >
              <Bell size={20} strokeWidth={(unreadCount > 0 || isNotifOpen) ? 2 : 1.5} />
              {unreadCount > 0 && (
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[var(--primary)] rounded-full border-2 border-[#fafafa] animate-in fade-in zoom-in duration-300"></span>
              )}
            </button>

            {isNotifOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)} />
                <div className="absolute right-0 mt-4 w-80 bg-white border border-slate-200 shadow-2xl z-50 rounded-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex flex-col">
                      <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Inbox Activity</h4>
                      {globalSearch && (
                        <span className="text-[8px] text-[var(--primary)] font-black uppercase tracking-tighter animate-in fade-in slide-in-from-top-1">Filtering: "{globalSearch}"</span>
                      )}
                    </div>
                    {unreadCount > 0 && !globalSearch && (
                      <button 
                        onClick={handleMarkAllRead}
                        className="text-[10px] font-bold text-[var(--primary)] hover:underline uppercase tracking-widest"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                  <div className="max-h-[350px] overflow-y-auto divide-y divide-slate-50">
                    {filteredNotifications.length > 0 ? filteredNotifications.map((notif) => (
                      <div 
                        key={notif.id} 
                        className={`p-4 flex gap-3 transition-colors hover:bg-slate-50 cursor-default group relative ${!notif.read ? 'bg-[var(--primary-muted)]/20' : ''}`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                          {getNotifIcon(notif.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h5 className="text-xs font-bold text-slate-900 truncate leading-none mb-1">{notif.title}</h5>
                            <span className="text-[9px] font-medium text-slate-400 whitespace-nowrap">{notif.time}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium leading-tight line-clamp-2">{notif.message}</p>
                        </div>
                        {!notif.read && (
                          <div className="absolute right-4 bottom-4 w-1.5 h-1.5 bg-[var(--primary)] rounded-full"></div>
                        )}
                      </div>
                    )) : (
                      <div className="py-12 text-center px-4">
                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                           <Bell size={20} className="text-slate-300" />
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                          {globalSearch ? 'No matches found' : 'No new alerts'}
                        </p>
                        {globalSearch && (
                          <p className="text-[10px] text-slate-400 mt-2 font-medium italic">
                            No notifications match "{globalSearch}"
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="p-3 border-t border-slate-100 bg-slate-50/30 text-center">
                    <button className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-slate-900 transition-colors">
                      View Audit Log
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <button 
            onClick={() => onNavigate('/settings')}
            className="p-2 text-slate-400 hover:text-slate-900 transition-all active:scale-90 rounded-full hover:bg-slate-100"
          >
            <Settings size={20} strokeWidth={2} />
          </button>
        </div>

        <div className="flex items-center pl-4 border-l border-slate-200">
          <div 
            onClick={() => onNavigate('/settings')}
            className="w-8 h-8 rounded-full cursor-pointer border border-slate-200 hover:border-[var(--primary)] transition-all overflow-hidden shadow-sm"
          >
            <img src="https://i.pravatar.cc/100?u=alex" alt="User" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </header>
  );
};
