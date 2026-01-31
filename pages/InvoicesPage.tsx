
import React, { useMemo } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { DataTable, Column } from '../components/ui/DataTable';
import { FileText, MoreHorizontal, Search, Plus, Filter, X } from 'lucide-react';
import { useApp } from '../App';

interface Invoice {
  id: string;
  customer: string;
  amount: string;
  date: string;
  status: string;
}

const INVOICES: Invoice[] = [
  { id: 'INV-2023-001', customer: 'TechFlow Inc.', amount: '$12,400.00', date: 'Oct 12, 2023', status: 'Paid' },
  { id: 'INV-2023-002', customer: 'Rome Logistics', amount: '$4,200.00', date: 'Oct 15, 2023', status: 'Pending' },
  { id: 'INV-2023-003', customer: 'Global Traders', amount: '$8,900.00', date: 'Oct 08, 2023', status: 'Overdue' },
  { id: 'INV-2023-004', customer: 'Studio Hub', amount: '$1,200.00', date: 'Oct 18, 2023', status: 'Draft' },
  { id: 'INV-2023-005', customer: 'Umbrella Ops', amount: '$24,000.00', date: 'Oct 20, 2023', status: 'Pending' },
];

export const InvoicesPage: React.FC = () => {
  const { showToast, globalSearch, setGlobalSearch } = useApp();

  const filteredInvoices = useMemo(() => {
    return INVOICES.filter(inv => 
      inv.id.toLowerCase().includes(globalSearch.toLowerCase()) ||
      inv.customer.toLowerCase().includes(globalSearch.toLowerCase()) ||
      inv.status.toLowerCase().includes(globalSearch.toLowerCase())
    );
  }, [globalSearch]);

  const columns: Column<Invoice>[] = [
    {
      key: 'id',
      label: 'Invoice ID',
      render: (inv) => (
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-slate-50 rounded-lg group-hover:bg-white transition-colors">
            <FileText size={14} className="text-slate-400" />
          </div>
          <span className="text-sm font-bold text-slate-900 leading-none">{inv.id}</span>
        </div>
      )
    },
    { key: 'customer', label: 'Customer', cellClassName: 'text-sm font-semibold text-slate-600' },
    { key: 'date', label: 'Issued Date', cellClassName: 'text-xs font-medium text-slate-500' },
    { key: 'amount', label: 'Amount', align: 'right', cellClassName: 'text-sm font-black text-slate-900 tabular-nums' },
    {
      key: 'status',
      label: 'Status',
      align: 'center',
      render: (inv) => (
        <Badge variant={
          inv.status === 'Paid' ? 'success' : 
          inv.status === 'Pending' ? 'warning' : 
          inv.status === 'Overdue' ? 'error' : 'default'
        } className="text-[10px] py-0">
          {inv.status}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: '',
      sortable: false,
      align: 'right',
      render: (inv) => (
        <button onClick={() => showToast(`Previewing ${inv.id}`, 'info')} className="p-1 hover:bg-white border border-transparent hover:border-slate-200 rounded transition-all text-slate-400">
          <MoreHorizontal size={18} />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Billing & Invoices</h1>
          <p className="text-slate-500 text-xs">Issue and manage enterprise billing documents.</p>
        </div>
        <button 
          onClick={() => showToast('Invoice generator launched', 'info')}
          className="bg-[var(--primary)] text-white px-4 py-2 rounded-lg text-xs font-bold hover:opacity-95 shadow-sm flex items-center gap-2 active:scale-95 transition-all"
        >
          <Plus size={16} />
          <span>New Invoice</span>
        </button>
      </div>

      <Card noPadding className="overflow-hidden border-slate-200/60 shadow-md">
        <div className="p-4 flex flex-wrap gap-4 items-center justify-between bg-white border-b border-slate-100">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 min-w-[300px] focus-within:ring-2 focus-within:ring-[var(--primary)]/10 transition-all relative">
            <Search size={16} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Search invoices..." 
              className="bg-transparent border-none text-xs focus:ring-0 w-full outline-none"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
            />
            {globalSearch && (
              <button onClick={() => setGlobalSearch('')} className="absolute right-2 text-slate-300 hover:text-slate-500">
                <X size={14} />
              </button>
            )}
          </div>
          <div className="flex gap-2">
             <button onClick={() => showToast('Filter menu applied', 'info')} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-colors active:scale-95">
              <Filter size={14} />
              <span>Filter Status</span>
            </button>
          </div>
        </div>

        <DataTable 
          data={filteredInvoices} 
          columns={columns} 
          rowKey={(i) => i.id} 
        />
      </Card>
    </div>
  );
};
