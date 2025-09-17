'use client';

import { useState } from 'react';

import type { IArticle } from '@brujula-cripto/types';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

import { HeartIcon, HeartSolidIcon, ShareIcon } from './ArticlePageIcons';

interface ArticlePageSidebarProps {
  article: IArticle;
  locale: 'es' | 'en';
  isSubscribed: boolean;
}

export function ArticlePageSidebar({
  article,
  locale,
  isSubscribed,
}: ArticlePageSidebarProps): JSX.Element {
  const t = useTranslations('blog');
  const [isSharing, setIsSharing] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

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
    if (!isSubscribed) return;

    try {
      setIsLiked(!isLiked);
      setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));

      const response = await fetch(`/api/articles/${article.slug}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isLiked: !isLiked }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar like');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      setIsLiked(!isLiked);
      setLikesCount((prev) => (isLiked ? prev + 1 : prev - 1));
    }
  };

  return (
    <div className="lg:col-span-1">
      <div className="sticky top-8 space-y-6">
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
  );
}
