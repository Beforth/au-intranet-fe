
import React from 'react';
import { GripVertical, Maximize2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface CardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
  onClick?: () => void;
  isDraggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  showHandle?: boolean;
  onResize?: () => void;
  noPadding?: boolean;
  maxHeight?: string;
  contentClassName?: string;
}

export const Card: React.FC<CardProps> = ({
  title,
  description,
  children,
  className,
  headerAction,
  onClick,
  isDraggable,
  onDragStart,
  onDragOver,
  onDrop,
  showHandle,
  onResize,
  noPadding = false,
  maxHeight = 'none',
  contentClassName
}) => {
  return (
    <div
      draggable={isDraggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={cn(
        'bg-white border border-slate-200 transition-all duration-300 relative group/card flex flex-col min-h-[140px] shadow-sm',
        onClick && 'cursor-pointer hover:shadow-md hover:border-slate-300',
        isDraggable && 'cursor-move active:scale-[0.99]',
        className
      )}
      style={{ maxHeight, borderRadius: 'var(--ui-radius, 0.75rem)' }}
      onClick={onClick}
    >
      {showHandle && (
        <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity z-20">
          {onResize && (
            <button
              onClick={(e) => { e.stopPropagation(); onResize(); }}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"
            >
              <Maximize2 size={12} />
            </button>
          )}
          <div className="text-slate-300 cursor-move p-1.5">
            <GripVertical size={14} />
          </div>
        </div>
      )}

      {(title || description || headerAction) && (
        <div className="px-5 py-4 border-b border-slate-50 flex justify-between items-center">
          <div className="min-w-0 pr-6">
            {title && <h3 className="text-sm font-semibold text-slate-900 tracking-tight">{title}</h3>}
            {description && <p className="text-[11px] text-slate-400 font-medium mt-0.5">{description}</p>}
          </div>
          {headerAction && <div className="shrink-0">{headerAction}</div>}
        </div>
      )}

      <div
        className={cn(
          'flex-1 group/content relative',
          !noPadding && 'p-[var(--ui-padding,1.25rem)]',
          maxHeight !== 'none' && 'overflow-y-auto scrollbar-hide',
          contentClassName
        )}
      >
        <div className="animate-in fade-in duration-500">
          {children}
        </div>
      </div>
    </div>
  );
};
