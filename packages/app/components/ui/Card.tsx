import * as React from 'react';

import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'interactive' | 'feature' | 'stat';
  hover?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hover = false, ...props }, ref) => {
    const baseStyles = 'rounded-lg border bg-white shadow-sm dark:bg-gray-900';

    const variantStyles = {
      default: 'border-gray-200 dark:border-gray-700',
      interactive: cn(
        'border-interactive-border-default dark:border-gray-700',
        'card-interactive',
        hover && 'hover:border-interactive-border-hover hover:shadow-xl',
      ),
      feature: cn(
        'border-primary-200 dark:border-primary-800',
        'bg-gradient-to-br from-white to-primary-50/30',
        'dark:from-gray-900 dark:to-primary-950/20',
        'card-interactive',
      ),
      stat: cn(
        'border-gray-200 dark:border-gray-700',
        'transition-all duration-200',
        'hover:bg-gray-50 dark:hover:bg-gray-800',
      ),
    };

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], 'p-6', className)}
        {...props}
      />
    );
  },
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
  ),
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    // eslint-disable-next-line jsx-a11y/heading-has-content
    <h3
      ref={ref}
      className={cn(
        'text-2xl font-semibold leading-none tracking-tight text-gray-900 dark:text-gray-100',
        className,
      )}
      {...props}
    />
  ),
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-gray-600 dark:text-gray-400', className)} {...props} />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  ),
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
  ),
);
CardFooter.displayName = 'CardFooter';

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
