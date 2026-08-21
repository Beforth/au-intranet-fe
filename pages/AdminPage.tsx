import React from 'react';
import {
  Box,
  Building2,
  Calculator,
  Cpu,
  ShoppingCart,
  Factory,
  FolderKanban,
  ShieldCheck,
  Tag,
  Warehouse,
  Link2,
  Settings2,
  Users2,
} from 'lucide-react';

interface AppModule {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  route?: string;
}

const APP_MODULES: AppModule[] = [
  { id: 'framework',    name: 'Framework',      icon: Box,          color: 'bg-[#3d3d3d]' },
  { id: 'frappe-fra',   name: 'Frappe Fra...',  icon: Box,          color: 'bg-[#3d3d3d]' },
  { id: 'organization', name: 'Organization',   icon: Building2,    color: 'bg-blue-500' },
  { id: 'accounting',   name: 'Accounting',     icon: Calculator,   color: 'bg-blue-500' },
  { id: 'assets',       name: 'Assets',         icon: Cpu,          color: 'bg-blue-500' },
  { id: 'buying',       name: 'Buying',         icon: Tag,          color: 'bg-blue-500' },
  { id: 'manufacturing',name: 'Manufactur...',  icon: Factory,      color: 'bg-blue-500' },
  { id: 'projects',     name: 'Projects',       icon: FolderKanban, color: 'bg-blue-500' },
  { id: 'quality',      name: 'Quality',        icon: ShieldCheck,  color: 'bg-blue-500' },
  { id: 'selling',      name: 'Selling',        icon: ShoppingCart, color: 'bg-blue-500' },
  { id: 'stock',        name: 'Stock',          icon: Warehouse,    color: 'bg-blue-500' },
  { id: 'subcontract',  name: 'Subcontrac...',  icon: Link2,        color: 'bg-blue-500' },
  { id: 'erpnext-se',   name: 'ERPNext Se...',  icon: Settings2,    color: 'bg-blue-500' },
  { id: 'frappe-hr',    name: 'Frappe HR',      icon: Users2,       color: 'bg-emerald-500' },
];

const AdminPage: React.FC = () => {
  return (
    <div className="min-h-full">
      {/* Module grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-8">
        {APP_MODULES.map(module => (
          <ModuleCard key={module.id} module={module} />
        ))}
      </div>
    </div>
  );
};

const ModuleCard: React.FC<{ module: AppModule }> = ({ module }) => {
  const Icon = module.icon;

  return (
    <button
      type="button"
      className="flex flex-col items-center gap-2 group focus:outline-none"
    >
      <div
        className={`
          w-16 h-16 rounded-2xl flex items-center justify-center
          ${module.color}
          shadow-md group-hover:shadow-lg group-hover:scale-105
          transition-all duration-200
        `}
      >
        <Icon size={30} strokeWidth={1.8} className="text-white" />
      </div>
      <span className="text-[12px] font-medium text-slate-700 group-hover:text-slate-900 text-center leading-tight max-w-[72px] truncate">
        {module.name}
      </span>
    </button>
  );
};

export default AdminPage;
