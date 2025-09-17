'use client';

import { useTranslations } from 'next-intl';

import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

import type { ArticleFilters } from './ArticleDataTable';

interface ArticleTableFiltersProps {
  filters: ArticleFilters;
  showSearch: boolean;
  showStatusFilter: boolean;
  onFilterChange: (key: string, value: string) => void;
}

export function ArticleTableFilters({
  filters,
  showSearch,
  showStatusFilter,
  onFilterChange,
}: ArticleTableFiltersProps): JSX.Element {
  const t = useTranslations('admin.articles');

  return (
    <Card className="p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {showSearch && (
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('filters.search')}
            </label>
            <Input
              type="text"
              placeholder={t('filters.searchPlaceholder')}
              value={filters.search || ''}
              onChange={(e) => onFilterChange('search', e.target.value)}
              className="w-full"
            />
          </div>
        )}

        {showStatusFilter && (
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('filters.status')}
            </label>
            <select
              value={filters.status || 'all'}
              onChange={(e) => onFilterChange('status', e.target.value)}
              title={t('filters.status')}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">{t('filters.allStatus')}</option>
              <option value="published">{t('filters.published')}</option>
              <option value="draft">{t('filters.draft')}</option>
            </select>
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('filters.author')}
          </label>
          <Input
            type="text"
            placeholder={t('filters.authorPlaceholder')}
            value={filters.author || ''}
            onChange={(e) => onFilterChange('author', e.target.value)}
            className="w-full"
          />
        </div>
      </div>
    </Card>
  );
}
