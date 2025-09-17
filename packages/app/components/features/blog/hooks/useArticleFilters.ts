import { useMemo } from 'react';

import { useSearchParams } from 'next/navigation';

interface ArticleFilters {
  search?: string;
  category?: string;
  tag?: string;
  status?: 'published' | 'draft';
  featured?: boolean;
}

interface UseArticleFiltersProps {
  featuredOnly: boolean;
}

export function useArticleFilters({ featuredOnly }: UseArticleFiltersProps): {
  filters: ArticleFilters;
  page: number;
} {
  const searchParams = useSearchParams();

  const filters = useMemo(
    (): ArticleFilters => ({
      search: searchParams.get('search') || undefined,
      category: searchParams.get('category') || undefined,
      tag: searchParams.get('tag') || undefined,
      status: 'published',
      featured: featuredOnly || undefined,
    }),
    [searchParams, featuredOnly],
  );

  const page = useMemo(() => parseInt(searchParams.get('page') || '1', 10), [searchParams]);

  return { filters, page };
}
