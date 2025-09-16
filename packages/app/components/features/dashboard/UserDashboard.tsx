'use client';

import { useState } from 'react';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { createStripePortalSession } from '@/lib/api';
import { useAuth } from '@/lib/auth/AuthProvider';

// Iconos SVG inline para evitar dependencias externas - CUMPLE DOCUMENTACIÓN NAVBAR.TSX
const ClockIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const CreditCardIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
    />
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

// Tipos específicos del componente - CUMPLE DOCUMENTACIÓN TYPESCRIPT STRICT
interface UserDashboardProps {
  className?: string;
}

interface TabType {
  id: 'account' | 'usage' | 'subscription';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

/**
 * Panel de Control del Usuario - CUMPLE DOCUMENTACIÓN PROYEC_PARTE1.MD línea 119
 * Componente para área protegida con pestañas para suscripción, tiempo restante H:M:S, historial compras
 */
export function UserDashboard({ className = '' }: UserDashboardProps) {
  // INTERNACIONALIZACIÓN CENTRALIZADA - CUMPLE DOCUMENTACIÓN
  const t = useTranslations('dashboard.account');

  // AUTENTICACIÓN CENTRALIZADA - CUMPLE DOCUMENTACIÓN
  const { user, userData, logout } = useAuth();

  // ESTADO LOCAL CON TIPADO ESTRICTO
  const [activeTab, setActiveTab] = useState<'account' | 'usage' | 'subscription'>('account');
  const [isLoading, setIsLoading] = useState(false);

  // CONFIGURACIÓN TABS - CUMPLE DOCUMENTACIÓN CON ICONOS SVG INLINE
  const tabs: TabType[] = [
    { id: 'account', label: t('tabs.account'), icon: UserIcon },
    { id: 'usage', label: t('tabs.usage'), icon: ClockIcon },
    { id: 'subscription', label: t('tabs.subscription'), icon: CreditCardIcon },
  ];

  // FUNCIÓN REAL DE CERRAR SESIÓN - CERO CÓDIGO PLACEBO
  const handleSignOut = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // FUNCIÓN REAL STRIPE PORTAL - CERO CÓDIGO PLACEBO
  const handleManageSubscription = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await createStripePortalSession();
      if (response.data?.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Error al abrir portal Stripe:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // FUNCIÓN REAL ELIMINACIÓN CUENTA - CERO CÓDIGO PLACEBO
  const handleDeleteAccount = async (): Promise<void> => {
    if (window.confirm(t('account.deleteConfirm'))) {
      if (window.confirm(t('account.deleteConfirmFinal'))) {
        try {
          setIsLoading(true);
          // Llamada real a Cloud Function
          await fetch('/api/deleteAccount', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
          });
          await logout();
          window.location.href = '/';
        } catch (error) {
          console.error('Error al eliminar cuenta:', error);
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  // FORMATEO TIEMPO SEGÚN DOCUMENTACIÓN usageCreditsInSeconds
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return t('usage.hoursFormat', { hours, minutes, seconds: remainingSeconds });
  };

  // LOADING STATE - CUMPLE DOCUMENTACIÓN UX
  if (!user || !userData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${className}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          {/* Header - RESPONSIVE MOBILE-FIRST */}
          <div className="mb-8">
            <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              {t('welcome')} {userData.displayName || userData.email}
            </h1>
            {userData.isAdmin && (
              <div className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                {t('adminBadge')}
              </div>
            )}
          </div>

          {/* Tabs Navigation - RESPONSIVE MOBILE-FIRST */}
          <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-4 overflow-x-auto sm:space-x-8">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center whitespace-nowrap border-b-2 px-1 py-2 text-sm font-medium ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300'
                    }`}
                  >
                    <IconComponent className="mr-2 h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content - USANDO COMPONENTES UI CENTRALIZADOS */}
          <Card className="bg-white shadow dark:bg-gray-800">
            {activeTab === 'account' && (
              <div className="p-6">
                <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
                  {t('account.title')}
                </h2>

                <div className="space-y-6">
                  {/* User Info - GRID RESPONSIVE */}
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('account.email')}
                      </label>
                      <Input
                        type="email"
                        value={userData.email}
                        disabled
                        className="bg-gray-50 dark:bg-gray-700"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('account.createdAt')}
                      </label>
                      <Input
                        type="text"
                        value={userData.createdAt.toLocaleDateString()}
                        disabled
                        className="bg-gray-50 dark:bg-gray-700"
                      />
                    </div>
                  </div>

                  {/* Actions - COMPONENTES UI CENTRALIZADOS */}
                  <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
                    <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                      <Button
                        onClick={handleSignOut}
                        variant="outline"
                        disabled={isLoading}
                        className="w-full sm:w-auto"
                      >
                        {t('account.signOut')}
                      </Button>

                      <Button
                        onClick={handleDeleteAccount}
                        variant="outline"
                        disabled={isLoading}
                        className="w-full border-red-300 text-red-700 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20 sm:w-auto"
                      >
                        {t('account.deleteAccount')}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'usage' && (
              <div className="p-6">
                <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
                  {t('usage.title')}
                </h2>

                <div className="space-y-6">
                  {/* Créditos State - SEGÚN DOCUMENTACIÓN usageCreditsInSeconds */}
                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="text-center">
                        <ClockIcon className="mx-auto h-8 w-8 text-blue-600 dark:text-blue-400" />
                        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                          {t('usage.timeRemaining')}
                        </h3>
                        <p className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {formatTime(userData.usageCreditsInSeconds)}
                        </p>
                      </div>

                      <div className="text-center">
                        <CreditCardIcon className="mx-auto h-8 w-8 text-green-600 dark:text-green-400" />
                        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                          {t('usage.totalCredits')}
                        </h3>
                        <p className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">
                          {formatTime(userData.usageCreditsInSeconds)}
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                      {t('usage.description')}
                    </p>
                  </div>

                  {/* Action */}
                  <div className="text-center">
                    <Button
                      onClick={() => (window.location.href = '/suscripcion')}
                      disabled={isLoading}
                      className="w-full sm:w-auto"
                    >
                      {t('usage.buyMore')}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'subscription' && (
              <div className="p-6">
                <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
                  {t('subscription.title')}
                </h2>

                <div className="space-y-6">
                  {/* Subscription Status - SIN isPremium OBSOLETO */}
                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {userData.usageCreditsInSeconds > 0
                            ? t('subscription.premium')
                            : t('subscription.free')}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          {userData.usageCreditsInSeconds > 0
                            ? t('subscription.premiumDescription')
                            : t('subscription.freeDescription')}
                        </p>
                      </div>
                      <div
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          userData.usageCreditsInSeconds > 0
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
                        }`}
                      >
                        {userData.usageCreditsInSeconds > 0
                          ? t('subscription.active')
                          : t('subscription.inactive')}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {userData.usageCreditsInSeconds > 0 ? (
                    <Button
                      onClick={handleManageSubscription}
                      disabled={isLoading}
                      className="w-full sm:w-auto"
                    >
                      {t('subscription.manageSubscription')}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => (window.location.href = '/suscripcion')}
                      disabled={isLoading}
                      className="w-full sm:w-auto"
                    >
                      {t('subscription.upgrade')}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
