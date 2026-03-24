import React from 'react';
import { DataTable, Column } from './DataTable';
import { Plant } from '../../lib/erp-api';
import { Badge } from './Badge';
import { Button } from './Button';
import { Edit2, Trash2, MapPin, User, Mail, Phone } from 'lucide-react';

interface PlantListProps {
  plants: Plant[];
  isLoading?: boolean;
  onEdit: (plant: Plant) => void;
  onDelete: (plant: Plant) => void;
}

export const PlantList: React.FC<PlantListProps> = ({
  plants,
  isLoading = false,
  onEdit,
  onDelete,
}) => {
  const columns: Column<Plant>[] = [
    {
      key: 'plant_name',
      label: 'Plant Details',
      render: (plant) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900">{plant.plant_name}</span>
          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{plant.plant_code || 'No Code'}</span>
        </div>
      )
    },
    {
      key: 'location',
      label: 'Location',
      render: (plant) => (
        <div className="flex items-center gap-2 text-slate-500">
          <MapPin size={14} className="text-slate-400" />
          <span className="text-xs">{plant.city ? `${plant.city}, ${plant.state || ''}` : 'No Address'}</span>
        </div>
      )
    },
    {
      key: 'contact',
      label: 'Primary Contact',
      render: (plant) => (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2 text-slate-700 font-semibold text-xs">
            <User size={12} className="text-slate-400" />
            {plant.contact_person_name || 'N/A'}
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-[10px]">
            <Mail size={10} className="text-slate-400" />
            {plant.contact_email || 'N/A'}
          </div>
        </div>
      )
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (plant) => (
        <Badge variant={plant.is_active ? 'success' : 'secondary'}>
          {plant.is_active ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: '',
      align: 'right',
      render: (plant) => (
        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="xs"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(plant);
            }}
          >
            <Edit2 size={14} />
          </Button>
          <Button
            variant="ghost"
            size="xs"
            className="text-rose-500 hover:text-rose-600 hover:bg-rose-50"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(plant);
            }}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      )
    }
  ];

  return (
    <DataTable
      data={plants}
      columns={columns}
      rowKey={(p) => p.id}
      isLoading={isLoading}
      onRowClick={onEdit}
    />
  );
};
