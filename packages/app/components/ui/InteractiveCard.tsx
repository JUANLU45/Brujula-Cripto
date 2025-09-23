import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InteractiveCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary' | 'accent';
  enableHover?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  onCardClick?: () => void;
}

// Hook personalizado para manejar la lógica de variantes
const useVariantStyles = (variant: string, enableHover: boolean): string => {
  return React.useMemo(() => {
    const variants = {
      primary: cn(
        'border-primary-200 dark:border-primary-800',
        'bg-white dark:bg-gray-900',
        enableHover && 'hover:border-primary-400 dark:hover:border-primary-600',
      ),
      secondary: cn(
        'border-gray-200 dark:border-gray-700',
        'bg-gray-50 dark:bg-gray-800',
        enableHover && 'hover:border-gray-300 dark:hover:border-gray-600',
      ),
      accent: cn(
        'border-primary-300 dark:border-primary-700',
        'bg-gradient-to-br from-primary-50 to-white dark:from-primary-950/20 dark:to-gray-900',
        enableHover && 'hover:border-primary-400 dark:hover:border-primary-600',
      ),
    };
    return variants[variant as keyof typeof variants] || variants.primary;
  }, [variant, enableHover]);
};

// Componente para el contenido cuando hay loading
const LoadingOverlay = React.memo(() => (
  <div className="absolute inset-0 rounded-lg bg-white/50 dark:bg-gray-900/50">
    <div className="skeleton-pulse h-full w-full rounded-lg" />
  </div>
));

LoadingOverlay.displayName = 'LoadingOverlay';

// Componente para el contenido del icono
const IconContent = React.memo(({ icon }: { icon: React.ReactNode }) => (
  <div className="mb-4 flex justify-center">
    <div className="icon-interactive text-primary-600 dark:text-primary-400">{icon}</div>
  </div>
));

IconContent.displayName = 'IconContent';

// Componente para el contenido por defecto
const DefaultContent = React.memo(
  ({
    icon,
    title,
    description,
    action,
  }: {
    icon?: React.ReactNode;
    title?: string;
    description?: string;
    action?: React.ReactNode;
  }) => (
    <div className="p-6">
      {icon && <IconContent icon={icon} />}
      {title && (
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      )}
      {description && (
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">{description}</p>
      )}
      {action && <div className="flex justify-center">{action}</div>}
    </div>
  ),
);

DefaultContent.displayName = 'DefaultContent';

export const InteractiveCard = React.forwardRef<HTMLDivElement, InteractiveCardProps>(
  (
    {
      className,
      variant = 'primary',
      enableHover = true,
      loading = false,
      icon,
      title,
      description,
      action,
      onCardClick,
      children,
      ...props
    },
    ref,
  ) => {
    const variantStyles = useVariantStyles(variant, enableHover);

    const baseStyles = cn(
      'relative rounded-lg border shadow-sm',
      'transition-all duration-200 ease-out',
      'focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2',
      enableHover && 'card-interactive',
      loading && 'opacity-70 pointer-events-none',
      onCardClick && 'cursor-pointer',
    );

    const handleClick = React.useCallback((): void => {
      if (onCardClick && !loading) {
        onCardClick();
      }
    }, [onCardClick, loading]);

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent): void => {
        if ((event.key === 'Enter' || event.key === ' ') && onCardClick && !loading) {
          event.preventDefault();
          onCardClick();
        }
      },
      [onCardClick, loading],
    );

    // Determinar si es interactivo
    const isInteractive = Boolean(onCardClick);

    // Props específicos para elementos interactivos
    const interactiveProps = isInteractive
      ? {
          onClick: handleClick,
          onKeyDown: handleKeyDown,
          role: 'button' as const,
          tabIndex: 0,
          'aria-disabled': loading,
        }
      : {};

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variantStyles, className)}
        {...interactiveProps}
        {...props}
      >
        {loading && <LoadingOverlay />}

        {children ? (
          <div className="p-6">{children}</div>
        ) : (
          <DefaultContent icon={icon} title={title} description={description} action={action} />
        )}
      </div>
    );
  },
);

InteractiveCard.displayName = 'InteractiveCard';
