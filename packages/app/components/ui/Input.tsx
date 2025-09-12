import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Base styles - Mobile First
          'border-input bg-background flex h-10 w-full rounded-md border px-3 py-2 text-sm',
          // Ring and focus states
          'ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium',
          // Placeholder and disabled states
          'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2',
          'focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          // Dark mode support using centralized Tailwind classes
          'dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100',
          'dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-400',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Input.displayName = 'Input';

export { Input };
