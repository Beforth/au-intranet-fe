import React, { useMemo, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SearchInput } from '../components/ui/SearchInput';
import {
  HelpCircle, BookOpen, FileQuestion, ArrowRight, ExternalLink,
  Layers, Users, ShoppingCart, BarChart2, FileText, Settings,
  Globe, Briefcase, ChevronRight, ChevronDown, LayoutDashboard,
} from 'lucide-react';
import { PageLayout } from '../components/layout/PageLayout';
import { BreadcrumbItem } from '../UI/Breadcrumb';

const MODULES = [
  {
    id: 'leads',
    label: 'Leads',
    icon: Briefcase,
    faqs: [
      { q: 'How do I create a new lead?', a: 'Go to Leads and click "New lead". Link a Contact or Customer, select Domain & Region, choose a number series, fill in Lead type, Lead through (e.g. Cold Calling, Website), and an optional potential value. Click Save — a Lead No. is auto-generated.' },
      { q: 'How do I move a lead through the pipeline?', a: 'In Kanban view, drag the lead card from one status column to another (e.g. New → Quote generated). Won and Lost leads are final. If the target status requires extra info, a form will appear.' },
      { q: 'How do I mark a lead as Won?', a: 'Move the lead to Won in Kanban and enter the Closed value when prompted. The lead becomes final and cannot be dragged further.' },
      { q: 'How do I set a follow-up reminder?', a: 'Open the lead and set the "Next follow-up date" field. Use the Activities (Enquiry log) section to log calls, meetings, and notes — these appear in lead detail and reports.' },
    ],
  },
  {
    id: 'quotations',
    label: 'Quotations',
    icon: FileText,
    faqs: [
      { q: 'How do I view quotations?', a: 'Click Quotations in the sidebar. You see the list with lead reference, date, and status. Use search or filters if available on the page.' },
      { q: 'How do I create a quotation?', a: 'From Quotations, click "New quotation", or open a lead and add a quotation from there. Select the Lead, fill in quote details (products, amounts, validity), and save.' },
    ],
  },
  {
    id: 'orders',
    label: 'Orders',
    icon: ShoppingCart,
    faqs: [
      { q: 'How do I create a new order?', a: 'Go to Orders and click "New order". Link it to a Won lead, choose the number series, enter Order value and Region, and save.' },
      { q: 'How do I update an order status?', a: 'In Kanban view, drag the order card to a new status column (e.g. Pending → Drawing Approved). Won and Lost orders are final.' },
    ],
  },
  {
    id: 'database',
    label: 'Database',
    icon: Users,
    faqs: [
      { q: 'How do I add an Organization?', a: 'Go to Database → Organizations, click "New organization", enter Name, Code, Industry and other fields. In the Plants tab add plants with name, code, and address.' },
      { q: 'How do I convert a Contact to a Customer?', a: 'Open the Contact, then use the "Convert to customer" action. This creates a Customer record linked to the same contact.' },
    ],
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: BarChart2,
    faqs: [
      { q: 'How do I run a report?', a: 'Click Reports in the sidebar and select the report type. Set your date range, domain, and region.' },
      { q: 'How do I create a custom Report Template?', a: 'Go to Report Templates and click "New report template". Add sections with a Title and a SQL SELECT query.' },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    faqs: [
      { q: 'How do I connect my Gmail account?', a: 'Go to Settings → Profile, scroll to Integrations, and click "Connect Account" under Gmail.' },
      { q: 'Where do I manage Numbering Series?', a: 'Go to Settings → Numbering Series (admin only). Configure the prefix and sequence for Lead, Order, and other numbers.' },
    ],
  },
];

export const SupportPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const toggle = (key: string) => setOpen(prev => ({ ...prev, [key]: !prev[key] }));

  const filtered = useMemo(() => {
    if (!search.trim()) return MODULES;
    const q = search.toLowerCase();
    return MODULES.map(m => ({
      ...m,
      faqs: m.faqs.filter(f =>
        f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q)
      ),
    })).filter(m => m.faqs.length > 0);
  }, [search]);

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Support', href: '/support' },
  ];

  return (
    <PageLayout
      title="Help Center"
      description="Find answers and step-by-step guides for every module."
      breadcrumbs={breadcrumbs}
    >
      <div className="space-y-6">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Full User Guide', icon: BookOpen, desc: 'Complete step-by-step documentation for every module.' },
            { title: 'Getting Started', icon: Layers, desc: 'Login, dashboard overview, and first steps.' },
            { title: 'Schema Reference', icon: FileQuestion, desc: 'Table and column reference for custom report templates.' },
          ].map((item) => (
            <div key={item.title} className="block group cursor-pointer">
              <Card className="hover:-translate-y-1 transition-all duration-200 h-full">
                <div className="flex flex-col gap-4 h-full">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                    <item.icon size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[13px] font-bold text-slate-900 tracking-tight mb-1">{item.title}</h3>
                    <p className="text-[11px] text-slate-400 font-medium leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-blue-600 group-hover:gap-2.5 transition-all">
                    Open guide <ExternalLink size={11} />
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>

        <SearchInput
          placeholder="Search help articles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch('')}
        />

        <div className="space-y-3">
          {filtered.map((module) => (
            <div
              key={module.id}
              className="bg-white border border-slate-200/50 rounded-[1.25rem] shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_40px_-15px_rgba(0,0,0,0.02)] overflow-hidden transition-all duration-200"
            >
              <button
                className="w-full flex items-center gap-4 px-6 py-4 hover:bg-slate-50/60 transition-colors text-left"
                onClick={() => toggle(module.id)}
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                  <module.icon size={15} />
                </div>
                <span className="text-[13px] font-bold text-slate-900 tracking-tight flex-1">{module.label}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">{module.faqs.length} articles</span>
                  <div
                    className={`transition-transform duration-200 ${open[module.id] ? 'rotate-180' : ''}`}
                  >
                    <ChevronDown size={14} className="text-slate-400" />
                  </div>
                </div>
              </button>

              <div
                className="transition-all duration-300 ease-in-out"
                style={{
                  maxHeight: open[module.id] ? '2000px' : '0px',
                  opacity: open[module.id] ? 1 : 0,
                  overflow: 'hidden',
                }}
              >
                <div className="border-t border-slate-100 divide-y divide-slate-100">
                  {module.faqs.map((faq, i) => (
                    <div key={i} className="px-6 py-5 bg-slate-50/30 flex items-start gap-4">
                      <HelpCircle size={13} className="text-slate-300 mt-0.5 shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <p className="text-[13px] font-bold text-slate-900 tracking-tight">{faq.q}</p>
                        <p className="text-[12px] text-slate-500 font-medium leading-relaxed">{faq.a}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="py-24 text-center">
              <p className="text-slate-900 font-semibold">No articles found</p>
              <p className="text-slate-500 text-sm mt-1">Try a different search term.</p>
            </div>
          )}
        </div>

        <div className="flex items-start gap-3 px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50/50">
          <HelpCircle size={15} className="text-slate-300 shrink-0 mt-0.5" />
          <p className="text-[12px] font-medium text-slate-500">
            If a menu item or action is missing, your user role may not have the required permission.{' '}
            <span className="text-slate-700 font-bold">Contact your administrator</span> to request access.
          </p>
        </div>

      </div>
    </PageLayout>
  );
};
