
import React from 'react';
import { GripVertical, Maximize2 } from 'lucide-react';

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
}

export const Card: React.FC<CardProps> = ({ 
  title, 
  description, 
  children, 
  className = '', 
  headerAction,
  onClick,
  isDraggable,
  onDragStart,
  onDragOver,
  onDrop,
  showHandle,
  onResize,
  noPadding = false,
  maxHeight = 'none'
}) => {
  return (
    <div 
      draggable={isDraggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`bg-white rounded-2xl border border-slate-200/60 transition-all duration-500 ease-out relative group/card flex flex-col min-h-[140px] shadow-sm
        ${onClick ? 'cursor-pointer hover:border-[var(--primary)]/40 hover:shadow-xl hover:shadow-[var(--primary)]/5 hover:-translate-y-0.5' : ''} 
        ${isDraggable ? 'cursor-move active:scale-[0.98]' : ''}
        ${className}`}
      style={{ 
        maxHeight: maxHeight,
      }}
      onClick={onClick}
    >
      {/* Interaction Layer */}
      {showHandle && (
        <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity z-20">
          {onResize && (
            <button 
              onClick={(e) => { e.stopPropagation(); onResize(); }}
              className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 pointer-events-auto transition-colors"
            >
              <Maximize2 size={12} />
            </button>
          )}
          <div className="text-slate-300 cursor-move p-1.5">
            <GripVertical size={14} />
          </div>
        </div>
      )}
      
      {/* Dynamic Header */}
      {(title || description || headerAction) && (
        <div className="px-6 py-4 border-b border-slate-100/80 flex justify-between items-center bg-white rounded-t-2xl sticky top-0 z-10">
          <div className="min-w-0 pr-6">
            {title && <h3 className="text-[11px] font-black text-slate-900 tracking-widest truncate uppercase leading-none">{title}</h3>}
            {description && <p className="text-[10px] text-slate-400 font-medium truncate mt-1.5 tracking-tight leading-none">{description}</p>}
          </div>
          {headerAction && <div className="shrink-0">{headerAction}</div>}
        </div>
      )}
      
      {/* Fluid Content Area */}
      <div 
        className={`flex-1 group/content relative ${noPadding ? '' : 'p-[var(--ui-padding,1.25rem)]'} ${maxHeight !== 'none' ? 'overflow-y-auto scrollbar-hide' : ''}`}
        style={{ scrollBehavior: 'smooth' }}
      >
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          {children}
        </div>
      </div>

      {/* Dynamic shadow indicator only if height is constrained */}
      {maxHeight !== 'none' && (
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
      )}
    </div>
  );
};
