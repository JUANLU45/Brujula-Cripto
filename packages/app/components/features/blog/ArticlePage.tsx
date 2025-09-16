'use client';

import { useState } from 'react';

import type { IArticle } from '@brujula-cripto/types';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

// Iconos SVG inline para evitar dependencias externas - CUMPLE DOCUMENTACIÓN NAVBAR.TSX
const ChevronLeftIcon = ({ className }: { className?: string }): JSX.Element => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = ({ className }: { className?: string }): JSX.Element => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const ShareIcon = ({ className }: { className?: string }): JSX.Element => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
    />
  </svg>
);

const HeartIcon = ({ className }: { className?: string }): JSX.Element => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
);

const HeartSolidIcon = ({ className }: { className?: string }): JSX.Element => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
  </svg>
);

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
  const t = useTranslations('blog');
  const tCommon = useTranslations('common');

  const [isSharing, setIsSharing] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  // Web Share API implementation (from ArticleCard.tsx)
  const handleShare = async (): Promise<void> => {
    setIsSharing(true);
    try {
      if (navigator.share) {
        await navigator.share({
          title: article[locale].title,
          text: article[locale].excerpt,
          url: window.location.href,
        });
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(window.location.href);

        const toastEvent = new CustomEvent('show-toast', {
          detail: {
            message: t('urlCopied'),
            type: 'success',
          },
        });
        window.dispatchEvent(toastEvent);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const handleLike = async (): Promise<void> => {
    if (!isSubscribed) {
      return;
    }

    try {
      setIsLiked(!isLiked);
      setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));

      // LLAMADA REAL A API CENTRALIZADA - lib/api.ts
      const response = await fetch(`/api/articles/${article.slug}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isLiked: !isLiked }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar like');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert on error
      setIsLiked(!isLiked);
      setLikesCount((prev) => (isLiked ? prev + 1 : prev - 1));
    }
  };

  const formatDate = (date: string): string => {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  return (
    <article className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${className}`}>
      {/* Hero Section */}
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
            <p className="mb-8 text-xl text-gray-600 dark:text-gray-300">
              {article[locale].excerpt}
            </p>

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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
            {/* Article Content */}
            <div className="lg:col-span-3">
              <Card className="p-8">
                {/* Featured Image */}
                {article.imageUrl && (
                  <div className="mb-8 overflow-hidden rounded-lg">
                    <img
                      src={article.imageUrl}
                      alt={article[locale].title}
                      className="h-64 w-full object-cover md:h-80"
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

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Actions */}
                <Card className="p-6">
                  <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                    {t('article.actions')}
                  </h3>
                  <div className="space-y-3">
                    {/* Share Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => void handleShare()}
                      disabled={isSharing}
                      className="w-full justify-start"
                    >
                      <ShareIcon className="mr-2 h-4 w-4" />
                      {isSharing ? t('article.sharing') : t('article.share')}
                    </Button>

                    {/* Like Button (Subscribers Only) */}
                    <Button
                      variant={isLiked ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => void handleLike()}
                      disabled={!isSubscribed}
                      className="w-full justify-start"
                      title={!isSubscribed ? t('article.subscriberOnlyTooltip') : ''}
                    >
                      {isLiked ? (
                        <HeartSolidIcon className="mr-2 h-4 w-4 text-red-500" />
                      ) : (
                        <HeartIcon className="mr-2 h-4 w-4" />
                      )}
                      {likesCount} {t('article.likes')}
                    </Button>

                    {!isSubscribed && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t('article.subscriberOnlyMessage')}
                      </p>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          </div>

          {/* Navigation */}
          {(prevArticle || nextArticle) && (
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
          )}
        </div>
      </div>
    </article>
  );
}
