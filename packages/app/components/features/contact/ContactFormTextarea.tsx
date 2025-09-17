'use client';

import { useTranslations } from 'next-intl';

interface ContactFormTextareaProps {
  disabled: boolean;
  register: any;
  error?: string;
}

export function ContactFormTextarea({
  disabled,
  register,
  error,
}: ContactFormTextareaProps): JSX.Element {
  const t = useTranslations('contact.form');

  const getTextareaClasses = (hasError: boolean): string => {
    const baseClasses =
      'w-full rounded-md border px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400';
    const errorClasses = 'border-red-500 focus:border-red-500 focus:ring-red-500';
    const normalClasses =
      'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600';

    return `${baseClasses} ${hasError ? errorClasses : normalClasses}`;
  };

  return (
    <div>
      <label
        htmlFor="message"
        className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {t('message.label')}
      </label>
      <textarea
        id="message"
        rows={6}
        placeholder={t('message.placeholder')}
        disabled={disabled}
        className={getTextareaClasses(!!error)}
        {...register('message')}
      />
      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{t('message.error')}</p>}
    </div>
  );
}
