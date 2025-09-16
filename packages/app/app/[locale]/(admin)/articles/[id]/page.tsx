'use client';

import { useEffect, useState, use } from 'react';

import { useRouter } from 'next/navigation';

import type { IArticle } from '@brujula-cripto/types';
import { useTranslations } from 'next-intl';

import { ArticleEditor } from '@/components/features/admin/ArticleEditor';
import { Spinner } from '@/components/ui/Spinner';

interface ArticleEditorPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export default function ArticleEditorPage(props: ArticleEditorPageProps) {
  const params = use(props.params);
  const t = useTranslations('admin.editor');
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [article, setArticle] = useState<IArticle | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isNewArticle = params.id === 'new';

  useEffect(() => {
    if (isNewArticle) {
      setLoading(false);
      return;
    }

    const loadArticle = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/admin/articles/${params.id}`, {
          headers: {
            Authorization: `Bearer ${await getAuthToken()}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al cargar el artículo');
        }

        const data = await response.json();
        setArticle(data.article);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [params.id, isNewArticle]);

  const getAuthToken = async () => {
    // Get Firebase auth token
    const { auth } = await import('@/lib/firebase');
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No autenticado');
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
        <button
          onClick={() => router.back()}
          className="text-blue-600 underline hover:text-blue-800"
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isNewArticle ? 'Nuevo Artículo' : 'Editar Artículo'}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {isNewArticle
              ? 'Crea un nuevo artículo para el blog'
              : `Editando: ${article?.es.title || 'Artículo sin título'}`}
          </p>
        </div>
      </div>

      {/* Editor */}
      <ArticleEditor
        articleSlug={isNewArticle ? undefined : params.id}
        initialData={article || undefined}
        mode={isNewArticle ? 'create' : 'edit'}
      />
    </div>
  );
}
