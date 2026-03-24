import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { DomainSelector } from '../components/ui/DomainSelector';
import { RegionSelector } from '../components/ui/RegionSelector';
import { CustomerSelector } from '../components/ui/CustomerSelector';
import { PlantSelector } from '../components/ui/PlantSelector';
import { PlantForm } from '../components/ui/PlantForm';
import { PlantList } from '../components/ui/PlantList';
import { Globe, Package, Users, FileText, Layout, Layers, Box, Cpu } from 'lucide-react';

export const ComponentLibraryPage: React.FC = () => {
  const [selectedDomain, setSelectedDomain] = useState<number | undefined>(undefined);
  const [selectedRegion, setSelectedRegion] = useState<number | undefined>(undefined);
  const [selectedCustomer, setSelectedCustomer] = useState<number | undefined>(undefined);
  const [selectedPlant, setSelectedPlant] = useState<number | undefined>(undefined);

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Header */}
      <section className="relative py-12 px-8 rounded-3xl bg-slate-900 overflow-hidden shadow-2xl shadow-indigo-200/20">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-transparent to-blue-500/10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full -mr-20 -mt-20" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-500/20 rounded-lg backdrop-blur-md border border-indigo-400/30">
              <Cpu size={24} className="text-indigo-400" />
            </div>
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-[0.3em]">Pure UI Library v1.0</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            21st.dev <span className="text-indigo-400 text-3xl font-normal ml-2">/ ERP Operations</span>
          </h1>
          <p className="text-slate-400 max-w-2xl text-lg leading-relaxed font-medium">
            High-density, backend-independent industrial UI components. Designed for performance, modularity, and rapid deployment.
          </p>
        </div>
      </section>

      {/* 1. Specialized Selectors */}
      <section id="selectors">
        <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
            <Layers size={20} className="text-slate-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Specialized Selectors</h2>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Industrial Data Entry</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <p className="text-[10px] font-bold text-indigo-500 uppercase mb-4 tracking-widest">Domain</p>
            <DomainSelector 
              value={selectedDomain} 
              onChange={(val) => {
                setSelectedDomain(val);
                setSelectedRegion(undefined);
              }}
            />
            <div className="mt-4 p-3 bg-slate-50 rounded-lg text-[10px] font-mono text-slate-400">
              VALUE: {selectedDomain || 'None'}
            </div>
          </Card>

          <Card className="p-6">
            <p className="text-[10px] font-bold text-indigo-500 uppercase mb-4 tracking-widest">Region (Dep. on Domain)</p>
            <RegionSelector 
              domainId={selectedDomain}
              value={selectedRegion} 
              onChange={setSelectedRegion}
              disabled={!selectedDomain}
            />
            <div className="mt-4 p-3 bg-slate-50 rounded-lg text-[10px] font-mono text-slate-400">
              VALUE: {selectedRegion || 'None'}
            </div>
          </Card>

          <Card className="p-6">
            <p className="text-[10px] font-bold text-indigo-500 uppercase mb-4 tracking-widest">Customer</p>
            <CustomerSelector 
              value={selectedCustomer} 
              onChange={setSelectedCustomer}
            />
            <div className="mt-4 p-3 bg-slate-50 rounded-lg text-[10px] font-mono text-slate-400">
              VALUE: {selectedCustomer || 'None'}
            </div>
          </Card>

          <Card className="p-6">
            <p className="text-[10px] font-bold text-indigo-500 uppercase mb-4 tracking-widest">Plant (Dep. on Customer)</p>
            <PlantSelector 
              customerId={selectedCustomer}
              value={selectedPlant} 
              onChange={setSelectedPlant}
              disabled={!selectedCustomer}
            />
            <div className="mt-4 p-3 bg-slate-50 rounded-lg text-[10px] font-mono text-slate-400">
              VALUE: {selectedPlant || 'None'}
            </div>
          </Card>
        </div>
      </section>

      {/* 2. Operations Module */}
      <section id="operations">
        <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
            <Box size={20} className="text-slate-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Plant Management</h2>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Operational Facilities</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          <div className="xl:col-span-4">
            <Card className="p-8 border-indigo-100 shadow-indigo-100/20 h-full">
              <h3 className="text-sm font-black text-slate-900 uppercase mb-6 tracking-widest">Add New Plant</h3>
              <PlantForm 
                onSubmit={async (d) => console.log('Plant Submitted', d)}
                onCancel={() => {}}
              />
            </Card>
          </div>
          <div className="xl:col-span-8">
            <Card className="overflow-hidden border-slate-100 shadow-sm h-full">
              <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Existing Units</h3>
                <div className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold">LIVE PREVIEW</div>
              </div>
              <PlantList 
                plants={[]} // Pass mock empty to see state or populate 
                onEdit={() => {}} 
                onDelete={() => {}} 
              />
            </Card>
          </div>
        </div>
      </section>

      {/* 3. Base UI Gallery */}
      <section id="ui-gallery">
        <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
            <Layout size={20} className="text-slate-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Base UI Components</h2>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Foundation Library</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <Card className="p-10 flex flex-col items-center justify-center gap-4 border-dashed border-2 hover:border-indigo-300 transition-colors">
            <div className="flex gap-2">
              <Button size="sm">Primary</Button>
              <Button size="sm" variant="outline">Outline</Button>
              <Button size="sm" variant="ghost">Ghost</Button>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Buttons</p>
          </Card>

          <Card className="p-10 flex flex-col items-center justify-center gap-4 border-dashed border-2 hover:border-indigo-300 transition-colors">
            <Input placeholder="Sample Input..." className="max-w-xs" />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Inputs</p>
          </Card>

          <Card className="p-10 flex flex-col items-center justify-center gap-4 border-dashed border-2 hover:border-indigo-300 transition-colors">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-indigo-500" />
              <div className="w-6 h-6 rounded bg-indigo-600" />
              <div className="w-6 h-6 rounded bg-slate-900" />
              <div className="w-6 h-6 rounded bg-slate-700" />
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Design Tokens</p>
          </Card>
        </div>
      </section>
    </div>
  );
};
