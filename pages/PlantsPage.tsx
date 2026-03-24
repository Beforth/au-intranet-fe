import React, { useState, useEffect, useCallback } from 'react';
import { erpAPI, Plant } from '../lib/erp-api';
import { PlantList } from '../components/ui/PlantList';
import { PlantForm } from '../components/ui/PlantForm';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { SearchInput } from '../components/ui/SearchInput';
import { Plus, Factory, Building2, MapPin } from 'lucide-react';
import { Card } from '../components/ui/Card';

export const PlantsPage: React.FC = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlant, setEditingPlant] = useState<Plant | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPlants = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await erpAPI.getPlants();
      setPlants(data);
    } catch (err) {
      console.error('Error fetching plants:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlants();
  }, [fetchPlants]);

  const handleCreate = () => {
    setEditingPlant(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (plant: Plant) => {
    setEditingPlant(plant);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: Partial<Plant>) => {
    setIsSubmitting(true);
    try {
      if (editingPlant) {
        await erpAPI.updatePlant(editingPlant.id, data);
      } else {
        await erpAPI.createPlant(data);
      }
      setIsModalOpen(false);
      fetchPlants();
    } catch (err) {
      console.error('Error saving plant:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (plant: Plant) => {
    if (window.confirm(`Are you sure you want to delete ${plant.plant_name}?`)) {
      try {
        await erpAPI.deletePlant(plant.id);
        fetchPlants();
      } catch (err) {
        console.error('Error deleting plant:', err);
      }
    }
  };

  const filteredPlants = plants.filter(p => 
    p.plant_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.plant_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Factory className="text-white" size={20} />
            </div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Plant Management</h1>
          </div>
          <p className="text-sm text-slate-500 font-medium">Manage operational facilities and manufacturing units.</p>
        </div>
        <Button onClick={handleCreate} leftIcon={<Plus size={18} />}>Add New Plant</Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-indigo-50 to-white border-indigo-100">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-indigo-100/50">
                 <Building2 size={18} className="text-indigo-600" />
              </div>
              <div>
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none mb-1">Total Units</p>
                <p className="text-xl font-black text-slate-900">{plants.length}</p>
              </div>
           </div>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-100">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-emerald-100/50">
                 <MapPin size={18} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest leading-none mb-1">Active Regions</p>
                <p className="text-xl font-black text-slate-900">{Array.from(new Set(plants.map(p => p.city))).length}</p>
              </div>
           </div>
        </Card>
      </div>

      <Card noPadding>
        <div className="p-4 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
          <SearchInput
            placeholder="Search by name, code or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
            className="max-w-md bg-white"
          />
        </div>
        <PlantList
          plants={filteredPlants}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => !isSubmitting && setIsModalOpen(false)}
        title={editingPlant ? 'Edit Plant' : 'Register New Plant'}
        size="lg"
      >
        <PlantForm
          initialData={editingPlant}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  );
};
