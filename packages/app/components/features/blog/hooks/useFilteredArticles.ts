import { useMemo } from 'react';

import type { IArticle } from '@brujula-cripto/types';

interface ArticleFilters {
  search?: string;
  category?: string;
  tag?: string;
  status?: 'published' | 'draft';
  featured?: boolean;
}

interface UseFilteredArticlesProps {
  articles: IArticle[];
  filters: ArticleFilters;
  locale: 'es' | 'en';
  page: number;
  itemsPerPage: number;
}

interface FilteredArticlesResult {
  filteredArticles: IArticle[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

export function useFilteredArticles({
  articles,
  filters,
  locale,
  page,
  itemsPerPage,
}: UseFilteredArticlesProps): FilteredArticlesResult {
  return useMemo(() => {
    let filtered = [...articles];

    // Apply search filter
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

    // Apply category filter
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter((article) => article.category === filters.category);
    }

    // Apply tag filter
    if (filters.tag) {
      filtered = filtered.filter((article) =>
        article.tags.some((tag: string) => tag.toLowerCase() === filters.tag?.toLowerCase()),
      );
    }

    // Apply featured filter
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

    return {
      filteredArticles: paginatedArticles,
      totalPages: totalPagesCount,
      currentPage: currentPageNum,
      totalItems,
    };
  }, [articles, filters, locale, page, itemsPerPage]);
}
