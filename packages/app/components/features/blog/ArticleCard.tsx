'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { IArticle } from '@brujula-cripto/types';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

interface ArticleCardProps {
  article: IArticle;
  locale: 'es' | 'en';
  showAuthor?: boolean;
  showExcerpt?: boolean;
  showTags?: boolean;
  showSharing?: boolean;
  showInteractions?: boolean;
  compact?: boolean;
  className?: string;
}

export function ArticleCard({
  article,
  locale,
  showAuthor = true,
  showExcerpt = true,
  showTags = true,
  showSharing = true,
  showInteractions = true,
  compact = false,
  className = '',
}: ArticleCardProps) {
  const t = useTranslations('blog.card');
  const router = useRouter();
  const pathname = usePathname();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isSharing, setIsSharing] = useState(false);

  const content = article[locale];
  const articleUrl = `${pathname.includes('/en') ? '/en' : ''}/blog/${article.slug}`;

  const handleTagClick = (tag: string) => {
    router.push(`${pathname.includes('/en') ? '/en' : ''}/blog?tag=${encodeURIComponent(tag)}`);
  };

  const handleShare = async () => {
    if (!showSharing) return;

    setIsSharing(true);
    try {
      if (navigator.share) {
        await navigator.share({
          title: content.title,
          text: content.excerpt,
          url: `${window.location.origin}${articleUrl}`,
        });
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(`${window.location.origin}${articleUrl}`);

        // Use modern toast notification for production
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

  const handleLike = async () => {
    if (!showInteractions) return;

    try {
      // Call real API endpoint for like functionality
      const response = await fetch('/api/articles/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleSlug: article.slug, action: isLiked ? 'unlike' : 'like' }),
      });

      if (response.ok) {
        setIsLiked(!isLiked);
        setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
      }
    } catch (error) {
      console.error('Error handling like:', error);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  return (
    <Card
      className={`overflow-hidden transition-shadow hover:shadow-lg ${compact ? 'p-4' : 'p-6'} ${className}`}
    >
      {/* Article Image */}
      <div className={`relative ${compact ? 'h-40' : 'h-48'} w-full overflow-hidden rounded-lg`}>
        <Link href={articleUrl}>
          <Image
            src={article.imageUrl}
            alt={content.title}
            fill
            className="object-cover transition-transform hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
        {article.isFeatured && (
          <div className="absolute right-2 top-2">
            <span className="bg-primary text-primary-foreground rounded px-2 py-1 text-xs font-medium">
              {t('featured')}
            </span>
          </div>
        )}
      </div>

      {/* Article Content */}
      <div className={`${compact ? 'mt-3' : 'mt-4'}`}>
        {/* Title */}
        <Link href={articleUrl}>
          <h3
            className={`text-foreground hover:text-primary font-bold transition-colors ${
              compact ? 'mb-2 text-lg' : 'mb-3 text-xl'
            } line-clamp-2`}
          >
            {content.title}
          </h3>
        </Link>

        {/* Author and Date */}
        {showAuthor && (
          <div
            className={`text-muted-foreground flex items-center text-sm ${compact ? 'mb-2' : 'mb-3'}`}
          >
            <span>
              {t('by')} {article.authorName}
            </span>
            <span className="mx-2">•</span>
            <time dateTime={article.createdAt.toISOString()}>{formatDate(article.createdAt)}</time>
          </div>
        )}

        {/* Excerpt */}
        {showExcerpt && !compact && (
          <p className="text-muted-foreground mb-4 line-clamp-3 text-sm">{content.excerpt}</p>
        )}

        {/* Tags */}
        {showTags && article.tags.length > 0 && (
          <div className={`flex flex-wrap gap-2 ${compact ? 'mb-3' : 'mb-4'}`}>
            {article.tags.slice(0, compact ? 2 : 4).map((tag: string) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className="bg-muted text-muted-foreground hover:bg-muted/80 rounded-full px-2 py-1 text-xs transition-colors"
              >
                #{tag}
              </button>
            ))}
            {article.tags.length > (compact ? 2 : 4) && (
              <span className="text-muted-foreground px-2 py-1 text-xs">
                +{article.tags.length - (compact ? 2 : 4)} {t('moreTags')}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        {(showSharing || showInteractions) && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Like Button */}
              {showInteractions && (
                <button
                  onClick={handleLike}
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
              <Link
                href={articleUrl}
                className="text-primary hover:text-primary/80 text-sm font-medium"
              >
                {t('readMore')} →
              </Link>
            </div>

            {/* Share Button */}
            {showSharing && (
              <Button
                className="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={handleShare}
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

            {/* Like Button */}
            {showInteractions && (
              <Button
                className="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={handleLike}
                disabled={!showInteractions}
              >
                <svg
                  className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`}
                  fill="none"
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
                <span className="ml-1 text-sm">{likesCount}</span>
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
