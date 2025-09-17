interface UpgradeButtonStylesProps {
  size: 'sm' | 'md' | 'lg';
  variant: 'primary' | 'secondary' | 'outline';
  fullWidth: boolean;
}

export function useUpgradeButtonStyles({ size, variant, fullWidth }: UpgradeButtonStylesProps) {
  const getSizeClasses = (): string => {
    switch (size) {
      case 'sm':
        return 'px-3 py-2 text-sm';
      case 'lg':
        return 'px-8 py-4 text-lg';
      default:
        return 'px-6 py-3 text-base';
    }
  };

  const getVariantClasses = (): string => {
    switch (variant) {
      case 'secondary':
        return 'bg-gray-600 hover:bg-gray-700 text-white';
      case 'outline':
        return 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white bg-transparent';
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white';
    }
  };

  const getButtonClasses = (): string => {
    return `${getSizeClasses()} ${getVariantClasses()} ${fullWidth ? 'w-full' : ''} transform rounded-lg font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50`;
  };

  return {
    getSizeClasses,
    getVariantClasses,
    getButtonClasses,
  };
}
