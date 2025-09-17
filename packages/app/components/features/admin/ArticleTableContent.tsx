'use client';

import Link from 'next/link';

import type { IArticle } from '@brujula-cripto/types';
import { useTranslations } from 'next-intl';

import { Card } from '@/components/ui/Card';

interface ArticleTableContentProps {
  articles: IArticle[];
  selectedArticles: Set<string>;
  onSelectAll: () => void;
  onSelectArticle: (slug: string) => void;
  onStatusChange: (slug: string, status: 'published' | 'draft') => Promise<void>;
}

export function ArticleTableContent({
  articles,
  selectedArticles,
  onSelectAll,
  onSelectArticle,
  onStatusChange,
}: ArticleTableContentProps): JSX.Element {
  const t = useTranslations('admin.articles');

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedArticles.size === articles.length && articles.length > 0}
                  onChange={onSelectAll}
                  title={t('table.selectAll')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {t('table.title')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {t('table.author')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {t('table.status')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {t('table.created')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {t('table.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
            {articles.map((article) => (
              <tr key={article.slug} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedArticles.has(article.slug)}
                    onChange={() => onSelectArticle(article.slug)}
                    title={t('table.selectArticle', { title: article.es.title })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {article.es.title}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{article.en.title}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {article.authorName}
                </td>
                <td className="px-6 py-4">
                  <select
                    value={article.status}
                    onChange={(e) =>
                      void onStatusChange(article.slug, e.target.value as 'published' | 'draft')
                    }
                    title={t('table.changeStatus')}
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      article.status === 'published'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                    }`}
                  >
                    <option value="draft">{t('status.draft')}</option>
                    <option value="published">{t('status.published')}</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(article.createdAt)}
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/admin/articles/${article.slug}`}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      {t('actions.edit')}
                    </Link>
                    <span className="text-gray-300 dark:text-gray-600">|</span>
                    <Link
                      href={`/blog/${article.slug}`}
                      target="_blank"
                      className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {t('actions.view')}
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
