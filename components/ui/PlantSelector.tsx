import React from 'react';
import { AsyncSelect, AsyncSelectOption } from './AsyncSelect';
import { erpAPI } from '../../lib/erp-api';

interface PlantSelectorProps {
  customerId?: number;
  contactId?: number;
  value?: number;
  onChange: (value: number | undefined) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export const PlantSelector: React.FC<PlantSelectorProps> = ({
  customerId,
  contactId,
  value,
  onChange,
  label = 'Plant',
  placeholder = 'Select Plant',
  error,
  required,
  disabled,
  className,
}) => {
  const loadOptions = async (search: string): Promise<AsyncSelectOption[]> => {
    try {
      const response = await erpAPI.getPlants({ 
        customer_id: customerId,
        contact_id: contactId
      });
      
      const filtered = search 
        ? response.filter(p => p.plant_name.toLowerCase().includes(search.toLowerCase()))
        : response;

      return filtered.map(p => ({
        value: p.id,
        label: p.plant_name,
      }));
    } catch (err) {
      console.error('Error loading plants:', err);
      return [];
    }
  };

  const selectorKey = `plant-select-${customerId || 'all'}-${contactId || 'all'}`;

  return (
    <AsyncSelect
      key={selectorKey}
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={(val) => onChange(val as number | undefined)}
      loadOptions={loadOptions}
      error={error}
      required={required}
      disabled={disabled}
      className={className}
    />
  );
};
