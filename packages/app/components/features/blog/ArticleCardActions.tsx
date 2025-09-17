'use client';

import { useState } from 'react';

import Link from 'next/link';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/Button';

interface ArticleCardActionsProps {
  articleUrl: string;
  articleSlug: string;
  articleTitle: string;
  articleExcerpt: string;
  showSharing: boolean;
  showInteractions: boolean;
}

export function ArticleCardActions({
  articleUrl,
  articleSlug,
  articleTitle,
  articleExcerpt,
  showSharing,
  showInteractions,
}: ArticleCardActionsProps): JSX.Element {
  const t = useTranslations('blog.card');
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async (): Promise<void> => {
    if (!showSharing) {
      return;
    }

    setIsSharing(true);
    try {
      if (navigator.share) {
        await navigator.share({
          title: articleTitle,
          text: articleExcerpt,
          url: `${window.location.origin}${articleUrl}`,
        });
      } else {
        await navigator.clipboard.writeText(`${window.location.origin}${articleUrl}`);
        const toastEvent = new CustomEvent('show-toast', {
          detail: { message: t('urlCopied'), type: 'success' },
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
    if (!showInteractions) {
      return;
    }

    try {
      const response = await fetch('/api/articles/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleSlug, action: isLiked ? 'unlike' : 'like' }),
      });

      if (response.ok) {
        setIsLiked(!isLiked);
        setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
      }
    } catch (error) {
      console.error('Error handling like:', error);
    }
  };

  if (!showSharing && !showInteractions) {
    return <></>;
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Like Button */}
        {showInteractions && (
          <button
            onClick={() => void handleLike()}
            className={`flex items-center gap-1 text-sm transition-colors ${
              isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'
            }`}
          >
            <svg
              className="h-4 w-4"
              fill={isLiked ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            {likesCount > 0 && <span>{likesCount}</span>}
          </button>
        )}

        {/* Read More Link */}
        <Link href={articleUrl} className="text-primary hover:text-primary/80 text-sm font-medium">
          {t('readMore')} →
        </Link>
      </div>

      {/* Share Button */}
      {showSharing && (
        <Button
          className="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={() => void handleShare()}
          disabled={isSharing}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
            />
          </svg>
        </Button>
      )}
    </div>
  );
}
