'use client';

import Link from 'next/link';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export function ArticleTableEmpty(): JSX.Element {
  const t = useTranslations('admin.articles');

  return (
    <Card className="p-12 text-center">
      <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
        <svg
          className="h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">{t('empty.title')}</h3>
      <p className="mb-6 text-gray-500 dark:text-gray-400">{t('empty.description')}</p>
      <Link href="/admin/articles/new">
        <Button className="bg-blue-600 text-white hover:bg-blue-700">
          {t('empty.createFirst')}
        </Button>
      </Link>
    </Card>
  );
}
