'use client';

import { useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { auth } from '@/lib/firebase';

interface User {
  uid: string;
  email: string;
  createdAt: Date;
  usageCreditsInSeconds: number;
  stripeCustomerId?: string;
  isAdmin?: boolean;
  lastLoginAt?: Date;
  displayName?: string;
}

export default function AdminUsersPage(): JSX.Element {
  const _t = useTranslations('admin.users');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(20);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/admin/users', {
          headers: {
            Authorization: `Bearer ${await getAuthToken()}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al cargar usuarios');
        }

        const data = await response.json();
        setUsers(data.users || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  // Filter users
  useEffect(() => {
    let filtered = [...users];

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.email.toLowerCase().includes(search) ||
          user.displayName?.toLowerCase().includes(search) ||
          user.uid.includes(search),
      );
    }

    // Apply role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter((user) => (roleFilter === 'admin' ? user.isAdmin : !user.isAdmin));
    }

    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [users, searchTerm, roleFilter]);

  const getAuthToken = async () => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No autenticado');
    }
    return await user.getIdToken();
  };

  // Format seconds to H:M:S
  const formatCredits = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  const handleUpdateCredits = async (uid: string, newCredits: number) => {
    try {
      setUpdating(uid);
      setError(null);

      const response = await fetch(`/api/admin/users/${uid}/credits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await getAuthToken()}`,
        },
        body: JSON.stringify({ credits: newCredits }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar créditos');
      }

      setUsers((prev) =>
        prev.map((user) =>
          user.uid === uid ? { ...user, usageCreditsInSeconds: newCredits } : user,
        ),
      );
      setSuccess('Créditos actualizados exitosamente');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar créditos');
    } finally {
      setUpdating(null);
    }
  };

  const handleToggleAdmin = async (uid: string, isAdmin: boolean) => {
    try {
      setUpdating(uid);
      setError(null);

      const response = await fetch(`/api/admin/users/${uid}/role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await getAuthToken()}`,
        },
        body: JSON.stringify({ isAdmin: !isAdmin }),
      });

      if (!response.ok) {
        throw new Error('Error al cambiar rol');
      }

      setUsers((prev) =>
        prev.map((user) => (user.uid === uid ? { ...user, isAdmin: !isAdmin } : user)),
      );
      setSuccess('Rol actualizado exitosamente');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cambiar rol');
    } finally {
      setUpdating(null);
    }
  };

  const exportUsers = async () => {
    try {
      const response = await fetch('/api/admin/users/export', {
        headers: {
          Authorization: `Bearer ${await getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al exportar usuarios');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setSuccess('Usuarios exportados exitosamente');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al exportar');
    }
  };

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestión de Usuarios</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Administra usuarios, créditos y permisos
          </p>
        </div>
        <Button onClick={exportUsers}>Exportar CSV</Button>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <Input
              placeholder="Buscar por email, nombre o UID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as typeof roleFilter)}
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            title="Filtrar por rol"
          >
            <option value="all">Todos</option>
            <option value="admin">Administradores</option>
            <option value="user">Usuarios</option>
          </select>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Usuarios</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{users.length}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Administradores</h3>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {users.filter((u) => u.isAdmin).length}
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Con Créditos</h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {users.filter((u) => u.usageCreditsInSeconds > 0).length}
          </p>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="overflow-hidden">
        {currentUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Créditos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Registro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Último Acceso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                {currentUsers.map((user) => (
                  <tr key={user.uid}>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.displayName || 'Sin nombre'}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">{user.uid}</div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          user.isAdmin
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                        }`}
                      >
                        {user.isAdmin ? 'Admin' : 'Usuario'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {formatCredits(user.usageCreditsInSeconds)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {user.usageCreditsInSeconds} segundos
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Nunca'}
                    </td>
                    <td className="space-x-2 whitespace-nowrap px-6 py-4 text-sm">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newCredits = prompt(
                            'Nuevos créditos en segundos:',
                            user.usageCreditsInSeconds.toString(),
                          );
                          if (newCredits !== null) {
                            handleUpdateCredits(user.uid, parseInt(newCredits) || 0);
                          }
                        }}
                        disabled={updating === user.uid}
                      >
                        Editar Créditos
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleAdmin(user.uid, !!user.isAdmin)}
                        disabled={updating === user.uid}
                      >
                        {updating === user.uid
                          ? 'Actualizando...'
                          : user.isAdmin
                            ? 'Quitar Admin'
                            : 'Hacer Admin'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">No hay usuarios para mostrar</p>
          </div>
        )}
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>

          <span className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
            Página {currentPage} de {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </Button>
        </div>
      )}

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
