import React from 'react';
import { AsyncSelect, AsyncSelectOption } from './AsyncSelect';
import { erpAPI } from '../../lib/erp-api';

interface CustomerSelectorProps {
  value?: number;
  onChange: (value: number | undefined) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export const CustomerSelector: React.FC<CustomerSelectorProps> = ({
  value,
  onChange,
  label = 'Customer',
  placeholder = 'Select Customer',
  error,
  required,
  disabled,
  className,
}) => {
  const loadOptions = async (search: string): Promise<AsyncSelectOption[]> => {
    try {
      const response = await erpAPI.getCustomers({ 
        // Note: erpAPI.getCustomers doesn't have a search param in the signature I saw, 
        // but it's often implemented in the backend. In our mock mode, it returns everything.
        is_active: true, 
        page_size: 50 
      });
      
      // Filter manually if API search isn't mocked
      const filtered = search 
        ? response.items.filter(c => c.company_name.toLowerCase().includes(search.toLowerCase()))
        : response.items;

      return filtered.map(c => ({
        value: c.id,
        label: c.company_name,
      }));
    } catch (err) {
      console.error('Error loading customers:', err);
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
