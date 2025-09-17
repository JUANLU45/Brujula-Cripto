import { useCallback, useEffect, useState } from 'react';

import type { IArticle } from '@brujula-cripto/types';

interface UseArticleDataProps {
  locale: 'es' | 'en';
  featuredOnly: boolean;
  initialArticles: IArticle[];
  loadingMessage: string;
  errorMessages: {
    loadFailed: string;
    unknown: string;
  };
}

interface ArticleDataResult {
  articles: IArticle[];
  loading: boolean;
  error: string | null;
  retry: () => void;
}

export function useArticleData({
  locale,
  featuredOnly,
  initialArticles,
  loadingMessage: _loadingMessage,
  errorMessages,
}: UseArticleDataProps): ArticleDataResult {
  const [articles, setArticles] = useState<IArticle[]>(initialArticles);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadArticles = useCallback(async (): Promise<void> => {
    if (initialArticles.length > 0) {
      setArticles(initialArticles);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        locale,
        status: 'published',
        limit: '100',
      });

      if (featuredOnly) {
        params.set('featured', 'true');
      }

      const response = await fetch(`/api/articles?${params}`);

      if (!response.ok) {
        throw new Error(errorMessages.loadFailed);
      }

      const data = (await response.json()) as { articles: IArticle[] };
      setArticles(data.articles || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : errorMessages.unknown);
    } finally {
      setLoading(false);
    }
  }, [locale, featuredOnly, initialArticles, errorMessages.loadFailed, errorMessages.unknown]);

  const retry = (): void => {
    setError(null);
    void loadArticles();
  };

  useEffect(() => {
    void loadArticles();
  }, [loadArticles]);

  return { articles, loading, error, retry };
}
