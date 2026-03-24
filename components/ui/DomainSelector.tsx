import React from 'react';
import { AsyncSelect, AsyncSelectOption } from './AsyncSelect';
import { erpAPI } from '../../lib/erp-api';

interface DomainSelectorProps {
  value?: number;
  onChange: (value: number | undefined) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export const DomainSelector: React.FC<DomainSelectorProps> = ({
  value,
  onChange,
  label = 'Domain',
  placeholder = 'Select Domain',
  error,
  required,
  disabled,
  className,
}) => {
  const loadOptions = async (search: string): Promise<AsyncSelectOption[]> => {
    try {
      const response = await erpAPI.getDomains({ search, is_active: true, page_size: 50 });
      return response.items.map(d => ({
        value: d.id,
        label: d.name,
      }));
    } catch (err) {
      console.error('Error loading domains:', err);
      return [];
    }
  };

  return (
    <AsyncSelect
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
