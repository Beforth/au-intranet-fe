import React, { useState, useMemo, useEffect } from 'react';
import {
  User,
  Globe,
  RefreshCw,
  History,
  Calendar,
  Sparkles,
  Bug,
  Tag,
} from 'lucide-react';
import { useApp } from '../App';
import { PageLayout } from '../components/layout/PageLayout';
import { BreadcrumbItem } from '../UI/Breadcrumb';
import { Column } from '../components/ui/DataTable';
import { DataTable } from '../components/ui/DataTable';
import { Pagination } from '../components/ui/Pagination';
import { SearchInput } from '../components/ui/SearchInput';
import {
  Button,
  Card,
  CardContent,
  Input,
  Label,
} from '../UI';

const MOCK_USER = {
  firstName: 'Alex',
  lastName: 'Rivera',
  email: 'alex.rivera@aethererp.com',
  role: 'System Administrator',
  location: 'Austin, TX',
};

interface AuditLog {
  id: string;
  created_at: string;
  employee_name: string;
  action: string;
  entity_type: string;
  details: string;
  entity_id: string;
}

const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: '1', created_at: '2026-06-28T09:15:00Z', employee_name: 'Alex Rivera', action: 'Login', entity_type: 'system', details: 'Successful login from Austin, TX', entity_id: '' },
  { id: '2', created_at: '2026-06-27T14:30:00Z', employee_name: 'Sarah Jenkins', action: 'Create', entity_type: 'order', details: 'Created order ORD-7237 for TechCorp', entity_id: 'ORD-7237' },
  { id: '3', created_at: '2026-06-27T11:20:00Z', employee_name: 'Mark Greene', action: 'Update', entity_type: 'lead', details: 'Updated lead status to Won', entity_id: 'L-1042' },
  { id: '4', created_at: '2026-06-26T16:45:00Z', employee_name: 'Alice Thompson', action: 'Delete', entity_type: 'customer', details: 'Removed customer record ID 5821', entity_id: '5821' },
  { id: '5', created_at: '2026-06-26T10:00:00Z', employee_name: 'Alex Rivera', action: 'Update', entity_type: 'settings', details: 'Changed notification preferences', entity_id: '' },
  { id: '6', created_at: '2026-06-25T08:30:00Z', employee_name: 'System', action: 'Sync', entity_type: 'hrms', details: 'HRMS employee sync completed (12 updated)', entity_id: '' },
  { id: '7', created_at: '2026-06-24T13:15:00Z', employee_name: 'Ellen Ripley', action: 'Create', entity_type: 'quotation', details: 'Created quotation Q-202 for Lead L-1038', entity_id: 'Q-202' },
  { id: '8', created_at: '2026-06-24T09:45:00Z', employee_name: 'John Doe', action: 'Convert', entity_type: 'lead', details: 'Converted lead L-1035 to customer', entity_id: 'C-891' },
];

const MOCK_VERSIONS = [
  {
    version: '1.1.1',
    release_date: 'June 28, 2026',
    sections: [
      { title: 'New Features', items: ['Audit Logs tab in Settings for full activity tracking', 'Version changelog modal accessible from sidebar', 'Expanded dashboard with Team Leaderboard chart'] },
      { title: 'Bug Fixes', items: ['Fixed pagination reset on search', 'Resolved Sidebar active state flicker on route change', 'Corrected breadcrumb overflow on narrow screens'] },
    ],
  },
  {
    version: '1.1.0',
    release_date: 'June 15, 2026',
    sections: [
      { title: 'New Features', items: ['Help Center page with module FAQ accordion', 'Quick-launch cards for User Guide and Getting Started', 'SearchInput component with debounced filtering'] },
      { title: 'Enhancements', items: ['Migrated design system to Outfit font family', 'Unified button variants across all Button components', 'Card component now supports title/description/actions slots'] },
    ],
  },
  {
    version: '1.0.0',
    release_date: 'June 1, 2026',
    sections: [
      { title: 'Initial Release', items: ['Dashboard with revenue charts and KPI cards', 'Order and Quotation management pages', 'Customer and Inventory management', 'Financial reporting module', 'Settings and Support pages'] },
    ],
  },
];

type SettingsTab = 'Profile' | 'Audit Logs' | 'Versions';

export const SettingsPage: React.FC = () => {
  const { showToast } = useApp();
  const [activeTab, setActiveTab] = useState<SettingsTab>('Profile');
  const [isSaving, setIsSaving] = useState(false);

  const [emailConnected, setEmailConnected] = useState(false);
  const [emailConnectLoading, setEmailConnectLoading] = useState(false);

  const [logsPage, setLogsPage] = useState(1);
  const [logsPageSize, setLogsPageSize] = useState(25);
  const [logsSearch, setLogsSearch] = useState('');

  const filteredLogs = useMemo(() => {
    if (!logsSearch.trim()) return MOCK_AUDIT_LOGS;
    const q = logsSearch.toLowerCase();
    return MOCK_AUDIT_LOGS.filter(log =>
      log.employee_name.toLowerCase().includes(q) ||
      log.action.toLowerCase().includes(q) ||
      log.entity_type.toLowerCase().includes(q) ||
      log.details.toLowerCase().includes(q)
    );
  }, [logsSearch]);

  const paginatedLogs = useMemo(() => {
    const start = (logsPage - 1) * logsPageSize;
    return filteredLogs.slice(start, start + logsPageSize);
  }, [filteredLogs, logsPage, logsPageSize]);

  useEffect(() => { setLogsPage(1); }, [logsSearch]);

  const auditLogColumns = useMemo<Column<AuditLog>[]>(() => [
    {
      key: 'created_at',
      label: 'Date & Time',
      width: 140,
      render: (log) => (
        <div>
          <div className="text-[10px] font-mono text-slate-400 tracking-tighter uppercase leading-none mb-1">
            {new Date(log.created_at).toLocaleDateString('en-GB')}
          </div>
          <div className="text-xs font-semibold text-slate-700 leading-none">
            {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      ),
    },
    {
      key: 'employee_name',
      label: 'User',
      width: 200,
      render: (log) => {
        const name = log.employee_name || 'System';
        const initial = name.slice(0, 1).toUpperCase();
        return (
          <div className="flex items-center gap-2">
            <div className="size-6 rounded-full bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center font-bold text-[10px] uppercase shrink-0">
              {initial}
            </div>
            <span className="text-xs font-semibold text-slate-800 truncate max-w-[150px] leading-tight" title={name}>
              {name}
            </span>
          </div>
        );
      },
    },
    {
      key: 'action',
      label: 'Action',
      width: 100,
      align: 'center',
      render: (log) => {
        const action = log.action?.toLowerCase() || '';
        const isDanger = action.includes('delete') || action.includes('remove');
        const isSuccess = action.includes('create') || action.includes('add') || action.includes('won') || action.includes('convert');
        return (
          <span className={
            `inline-flex items-center justify-center px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border ` +
            (isDanger ? 'bg-rose-50 text-rose-700 border-rose-200' :
            isSuccess ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
            'bg-blue-50 text-blue-700 border-blue-200')
          }>
            {log.action}
          </span>
        );
      },
    },
    {
      key: 'details',
      label: 'Log Details',
      render: (log) => {
        const entityLabel = log.entity_type ? log.entity_type.split('_').join(' ') : 'System';
        return (
          <div className="flex items-start gap-2 max-w-full">
            <span className="shrink-0 inline-flex items-center px-1.5 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 rounded text-[9px] font-bold uppercase tracking-wider mt-0.5">
              {entityLabel}
            </span>
            <span
              className="text-xs text-slate-600 font-medium leading-normal break-words whitespace-normal"
              title={log.details || ''}
            >
              {log.details || `ID: ${log.entity_id || 'n/a'}`}
            </span>
          </div>
        );
      },
    },
  ], []);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast(`${activeTab} preferences updated`, 'success');
    }, 800);
  };

  const handleConnectEmail = () => {
    setEmailConnectLoading(true);
    setTimeout(() => {
      setEmailConnected(true);
      setEmailConnectLoading(false);
      showToast('Gmail account connected successfully', 'success');
    }, 1200);
  };

  const handleDisconnectEmail = () => {
    setEmailConnected(false);
    showToast('Gmail account disconnected', 'info');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Profile':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-start gap-8">
              <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 overflow-hidden group">
                  <span className="text-2xl font-semibold uppercase tracking-widest text-slate-400">AR</span>
                  <button className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold uppercase tracking-widest">
                    Update
                  </button>
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
                  <div className="space-y-0.5">
                    <Label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Full Name</Label>
                    <div className="text-sm font-semibold text-slate-900">{MOCK_USER.firstName} {MOCK_USER.lastName}</div>
                  </div>
                  <div className="space-y-0.5">
                    <Label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Email Address</Label>
                    <div className="text-sm font-semibold text-slate-900">{MOCK_USER.email}</div>
                  </div>
                  <div className="space-y-0.5">
                    <Label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Designation</Label>
                    <div className="text-sm font-semibold text-slate-900">{MOCK_USER.role}</div>
                  </div>
                  <div className="space-y-0.5">
                    <Label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Status</Label>
                    <div className="flex items-center gap-1.5">
                      <div className="size-1.5 rounded-full bg-emerald-500" />
                      <span className="text-xs text-emerald-600">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 -mx-4 md:-mx-6 lg:-mx-8" />

            <div className="space-y-5 pt-2">
              <h4 className="text-[11px] font-semibold uppercase tracking-tight text-slate-900">Integrations</h4>

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-200">
                    <Globe size={18} />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-tight text-slate-900">Gmail Account</div>
                    <div className="text-sm font-semibold text-slate-400">Connect to send automated follow-up emails.</div>
                  </div>
                </div>

                {emailConnected ? (
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs text-emerald-600">Authenticated</div>
                      <div className="text-xs font-semibold text-slate-400">{MOCK_USER.email}</div>
                    </div>
                    <Button variant="outline" size="xs" onClick={handleDisconnectEmail} className="h-8 px-3 border-slate-200">
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <Button variant="secondary" size="sm" onClick={handleConnectEmail} isLoading={emailConnectLoading} className="h-8 text-xs px-4 font-semibold rounded-lg">
                    Connect Account
                  </Button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-tight text-slate-900">Permissions Sync</div>
                <div className="text-sm font-semibold text-slate-400">Force refresh your access tokens and permissions.</div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-8 border-dashed text-slate-500 hover:text-blue-600 hover:border-blue-200 font-semibold uppercase tracking-wide text-xs"
                onClick={() => { showToast('Permissions synced successfully', 'success'); }}
                leftIcon={<RefreshCw size={14} />}
              >
                Clear Cache
              </Button>
            </div>

            <div className="pt-6 flex justify-end gap-3">
              <Button variant="ghost" size="sm" onClick={() => setActiveTab('Profile')} className="text-xs font-semibold text-slate-400">Reset</Button>
              <Button onClick={handleSave} isLoading={isSaving} size="sm" className="px-8 text-xs uppercase font-semibold tracking-wide">Save Changes</Button>
            </div>
          </div>
        );

      case 'Audit Logs':
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-3">
              <SearchInput
                placeholder="Filter by user, action, entity or details..."
                value={logsSearch}
                onChange={(e) => setLogsSearch(e.target.value)}
                onClear={() => setLogsSearch('')}
                containerClassName="max-w-md shadow-none"
                inputSize="sm"
              />
            </div>

            <DataTable<AuditLog>
              bordered={true}
              data={paginatedLogs}
              rowKey={(l) => l.id}
              dense={true}
              columns={auditLogColumns}
            />

            <div className="border-t border-slate-100 pt-3">
              <Pagination
                page={logsPage}
                pageSize={logsPageSize}
                total={filteredLogs.length}
                totalPages={Math.ceil(filteredLogs.length / logsPageSize)}
                onPageChange={setLogsPage}
                onPageSizeChange={(sz: number) => { setLogsPageSize(sz); setLogsPage(1); }}
              />
            </div>
          </div>
        );

      case 'Versions':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="space-y-8">
              {MOCK_VERSIONS.map((v) => (
                <div key={v.version} className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-2">
                    <span className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 rounded-lg">
                      Version {v.version}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <Calendar size={12} className="text-slate-300" />
                      {v.release_date}
                    </span>
                  </div>
                  <div className="space-y-4 pl-4 border-l-2 border-slate-100/80">
                    {v.sections.map((section) => (
                      <section key={section.title} className="space-y-2">
                        <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          {section.title.toLowerCase().includes('bug') ? (
                            <Bug size={13} className="text-rose-500" />
                          ) : (
                            <Sparkles size={13} className="text-amber-500" />
                          )}
                          {section.title}
                        </h4>
                        <ul className="list-disc pl-5 space-y-1.5 text-slate-600 text-xs leading-relaxed font-medium">
                          {section.items.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </section>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const tabs: { label: SettingsTab; icon: any }[] = [
    { label: 'Profile', icon: User },
    { label: 'Audit Logs', icon: History },
    { label: 'Versions', icon: Tag },
  ];

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Settings', href: '/settings' },
    { label: activeTab },
  ];

  return (
    <PageLayout
      title={activeTab}
      description="Manage your account, review activity, and track version changes."
      breadcrumbs={breadcrumbs}
    >
      <div className="w-full space-y-4">
        <div className="flex items-center justify-between gap-4 py-1 border-b border-slate-100 mb-2">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth">
            {tabs.map((item) => (
              <button
                key={item.label}
                onClick={() => setActiveTab(item.label)}
                className={
                  `flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 relative group whitespace-nowrap active:scale-[0.98] ` +
                  (activeTab === item.label
                    ? 'text-blue-600 font-semibold'
                    : 'text-slate-500 hover:text-slate-900')
                }
              >
                {activeTab === item.label && (
                  <span className="absolute inset-0 bg-blue-50 rounded-xl -z-10 animate-in fade-in duration-200" />
                )}
                <item.icon size={15} className={`transition-transform group-hover:scale-110 ${activeTab === item.label ? 'text-blue-600' : 'opacity-40'}`} />
                <span className="text-xs font-medium uppercase tracking-wide">{item.label}</span>
                {activeTab === item.label && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-blue-600 rounded-full animate-in fade-in duration-200" />
                )}
              </button>
            ))}
          </div>
        </div>

        <main className="w-full">
          <Card className="rounded-2xl shadow-sm border-slate-200 overflow-hidden">
            <CardContent className="p-4 md:p-6 lg:p-8">
              {renderContent()}
            </CardContent>
          </Card>
        </main>
      </div>
    </PageLayout>
  );
};
