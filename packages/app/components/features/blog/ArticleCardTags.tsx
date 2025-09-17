'use client';

import { usePathname, useRouter } from 'next/navigation';

import { useTranslations } from 'next-intl';

interface ArticleCardTagsProps {
  tags: string[];
  compact: boolean;
}

export function ArticleCardTags({ tags, compact }: ArticleCardTagsProps): JSX.Element {
  const t = useTranslations('blog.card');
  const router = useRouter();
  const pathname = usePathname();

  const handleTagClick = (tag: string): void => {
    router.push(`${pathname.includes('/en') ? '/en' : ''}/blog?tag=${encodeURIComponent(tag)}`);
  };

  const maxTags = compact ? 2 : 4;
  const visibleTags = tags.slice(0, maxTags);
  const remainingCount = tags.length - maxTags;

  return (
    <div className={`flex flex-wrap gap-2 ${compact ? 'mb-3' : 'mb-4'}`}>
      {visibleTags.map((tag: string) => (
        <button
          key={tag}
          onClick={() => handleTagClick(tag)}
          className="bg-muted text-muted-foreground hover:bg-muted/80 rounded-full px-2 py-1 text-xs transition-colors"
        >
          #{tag}
        </button>
      ))}
      {remainingCount > 0 && (
        <span className="text-muted-foreground px-2 py-1 text-xs">
          +{remainingCount} {t('moreTags')}
        </span>
      )}
    </div>
  );
}
