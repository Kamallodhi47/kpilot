import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
          {
            'bg-primary-600 text-white hover:bg-primary-700 shadow-sm shadow-primary-500/20': variant === 'primary',
            'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 shadow-sm': variant === 'secondary',
            'border border-primary-600 text-primary-600 hover:bg-primary-50': variant === 'outline',
            'hover:bg-slate-100 text-slate-700': variant === 'ghost',
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-4 py-2 text-sm': size === 'md',
            'px-6 py-3 text-base': size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden", className)}>{children}</div>;
}

export function CardHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("px-6 py-4 border-b border-slate-100", className)}>{children}</div>;
}

export function CardContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("p-6", className)}>{children}</div>;
}

export function Badge({ className, variant = 'default', children }: { className?: string, variant?: 'default'|'success'|'warning'|'danger'|'info'|'purple', children: React.ReactNode }) {
  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold",
      {
        'bg-slate-100 text-slate-800 border border-slate-200': variant === 'default',
        'bg-green-50 text-green-700 border border-green-200': variant === 'success',
        'bg-yellow-50 text-yellow-700 border border-yellow-200': variant === 'warning',
        'bg-red-50 text-red-700 border border-red-200': variant === 'danger',
        'bg-blue-50 text-blue-700 border border-blue-200': variant === 'info',
        'bg-purple-50 text-purple-700 border border-purple-200': variant === 'purple',
      },
      className
    )}>
      {children}
    </span>
  );
}
