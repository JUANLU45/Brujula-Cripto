'use client';

import { useTranslations } from 'next-intl';

import { Input } from '@/components/ui/Input';

interface ContactFormFieldProps {
  id: string;
  type: 'text' | 'email';
  fieldKey: 'name' | 'email';
  autoComplete: string;
  disabled: boolean;
  register: any;
  error?: string;
}

export function ContactFormField({
  id,
  type,
  fieldKey,
  autoComplete,
  disabled,
  register,
  error,
}: ContactFormFieldProps): JSX.Element {
  const t = useTranslations('contact.form');

  const getFieldClasses = (hasError: boolean): string => {
    const baseClasses = 'w-full';
    const errorClasses = 'border-red-500 focus:border-red-500 focus:ring-red-500';
    const normalClasses =
      'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600';

    return `${baseClasses} ${hasError ? errorClasses : normalClasses}`;
  };

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {t(`${fieldKey}.label`)}
      </label>
      <Input
        id={id}
        type={type}
        autoComplete={autoComplete}
        placeholder={t(`${fieldKey}.placeholder`)}
        disabled={disabled}
        className={getFieldClasses(!!error)}
        {...register(fieldKey)}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{t(`${fieldKey}.error`)}</p>
      )}
    </div>
  );
}
