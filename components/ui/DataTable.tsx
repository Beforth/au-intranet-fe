
import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

export interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  render?: (item: T) => React.ReactNode;
  headerClassName?: string;
  cellClassName?: string;
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  rowKey: (item: T) => string | number;
  onRowClick?: (item: T) => void;
  className?: string;
  hideHeader?: boolean;
  /** Enables or disables sorting for the entire table. Defaults to true. */
  enableSorting?: boolean;
}

export function DataTable<T>({ 
  data, 
  columns, 
  rowKey, 
  onRowClick, 
  className = '', 
  hideHeader = false,
  enableSorting = true 
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{ key: keyof T | string | null; direction: 'asc' | 'desc' | null }>({
    key: null,
    direction: null,
  });

  const handleSort = (key: keyof T | string) => {
    let direction: 'asc' | 'desc' | null = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = null;
    }
    setSortConfig({ key: direction ? key : null, direction });
  };

  const isColumnSortable = (col: Column<T>) => {
    return enableSorting && col.sortable !== false && col.label !== '';
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return data;

    return [...data].sort((a, b) => {
      let aValue: any = (a as any)[sortConfig.key!];
      let bValue: any = (b as any)[sortConfig.key!];

      // Smart parsing for ERP data types
      const parseValue = (val: any) => {
        if (val === undefined || val === null) return -Infinity;
        if (typeof val === 'number') return val;
        
        const str = String(val).trim();
        
        // 1. Handle Currency and negative amounts
        if (str.includes('$') || str.match(/^-?\$/)) {
          return parseFloat(str.replace(/[$,]/g, '')) || 0;
        }

        // 2. Natural sorting for Alphanumeric IDs (SKU-1 vs SKU-10)
        if (str.match(/[0-9]/) && str.match(/[a-zA-Z]/)) {
          return str;
        }

        // 3. Date Parsing
        const timestamp = Date.parse(str);
        if (!isNaN(timestamp)) return timestamp;
        
        // 4. Fallback to lowercase string
        return str.toLowerCase();
      };

      const valA = parseValue(aValue);
      const valB = parseValue(bValue);

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortConfig.direction === 'asc' 
          ? valA.localeCompare(valB, undefined, { numeric: true, sensitivity: 'base' })
          : valB.localeCompare(valA, undefined, { numeric: true, sensitivity: 'base' });
      }

      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const SortIndicator = ({ columnKey }: { columnKey: keyof T | string }) => {
    const isActive = sortConfig.key === columnKey;
    if (!isActive) {
      return (
        <ChevronsUpDown 
          size={12} 
          className="opacity-0 group-hover/header:opacity-40 transition-all duration-300 transform translate-x-1 group-hover/header:translate-x-0" 
        />
      );
    }
    return sortConfig.direction === 'asc' 
      ? <ChevronUp size={12} className="text-[var(--primary)] animate-in fade-in zoom-in duration-300" strokeWidth={3} /> 
      : <ChevronDown size={12} className="text-[var(--primary)] animate-in fade-in zoom-in duration-300" strokeWidth={3} />;
  };

  return (
    <div className={`overflow-x-auto relative ${className}`}>
      {/* Subtle sort progress indicator */}
      {sortConfig.key && (
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-[var(--primary)]/10 z-30 overflow-hidden">
          <div className="h-full bg-[var(--primary)] animate-pulse" style={{ width: '100%' }}></div>
        </div>
      )}
      
      <table className="w-full text-left border-separate border-spacing-0">
        {!hideHeader && (
          <thead className="sticky top-0 z-20">
            <tr className="bg-slate-50/90 backdrop-blur-md border-b border-slate-200">
              {columns.map((col) => {
                const sortable = isColumnSortable(col);
                return (
                  <th
                    key={String(col.key)}
                    className={`
                      px-6 py-4 transition-all select-none group/header
                      ${sortable ? 'cursor-pointer hover:bg-slate-100/80 active:bg-slate-200/50' : ''} 
                      ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : ''} 
                      ${col.headerClassName || ''}
                    `}
                    style={{ width: col.width }}
                    onClick={() => sortable && handleSort(col.key)}
                  >
                    <div className={`flex items-center gap-2 ${col.align === 'center' ? 'justify-center' : col.align === 'right' ? 'justify-end' : ''}`}>
                      <span className={`
                        text-[10px] uppercase font-black tracking-widest transition-colors duration-300
                        ${sortConfig.key === col.key ? 'text-[var(--primary)]' : 'text-slate-400 group-hover/header:text-slate-600'}
                      `}>
                        {col.label}
                      </span>
                      {sortable && <SortIndicator columnKey={col.key} />}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
        )}
        <tbody className="divide-y divide-slate-100 bg-white">
          {sortedData.length > 0 ? sortedData.map((item, idx) => (
            <tr
              key={String(rowKey(item))}
              onClick={() => onRowClick?.(item)}
              className={`
                group transition-all duration-300
                ${onRowClick ? 'cursor-pointer' : ''} 
                hover:bg-[var(--primary-muted)]/20
                ${sortConfig.key ? 'hover:shadow-inner' : ''}
              `}
            >
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className={`
                    px-6 py-5 transition-colors duration-300
                    ${sortConfig.key === col.key ? 'bg-[var(--primary-muted)]/5 font-medium' : ''}
                    ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : ''} 
                    ${col.cellClassName || ''}
                  `}
                >
                  <div className="animate-in fade-in slide-in-from-left-1 duration-300">
                    {col.render ? col.render(item) : (item as any)[col.key]}
                  </div>
                </td>
              ))}
            </tr>
          )) : (
            <tr>
              <td colSpan={columns.length} className="px-6 py-20 text-center">
                <div className="flex flex-col items-center gap-2 opacity-40">
                  <ChevronsUpDown size={32} className="text-slate-300" />
                  <p className="text-sm font-black uppercase tracking-widest text-slate-400">
                    No matching records found
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
