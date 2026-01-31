
import React from 'react';

/**
 * Standardized Input component with icon support and consistent focus states.
 */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
  containerClassName?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  icon,
  error,
  className = '',
  containerClassName = '',
  ...props
}) => {
  return (
    <div className={`space-y-1.5 w-full ${containerClassName}`}>
      {label && (
        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--primary)] transition-colors pointer-events-none">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold 
            focus:ring-4 focus:ring-[var(--primary)]/10 focus:border-[var(--primary)] 
            outline-none transition-all placeholder:text-slate-400
            ${icon ? 'pl-11' : 'px-4'} 
            ${error ? 'border-rose-300 bg-rose-50' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-[10px] text-rose-500 font-bold uppercase tracking-tight">{error}</p>}
    </div>
  );
};
