'use client';

import { useTranslations } from 'next-intl';

interface ContactFormStatusProps {
  status: 'idle' | 'success' | 'error';
}

export function ContactFormStatus({ status }: ContactFormStatusProps): JSX.Element | null {
  const t = useTranslations('contact.form');

  if (status === 'success') {
    return (
      <div className="mb-6 rounded-md border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
        <div className="text-sm text-green-700 dark:text-green-400">{t('success')}</div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="mb-6 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
        <div className="text-sm text-red-700 dark:text-red-400">{t('error')}</div>
      </div>
    );
  }

  return null;
}
