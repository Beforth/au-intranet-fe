
import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import {
  User,
  Bell,
  Shield,
  Globe,
  Monitor,
  Mail,
  Loader2,
  Check
} from 'lucide-react';
import { useApp } from '../App';
import { PageLayout } from '../components/layout/PageLayout';
import { Button } from '../components/ui/Button';
import { useTheme, Density } from '../context/ThemeContext';

type SettingsTab = 'Profile' | 'Security' | 'Notifications' | 'Display' | 'Integrations';

export const SettingsPage: React.FC = () => {
  const { showToast } = useApp();
  const { density, setDensity } = useTheme();
  const [activeTab, setActiveTab] = useState<SettingsTab>('Profile');
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    firstName: 'Alex',
    lastName: 'Rivera',
    email: 'alex.rivera@aethererp.com'
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast(`${activeTab} preferences updated`, 'success');
    }, 800);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Display':
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Interface Density</p>
              <div className="flex gap-2">
                {(['compact', 'default', 'relaxed'] as Density[]).map(d => (
                  <Button
                    key={d}
                    variant={density === d ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={() => setDensity(d)}
                    className="flex-1 rounded-xl"
                  >
                    {d}
                  </Button>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 italic">Density affects global component padding and whitespace.</p>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-900">Visual Aesthetic</p>
              <p className="text-xs text-slate-400 mt-1">Dark mode has been disabled in favor of the legacy professional light interface.</p>
            </div>
          </div>
        );

      case 'Profile':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <img src="https://i.pravatar.cc/150?u=alex" alt="Avatar" className="w-20 h-20 rounded-2xl object-cover ring-4 ring-slate-50" />
              <div>
                <h4 className="font-bold text-slate-900">{formData.firstName} {formData.lastName}</h4>
                <p className="text-xs text-slate-400 font-medium">System Administrator • Austin, TX</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">First Name</label>
                <input type="text" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[var(--primary-accent)]/20 transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Last Name</label>
                <input type="text" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[var(--primary-accent)]/20 transition-all" />
              </div>
            </div>
          </div>
        );

      default:
        return <div className="py-20 text-center text-slate-400 text-sm">Module coming soon in the next update.</div>;
    }
  };

  const tabs: { label: SettingsTab; icon: any }[] = [
    { label: 'Profile', icon: User },
    { label: 'Display', icon: Monitor },
    { label: 'Security', icon: Shield },
    { label: 'Notifications', icon: Bell },
    { label: 'Integrations', icon: Globe },
  ];

  return (
    <PageLayout
      title="Account Configuration"
      description="Fine-tune your Aether ERP environment and identity."
    >

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="space-y-1">
          {tabs.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === item.label ? 'bg-[var(--primary-muted)] text-[var(--primary)] shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </aside>

        <div className="md:col-span-3">
          <Card
            title={activeTab}
            description="Manage your global system and account preferences."
          >
            <div className="space-y-6">
              {renderContent()}
              <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                <Button
                  onClick={handleSave}
                  isLoading={isSaving}
                  size="sm"
                  className="min-w-[120px]"
                >
                  Apply Settings
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};
