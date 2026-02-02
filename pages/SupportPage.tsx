
import React, { useMemo } from 'react';
import { Card } from '../components/ui/Card';
import { HelpCircle, MessageSquare, Book, FileQuestion, ArrowRight, Search } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { useApp } from '../App';

const KNOWLEDGE_BASE = [
  'Security protocol for resetting root admin credentials',
  'Configuring automated regional tax calculation zones',
  'Synchronizing high-volume data streams with API v2.5',
  'Legacy migration path for structural warehouse data',
  'Billing cycle adjustment for enterprise clients',
  'Custom reporting modules and predictive analytics setup',
];

export const SupportPage: React.FC = () => {
  const { globalSearch, setGlobalSearch } = useApp();

  const filteredQuestions = useMemo(() => {
    return KNOWLEDGE_BASE.filter(q => 
      q.toLowerCase().includes(globalSearch.toLowerCase())
    );
  }, [globalSearch]);

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="text-center max-w-3xl mx-auto space-y-6 py-12">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">Global Help Center</h1>
        <p className="text-slate-500 text-lg font-medium max-w-xl mx-auto">Search our knowledge base or connect with a dedicated ERP specialist.</p>
        <div className="max-w-xl mx-auto">
          <Input 
            variant="white"
            inputSize="lg"
            className="rounded-2xl shadow-xl shadow-slate-200/50"
            placeholder="Search documentation..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            onClear={() => setGlobalSearch('')}
            icon={<Search size={22} className="text-slate-400" strokeWidth={2.5} />}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: 'User Manuals', icon: Book, desc: 'Technical documentation and step-by-step module configuration.' },
          { title: 'Admin Forum', icon: MessageSquare, desc: 'Collaborate with the global Aether ERP community.' },
          { title: 'Learning Hub', icon: HelpCircle, desc: 'Visual walkthroughs and interactive video masterclasses.' },
        ].map((item) => (
          <Card key={item.title} className="p-8 text-center hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 bg-[var(--primary-muted)] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <item.icon className="text-[var(--primary)]" size={28} strokeWidth={2.5} />
            </div>
            <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest mb-3 leading-none">{item.title}</h3>
            <p className="text-xs text-slate-500 mb-8 font-medium leading-relaxed">{item.desc}</p>
            <button className="text-[10px] font-black text-[var(--primary)] uppercase tracking-widest flex items-center gap-2 mx-auto hover:gap-3 transition-all">
              Launch Module <ArrowRight size={14} strokeWidth={3} />
            </button>
          </Card>
        ))}
      </div>

      <Card title="Knowledge Base: Popular Queries" description="Quick resolution for common enterprise inquiries.">
        <div className="divide-y divide-slate-100 -mx-6 -mb-6">
          {filteredQuestions.length > 0 ? filteredQuestions.map((q, i) => (
            <button key={i} className="w-full px-8 py-5 flex items-center justify-between group hover:bg-slate-50 transition-all text-left">
              <div className="flex items-center gap-5">
                <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-white group-hover:border-[var(--primary)]/20 transition-all">
                  <FileQuestion size={16} className="text-slate-300 group-hover:text-[var(--primary)] transition-colors" />
                </div>
                <span className="text-[13px] font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{q}</span>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                <span className="text-[9px] font-black text-[var(--primary)] uppercase tracking-widest">Read Article</span>
                <ArrowRight size={14} className="text-[var(--primary)]" strokeWidth={3} />
              </div>
            </button>
          )) : (
            <div className="px-8 py-12 text-center">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No matching help articles found.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
