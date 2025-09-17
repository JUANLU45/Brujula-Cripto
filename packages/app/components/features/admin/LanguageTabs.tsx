'use client';

import { useTranslations } from 'next-intl';

interface LanguageTabsProps {
  activeLanguage: 'es' | 'en';
  onLanguageChange: (language: 'es' | 'en') => void;
}

export function LanguageTabs({ activeLanguage, onLanguageChange }: LanguageTabsProps): JSX.Element {
  const t = useTranslations('admin.editor');

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav className="flex space-x-8 px-6" aria-label="Tabs">
        {(['es', 'en'] as const).map((lang) => (
          <button
            key={lang}
            onClick={() => onLanguageChange(lang)}
            className={`border-b-2 px-1 py-4 text-sm font-medium ${
              activeLanguage === lang
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            {t(`languages.${lang}`)}
          </button>
        ))}
      </nav>
    </div>
  );
}
