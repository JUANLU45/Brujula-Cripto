'use client';

import { useTranslations } from 'next-intl';

import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

interface ArticleMetadataProps {
  slug: string;
  authorName: string;
  category: string;
  tags: string[];
  isFeatured: boolean;
  status: 'draft' | 'published';
  onSlugChange: (slug: string) => void;
  onAuthorChange: (author: string) => void;
  onCategoryChange: (category: string) => void;
  onTagsChange: (tags: string[]) => void;
  onFeaturedChange: (featured: boolean) => void;
  onStatusChange: (status: 'draft' | 'published') => void;
}

export function ArticleMetadata({
  slug,
  authorName,
  category,
  tags,
  isFeatured,
  status,
  onSlugChange,
  onAuthorChange,
  onCategoryChange,
  onTagsChange,
  onFeaturedChange,
  onStatusChange,
}: ArticleMetadataProps): JSX.Element {
  const t = useTranslations('admin.editor');

  const handleTagsChange = (value: string): void => {
    const newTags = value
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
    onTagsChange(newTags);
  };

  return (
    <Card className="space-y-4 p-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t('metadata.title')}</h3>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('fields.slug')}
        </label>
        <Input
          type="text"
          value={slug}
          onChange={(e) => onSlugChange(e.target.value)}
          placeholder={t('placeholders.slug')}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('fields.author')}
        </label>
        <Input
          type="text"
          value={authorName}
          onChange={(e) => onAuthorChange(e.target.value)}
          placeholder={t('placeholders.author')}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('fields.category')}
        </label>
        <Input
          type="text"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          placeholder={t('placeholders.category')}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('fields.tags')}
        </label>
        <Input
          type="text"
          value={tags.join(', ')}
          onChange={(e) => handleTagsChange(e.target.value)}
          placeholder={t('placeholders.tags')}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('fields.status')}
        </label>
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value as 'draft' | 'published')}
          title={t('fields.status')}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <option value="draft">{t('status.draft')}</option>
          <option value="published">{t('status.published')}</option>
        </select>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="featured"
          checked={isFeatured}
          onChange={(e) => onFeaturedChange(e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="featured" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
          {t('fields.featured')}
        </label>
      </div>
    </Card>
  );
}
