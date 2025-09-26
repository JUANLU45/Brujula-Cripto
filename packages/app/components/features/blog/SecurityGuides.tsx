'use client';

import type { IArticle } from '@brujula-cripto/types';
import { useTranslations } from 'next-intl';

import { ArticleList } from '@/components/features/blog/ArticleList';
import { Card } from '@/components/ui/Card';

interface SecurityGuidesProps {
  locale: 'es' | 'en';
  articles?: IArticle[];
  className?: string;
}

export function SecurityGuides({
  locale,
  articles = [],
  className = '',
}: SecurityGuidesProps): JSX.Element {
  const t = useTranslations('security');

  // Filtrar artículos por categoría "seguridad"
  const securityArticles = articles.filter(
    (article) =>
      article.category.toLowerCase() === 'seguridad' ||
      article.category.toLowerCase() === 'security',
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Section */}
      <Card className="border-0 bg-gradient-to-r from-blue-50 to-indigo-50 p-8 dark:from-blue-950/20 dark:to-indigo-950/20">
        <div className="text-center">
          <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
            {t('title')}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            {t('subtitle')}
          </p>
        </div>
      </Card>

      {/* Security Articles List */}
      <ArticleList
        locale={locale}
        initialArticles={securityArticles}
        showSearch={true}
        showPagination={true}
        categories={['seguridad', 'security']}
        itemsPerPage={9}
        compact={false}
        className="mt-8"
      />

      {/* Empty State */}
      {securityArticles.length === 0 && (
        <Card className="p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <svg
              className="h-8 w-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
            No hay guías de seguridad disponibles
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Pronto publicaremos contenido especializado en seguridad cripto.
          </p>
        </Card>
      )}
    </div>
  );
}
