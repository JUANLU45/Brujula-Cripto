'use client';

import Image from 'next/image';

import type { IArticle } from '@brujula-cripto/types';
import { useTranslations } from 'next-intl';

import { Card } from '@/components/ui/Card';

interface ArticlePageContentProps {
  article: IArticle;
  locale: 'es' | 'en';
}

export function ArticlePageContent({ article, locale }: ArticlePageContentProps): JSX.Element {
  const tCommon = useTranslations('common');

  return (
    <div className="lg:col-span-3">
      <Card className="p-8">
        {/* Featured Image */}
        {article.imageUrl && (
          <div className="mb-8 overflow-hidden rounded-lg">
            <Image
              src={article.imageUrl}
              alt={article[locale].title}
              className="h-64 w-full object-cover md:h-80"
              width={800}
              height={320}
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          {/* RENDERIZADO SEGURO DE CONTENIDO MARKDOWN SEGÚN PROYEC_PARTE2.MD */}
          <div
            dangerouslySetInnerHTML={{
              __html: article[locale].contentMarkdown || '',
            }}
          />
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-8 border-t border-gray-200 pt-8 dark:border-gray-700">
            <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
              {tCommon('tags')}
            </h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <div
                  key={tag}
                  className="cursor-pointer rounded border border-gray-300 px-2 py-1 text-sm hover:bg-blue-50 dark:border-gray-600 dark:hover:bg-blue-900"
                >
                  #{tag}
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
