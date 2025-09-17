import { useCallback, useEffect, useState } from 'react';

import type { IArticle } from '@brujula-cripto/types';
import { useTranslations } from 'next-intl';

import { auth } from '@/lib/firebase';

import type { ArticleFilters } from './ArticleDataTable';
import { filterArticles } from './ArticleDataTableUtils';

interface UseArticleDataParams {
  initialArticles: IArticle[];
}

interface UseArticleDataReturn {
  articles: IArticle[];
  filteredArticles: IArticle[];
  loading: boolean;
  error: string | null;
  selectedArticles: Set<string>;
  currentPage: number;
  filters: ArticleFilters;
  setArticles: React.Dispatch<React.SetStateAction<IArticle[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedArticles: React.Dispatch<React.SetStateAction<Set<string>>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setFilters: React.Dispatch<React.SetStateAction<ArticleFilters>>;
  getAuthToken: () => Promise<string>;
  handleFilterChange: (key: keyof ArticleFilters, value: string) => void;
  handleSelectAll: () => void;
  handleSelectArticle: (slug: string) => void;
}

export function useArticleData({ initialArticles }: UseArticleDataParams): UseArticleDataReturn {
  const t = useTranslations('admin.articles');

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

  const getAuthToken = useCallback((): Promise<string> => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error(t('errors.notAuthenticated'));
    }
    return user.getIdToken();
  }, [t]);

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
  }, [initialArticles, t, getAuthToken]);

  // Filter articles
  useEffect(() => {
    const filtered = filterArticles(articles, filters);
    setFilteredArticles(filtered);
    setCurrentPage(1);
  }, [articles, filters]);

  const handleFilterChange = useCallback((key: keyof ArticleFilters, value: string): void => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSelectAll = useCallback((): void => {
    if (selectedArticles.size === filteredArticles.length) {
      setSelectedArticles(new Set());
    } else {
      setSelectedArticles(new Set(filteredArticles.map((article) => article.slug)));
    }
  }, [selectedArticles.size, filteredArticles]);

  const handleSelectArticle = useCallback(
    (slug: string): void => {
      const newSelected = new Set(selectedArticles);
      if (newSelected.has(slug)) {
        newSelected.delete(slug);
      } else {
        newSelected.add(slug);
      }
      setSelectedArticles(newSelected);
    },
    [selectedArticles],
  );

  return {
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
    setFilters,
    getAuthToken,
    handleFilterChange,
    handleSelectAll,
    handleSelectArticle,
  };
}
