'use client';

import Link from 'next/link';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/lib/auth/AuthProvider';

export default function DashboardHomePage() {
  const t = useTranslations('dashboard.home');
  const { user, userData } = useAuth();

  // TARJETAS DE ACCESO RÁPIDO SEGÚN DOCUMENTACIÓN
  const quickActions = [
    {
      title: t('quickActions.account.title'),
      description: t('quickActions.account.description'),
      href: '/cuenta',
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
          />
        </svg>
      ),
    },
    {
      title: t('quickActions.tools.title'),
      description: t('quickActions.tools.description'),
      href: '/herramientas',
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"
          />
        </svg>
      ),
    },
    {
      title: t('quickActions.recovery.title'),
      description: t('quickActions.recovery.description'),
      href: '/recuperacion',
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* WELCOME SECTION */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t('welcome', { name: user?.displayName || t('defaultName') })}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">{t('subtitle')}</p>
      </div>

      {/* ESTADO PREMIUM SEGÚN DOCUMENTACIÓN */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('subscription.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {userData?.isPremium
                ? t('subscription.premiumActive')
                : t('subscription.freeAccount')}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {userData?.isPremium ? (
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  {t('subscription.active')}
                </span>
              </div>
            ) : (
              <Link href="/suscripcion">
                <Button size="sm" variant="outline">
                  {t('subscription.upgrade')}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </Card>

      {/* TIEMPO RESTANTE SI ES PREMIUM */}
      {userData?.isPremium && userData?.usageCreditsInSeconds && (
        <Card className="p-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('usage.title')}
            </h3>
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {Math.floor(userData.usageCreditsInSeconds / 3600)}:
                {Math.floor((userData.usageCreditsInSeconds % 3600) / 60)
                  .toString()
                  .padStart(2, '0')}
                :{(userData.usageCreditsInSeconds % 60).toString().padStart(2, '0')}
              </div>
              <span className="text-gray-600 dark:text-gray-400">{t('usage.remaining')}</span>
            </div>
          </div>
        </Card>
      )}

      {/* ACCIONES RÁPIDAS */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {t('quickActions.title')}
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action, index) => (
            <Link key={index} href={action.href}>
              <Card className="cursor-pointer p-6 transition-all duration-200 hover:scale-105 hover:shadow-lg">
                <div className="flex items-start space-x-4">
                  <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/20">
                    <div className="text-blue-600 dark:text-blue-400">{action.icon}</div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{action.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{action.description}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
