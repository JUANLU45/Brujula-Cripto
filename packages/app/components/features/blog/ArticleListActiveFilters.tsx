'use client';

import { useTranslations } from 'next-intl';

interface ArticleFilters {
  search?: string;
  category?: string;
  tag?: string;
  status?: 'published' | 'draft';
  featured?: boolean;
}

interface ArticleListActiveFiltersProps {
  filters: ArticleFilters;
}

export function ArticleListActiveFilters({ filters }: ArticleListActiveFiltersProps): JSX.Element {
  const t = useTranslations('blog.list');

  const hasFilters = filters.search || filters.category || filters.tag;

  if (!hasFilters) {
    return <></>;
  }

  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-muted-foreground text-sm">{t('activeFilters')}:</span>
        {filters.search && (
          <span className="bg-muted text-muted-foreground rounded-full px-2 py-1 text-xs">
            {t('search')}: &quot;{filters.search}&quot;
          </span>
        )}
        {filters.category && (
          <span className="bg-muted text-muted-foreground rounded-full px-2 py-1 text-xs">
            {t('category')}: {filters.category}
          </span>
        )}
        {filters.tag && (
          <span className="bg-muted text-muted-foreground rounded-full px-2 py-1 text-xs">
            {t('tag')}: #{filters.tag}
          </span>
        )}
      </div>
    </div>
  );
}
