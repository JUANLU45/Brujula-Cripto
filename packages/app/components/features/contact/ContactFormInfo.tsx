'use client';

import { useTranslations } from 'next-intl';

export function ContactFormInfo(): JSX.Element {
  const t = useTranslations('contact.form');

  return (
    <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-700">
      <div className="grid grid-cols-1 gap-6 text-center md:grid-cols-2">
        <div>
          <h3 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
            {t('support.title')}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">soporte@brujulacripto.com</p>
        </div>
        <div>
          <h3 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
            {t('info.title')}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">info@brujulacripto.com</p>
        </div>
      </div>
    </div>
  );
}
