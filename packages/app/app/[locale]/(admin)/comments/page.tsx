'use client';

import { useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { auth } from '@/lib/firebase';

interface Comment {
  id: string;
  articleSlug: string;
  articleTitle: string;
  authorName: string;
  authorEmail: string;
  content: string;
  submittedAt: Date;
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  moderationScore?: number;
  moderationReason?: string;
}

export default function AdminCommentsPage() {
  const t = useTranslations('admin.comments');
  const [loading, setLoading] = useState(true);
  const [moderating, setModerating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [comments, setComments] = useState<Comment[]>([]);
  const [filteredComments, setFilteredComments] = useState<Comment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'pending' | 'approved' | 'rejected' | 'flagged'
  >('all');

  useEffect(() => {
    const loadComments = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/admin/comments', {
          headers: {
            Authorization: `Bearer ${await getAuthToken()}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al cargar comentarios');
        }

        const data = await response.json();
        setComments(data.comments || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    loadComments();
  }, []);

  // Filter comments
  useEffect(() => {
    let filtered = [...comments];

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (comment) =>
          comment.authorName.toLowerCase().includes(search) ||
          comment.authorEmail.toLowerCase().includes(search) ||
          comment.content.toLowerCase().includes(search) ||
          comment.articleTitle.toLowerCase().includes(search),
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((comment) => comment.status === statusFilter);
    }

    setFilteredComments(filtered);
  }, [comments, searchTerm, statusFilter]);

  const getAuthToken = async () => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No autenticado');
    }
    return await user.getIdToken();
  };

  const handleModerateComment = async (
    commentId: string,
    action: 'approve' | 'reject' | 'delete',
  ) => {
    try {
      setModerating(commentId);
      setError(null);

      const response = await fetch(`/api/admin/comments/${commentId}/moderate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await getAuthToken()}`,
        },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        throw new Error('Error al moderar comentario');
      }

      if (action === 'delete') {
        setComments((prev) => prev.filter((comment) => comment.id !== commentId));
        setSuccess('Comentario eliminado exitosamente');
      } else {
        const newStatus = action === 'approve' ? 'approved' : 'rejected';
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === commentId
              ? { ...comment, status: newStatus as Comment['status'] }
              : comment,
          ),
        );
        setSuccess(`Comentario ${action === 'approve' ? 'aprobado' : 'rechazado'} exitosamente`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al moderar comentario');
    } finally {
      setModerating(null);
    }
  };

  const triggerAIModeration = async () => {
    try {
      setError(null);

      const response = await fetch('/api/admin/comments/ai-moderation', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${await getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al ejecutar moderación IA');
      }

      setSuccess('Moderación IA ejecutada. Recargando comentarios...');
      // Reload comments after AI moderation
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en moderación IA');
    }
  };

  const getStatusColor = (status: Comment['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'flagged':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusText = (status: Comment['status']) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'approved':
        return 'Aprobado';
      case 'rejected':
        return 'Rechazado';
      case 'flagged':
        return 'Marcado';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Moderación de Comentarios
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Administra y modera los comentarios del blog
          </p>
        </div>
        <Button onClick={triggerAIModeration}>Ejecutar Moderación IA</Button>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <Input
              placeholder="Buscar por autor, email, contenido o artículo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            aria-label="Filtrar comentarios por estado"
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="all">Todos</option>
            <option value="pending">Pendientes</option>
            <option value="approved">Aprobados</option>
            <option value="rejected">Rechazados</option>
            <option value="flagged">Marcados</option>
          </select>
        </div>
      </Card>

      {/* Comments */}
      <div className="space-y-4">
        {filteredComments.length > 0 ? (
          filteredComments.map((comment) => (
            <Card key={comment.id} className="p-6">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center space-x-3">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {comment.authorName}
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {comment.authorEmail}
                    </span>
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${getStatusColor(comment.status)}`}
                    >
                      {getStatusText(comment.status)}
                    </span>
                  </div>
                  <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                    En: <span className="font-medium">{comment.articleTitle}</span>
                  </p>
                  <p className="mb-2 text-gray-900 dark:text-white">{comment.content}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>{new Date(comment.submittedAt).toLocaleString()}</span>
                    {comment.moderationScore && (
                      <span>Puntuación IA: {comment.moderationScore.toFixed(2)}</span>
                    )}
                    {comment.moderationReason && <span>Razón: {comment.moderationReason}</span>}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2">
                {comment.status === 'pending' && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleModerateComment(comment.id, 'approve')}
                      disabled={moderating === comment.id}
                    >
                      Aprobar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleModerateComment(comment.id, 'reject')}
                      disabled={moderating === comment.id}
                    >
                      Rechazar
                    </Button>
                  </>
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleModerateComment(comment.id, 'delete')}
                  disabled={moderating === comment.id}
                >
                  {moderating === comment.id ? 'Eliminando...' : 'Eliminar'}
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">No hay comentarios para mostrar</p>
          </Card>
        )}
      </div>

      {/* Messages */}
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {success && (
        <div className="rounded-md border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
          <p className="text-green-800 dark:text-green-200">{success}</p>
        </div>
      )}
    </div>
  );
}
