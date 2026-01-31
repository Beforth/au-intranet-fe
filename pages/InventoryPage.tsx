
import React, { useState, useMemo } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { DataTable, Column } from '../components/ui/DataTable';
import { Package, AlertTriangle, ArrowRight, Box, Search, RefreshCw, MoreVertical, X, TrendingDown } from 'lucide-react';
import { useApp } from '../App';

interface StockItem {
  sku: string;
  name: string;
  stock: number;
  status: string;
  category: string;
}

const STOCK_DATA: StockItem[] = [
  { sku: 'ERP-001', name: 'Premium ERP License', stock: 120, status: 'In Stock', category: 'Software' },
  { sku: 'CLD-010', name: 'Storage Unit (Basic)', stock: 12, status: 'Low Stock', category: 'Infrastructure' },
  { sku: 'SEC-202', name: 'Encryption Key V2', stock: 450, status: 'In Stock', category: 'Security' },
  { sku: 'SRV-X86', name: 'Baremetal Instance', stock: 0, status: 'Out of Stock', category: 'Infrastructure' },
  { sku: 'API-PRO', name: 'Advanced API Key', stock: 89, status: 'In Stock', category: 'Software' },
];

export const InventoryPage: React.FC = () => {
  const { showToast, globalSearch, setGlobalSearch } = useApp();

  const filteredStock = useMemo(() => {
    return STOCK_DATA.filter(item => 
      item.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
      item.sku.toLowerCase().includes(globalSearch.toLowerCase()) ||
      item.category.toLowerCase().includes(globalSearch.toLowerCase())
    );
  }, [globalSearch]);

  const columns: Column<StockItem>[] = [
    {
      key: 'name',
      label: 'Item Details',
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-white border border-transparent group-hover:border-slate-100 transition-all">
            <Box size={14} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-800 leading-none">{item.name}</span>
            <span className="text-[9px] font-mono text-slate-400 mt-1">{item.sku}</span>
          </div>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Category',
      cellClassName: 'text-[10px] font-bold text-slate-500'
    },
    {
      key: 'stock',
      label: 'Stock',
      cellClassName: 'text-xs font-black text-slate-900 tabular-nums'
    },
    {
      key: 'status',
      label: 'Status',
      render: (item) => (
        <Badge variant={
          item.status === 'In Stock' ? 'success' : 
          item.status === 'Low Stock' ? 'warning' : 'error'
        } className="text-[9px] py-0 h-5 flex items-center justify-center w-fit">
          {item.status}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: '',
      sortable: false,
      align: 'right',
      render: (item) => (
        <button onClick={(e) => { e.stopPropagation(); showToast(`Record: ${item.name}`, 'info'); }} className="p-1 text-slate-300 hover:text-slate-600 rounded-lg transition-all opacity-0 group-hover:opacity-100">
          <MoreVertical size={16} />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Inventory Management</h1>
          <p className="text-slate-500 text-xs font-medium">Real-time tracking of enterprise assets and resources.</p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={() => showToast('Generating report...', 'info')}
             className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 active:scale-95 transition-all shadow-sm"
           >
            <RefreshCw size={14} />
            Stock Report
          </button>
          <button 
            onClick={() => showToast('Opening bulk editor', 'info')}
            className="bg-[var(--primary)] text-white px-4 h-9 rounded-lg text-[10px] font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-md shadow-[var(--primary)]/20"
          >
            Update Stock
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          <Card noPadding className="border-slate-200/60 shadow-sm">
             <div className="px-5 py-3 bg-white border-b border-slate-100 flex flex-wrap gap-4 items-center justify-between">
               <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 focus-within:ring-4 focus-within:ring-[var(--primary)]/5 focus-within:bg-white rounded-lg px-3 py-1.5 w-full md:w-80 transition-all relative">
                 <Search size={14} className="text-slate-400" />
                 <input 
                   type="text" 
                   placeholder="Filter inventory SKUs..." 
                   className="bg-transparent border-none text-[11px] font-bold focus:ring-0 outline-none w-full pr-6"
                   value={globalSearch}
                   onChange={(e) => setGlobalSearch(e.target.value)}
                 />
                 {globalSearch && (
                    <button onClick={() => setGlobalSearch('')} className="absolute right-2 text-slate-300 hover:text-slate-500">
                      <X size={14} />
                    </button>
                 )}
               </div>
               <div className="flex gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Stable</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Review</span>
                  </div>
               </div>
             </div>
             
             <DataTable 
               data={filteredStock} 
               columns={columns} 
               rowKey={(i) => i.sku} 
             />
          </Card>
        </div>

        <div className="space-y-4">
          <Card 
            className="border-amber-200 bg-amber-50/20 shadow-amber-900/5 shadow-xl" 
            title="Operational Alert" 
            description="Procurement threshold detected."
          >
            <div className="space-y-4 py-1">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg border border-amber-200 text-amber-500 flex-shrink-0 shadow-sm animate-pulse">
                  <AlertTriangle size={16} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 leading-tight">Critical Depletion</h4>
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-1">
                    3 priority SKUs are currently below the safety stock margin (15% capacity).
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest">
                  <span className="text-slate-400">Restock Urgency</span>
                  <span className="text-amber-600">85% Priority</span>
                </div>
                <div className="h-1.5 w-full bg-amber-200/50 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full transition-all duration-1000" style={{ width: '85%' }}></div>
                </div>
                <div className="flex items-center gap-1.5 text-[8px] font-bold text-slate-400 uppercase italic">
                   <TrendingDown size={10} />
                   Stock reduced by 12% in last 24h
                </div>
              </div>

              <button 
                onClick={() => showToast('Procurement workflow initiated', 'success')} 
                className="w-full h-9 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2"
              >
                Initiate Purchase <ArrowRight size={12} strokeWidth={3} />
              </button>
            </div>
          </Card>

          <Card className="bg-slate-50 border-dashed border-slate-300">
             <div className="flex flex-col items-center justify-center text-center py-4 space-y-2">
                <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-300">
                   <Package size={20} />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Scanning</p>
                <p className="text-[9px] text-slate-500 px-4">Automatic sync with regional warehouse sensors is currently active.</p>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
