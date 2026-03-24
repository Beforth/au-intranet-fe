import React, { useState } from 'react';
import { Input } from './Input';
import { Button } from './Button';
import { Switch } from './Switch';
import { Plant } from '../../lib/erp-api';
import { CustomerSelector } from './CustomerSelector';

interface PlantFormProps {
  initialData?: Partial<Plant>;
  onSubmit: (data: Partial<Plant>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const PlantForm: React.FC<PlantFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<Partial<Plant>>({
    plant_name: '',
    plant_code: '',
    address_line1: '',
    city: '',
    state: '',
    country: 'India',
    contact_person_name: '',
    contact_email: '',
    contact_phone: '',
    is_active: true,
    ...initialData,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CustomerSelector
          value={formData.customer_id}
          onChange={(val) => setFormData(prev => ({ ...prev, customer_id: val }))}
          required
        />
        <Input
          label="Plant Name"
          name="plant_name"
          value={formData.plant_name}
          onChange={handleChange}
          placeholder="e.g. Mumbai Manufacturing Unit"
          required
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Plant Code"
          name="plant_code"
          value={formData.plant_code}
          onChange={handleChange}
          placeholder="e.g. PL-MUM-01"
        />
      </div>

      <div className="space-y-4">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-2">Location Details</h4>
        <Input
          label="Address Line 1"
          name="address_line1"
          value={formData.address_line1}
          onChange={handleChange}
          placeholder="Street address, P.O. box, etc."
        />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Input
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
          />
          <Input
            label="State"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="State"
          />
          <Input
            label="Country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Country"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-2">Primary Contact</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Contact Person"
            name="contact_person_name"
            value={formData.contact_person_name}
            onChange={handleChange}
            placeholder="Name"
          />
          <Input
            label="Email"
            name="contact_email"
            type="email"
            value={formData.contact_email}
            onChange={handleChange}
            placeholder="email@example.com"
          />
          <Input
            label="Phone"
            name="contact_phone"
            value={formData.contact_phone}
            onChange={handleChange}
            placeholder="+91..."
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <Switch
          label="Mark as Active"
          checked={formData.is_active}
          onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
        />
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" isLoading={isLoading}>
            {initialData?.id ? 'Update Plant' : 'Create Plant'}
          </Button>
        </div>
      </div>
    </form>
  );
};
