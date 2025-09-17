'use client';

import type { IArticle } from '@brujula-cripto/types';
import { useTranslations } from 'next-intl';

import { ArticleCard } from '@/components/features/blog/ArticleCard';
import { ArticleListActiveFilters } from '@/components/features/blog/ArticleListActiveFilters';
import { ArticleListFilters } from '@/components/features/blog/ArticleListFilters';
import { BlogSearchBar } from '@/components/features/blog/BlogSearchBar';
import { useArticleData } from '@/components/features/blog/hooks/useArticleData';
import { useArticleFilters } from '@/components/features/blog/hooks/useArticleFilters';
import { useFilteredArticles } from '@/components/features/blog/hooks/useFilteredArticles';
import { PaginationControls } from '@/components/features/blog/PaginationControls';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';

interface ArticleListProps {
  locale: 'es' | 'en';
  initialArticles?: IArticle[];
  showSearch?: boolean;
  showPagination?: boolean;
  itemsPerPage?: number;
  categories?: string[];
  featuredOnly?: boolean;
  compact?: boolean;
  className?: string;
}

/**
 * Componente para mostrar el estado de carga
 */
function LoadingState({ t, className }: { t: any; className: string }): JSX.Element {
  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <div className="text-center">
        <Spinner className="mx-auto mb-4" />
        <p className="text-muted-foreground">{t('loading')}</p>
      </div>
    </div>
  );
}

/**
 * Componente para mostrar el estado de error
 */
function ErrorState({
  t,
  className,
  error,
  retry,
}: {
  t: any;
  className: string;
  error: string;
  retry: () => void;
}): JSX.Element {
  return (
    <div className={`py-12 text-center ${className}`}>
      <div className="mx-auto max-w-md">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={retry} variant="outline">
          {t('retry')}
        </Button>
      </div>
    </div>
  );
}

/**
 * Componente para mostrar cuando no hay resultados
 */
function NoResultsState({ t, hasFilters }: { t: any; hasFilters: boolean }): JSX.Element {
  return (
    <div className="py-12 text-center">
      <div className="mx-auto max-w-md">
        <p className="text-muted-foreground mb-2">{t('noResults')}</p>
        {hasFilters && <p className="text-muted-foreground text-sm">{t('noResultsHint')}</p>}
      </div>
    </div>
  );
}

export function ArticleList({
  locale,
  initialArticles = [],
  showSearch = true,
  showPagination = true,
  itemsPerPage = 12,
  categories = [],
  featuredOnly = false,
  compact = false,
  className = '',
}: ArticleListProps): JSX.Element {
  const t = useTranslations('blog.list');

  const { filters, page } = useArticleFilters({ featuredOnly });

  const { articles, loading, error, retry } = useArticleData({
    locale,
    featuredOnly,
    initialArticles,
    loadingMessage: t('loading'),
    errorMessages: {
      loadFailed: t('errors.loadFailed'),
      unknown: t('errors.unknown'),
    },
  });

  const { filteredArticles, totalPages, currentPage, totalItems } = useFilteredArticles({
    articles,
    filters,
    locale,
    page,
    itemsPerPage,
  });

  const handleCategoryChange = (category: string): void => {
    const url = new URL(window.location.href);
    if (category === 'all') {
      url.searchParams.delete('category');
    } else {
      url.searchParams.set('category', category);
    }
    url.searchParams.delete('page');
    window.history.replaceState({}, '', url.toString());
  };

  if (loading) {
    return <LoadingState t={t} className={className} />;
  }

  if (error) {
    return <ErrorState t={t} className={className} error={error} retry={retry} />;
  }

  const hasFilters = filters.search || filters.category || filters.tag;
  const noResults = filteredArticles.length === 0;

  return (
    <div className={className}>
      {/* Search Bar */}
      {showSearch && (
        <div className="mb-8">
          <BlogSearchBar initialValue={filters.search || ''} placeholder={t('searchPlaceholder')} />
        </div>
      )}

      {/* Category Filters */}
      <ArticleListFilters categories={categories} onCategoryChange={handleCategoryChange} />

      {/* Active Filters */}
      <ArticleListActiveFilters filters={filters} />

      {/* No Results */}
      {noResults && (
        <div className="py-12 text-center">
          <div className="mx-auto max-w-md">
            <p className="text-muted-foreground mb-2">{t('noResults')}</p>
            {hasFilters && <p className="text-muted-foreground text-sm">{t('noResultsHint')}</p>}
          </div>
        </div>
      )}

      {/* Articles Grid */}
      {!noResults && (
        <>
          <div
            className={`grid gap-6 ${
              compact
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {filteredArticles.map((article) => (
              <ArticleCard
                key={article.slug}
                article={article}
                locale={locale}
                compact={compact}
                showSharing={true}
                showInteractions={true}
              />
            ))}
          </div>

          {/* Pagination */}
          {showPagination && totalPages > 1 && (
            <div className="mt-12">
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                showItemCount={true}
                showPageNumbers={true}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
