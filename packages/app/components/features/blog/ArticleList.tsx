'use client';

import { ArticleCard } from '@/components/features/blog/ArticleCard';
import { BlogSearchBar } from '@/components/features/blog/BlogSearchBar';
import { PaginationControls } from '@/components/features/blog/PaginationControls';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { IArticle } from '@brujula-cripto/types';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

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

interface ArticleFilters {
  search?: string;
  category?: string;
  tag?: string;
  status?: 'published' | 'draft';
  featured?: boolean;
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
}: ArticleListProps) {
  const t = useTranslations('blog.list');
  const searchParams = useSearchParams();

  const [articles, setArticles] = useState<IArticle[]>(initialArticles);
  const [filteredArticles, setFilteredArticles] = useState<IArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Get filters from URL parameters
  const filters: ArticleFilters = {
    search: searchParams.get('search') || undefined,
    category: searchParams.get('category') || undefined,
    tag: searchParams.get('tag') || undefined,
    status: 'published', // Only show published articles in public view
    featured: featuredOnly || undefined,
  };

  const page = parseInt(searchParams.get('page') || '1', 10);

  // Load articles
  useEffect(() => {
    const loadArticles = async () => {
      if (initialArticles.length > 0) {
        setArticles(initialArticles);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch articles from the API
        const response = await fetch(
          '/api/articles?' +
            new URLSearchParams({
              locale,
              status: 'published',
              ...(featuredOnly && { featured: 'true' }),
              limit: '100', // Load all for client-side filtering
            }),
        );

        if (!response.ok) {
          throw new Error(t('errors.loadFailed'));
        }

        const data = await response.json();
        setArticles(data.articles || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('errors.unknown'));
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, [locale, featuredOnly, initialArticles, t]);

  // Filter and paginate articles
  useEffect(() => {
    let filtered = [...articles];

    // Apply filters
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter((article) => {
        const content = article[locale];
        return (
          content.title.toLowerCase().includes(searchTerm) ||
          content.excerpt.toLowerCase().includes(searchTerm) ||
          article.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm))
        );
      });
    }

    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter((article) => article.category === filters.category);
    }

    if (filters.tag) {
      filtered = filtered.filter((article) =>
        article.tags.some((tag: string) => tag.toLowerCase() === filters.tag?.toLowerCase()),
      );
    }

    if (filters.featured) {
      filtered = filtered.filter((article) => article.isFeatured);
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Calculate pagination
    const totalItems = filtered.length;
    const totalPagesCount = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    const currentPageNum = Math.min(page, totalPagesCount);

    const startIndex = (currentPageNum - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedArticles = filtered.slice(startIndex, endIndex);

    setFilteredArticles(paginatedArticles);
    setTotalPages(totalPagesCount);
    setCurrentPage(currentPageNum);
  }, [articles, filters, page, itemsPerPage, locale]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    // Update URL with new category filter
    const url = new URL(window.location.href);
    if (category === 'all') {
      url.searchParams.delete('category');
    } else {
      url.searchParams.set('category', category);
    }
    url.searchParams.delete('page'); // Reset to first page
    window.history.replaceState({}, '', url.toString());
  };

  const handleRetry = () => {
    setError(null);
    // Trigger reload by updating a dependency
    setLoading(true);
    setTimeout(() => setLoading(false), 100);
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <div className="text-center">
          <Spinner className="mx-auto mb-4" />
          <p className="text-muted-foreground">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`py-12 text-center ${className}`}>
        <div className="mx-auto max-w-md">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={handleRetry} variant="outline">
            {t('retry')}
          </Button>
        </div>
      </div>
    );
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
      {categories.length > 0 && (
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleCategoryChange('all')}
            >
              {t('categories.all')}
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleCategoryChange(category)}
              >
                {t(`categories.${category}`, { fallback: category })}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Active Filters */}
      {hasFilters && (
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted-foreground text-sm">{t('activeFilters')}:</span>
            {filters.search && (
              <span className="bg-muted text-muted-foreground rounded-full px-2 py-1 text-xs">
                {t('search')}: "{filters.search}"
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
      )}

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
                totalItems={articles.length}
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
