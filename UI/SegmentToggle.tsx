import React from 'react';
import { cn } from '../lib/utils';

interface SegmentOption<T> {
  label: string | React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  value: T;
}

interface SegmentToggleProps<T extends string | number> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  size?: 'sm' | 'md';
}

export function SegmentToggle<T extends string | number>({
  options,
  value,
  onChange,
  className,
  size = 'md'
}: SegmentToggleProps<T>) {
  const activeIndex = options.findIndex(o => o.value === value);

  return (
    <div
      className={cn(
        'bg-slate-100/80 inline-flex items-center p-0.5 rounded-xl border border-slate-200/60 shadow-sm relative',
        size === 'sm' ? 'min-w-[120px]' : 'min-w-[140px]',
        className
      )}
      role="radiogroup"
    >
      <div
        className="absolute top-0.5 bottom-0.5 rounded-[10px] bg-white shadow-sm border border-slate-200/50 z-0 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{
          left: `calc(${activeIndex} * (100% / ${options.length}) + 2px)`,
          width: `calc(100% / ${options.length} - 4px)`,
        }}
      />
      {options.map((option) => {
        const isActive = value === option.value;
        return (
          <button
            key={String(option.value)}
            type="button"
            className={cn(
              'relative flex-1 flex items-center justify-center gap-2 rounded-[10px] transition-all z-10 active:scale-[0.98]',
              size === 'sm' ? 'px-3 py-1.5' : 'px-5 py-2',
              isActive
                ? 'text-blue-700'
                : 'text-slate-500 hover:text-slate-800',
            )}
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(option.value)}
          >
            <span className="relative z-20 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide whitespace-nowrap">
              {option.icon && <option.icon className={size === 'sm' ? 'size-3' : 'size-3.5'} />}
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
