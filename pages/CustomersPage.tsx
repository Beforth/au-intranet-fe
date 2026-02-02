
import React, { useState, useMemo } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Search, UserPlus, Building2, ShieldCheck, ArrowUpRight, MoreHorizontal, Filter } from 'lucide-react';
import { useApp } from '../App';
import { PageLayout } from '../components/layout/PageLayout';

const CUSTOMERS = [
  { id: 'CUST-001', name: 'Alice Thompson', role: 'Enterprise Admin', company: 'TechFlow Inc.', email: 'alice@techflow.com', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=alice' },
  { id: 'CUST-002', name: 'Marcus Aurelius', role: 'Billing Manager', company: 'Rome Logistics', email: 'marcus@rome.com', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=marcus' },
  { id: 'CUST-003', name: 'Sven Gali', role: 'Supply Chain Lead', company: 'Global Traders', email: 'sven@global.com', status: 'Pending', avatar: 'https://i.pravatar.cc/150?u=sven' },
  { id: 'CUST-004', name: 'Julia Roberts', role: 'HR Director', company: 'Studio Hub', email: 'julia@studio.com', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=julia' },
  { id: 'CUST-005', name: 'Leon Kennedy', role: 'Security Consultant', company: 'Umbrella Ops', email: 'leon@umbrella.com', status: 'Inactive', avatar: 'https://i.pravatar.cc/150?u=leon' },
  { id: 'CUST-006', name: 'Ada Wong', role: 'Field Agent', company: 'Cipher', email: 'ada@cipher.net', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=ada' },
  { id: 'CUST-007', name: 'Bruce Wayne', role: 'CEO', company: 'Wayne Enterprises', email: 'bruce@wayne.com', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=bruce' },
  { id: 'CUST-008', name: 'Tony Stark', role: 'Chief Engineer', company: 'Stark Industries', email: 'tony@stark.com', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=tony' },
  { id: 'CUST-009', name: 'Clark Kent', role: 'Journalist', company: 'Daily Planet', email: 'clark@dailyplanet.com', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=clark' },
];

export const CustomersPage: React.FC = () => {
  const { showToast, globalSearch, setGlobalSearch, customers: demoCustomers } = useApp();

  const filteredCustomers = useMemo(() => {
    // Merge local and demo data
    const combined = [...CUSTOMERS, ...demoCustomers];
    // Filter by search
    return combined.filter(c =>
      c.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
      c.email.toLowerCase().includes(globalSearch.toLowerCase()) ||
      c.company.toLowerCase().includes(globalSearch.toLowerCase())
    );
  }, [globalSearch, demoCustomers]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Active':
        return { variant: 'success' as const, dotClass: 'bg-emerald-500 animate-pulse', containerClass: 'bg-emerald-100/50 text-emerald-700' };
      case 'Pending':
        return { variant: 'warning' as const, dotClass: 'bg-amber-500', containerClass: 'bg-amber-100/50 text-amber-700' };
      default:
        return { variant: 'error' as const, dotClass: 'bg-rose-500', containerClass: 'bg-rose-100/50 text-rose-700' };
    }
  };

  const actions = (
    <Button
      size="sm"
      onClick={() => showToast('Initializing account setup...', 'info')}
      leftIcon={<UserPlus size={14} strokeWidth={3} />}
    >
      New Client Account
    </Button>
  );

  return (
    <PageLayout
      title="Customer Registry"
      description="Manage enterprise-level client relationships."
      actions={actions}
    >

      <div className="flex items-center gap-3">
        <Input
          variant="white"
          inputSize="sm"
          className="rounded-full shadow-sm"
          icon={<Search size={14} strokeWidth={2.5} />}
          placeholder="Filter customer records..."
          value={globalSearch}
          onChange={(e) => setGlobalSearch(e.target.value)}
          containerClassName="max-w-md"
        />
        <Button variant="outline" size="sm" className="rounded-full" leftIcon={<Filter size={14} />}>Filter Status</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.length > 0 ? filteredCustomers.map((customer) => {
          const statusStyle = getStatusConfig(customer.status);
          return (
            <Card key={customer.id} noPadding className="group hover:border-indigo-200/50 overflow-hidden">
              <div className="p-5 border-b border-slate-50 flex items-start justify-between bg-slate-50/30">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img src={customer.avatar} alt="" className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-sm group-hover:scale-105 transition-transform" />
                    <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${customer.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900 text-sm truncate leading-none tracking-tight">{customer.name}</h3>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2 inline-block leading-none">{customer.id}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="xs"
                  className="text-slate-300 hover:text-slate-600"
                  leftIcon={<MoreHorizontal size={14} />}
                />
              </div>

              <div className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Organization</p>
                    <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-700">
                      <Building2 size={12} className="text-slate-300" />
                      <span className="truncate">{customer.company}</span>
                    </div>
                  </div>
                  <div className="space-y-1.5 text-right flex flex-col items-end">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Status</p>
                    <Badge className={`text-[8px] px-2 h-4.5 font-bold uppercase tracking-widest inline-flex items-center gap-1.5 border-none shadow-sm ${statusStyle.containerClass}`}>
                      <span className={`w-1 h-1 rounded-full ${statusStyle.dotClass}`} />
                      {customer.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50/20 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={12} className="text-emerald-500/80" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Secure Client</span>
                </div>
                <Button variant="link" size="xs" className="text-indigo-600 hover:text-indigo-700 font-bold" rightIcon={<ArrowUpRight size={12} strokeWidth={3} />}>
                  View Portfolio
                </Button>
              </div>
            </Card>
          );
        }) : (
          <div className="col-span-full py-24 text-center">
            <p className="text-slate-900 font-black text-sm uppercase tracking-widest">No matching indices</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
};
