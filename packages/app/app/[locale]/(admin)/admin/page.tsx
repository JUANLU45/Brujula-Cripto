'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import type { IArticle } from '@brujula-cripto/types';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { auth } from '@/lib/firebase';

interface DashboardStats {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  totalViews: number;
  recentArticles: IArticle[];
}

export default function AdminDashboardPage() {
  const t = useTranslations('admin.dashboard');
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch dashboard stats from API
        const response = await fetch('/api/admin/dashboard', {
          headers: {
            Authorization: `Bearer ${await getAuthToken()}`,
          },
        });

        if (!response.ok) {
          throw new Error(t('errors.loadStats'));
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('errors.unknown'));
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const getAuthToken = async () => {
    // Get Firebase auth token
    const user = auth.currentUser;
    if (!user) {
      throw new Error(t('errors.notAuthenticated'));
    }
    return await user.getIdToken();
  };

  if (loading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="mb-4 text-red-600 dark:text-red-400">{error}</p>
        <Button onClick={() => window.location.reload()}>Reintentar</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard de Administración
        </h1>
        <Link href="/admin/articles/new">
          <Button>Nuevo Artículo</Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Artículos</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats?.totalArticles || 0}
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Publicados</h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {stats?.publishedArticles || 0}
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Borradores</h3>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {stats?.draftArticles || 0}
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Vistas</h3>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {stats?.totalViews || 0}
          </p>
        </Card>
      </div>

      {/* Recent Articles */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Artículos Recientes
          </h2>
          <Link href="/admin/articles">
            <Button variant="outline" size="sm">
              Ver Todos
            </Button>
          </Link>
        </div>

        {stats?.recentArticles && stats.recentArticles.length > 0 ? (
          <div className="space-y-4">
            {stats.recentArticles.slice(0, 5).map((article) => (
              <div
                key={article.slug}
                className="flex items-center justify-between border-b border-gray-200 py-3 dark:border-gray-700"
              >
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{article.es.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {article.authorName} • {article.category}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      article.status === 'published'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}
                  >
                    {article.status === 'published' ? 'Publicado' : 'Borrador'}
                  </span>
                  <Link href={`/admin/articles/${article.slug}`}>
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-8 text-center text-gray-500 dark:text-gray-400">
            No hay artículos recientes
          </p>
        )}
      </Card>
    </div>
  );
}
