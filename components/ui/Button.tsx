import * as React from "react"
import { cn } from "../../lib/utils"

const buttonVariants = {
  variants: {
    variant: {
      default: "bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:shadow-blue-500/20",
      primary: "bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:shadow-blue-500/20",
      destructive: "bg-rose-600 text-white hover:bg-rose-700 shadow-sm",
      danger: "bg-rose-600 text-white hover:bg-rose-700 shadow-sm",
      outline: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-xs",
      secondary: "bg-slate-900 text-white hover:bg-slate-800 shadow-sm",
      ghost: "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
      link: "text-blue-600 hover:underline font-semibold p-0 h-auto",
    },
    size: {
      default: "h-10 px-5 text-sm rounded-lg font-bold",
      xxs: "h-7 px-2 text-[9px] rounded-md uppercase tracking-widest font-bold",
      xs: "h-8 px-3 text-[10px] rounded-lg uppercase tracking-widest font-bold",
      sm: "h-9 px-4 text-xs rounded-lg font-bold",
      md: "h-10 px-5 text-sm rounded-lg font-bold",
      lg: "h-12 px-8 text-base rounded-xl font-bold",
      icon: "h-10 w-10",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'destructive' | 'danger' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    const variantStyles = buttonVariants.variants.variant;
    const sizeStyles = buttonVariants.variants.size;
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          variantStyles[variant as keyof typeof variantStyles] || variantStyles.default,
          sizeStyles[size as keyof typeof sizeStyles] || sizeStyles.default,
          className
        )}
        ref={ref}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading ? (
          <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
        ) : (
          leftIcon && <span className="mr-2 opacity-90">{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && <span className="ml-2 opacity-90">{rightIcon}</span>}
      </button>
    )
  },
)
Button.displayName = "Button"

export { Button }
