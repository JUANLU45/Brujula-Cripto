'use client';

import type { IArticle } from '@brujula-cripto/types';

import { ArticlePageContent } from './ArticlePageContent';
import { ArticlePageHero } from './ArticlePageHero';
import { ArticlePageNavigation } from './ArticlePageNavigation';
import { ArticlePageSidebar } from './ArticlePageSidebar';

interface ArticlePageProps {
  article: IArticle;
  locale: 'es' | 'en';
  prevArticle?: IArticle;
  nextArticle?: IArticle;
  isSubscribed?: boolean;
  className?: string;
}

export function ArticlePage({
  article,
  locale,
  prevArticle,
  nextArticle,
  isSubscribed = false,
  className = '',
}: ArticlePageProps): JSX.Element {
  return (
    <article className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${className}`}>
      {/* Hero Section */}
      <ArticlePageHero article={article} locale={locale} />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
            {/* Article Content */}
            <ArticlePageContent article={article} locale={locale} />

            {/* Sidebar */}
            <ArticlePageSidebar article={article} locale={locale} isSubscribed={isSubscribed} />
          </div>

          {/* Navigation */}
          <ArticlePageNavigation
            prevArticle={prevArticle}
            nextArticle={nextArticle}
            locale={locale}
          />
        </div>
      </div>
    </article>
  );
}
