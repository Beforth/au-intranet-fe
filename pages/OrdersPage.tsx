
import React, { useState, useMemo, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { DataTable, Column } from '../components/ui/DataTable';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  MoreHorizontal, 
  Loader2
} from 'lucide-react';
import { useApp } from '../App';
import { Modal } from '../components/ui/Modal';

interface Order {
  id: string;
  customer: string;
  product: string;
  amount: string;
  status: string;
  date: string;
}

const INITIAL_ORDERS: Order[] = [
  { id: '#ORD-7231', customer: 'Sarah Jenkins', product: 'Premium ERP Suite', amount: '$1,200.00', status: 'Processing', date: 'Oct 12, 2023' },
  { id: '#ORD-7232', customer: 'Michael Chen', product: 'Cloud Storage 1TB', amount: '$599.00', status: 'Shipped', date: 'Oct 13, 2023' },
  { id: '#ORD-7233', customer: 'Alisha Varma', product: 'Security Bundle', amount: '$850.00', status: 'Delivered', date: 'Oct 14, 2023' },
  { id: '#ORD-7234', customer: 'Robert Fox', product: 'Support Plan Pro', amount: '$2,100.00', status: 'Canceled', date: 'Oct 15, 2023' },
  { id: '#ORD-7235', customer: 'Emma Watson', product: 'API Access Key', amount: '$150.00', status: 'Delivered', date: 'Oct 15, 2023' },
  { id: '#ORD-7236', customer: 'David Bowie', product: 'Integration Kit', amount: '$420.00', status: 'Delivered', date: 'Oct 16, 2023' },
];

export const OrdersPage: React.FC = () => {
  const { showToast, globalSearch, setGlobalSearch } = useApp();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const filteredOrders = useMemo(() => {
    return INITIAL_ORDERS.filter(order => 
      order.customer.toLowerCase().includes(globalSearch.toLowerCase()) ||
      order.id.toLowerCase().includes(globalSearch.toLowerCase()) ||
      order.product.toLowerCase().includes(globalSearch.toLowerCase())
    );
  }, [globalSearch]);

  const handleDownload = () => {
    setIsDownloading(true);
    showToast('Exporting order manifest...', 'info');
    setTimeout(() => {
      setIsDownloading(false);
      showToast('Order manifest downloaded successfully', 'success');
    }, 1500);
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Processing new order entry...', 'info');
    setTimeout(() => {
      setIsCreateOpen(false);
      showToast('Order created successfully', 'success');
    }, 1000);
  };

  const columns: Column<Order>[] = [
    { 
      key: 'id', 
      label: 'Order Reference', 
      cellClassName: 'text-[13px] font-black text-[var(--primary)] tracking-tight' 
    },
    { 
      key: 'customer', 
      label: 'Client Name', 
      cellClassName: 'text-sm font-bold text-slate-900' 
    },
    { 
      key: 'product', 
      label: 'Product Module', 
      cellClassName: 'text-[12px] font-bold text-slate-500' 
    },
    { 
      key: 'date', 
      label: 'Transaction Date', 
      cellClassName: 'text-[11px] font-bold text-slate-400' 
    },
    { 
      key: 'amount', 
      label: 'Gross Value', 
      align: 'right', 
      cellClassName: 'text-sm font-black text-slate-900 tabular-nums' 
    },
    { 
      key: 'status', 
      label: 'Fulfillment', 
      align: 'center',
      render: (order) => (
        <Badge variant={
          order.status === 'Delivered' ? 'success' : 
          order.status === 'Processing' ? 'warning' : 
          order.status === 'Shipped' ? 'default' : 'error'
        } className="text-[10px] font-black tracking-widest uppercase h-6 px-3 flex items-center justify-center w-fit mx-auto">
          {order.status}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: '',
      sortable: false,
      align: 'right',
      render: (order) => (
        <button onClick={(e) => { e.stopPropagation(); showToast(`Opening details for ${order.id}`, 'info'); }} className="p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg transition-all text-slate-300 hover:text-slate-900 active:scale-90">
          <MoreHorizontal size={18} strokeWidth={2.5} />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Order Management</h1>
          <p className="text-slate-500 text-sm font-medium">Track and fulfill your enterprise orders with real-time accuracy.</p>
        </div>
        <div className="flex items-center gap-2">
           <button 
             onClick={handleDownload}
             disabled={isDownloading}
             className="p-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50 shadow-sm"
             title="Download CSV"
           >
            {isDownloading ? <Loader2 size={18} className="animate-spin text-slate-400" /> : <Download size={18} className="text-slate-600" />}
          </button>
          <button 
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 bg-[var(--primary)] text-white px-6 h-11 rounded-xl text-xs font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-[var(--primary)]/20"
          >
            <Plus size={18} strokeWidth={3} />
            <span>Generate New Order</span>
          </button>
        </div>
      </div>

      <Card noPadding className="overflow-hidden border-slate-200/60 shadow-md">
        <div className="p-5 border-b border-slate-100 flex flex-wrap gap-4 items-center justify-between bg-white">
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 min-w-[350px] focus-within:ring-4 focus-within:ring-[var(--primary)]/5 focus-within:bg-white transition-all shadow-sm">
            <Search size={18} className="text-slate-400" strokeWidth={2.5} />
            <input 
              type="text" 
              placeholder="Filter by Reference, Client, or Module..." 
              className="bg-transparent border-none text-[13px] font-bold focus:ring-0 w-full outline-none placeholder:text-slate-400"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => showToast('Advanced filtering options enabled', 'info')}
              className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
            >
              <Filter size={16} strokeWidth={2.5} />
              <span className="uppercase tracking-widest">Advanced Filters</span>
            </button>
          </div>
        </div>

        <DataTable 
          data={filteredOrders} 
          columns={columns} 
          rowKey={(o) => o.id}
          onRowClick={(o) => showToast(`Opening record ${o.id}`, 'info')}
        />

        <div className="p-5 border-t border-slate-100 flex items-center justify-between text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/30">
          <p>Displaying {filteredOrders.length} active records</p>
          <div className="flex gap-2">
            <button className="px-5 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-30 font-black uppercase tracking-widest" disabled>Prev</button>
            <button className="px-5 py-2 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-all active:scale-95 font-black uppercase tracking-widest text-slate-600">Next</button>
          </div>
        </div>
      </Card>

      <Modal 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
        title="Initialize New Transaction"
      >
        <form className="space-y-5" onSubmit={handleCreateOrder}>
           <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Client Identity</label>
            <input type="text" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-4 focus:ring-[var(--primary)]/10 focus:border-[var(--primary)] outline-none transition-all" placeholder="Legal business name" />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Asset Allocation</label>
            <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-4 focus:ring-[var(--primary)]/10 focus:border-[var(--primary)] outline-none transition-all">
              <option value="">Select a product...</option>
              <option value="erp">Premium ERP Suite</option>
              <option value="cloud">Cloud Storage 1TB</option>
              <option value="security">Security Bundle</option>
            </select>
          </div>
          <div className="pt-6 flex justify-end gap-3">
             <button type="button" onClick={() => setIsCreateOpen(false)} className="px-5 py-2.5 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">Cancel</button>
             <button type="submit" className="px-7 py-2.5 bg-[var(--primary)] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-[var(--primary)]/20 active:scale-95 transition-all">Create Record</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
