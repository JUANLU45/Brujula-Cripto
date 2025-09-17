'use client';

import Link from 'next/link';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/Button';

interface ArticleTableHeaderProps {
  filteredArticlesCount: number;
  selectedArticlesCount: number;
  loading: boolean;
  onDeleteSelected: () => void;
}

export function ArticleTableHeader({
  filteredArticlesCount,
  selectedArticlesCount,
  loading,
  onDeleteSelected,
}: ArticleTableHeaderProps): JSX.Element {
  const t = useTranslations('admin.articles');

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t('subtitle', { count: filteredArticlesCount })}
        </p>
      </div>

      <div className="flex items-center space-x-3">
        {selectedArticlesCount > 0 && (
          <Button
            onClick={onDeleteSelected}
            className="bg-red-600 text-white hover:bg-red-700"
            disabled={loading}
          >
            {t('deleteSelected', { count: selectedArticlesCount })}
          </Button>
        )}

        <Link href="/admin/articles/new">
          <Button className="bg-blue-600 text-white hover:bg-blue-700">{t('newArticle')}</Button>
        </Link>
      </div>
    </div>
  );
}
