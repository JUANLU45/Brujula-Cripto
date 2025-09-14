'use client';

import { AdminLoginForm } from '@/components/features/admin/AdminLoginForm';
import { useTranslations } from 'next-intl';

interface AdminAuthPageProps {
  params: { locale: string };
}

export default function AdminAuthPage({ params }: AdminAuthPageProps) {
  const t = useTranslations('admin.auth');

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            {t('title')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {t('subtitle')}
          </p>
        </div>
        <AdminLoginForm redirectTo={`/${params.locale}/admin`} />
      </div>
    </div>
  );
}
