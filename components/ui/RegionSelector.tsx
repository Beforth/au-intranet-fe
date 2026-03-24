import React from 'react';
import { AsyncSelect, AsyncSelectOption } from './AsyncSelect';
import { erpAPI } from '../../lib/erp-api';

interface RegionSelectorProps {
  domainId?: number;
  value?: number;
  onChange: (value: number | undefined) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export const RegionSelector: React.FC<RegionSelectorProps> = ({
  domainId,
  value,
  onChange,
  label = 'Region',
  placeholder = 'Select Region',
  error,
  required,
  disabled,
  className,
}) => {
  const loadOptions = async (search: string): Promise<AsyncSelectOption[]> => {
    try {
      const response = await erpAPI.getRegions({ 
        search, 
        domain_id: domainId, 
        is_active: true, 
        page_size: 50 
      });
      return response.items.map(r => ({
        value: r.id,
        label: r.name,
      }));
    } catch (err) {
      console.error('Error loading regions:', err);
      return [];
    }
  };

  // Unique key based on domainId to force reload when domain changes
  const selectorKey = `region-select-${domainId || 'all'}`;

  return (
    <AsyncSelect
      key={selectorKey}
      label={label}
      placeholder={domainId ? placeholder : 'Select Domain First'}
      value={value}
      onChange={(val) => onChange(val as number | undefined)}
      loadOptions={loadOptions}
      error={error}
      required={required}
      disabled={disabled || !domainId}
      className={className}
    />
  );
};
