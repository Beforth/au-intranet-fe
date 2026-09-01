import React, { useEffect, useState, useCallback } from 'react';
import { Box, Pencil, Plus } from 'lucide-react';
import {
  fetchIntranetApps,
  createIntranetApp,
  updateIntranetApp,
  deleteIntranetApp,
  generateSSOToken,
  IntranetApp,
  IntranetAppPayload,
} from '../lib/auth';
import { useApp } from '../App';
import { Button, Modal, Input, Switch } from '../UI';
import { DeleteButton } from '../components/ui/DeleteButton';

const INTRANET_BASE_URL = import.meta.env.VITE_INTRANET_BASE_URL ?? 'http://localhost:8000';

function resolveIconPath(icon: string | null): string | null {
  if (!icon) return null;
  if (/^https?:\/\//i.test(icon)) return icon;
  return `${INTRANET_BASE_URL}${icon}`;
}

const EMPTY_FORM: Omit<IntranetAppPayload, 'name' | 'url'> & { name: string; url: string } = {
  name: '',
  url: '',
  description: '',
  is_active: true,
  sort_order: 0,
};

const AdminPage: React.FC = () => {
  const { authUser, authPermissions, showToast } = useApp();
  const [apps, setApps] = useState<IntranetApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Manage state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<IntranetApp | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const canManage =
    authUser?.is_superuser === true ||
    authPermissions.some((p) => p.code === 'intranet.manage');

  const loadApps = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchIntranetApps();
      const active = data
        .filter((app) => app.is_active)
        .sort((a, b) => {
          const byOrder = a.sort_order - b.sort_order;
          if (byOrder !== 0) return byOrder;
          return a.name.localeCompare(b.name);
        });
      setApps(active);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadApps();
  }, [loadApps]);

  const openCreate = () => {
    setEditingApp(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setModalOpen(true);
  };

  const openEdit = (app: IntranetApp) => {
    setEditingApp(app);
    setForm({
      name: app.name,
      url: app.url,
      description: app.description ?? '',
      is_active: app.is_active,
      sort_order: app.sort_order,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleField = (field: keyof typeof EMPTY_FORM, value: string | boolean | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      setFormError('Name is required.');
      return;
    }
    if (!form.url.trim()) {
      setFormError('URL is required.');
      return;
    }

    setSaving(true);
    setFormError(null);
    try {
      const payload: IntranetAppPayload = {
        name: form.name.trim(),
        url: form.url.trim(),
        description: (form.description ?? '').trim() || null,
        is_active: form.is_active,
        sort_order: typeof form.sort_order === 'number' ? form.sort_order : Number(form.sort_order) || 0,
      };
      if (editingApp) {
        await updateIntranetApp(editingApp.id, payload);
        showToast('Application updated', 'success');
      } else {
        await createIntranetApp(payload);
        showToast('Application created', 'success');
      }
      setModalOpen(false);
      await loadApps();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save application');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (app: IntranetApp) => {
    setDeletingId(app.id);
    try {
      await deleteIntranetApp(app.id);
      showToast(`Application "${app.name}" deleted`, 'info');
      await loadApps();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to delete application', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-500 text-sm">
        Loading applications...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-500 text-sm">
        <p className="mb-2">{error}</p>
        <p>Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      {canManage && (
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-bold text-slate-900">Applications</h1>
            <p className="text-sm text-slate-500">Manage the applications available in the launcher.</p>
          </div>
          <Button size="sm" onClick={openCreate} leftIcon={<Plus size={16} />}>
            Add Application
          </Button>
        </div>
      )}

      {apps.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400 text-sm">
          <p>No applications available.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-8">
          {apps.map((app) => (
            <ModuleCard
              key={app.id}
              app={app}
              canManage={canManage}
              onEdit={() => openEdit(app)}
              onDelete={() => handleDelete(app)}
              deleting={deletingId === app.id}
              showToast={showToast}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingApp ? 'Update Application' : 'Add Application'}
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} isLoading={saving}>
              {editingApp ? 'Save Changes' : 'Create'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {formError && (
            <div className="px-3 py-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {formError}
            </div>
          )}
          <Input
            label="Name"
            value={form.name}
            onChange={(e) => handleField('name', e.target.value)}
            placeholder="e.g. T-HRMS"
          />
          <Input
            label="URL"
            value={form.url}
            onChange={(e) => handleField('url', e.target.value)}
            placeholder="https://hrms.example.com"
          />
          <Input
            label="Description"
            value={form.description ?? ''}
            onChange={(e) => handleField('description', e.target.value)}
            placeholder="Short description (optional)"
          />
          <Input
            label="Sort Order"
            type="number"
            value={String(form.sort_order)}
            onChange={(e) => handleField('sort_order', Number(e.target.value))}
          />
          <div className="pt-1">
            <Switch
              label="Active (visible in launcher)"
              size="md"
              checked={form.is_active}
              onChange={(e) => handleField('is_active', e.target.checked)}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

const ModuleCard: React.FC<{
  app: IntranetApp;
  canManage: boolean;
  onEdit: () => void;
  onDelete: () => void;
  deleting: boolean;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}> = ({ app, canManage, onEdit, onDelete, deleting, showToast }) => {
  const iconUrl = resolveIconPath(app.icon);
  const [launching, setLaunching] = useState(false);

  const handleLaunch = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLaunching(true);
    try {
      const data = await generateSSOToken(app.id);
      window.location.href = data.redirect_url;
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Failed to launch application',
        'error'
      );
      setLaunching(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center gap-2 group">
      {canManage && (
        <div className="absolute top-0 right-0 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={onEdit}
            title="Edit"
            className="flex justify-center items-center text-slate-500 hover:text-blue-600 transition-colors p-1 rounded-md hover:bg-blue-50/70 active:scale-95"
          >
            <Pencil size={14} />
          </button>
          <DeleteButton onClick={onDelete} size={14} />
        </div>
      )}

      <a
        href={app.url}
        onClick={handleLaunch}
        title={app.description ?? app.name}
        className="flex flex-col items-center gap-2 group focus:outline-none"
      >
        <div
          className={`
            w-16 h-16 rounded-2xl flex items-center justify-center
            bg-blue-500
            shadow-md group-hover:shadow-lg group-hover:scale-105
            transition-all duration-200
            ${launching ? 'animate-pulse opacity-60' : ''}
          `}
        >
          {iconUrl ? (
            <img
              src={iconUrl}
              alt={app.name}
              className="w-16 h-16 rounded-2xl object-cover"
              loading="lazy"
            />
          ) : (
            <Box size={30} strokeWidth={1.8} className="text-white" />
          )}
        </div>
        <span className="text-[12px] font-medium text-slate-700 group-hover:text-slate-900 text-center leading-tight max-w-[72px] truncate">
          {launching ? 'Launching...' : app.name}
        </span>
      </a>

      {canManage && deleting && (
        <span className="text-[10px] text-rose-500 animate-pulse">Deleting...</span>
      )}
    </div>
  );
};

export default AdminPage;
