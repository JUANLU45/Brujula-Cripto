'use client';

import Link from 'next/link';

import { useTranslations } from 'next-intl';

interface ArticleCardHeaderProps {
  title: string;
  authorName: string;
  createdAt: Date;
  articleUrl: string;
  locale: 'es' | 'en';
  showAuthor: boolean;
  compact: boolean;
}

export function ArticleCardHeader({
  title,
  authorName,
  createdAt,
  articleUrl,
  locale,
  showAuthor,
  compact,
}: ArticleCardHeaderProps): JSX.Element {
  const t = useTranslations('blog.card');

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  return (
    <>
      {/* Title */}
      <Link href={articleUrl}>
        <h3
          className={`text-foreground hover:text-primary font-bold transition-colors ${
            compact ? 'mb-2 text-lg' : 'mb-3 text-xl'
          } line-clamp-2`}
        >
          {title}
        </h3>
      </Link>

      {/* Author and Date */}
      {showAuthor && (
        <div
          className={`text-muted-foreground flex items-center text-sm ${compact ? 'mb-2' : 'mb-3'}`}
        >
          <span>
            {t('by')} {authorName}
          </span>
          <span className="mx-2">•</span>
          <time dateTime={createdAt.toISOString()}>{formatDate(createdAt)}</time>
        </div>
      )}
    </>
  );
}
