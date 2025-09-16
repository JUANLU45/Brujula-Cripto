'use client';
import { use } from 'react';

import Link from 'next/link';

import { useTranslations } from 'next-intl';

import { ArticleDataTable } from '@/components/features/admin/ArticleDataTable';
import { Button } from '@/components/ui/Button';

interface AdminArticlesPageProps {
  params: Promise<{ locale: string }>;
}

export default function AdminArticlesPage(props: AdminArticlesPageProps) {
  const params = use(props.params);
  const t = useTranslations('admin.articles');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">{t('subtitle')}</p>
        </div>
        <Link href={`/${params.locale}/admin/articles/new`}>
          <Button>{t('createNew')}</Button>
        </Link>
      </div>

      {/* Articles Table */}
      <ArticleDataTable showStatusFilter={true} showSearch={true} itemsPerPage={20} />
    </div>
  );
}
