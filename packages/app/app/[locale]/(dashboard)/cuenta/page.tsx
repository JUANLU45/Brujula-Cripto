'use client';

import { UserDashboard } from '@/components/features/dashboard/UserDashboard';
import { useTranslations } from 'next-intl';

export default function CuentaPage() {
  const t = useTranslations('dashboard.account');

  return (
    <div className="space-y-6">
      {/* BREADCRUMB NAVIGATION */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
        <span>{t('breadcrumb.dashboard')}</span>
        <span>/</span>
        <span className="text-gray-900 dark:text-white">{t('breadcrumb.account')}</span>
      </nav>

      {/* PAGE HEADER */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
        <p className="text-gray-600 dark:text-gray-400">{t('description')}</p>
      </div>

      {/* COMPONENTE CENTRALIZADO UserDashboard.tsx */}
      <UserDashboard className="w-full" />
    </div>
  );
}
