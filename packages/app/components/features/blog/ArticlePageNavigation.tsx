'use client';

import type { IArticle } from '@brujula-cripto/types';
import { useTranslations } from 'next-intl';

import { Card } from '@/components/ui/Card';

import { ChevronLeftIcon, ChevronRightIcon } from './ArticlePageIcons';

interface ArticlePageNavigationProps {
  prevArticle?: IArticle;
  nextArticle?: IArticle;
  locale: 'es' | 'en';
}

export function ArticlePageNavigation({
  prevArticle,
  nextArticle,
  locale,
}: ArticlePageNavigationProps): JSX.Element {
  const t = useTranslations('blog');

  if (!prevArticle && !nextArticle) {
    return <></>;
  }

  return (
    <Card className="mt-12 p-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Previous Article */}
        {prevArticle && (
          <div className="flex items-center">
            <ChevronLeftIcon className="mr-3 h-5 w-5 text-gray-400" />
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {t('article.navigation.previous')}
              </div>
              <a
                href={`/blog/${prevArticle.slug}`}
                className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {prevArticle[locale].title}
              </a>
            </div>
          </div>
        )}

        {/* Next Article */}
        {nextArticle && (
          <div className="flex items-center justify-end text-right md:col-start-2">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {t('article.navigation.next')}
              </div>
              <a
                href={`/blog/${nextArticle.slug}`}
                className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {nextArticle[locale].title}
              </a>
            </div>
            <ChevronRightIcon className="ml-3 h-5 w-5 text-gray-400" />
          </div>
        )}
      </div>
    </Card>
  );
}
