import * as React from 'react';

import { cn } from '@/lib/utils';

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = 'md', ...props }, ref) => {
    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-6 w-6',
      lg: 'h-8 w-8',
    };

    return (
      <div
        ref={ref}
        className={cn(
          // Base styles - Mobile First con colores centralizados
          'inline-block animate-spin rounded-full border-2 border-solid border-gray-600 border-r-transparent',
          // Size variants
          sizeClasses[size],
          // Accessibility
          'motion-reduce:animate-none',
          // Dark mode support
          'dark:border-gray-300 dark:border-r-transparent',
          className,
        )}
        role="status"
        aria-label="Cargando..."
        {...props}
      >
        <span className="sr-only">Cargando...</span>
      </div>
    );
  },
);

Spinner.displayName = 'Spinner';

export { Spinner };
