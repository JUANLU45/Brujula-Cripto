'use client';

import { useState } from 'react';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/Button';

interface ArticleListFiltersProps {
  categories: string[];
  onCategoryChange: (category: string) => void;
}

export function ArticleListFilters({
  categories,
  onCategoryChange,
}: ArticleListFiltersProps): JSX.Element {
  const t = useTranslations('blog.list');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleCategoryChange = (category: string): void => {
    setSelectedCategory(category);
    onCategoryChange(category);
  };

  if (categories.length === 0) {
    return <></>;
  }

  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleCategoryChange('all')}
        >
          {t('categories.all')}
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleCategoryChange(category)}
          >
            {t(`categories.${category}`, { fallback: category })}
          </Button>
        ))}
      </div>
    </div>
  );
}
