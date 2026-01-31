
import React from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { DataTable, Column } from '../components/ui/DataTable';
import { CreditCard, DollarSign, ArrowUpRight, ArrowDownRight, Briefcase, TrendingUp } from 'lucide-react';
import { useApp } from '../App';

interface LedgerEntry {
  label: string;
  amount: string;
  date: string;
  status: string;
}

export const FinancialsPage: React.FC = () => {
  const { showToast } = useApp();

  const handleDownload = () => {
    showToast('Generating fiscal year-end report...', 'info');
    setTimeout(() => showToast('Report generated successfully', 'success'), 1500);
  };

  const handleCardClick = (title: string) => {
    showToast(`Opening analytics for ${title}`, 'info');
  };

  const ledgerData: LedgerEntry[] = [
    { label: 'Cloud Hosting Sub', amount: '-$1,200.00', date: 'Oct 15, 2023', status: 'Paid' },
    { label: 'Client Retention Bonus', amount: '+$5,400.00', date: 'Oct 14, 2023', status: 'Hold' },
    { label: 'Payroll - Dept A', amount: '-$22,500.00', date: 'Oct 12, 2023', status: 'Paid' },
    { label: 'Maintenance Fee', amount: '-$450.00', date: 'Oct 10, 2023', status: 'Paid' },
    { label: 'Global Licensing', amount: '+$12,000.00', date: 'Oct 09, 2023', status: 'Pending' },
  ];

  const columns: Column<LedgerEntry>[] = [
    {
      key: 'label',
      label: 'Description',
      cellClassName: 'text-[11px] font-black text-slate-800 tracking-tight'
    },
    {
      key: 'date',
      label: 'Date',
      cellClassName: 'text-[9px] text-slate-400 font-bold uppercase tracking-widest'
    },
    {
      key: 'status',
      label: 'Status',
      render: (item) => (
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.status}</span>
      )
    },
    {
      key: 'amount',
      label: 'Amount',
      align: 'right',
      render: (item) => {
        const isPositive = item.amount.startsWith('+');
        return (
          <span className={`text-[11px] font-black tabular-nums ${isPositive ? 'text-emerald-600' : 'text-slate-900'}`}>
            {item.amount}
          </span>
        );
      }
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Financial Reporting</h1>
          <p className="text-slate-500 text-xs font-medium">Real-time fiscal monitoring and revenue forecasting modules.</p>
        </div>
        <button 
          onClick={handleDownload}
          className="bg-[var(--primary)] text-white px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest hover:brightness-105 active:scale-95 transition-all shadow-md shadow-[var(--primary)]/10"
        >
          Download Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card onClick={() => handleCardClick('Net Profit')}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <DollarSign size={16} className="text-blue-600" />
            </div>
            <Badge variant="outline" className="text-slate-400 font-black uppercase tracking-widest text-[8px] py-0 border-slate-100">OCT 2023</Badge>
          </div>
          <p className="text-slate-400 text-[9px] font-black uppercase tracking-wider leading-none mb-1">Net Profit</p>
          <h3 className="text-xl font-black text-slate-900 tabular-nums">$142,402.00</h3>
          <div className="flex items-center gap-1 mt-3 text-emerald-600 text-[9px] font-black uppercase">
            <ArrowUpRight size={12} strokeWidth={3} />
            <span>+12.5% vs LW</span>
          </div>
        </Card>

        <Card onClick={() => handleCardClick('Operating Expenses')}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 bg-rose-50 rounded-lg flex items-center justify-center">
              <Briefcase size={16} className="text-rose-600" />
            </div>
            <Badge variant="success" className="font-black text-[8px] px-1 py-0 uppercase border-emerald-100 bg-emerald-50">Target Met</Badge>
          </div>
          <p className="text-slate-400 text-[9px] font-black uppercase tracking-wider leading-none mb-1">Op. Expenses</p>
          <h3 className="text-xl font-black text-slate-900 tabular-nums">$45,210.00</h3>
          <div className="flex items-center gap-1 mt-3 text-rose-500 text-[9px] font-black uppercase">
            <ArrowDownRight size={12} strokeWidth={3} />
            <span>-2.1% efficiency</span>
          </div>
        </Card>

        <Card onClick={() => handleCardClick('Outstanding Credit')}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
              <CreditCard size={16} className="text-amber-600" />
            </div>
            <TrendingUp size={14} className="text-slate-300" />
          </div>
          <p className="text-slate-400 text-[9px] font-black uppercase tracking-wider leading-none mb-1">Credit Risk</p>
          <h3 className="text-xl font-black text-slate-900 tabular-nums">$12,000.45</h3>
          <div className="mt-4">
            <div className="w-full bg-slate-50 rounded-full h-1 overflow-hidden">
               <div className="bg-amber-400 h-full transition-all duration-1000" style={{ width: '45%' }}></div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Revenue Stream" description="Q4 Predictive analysis results.">
          <div className="h-[140px] flex items-end gap-1.5 px-0.5 pt-4">
            {[65, 45, 95, 75, 55, 85, 100].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
                <div 
                  className="w-full bg-[var(--primary)]/30 group-hover:bg-[var(--primary)] rounded-sm transition-all duration-300 cursor-pointer" 
                  style={{ height: `${h}%` }}
                ></div>
                <span className="text-[7px] font-black text-slate-300 uppercase tracking-tighter">W{i+1}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card noPadding title="Ledger Highlights" description="Latest verified system entries.">
          <DataTable 
            data={ledgerData}
            columns={columns}
            rowKey={(item) => item.label + item.date}
            className="border-none"
          />
        </Card>
      </div>
    </div>
  );
};
