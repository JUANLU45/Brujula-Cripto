'use client';

import { useCallback } from 'react';

import { useRouter } from 'next/navigation';

import type { IArticle } from '@brujula-cripto/types';
import { useTranslations } from 'next-intl';

import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';

import { calculatePagination } from './ArticleDataTableUtils';
import { ArticleTableContent } from './ArticleTableContent';
import { ArticleTableEmpty } from './ArticleTableEmpty';
import { ArticleTableFilters } from './ArticleTableFilters';
import { ArticleTableHeader } from './ArticleTableHeader';
import { ArticleTablePagination } from './ArticleTablePagination';
import { useArticleData } from './useArticleData';

interface ArticleDataTableProps {
  initialArticles?: IArticle[];
  showStatusFilter?: boolean;
  showSearch?: boolean;
  itemsPerPage?: number;
}

export interface ArticleFilters {
  search?: string;
  status?: 'all' | 'published' | 'draft';
  author?: string;
}

export function ArticleDataTable({
  initialArticles = [],
  showStatusFilter = true,
  showSearch = true,
  itemsPerPage = 20,
}: ArticleDataTableProps): JSX.Element {
  const t = useTranslations('admin.articles');
  const _router = useRouter();

  const {
    articles,
    filteredArticles,
    loading,
    error,
    selectedArticles,
    currentPage,
    filters,
    setArticles,
    setLoading,
    setError,
    setSelectedArticles,
    setCurrentPage,
    getAuthToken,
    handleFilterChange,
    handleSelectAll,
    handleSelectArticle,
  } = useArticleData({ initialArticles });

  const handleDeleteSelected = useCallback(async (): Promise<void> => {
    if (selectedArticles.size === 0) {
      return;
    }

    if (!window.confirm(t('confirmDeleteSelected', { count: selectedArticles.size }))) {
      return;
    }

    setLoading(true);
    try {
      const token = await getAuthToken();
      const deletePromises = Array.from(selectedArticles).map((slug) =>
        fetch(`/api/admin/articles/${slug}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }),
      );

      await Promise.all(deletePromises);

      // Remove deleted articles from state
      setArticles((prev) => prev.filter((article) => !selectedArticles.has(article.slug)));
      setSelectedArticles(new Set());
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.deleteFailed'));
    } finally {
      setLoading(false);
    }
  }, [selectedArticles, t, getAuthToken, setLoading, setError, setArticles, setSelectedArticles]);

  const handleStatusChange = async (
    slug: string,
    newStatus: 'published' | 'draft',
  ): Promise<void> => {
    try {
      const token = await getAuthToken();
      const response = await fetch(`/api/admin/articles/${slug}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error(t('errors.updateFailed'));
      }

      // Update article status in state
      setArticles((prev) =>
        prev.map((article) =>
          article.slug === slug ? { ...article, status: newStatus } : article,
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.updateFailed'));
    }
  };

  const { totalPages, startIndex, endIndex } = calculatePagination(
    filteredArticles.length,
    currentPage,
    itemsPerPage,
  );
  const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

  if (loading && articles.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Spinner className="mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">{t('loading')}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <ArticleTableHeader
        filteredArticlesCount={filteredArticles.length}
        selectedArticlesCount={selectedArticles.size}
        loading={loading}
        onDeleteSelected={() => void handleDeleteSelected()}
      />

      <ArticleTableFilters
        filters={filters}
        showSearch={showSearch}
        showStatusFilter={showStatusFilter}
        onFilterChange={(key: string, value: string) =>
          handleFilterChange(key as keyof ArticleFilters, value)
        }
      />

      {error && (
        <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
          <div className="text-sm text-red-700 dark:text-red-400">{error}</div>
        </div>
      )}

      {filteredArticles.length === 0 && !loading ? (
        <ArticleTableEmpty />
      ) : (
        <>
          <ArticleTableContent
            articles={paginatedArticles}
            selectedArticles={selectedArticles}
            onSelectAll={handleSelectAll}
            onSelectArticle={handleSelectArticle}
            onStatusChange={handleStatusChange}
          />

          <ArticleTablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            startIndex={startIndex}
            endIndex={endIndex}
            totalItems={filteredArticles.length}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}

export default ArticleDataTable;
