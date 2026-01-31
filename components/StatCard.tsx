
import React from 'react';
import { StatItem } from '../types';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const StatCard: React.FC<{ stat: StatItem }> = ({ stat }) => {
  const isUp = stat.trend === 'up';

  return (
    <div 
      className="bg-white rounded-2xl border border-slate-200/60 hover:border-[var(--primary)]/30 transition-all group cursor-default shadow-sm hover:shadow-lg hover:shadow-[var(--primary)]/5 flex flex-col justify-between"
      style={{ padding: 'var(--ui-padding, 1.25rem)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400 group-hover:text-[var(--primary)] group-hover:bg-[var(--primary-muted)] transition-all">
          <stat.icon size={16} strokeWidth={2.5} />
        </div>
        <div className={`flex items-center gap-0.5 text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-tighter ${isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {isUp ? <ArrowUpRight size={10} strokeWidth={3} /> : <ArrowDownRight size={10} strokeWidth={3} />}
          {stat.change.split(' ')[0]}
        </div>
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2.5">{stat.label}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-black text-slate-900 tracking-tighter tabular-nums leading-none">{stat.value}</h3>
        </div>
        <p className="text-[9px] text-slate-400 font-medium mt-3 italic truncate">{stat.change.replace(stat.change.split(' ')[0], '').trim()}</p>
      </div>
    </div>
  );
};
