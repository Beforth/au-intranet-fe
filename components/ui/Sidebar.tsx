
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { SIDEBAR_LINKS, SECONDARY_LINKS } from '../../constants';
import { NavItem } from '../../types';

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col fixed left-0 top-0 z-30">
      <div className="p-6">
        <Link
          to="/"
          className="flex items-center gap-2.5 mb-8 hover:opacity-80 transition-all"
        >
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Aether<span className="text-slate-400 font-medium">ERP</span>
          </span>
        </Link>

        <nav className="space-y-1">
          <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Main Menu</p>
          {SIDEBAR_LINKS.map((item) => (
            <SidebarItem key={item.title} item={item} />
          ))}
        </nav>
      </div>

      <div className="mt-auto p-4 border-t border-slate-100">
        <nav className="space-y-0.5">
          {SECONDARY_LINKS.map((item) => (
            <SidebarItem key={item.title} item={item} />
          ))}
        </nav>

        <div className="mt-4 flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/50">
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden shrink-0">
            <img src="https://i.pravatar.cc/100?u=alex" alt="Avatar" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-900 truncate">Alex Rivera</p>
            <p className="text-[10px] text-slate-500 font-medium">Administrator</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

const SidebarItem: React.FC<{ item: NavItem }> = ({ item }) => {
  return (
    <NavLink
      to={item.href}
      className={({ isActive }) => `
        group flex items-center justify-between w-full rounded-lg text-[13px] transition-all duration-200 font-medium
        ${isActive
          ? 'bg-indigo-50 text-indigo-700 font-semibold'
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
      `}
      style={{
        paddingLeft: 'calc(var(--ui-padding) * 0.75)',
        paddingRight: 'calc(var(--ui-padding) * 0.75)',
        paddingTop: 'calc(var(--ui-padding) * 0.5)',
        paddingBottom: 'calc(var(--ui-padding) * 0.5)'
      }}
    >
      {({ isActive }) => (
        <>
          <div className="flex items-center gap-3">
            <item.icon
              size={18}
              strokeWidth={isActive ? 2.5 : 2}
              className={isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}
            />
            <span>{item.title}</span>
          </div>
          {item.badge && (
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
              {item.badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
};
