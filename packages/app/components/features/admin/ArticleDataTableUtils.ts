import type { IArticle } from '@brujula-cripto/types';

import type { ArticleFilters } from './ArticleDataTable';

/**
 * Applies filters to a list of articles
 */
export function filterArticles(articles: IArticle[], filters: ArticleFilters): IArticle[] {
  let filtered = [...articles];

  // Apply search filter
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filtered = filtered.filter(
      (article) =>
        article.es.title.toLowerCase().includes(searchTerm) ||
        article.en.title.toLowerCase().includes(searchTerm) ||
        article.authorName.toLowerCase().includes(searchTerm) ||
        article.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm)),
    );
  }

  // Apply status filter
  if (filters.status && filters.status !== 'all') {
    filtered = filtered.filter((article) => article.status === filters.status);
  }

  // Apply author filter
  if (filters.author && filters.author.trim()) {
    const authorFilter = filters.author;
    filtered = filtered.filter((article) =>
      article.authorName.toLowerCase().includes(authorFilter.toLowerCase()),
    );
  }

  // Sort by creation date (newest first)
  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return filtered;
}

/**
 * Calculates pagination data
 */
export function calculatePagination(
  totalItems: number,
  currentPage: number,
  itemsPerPage: number,
): {
  totalPages: number;
  startIndex: number;
  endIndex: number;
  paginatedItems: number;
} {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedItems = endIndex - startIndex;

  return {
    totalPages,
    startIndex,
    endIndex,
    paginatedItems,
  };
}
