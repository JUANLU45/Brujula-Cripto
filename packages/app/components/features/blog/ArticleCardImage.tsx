'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useTranslations } from 'next-intl';

interface ArticleCardImageProps {
  imageUrl: string;
  title: string;
  articleUrl: string;
  isFeatured: boolean;
  compact: boolean;
}

export function ArticleCardImage({
  imageUrl,
  title,
  articleUrl,
  isFeatured,
  compact,
}: ArticleCardImageProps): JSX.Element {
  const t = useTranslations('blog.card');

  return (
    <div className={`relative ${compact ? 'h-40' : 'h-48'} w-full overflow-hidden rounded-lg`}>
      <Link href={articleUrl}>
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </Link>
      {isFeatured && (
        <div className="absolute right-2 top-2">
          <span className="bg-primary text-primary-foreground rounded px-2 py-1 text-xs font-medium">
            {t('featured')}
          </span>
        </div>
      )}
    </div>
  );
}
