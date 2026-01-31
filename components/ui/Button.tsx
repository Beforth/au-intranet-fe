
import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Reusable Button component following ERP design standards.
 * Supports multiple variants and sizes to prevent class duplication.
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'link';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  // Base styles for all buttons
  const baseStyles = 'inline-flex items-center justify-center font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none rounded-xl';

  // Variant mapping
  const variants = {
    primary: 'bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20 hover:brightness-110',
    secondary: 'bg-slate-900 text-white border-slate-900 shadow-md',
    outline: 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 shadow-sm',
    ghost: 'text-slate-500 hover:bg-slate-50 hover:text-slate-900',
    danger: 'bg-rose-500 text-white shadow-lg shadow-rose-500/20 hover:bg-rose-600',
    link: 'text-[var(--primary)] hover:underline normal-case tracking-normal font-bold p-0 h-auto',
  };

  // Size mapping
  const sizes = {
    xs: 'h-8 px-3 text-[9px]',
    sm: 'h-9 px-4 text-[10px]',
    md: 'h-11 px-6 text-xs',
    lg: 'h-14 px-8 text-sm',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="animate-spin mr-2" size={16} />
      ) : (
        leftIcon && <span className="mr-2">{leftIcon}</span>
      )}
      {children}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};
