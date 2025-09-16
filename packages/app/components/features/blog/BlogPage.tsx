'use client';

import { useState } from 'react';

import type { IArticle } from '@brujula-cripto/types';
import { useTranslations } from 'next-intl';

import { ArticleList } from '@/components/features/blog/ArticleList';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface BlogPageProps {
  locale: 'es' | 'en';
  articles?: IArticle[];
  bannerConfig?: {
    title?: string;
    subtitle?: string;
    description?: string;
    imageUrl?: string;
    isEditable?: boolean;
  };
  className?: string;
}

export function BlogPage({
  locale,
  articles = [],
  bannerConfig,
  className = '',
}: BlogPageProps): JSX.Element {
  const t = useTranslations('blog');
  const tCommon = useTranslations('common');
  const [bannerImage, setBannerImage] = useState(
    bannerConfig?.imageUrl || '/images/blog/blog-hero.jpg',
  );

  const defaultBanner = {
    title: bannerConfig?.title || t('page.title'),
    subtitle: bannerConfig?.subtitle || t('page.subtitle'),
    description: bannerConfig?.description || t('page.description'),
    imageUrl: bannerImage,
    isEditable: bannerConfig?.isEditable || false,
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBannerImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${className}`}>
      {/* Banner Hero Section */}
      <div
        className="relative h-96 bg-slate-700 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('${defaultBanner.imageUrl}')`,
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto px-4 text-center text-white">
            <h1 className="mb-4 text-4xl font-bold md:text-6xl">{defaultBanner.title}</h1>
            {defaultBanner.subtitle && (
              <h2 className="mb-6 text-xl font-medium opacity-90 md:text-2xl">
                {defaultBanner.subtitle}
              </h2>
            )}
            <p className="mx-auto max-w-3xl text-lg opacity-80 md:text-xl">
              {defaultBanner.description}
            </p>

            {/* Banner Edit Controls (Admin Only) */}
            {defaultBanner.isEditable && (
              <div className="mt-8 space-y-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="banner-image-upload"
                  aria-label="Subir imagen del banner"
                  title="Seleccionar imagen para el banner"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => document.getElementById('banner-image-upload')?.click()}
                  className="bg-white/20 text-white hover:bg-white/30"
                >
                  📷 Cambiar Imagen Banner
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Blog Stats */}
        <Card className="mb-8 border-0 bg-white/80 p-6 backdrop-blur-sm dark:bg-gray-800/80">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {articles.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{tCommon('articles')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {new Set(articles.map((a) => a.category)).size}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {tCommon('categories')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {new Set(articles.flatMap((a) => a.tags || [])).size}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{tCommon('tags')}</div>
            </div>
          </div>
        </Card>

        {/* Articles Section */}
        <ArticleList
          locale={locale}
          initialArticles={articles}
          showSearch={true}
          showPagination={true}
          itemsPerPage={12}
          compact={false}
          className="mt-8"
        />

        {/* Empty State */}
        {articles.length === 0 && (
          <Card className="p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <svg
                className="h-8 w-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
              {t('empty.title')}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">{t('empty.description')}</p>
          </Card>
        )}
      </div>
    </div>
  );
}
