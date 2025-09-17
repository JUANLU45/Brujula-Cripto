'use client';

import { usePathname } from 'next/navigation';

import type { IArticle } from '@brujula-cripto/types';

import { Card } from '@/components/ui/Card';

import { ArticleCardActions } from './ArticleCardActions';
import { ArticleCardHeader } from './ArticleCardHeader';
import { ArticleCardImage } from './ArticleCardImage';
import { ArticleCardTags } from './ArticleCardTags';

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
}: ArticleCardProps): JSX.Element {
  const pathname = usePathname();
  const content = article[locale];
  const articleUrl = `${pathname.includes('/en') ? '/en' : ''}/blog/${article.slug}`;

  return (
    <Card
      className={`overflow-hidden transition-shadow hover:shadow-lg ${compact ? 'p-4' : 'p-6'} ${className}`}
    >
      {/* Article Image */}
      <ArticleCardImage
        imageUrl={article.imageUrl}
        title={content.title}
        articleUrl={articleUrl}
        isFeatured={article.isFeatured}
        compact={compact}
      />

      {/* Article Content */}
      <div className={`${compact ? 'mt-3' : 'mt-4'}`}>
        {/* Title and Author */}
        <ArticleCardHeader
          title={content.title}
          authorName={article.authorName}
          createdAt={article.createdAt}
          articleUrl={articleUrl}
          locale={locale}
          showAuthor={showAuthor}
          compact={compact}
        />

        {/* Excerpt */}
        {showExcerpt && !compact && (
          <p className="text-muted-foreground mb-4 line-clamp-3 text-sm">{content.excerpt}</p>
        )}

        {/* Tags */}
        {showTags && article.tags.length > 0 && (
          <ArticleCardTags tags={article.tags} compact={compact} />
        )}

        {/* Actions */}
        <ArticleCardActions
          articleUrl={articleUrl}
          articleSlug={article.slug}
          articleTitle={content.title}
          articleExcerpt={content.excerpt}
          showSharing={showSharing}
          showInteractions={showInteractions}
        />
      </div>
    </Card>
  );
}
