
import React from 'react';
import { NavItem } from '../../types';
import { SIDEBAR_LINKS, SECONDARY_LINKS } from '../../constants';

/**
 * Navigation Sidebar featuring primary and secondary links.
 * Stays fixed to the left of the viewport.
 */
interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPath, onNavigate }) => {
  return (
    <aside className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col fixed left-0 top-0 z-30 transition-colors duration-300">
      <div className="p-6">
        <button 
          onClick={() => onNavigate('/')}
          className="flex items-center gap-2 mb-8 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center transition-colors">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Aether<span className="text-[var(--primary)] transition-colors">ERP</span>
          </span>
        </button>

        <nav className="space-y-1">
          <p className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Main Menu</p>
          {SIDEBAR_LINKS.map((item) => (
            <SidebarItem 
              key={item.title} 
              item={item} 
              active={currentPath === item.href} 
              onClick={() => onNavigate(item.href)} 
            />
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-slate-100">
        <nav className="space-y-1">
          {SECONDARY_LINKS.map((item) => (
            <SidebarItem 
              key={item.title} 
              item={item} 
              active={currentPath === item.href} 
              onClick={() => onNavigate(item.href)} 
            />
          ))}
        </nav>
        
        <div className="mt-6 flex items-center gap-3 p-2 rounded-lg border border-slate-100 bg-slate-50">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
            <img src="https://i.pravatar.cc/100?u=alex" alt="Avatar" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-900 truncate">Alex Rivera</p>
            <p className="text-[10px] text-slate-500 truncate uppercase font-bold tracking-tighter">Administrator</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

const SidebarItem: React.FC<{ item: NavItem; active: boolean; onClick: () => void }> = ({ item, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`group flex items-center justify-between w-full px-3 py-2 rounded-md text-sm transition-all duration-200 ${
        active 
          ? 'bg-[var(--primary-muted)] text-[var(--primary)] font-bold' 
          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <div className="flex items-center gap-3">
        <item.icon size={18} className={active ? 'text-[var(--primary)]' : 'text-slate-400 group-hover:text-slate-600'} />
        <span>{item.title}</span>
      </div>
      {item.badge && (
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
          active ? 'bg-[var(--primary)] text-white' : 'bg-slate-200 text-slate-600'
        }`}>
          {item.badge}
        </span>
      )}
    </button>
  );
};
