
import React, { useMemo } from 'react';
import { Card } from '../components/ui/Card';
import { DataTable, Column } from '../components/ui/DataTable';
import { Input } from '../components/ui/Input';
import { FileText, Download, Clock, ExternalLink, BarChart3, Search } from 'lucide-react';
import { useApp } from '../App';

interface ReportTemplate {
  name: string;
  type: string;
  size: string;
}

const TEMPLATES: ReportTemplate[] = [
  { name: 'Annual Growth Forecast', type: 'Predictive', size: '2.4 MB' },
  { name: 'Weekly Operational Audit', type: 'Summary', size: '1.1 MB' },
  { name: 'Quarterly Financial Review', type: 'Audit', size: '4.8 MB' },
  { name: 'Regional Perf Matrix', type: 'Compare', size: '3.2 MB' },
  { name: 'Inventory Lifecycle Log', type: 'Logistics', size: '0.8 MB' },
];

export const ReportsPage: React.FC = () => {
  const { showToast, globalSearch, setGlobalSearch } = useApp();

  const filteredTemplates = useMemo(() => {
    return TEMPLATES.filter(t => 
      t.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
      t.type.toLowerCase().includes(globalSearch.toLowerCase())
    );
  }, [globalSearch]);

  const columns: Column<ReportTemplate>[] = [
    {
      key: 'name',
      label: 'Document Identity',
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-white transition-colors">
            <FileText size={14} className="text-slate-400" />
          </div>
          <span className="text-[11px] font-bold text-slate-800">{item.name}</span>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Audit Type',
      cellClassName: 'text-[9px] text-slate-400 font-bold uppercase tracking-widest'
    },
    {
      key: 'size',
      label: 'Capacity',
      cellClassName: 'text-[9px] text-slate-400 font-bold uppercase'
    },
    {
      key: 'actions',
      label: '',
      sortable: false,
      align: 'right',
      render: (item) => (
        <button 
          onClick={(e) => { e.stopPropagation(); showToast(`Downloading ${item.name}`, 'success'); }}
          className="p-1 text-slate-300 hover:text-[var(--primary)] transition-colors"
        >
          <Download size={14} />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Enterprise Reports</h1>
          <p className="text-slate-500 text-xs font-medium">Generate and manage comprehensive business insights.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Sales Summary', icon: BarChart3, count: 24, last: '2h ago' },
          { title: 'Inventory Logs', icon: FileText, count: 156, last: 'Yesterday' },
          { title: 'User Activity', icon: Clock, count: 12, last: '1h ago' },
          { title: 'Tax Statements', icon: Download, count: 8, last: '3d ago' },
        ].map((item) => (
          <Card 
            key={item.title} 
            onClick={() => showToast(`Opening ${item.title} directory`, 'info')}
            className="hover:border-[var(--primary)]/30 transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-1.5 bg-slate-50 rounded-lg group-hover:bg-[var(--primary-muted)] transition-colors">
                <item.icon className="text-slate-400 group-hover:text-[var(--primary)]" size={14} strokeWidth={2.5} />
              </div>
              <ExternalLink size={10} className="text-slate-200 group-hover:text-slate-400" />
            </div>
            <h3 className="font-bold text-slate-900 text-[12px] tracking-tight leading-none mb-1.5">{item.title}</h3>
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{item.count} Reports</span>
              <span className="text-[9px] font-bold text-slate-300 uppercase">{item.last}</span>
            </div>
          </Card>
        ))}
      </div>

      <Card noPadding title="Templates" description="Predefined auditing structures.">
        <div className="px-5 py-3 border-b border-slate-100 bg-white">
          <Input 
            variant="white"
            inputSize="sm"
            className="max-w-xs rounded-full shadow-sm"
            placeholder="Search report templates..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            onClear={() => setGlobalSearch('')}
            icon={<Search size={14} className="text-slate-400" strokeWidth={2.5} />}
          />
        </div>
        <DataTable 
          data={filteredTemplates}
          columns={columns}
          rowKey={(item) => item.name}
          className="border-none"
        />
      </Card>
    </div>
  );
};
