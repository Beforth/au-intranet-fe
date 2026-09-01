import React, { useState } from 'react';
import { Globe, RefreshCw } from 'lucide-react';
import { useApp } from '../App';
import { PageLayout } from '../components/layout/PageLayout';
import { BreadcrumbItem } from '../UI/Breadcrumb';
import { Button, Card, CardContent, Label } from '../UI';

export const SettingsPage: React.FC = () => {
  const { showToast, authUser, authEmployee } = useApp();
  const [isSaving, setIsSaving] = useState(false);
  const [emailConnected, setEmailConnected] = useState(false);
  const [emailConnectLoading, setEmailConnectLoading] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast('Settings updated', 'success');
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

  const fullName =
    `${authEmployee?.first_name ?? authUser?.first_name} ${authEmployee?.last_name ?? authUser?.last_name}`.trim() ||
    authUser?.username ||
    '';
  const email = authUser?.email ?? authEmployee?.email ?? '';
  const designation =
    authEmployee?.designation ??
    (authUser?.is_superuser ? 'Administrator' : 'User');
  const initials = fullName
    ? fullName.split(' ').map((part) => part[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
    : (authUser?.username ?? 'U').slice(0, 2).toUpperCase();

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Settings', href: '/settings' },
  ];

  return (
    <PageLayout
      title="Profile"
      description="Manage your account and preferences."
      breadcrumbs={breadcrumbs}
    >
      <div className="w-full">
        <Card className="rounded-2xl shadow-sm border-slate-200 overflow-hidden">
          <CardContent className="p-4 md:p-6 lg:p-8">
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">

              <div className="flex items-start gap-8">
                <div className="relative shrink-0">
                  <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200 overflow-hidden group">
                    <span className="text-2xl font-semibold uppercase tracking-widest text-slate-400">{initials}</span>
                    <button className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold uppercase tracking-widest">
                      Update
                    </button>
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
                    <div className="space-y-0.5">
                      <Label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Full Name</Label>
                      <div className="text-sm font-semibold text-slate-900">{fullName}</div>
                    </div>
                    <div className="space-y-0.5">
                      <Label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Email Address</Label>
                      <div className="text-sm font-semibold text-slate-900">{email}</div>
                    </div>
                    <div className="space-y-0.5">
                      <Label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Designation</Label>
                      <div className="text-sm font-semibold text-slate-900">{designation}</div>
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
                        <div className="text-xs font-semibold text-slate-400">{email}</div>
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
                  onClick={() => showToast('Permissions synced successfully', 'success')}
                  leftIcon={<RefreshCw size={14} />}
                >
                  Clear Cache
                </Button>
              </div>

              <div className="pt-6 flex justify-end gap-3">
                <Button variant="ghost" size="sm" className="text-xs font-semibold text-slate-400">Reset</Button>
                <Button onClick={handleSave} isLoading={isSaving} size="sm" className="px-8 text-xs uppercase font-semibold tracking-wide">
                  Save Changes
                </Button>
              </div>

            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};
