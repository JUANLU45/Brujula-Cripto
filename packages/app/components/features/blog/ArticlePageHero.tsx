'use client';

import type { IArticle } from '@brujula-cripto/types';

interface ArticlePageHeroProps {
  article: IArticle;
  locale: 'es' | 'en';
}

export function ArticlePageHero({ article, locale }: ArticlePageHeroProps): JSX.Element {
  const formatDate = (date: string): string => {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  return (
    <div className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          {/* Category Badge */}
          <div className="mb-4 inline-block rounded bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {article.category}
          </div>

          {/* Title */}
          <h1 className="mb-6 text-4xl font-bold text-gray-900 dark:text-white md:text-5xl">
            {article[locale].title}
          </h1>

          {/* Excerpt */}
          <p className="mb-8 text-xl text-gray-600 dark:text-gray-300">{article[locale].excerpt}</p>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <span className="font-medium">{article.authorName}</span>
            </div>
            <div>{formatDate(article.createdAt.toString())}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
