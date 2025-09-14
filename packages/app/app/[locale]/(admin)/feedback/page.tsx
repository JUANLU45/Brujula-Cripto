'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { auth } from '@/lib/firebase';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

interface FeedbackMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  submittedAt: Date;
  status: 'new' | 'read';
}

export default function AdminFeedbackPage() {
  const t = useTranslations('admin.feedback');
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [feedback, setFeedback] = useState<FeedbackMessage[]>([]);
  const [filteredFeedback, setFilteredFeedback] = useState<FeedbackMessage[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'read'>('all');

  useEffect(() => {
    const loadFeedback = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/admin/feedback', {
          headers: {
            Authorization: `Bearer ${await getAuthToken()}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al cargar mensajes de feedback');
        }

        const data = await response.json();
        setFeedback(data.feedback || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    loadFeedback();
  }, []);

  // Filter feedback
  useEffect(() => {
    let filtered = [...feedback];

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(search) ||
          item.email.toLowerCase().includes(search) ||
          item.message.toLowerCase().includes(search),
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    setFilteredFeedback(filtered);
  }, [feedback, searchTerm, statusFilter]);

  const getAuthToken = async () => {
    const user = auth.currentUser;
    if (!user) throw new Error('No autenticado');
    return await user.getIdToken();
  };

  const handleSelectAll = () => {
    if (selectedItems.size === filteredFeedback.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredFeedback.map((item) => item.id)));
    }
  };

  const handleSelectItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const handleDelete = async (id: string) => {
    try {
      setDeleting(id);
      setError(null);

      const response = await fetch(`/api/admin/feedback/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${await getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al eliminar mensaje');
      }

      setFeedback((prev) => prev.filter((item) => item.id !== id));
      setSuccess('Mensaje eliminado exitosamente');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar');
    } finally {
      setDeleting(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.size === 0) return;

    try {
      setDeleting('bulk');
      setError(null);

      const response = await fetch('/api/admin/feedback/bulk-delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await getAuthToken()}`,
        },
        body: JSON.stringify({ ids: Array.from(selectedItems) }),
      });

      if (!response.ok) {
        throw new Error('Error al eliminar mensajes');
      }

      setFeedback((prev) => prev.filter((item) => !selectedItems.has(item.id)));
      setSelectedItems(new Set());
      setSuccess(`${selectedItems.size} mensajes eliminados exitosamente`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar');
    } finally {
      setDeleting(null);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/feedback/${id}/mark-read`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${await getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al marcar como leído');
      }

      setFeedback((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: 'read' as const } : item)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al marcar como leído');
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Gestión de Mensajes de Feedback
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Administra los mensajes de feedback de los usuarios
        </p>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <Input
              placeholder="Buscar por nombre, email o mensaje..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <label htmlFor="status-filter" className="sr-only">
            Filtrar por estado
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'new' | 'read')}
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            aria-label="Filtrar feedback por estado"
          >
            <option value="all">Todos</option>
            <option value="new">Nuevos</option>
            <option value="read">Leídos</option>
          </select>
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedItems.size > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {selectedItems.size} elemento(s) seleccionado(s)
            </span>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              disabled={deleting === 'bulk'}
            >
              {deleting === 'bulk' ? 'Eliminando...' : 'Eliminar Seleccionados'}
            </Button>
          </div>
        </Card>
      )}

      {/* Messages */}
      <Card className="overflow-hidden">
        {filteredFeedback.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <label htmlFor="select-all-feedback" className="sr-only">
                      Seleccionar todos los elementos
                    </label>
                    <input
                      id="select-all-feedback"
                      type="checkbox"
                      checked={
                        selectedItems.size === filteredFeedback.length &&
                        filteredFeedback.length > 0
                      }
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      aria-label="Seleccionar todos los elementos de feedback"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Mensaje
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                {filteredFeedback.map((item) => (
                  <tr
                    key={item.id}
                    className={item.status === 'new' ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <label htmlFor={`select-feedback-${item.id}`} className="sr-only">
                        Seleccionar feedback de {item.email}
                      </label>
                      <input
                        id={`select-feedback-${item.id}`}
                        type="checkbox"
                        checked={selectedItems.has(item.id)}
                        onChange={() => handleSelectItem(item.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        aria-label={`Seleccionar feedback de ${item.email}`}
                      />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          item.status === 'new'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                        }`}
                      >
                        {item.status === 'new' ? 'Nuevo' : 'Leído'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      {item.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {item.email}
                    </td>
                    <td className="max-w-xs truncate px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {item.message}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(item.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="space-x-2 whitespace-nowrap px-6 py-4 text-sm">
                      {item.status === 'new' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkAsRead(item.id)}
                        >
                          Marcar Leído
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        disabled={deleting === item.id}
                      >
                        {deleting === item.id ? 'Eliminando...' : 'Eliminar'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">No hay mensajes de feedback</p>
          </div>
        )}
      </Card>

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
