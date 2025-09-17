'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import type { IArticle } from '@brujula-cripto/types';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { auth } from '@/lib/firebase';

interface ArticleDataTableProps {
  initialArticles?: IArticle[];
  showStatusFilter?: boolean;
  showSearch?: boolean;
  itemsPerPage?: number;
}

interface ArticleFilters {
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

  const [articles, setArticles] = useState<IArticle[]>(initialArticles);
  const [filteredArticles, setFilteredArticles] = useState<IArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedArticles, setSelectedArticles] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<ArticleFilters>({
    search: '',
    status: 'all',
    author: '',
  });

  // Load articles
  useEffect(() => {
    const loadArticles = async (): Promise<void> => {
      if (initialArticles.length > 0) {
        setArticles(initialArticles);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/admin/articles', {
          headers: {
            Authorization: `Bearer ${await getAuthToken()}`,
          },
        });

        if (!response.ok) {
          throw new Error(t('errors.loadFailed'));
        }

        const data = (await response.json()) as { articles?: IArticle[] };
        setArticles(data.articles || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('errors.unknown'));
      } finally {
        setLoading(false);
      }
    };

    void loadArticles();
  }, [initialArticles, t]);

  // Filter articles
  useEffect(() => {
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

    setFilteredArticles(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [articles, filters]);

  const getAuthToken = async (): Promise<string> => {
    // Get Firebase Auth token for admin API calls
    const user = auth.currentUser;
    if (!user) {
      throw new Error(t('errors.notAuthenticated'));
    }
    return await user.getIdToken();
  };

  const handleFilterChange = (key: keyof ArticleFilters, value: string): void => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSelectAll = (): void => {
    if (selectedArticles.size === filteredArticles.length) {
      setSelectedArticles(new Set());
    } else {
      setSelectedArticles(new Set(filteredArticles.map((article) => article.slug)));
    }
  };

  const handleSelectArticle = (slug: string): void => {
    const newSelected = new Set(selectedArticles);
    if (newSelected.has(slug)) {
      newSelected.delete(slug);
    } else {
      newSelected.add(slug);
    }
    setSelectedArticles(newSelected);
  };

  const handleDeleteSelected = async (): Promise<void> => {
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
  };

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

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('subtitle', { count: filteredArticles.length })}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {selectedArticles.size > 0 && (
            <Button
              onClick={() => void handleDeleteSelected()}
              className="bg-red-600 text-white hover:bg-red-700"
              disabled={loading}
            >
              {t('deleteSelected', { count: selectedArticles.size })}
            </Button>
          )}

          <Link href="/admin/articles/new">
            <Button className="bg-blue-600 text-white hover:bg-blue-700">{t('newArticle')}</Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
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
                onChange={(e) => handleFilterChange('search', e.target.value)}
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
                onChange={(e) => handleFilterChange('status', e.target.value)}
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
              onChange={(e) => handleFilterChange('author', e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
          <div className="text-sm text-red-700 dark:text-red-400">{error}</div>
        </div>
      )}

      {/* Data Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedArticles.size === filteredArticles.length &&
                      filteredArticles.length > 0
                    }
                    onChange={handleSelectAll}
                    title={t('table.selectAll')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {t('table.title')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {t('table.author')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {t('table.status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {t('table.created')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {t('table.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
              {paginatedArticles.map((article) => (
                <tr key={article.slug} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedArticles.has(article.slug)}
                      onChange={() => handleSelectArticle(article.slug)}
                      title={t('table.selectArticle', { title: article.es.title })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {article.es.title}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {article.en.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {article.authorName}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={article.status}
                      onChange={(e) =>
                        void handleStatusChange(
                          article.slug,
                          e.target.value as 'published' | 'draft',
                        )
                      }
                      title={t('table.changeStatus')}
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        article.status === 'published'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                      }`}
                    >
                      <option value="draft">{t('status.draft')}</option>
                      <option value="published">{t('status.published')}</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(article.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/admin/articles/${article.slug}`}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        {t('actions.edit')}
                      </Link>
                      <span className="text-gray-300 dark:text-gray-600">|</span>
                      <Link
                        href={`/blog/${article.slug}`}
                        target="_blank"
                        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        {t('actions.view')}
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {t('pagination.previous')}
              </Button>
              <Button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {t('pagination.next')}
              </Button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {t('pagination.showing')} <span className="font-medium">{startIndex + 1}</span>{' '}
                  {t('pagination.to')}{' '}
                  <span className="font-medium">{Math.min(endIndex, filteredArticles.length)}</span>{' '}
                  {t('pagination.of')}{' '}
                  <span className="font-medium">{filteredArticles.length}</span>{' '}
                  {t('pagination.results')}
                </p>
              </div>
              <div>
                <nav
                  className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                  aria-label="Pagination"
                >
                  <Button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  >
                    <span className="sr-only">{t('pagination.previous')}</span>
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Button>

                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + Math.max(1, currentPage - 2);
                    return page <= totalPages ? (
                      <Button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                          page === currentPage
                            ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                            : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                        }`}
                      >
                        {page}
                      </Button>
                    ) : null;
                  })}

                  <Button
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  >
                    <span className="sr-only">{t('pagination.next')}</span>
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Empty State */}
      {filteredArticles.length === 0 && !loading && (
        <Card className="p-12 text-center">
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <svg
              className="h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
            {t('empty.title')}
          </h3>
          <p className="mb-6 text-gray-500 dark:text-gray-400">{t('empty.description')}</p>
          <Link href="/admin/articles/new">
            <Button className="bg-blue-600 text-white hover:bg-blue-700">
              {t('empty.createFirst')}
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
}

export default ArticleDataTable;
