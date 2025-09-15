'use client';

import { useAuth } from '@/lib/auth/AuthProvider';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, use } from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default function DashboardLayout(props: DashboardLayoutProps) {
  const params = use(props.params);

  const {
    children
  } = props;

  const t = useTranslations('dashboard.layout');
  const { user, loading } = useAuth();
  const router = useRouter();

  // PROTECCIÓN DE RUTA SEGÚN PROYEC_PARTE1.MD
  useEffect(() => {
    if (!loading && !user) {
      router.push(`/${params.locale}/login`);
    }
  }, [user, loading, router, params.locale]);

  // LOADING STATE DURANTE VERIFICACIÓN
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  // REDIRECT SI NO AUTENTICADO
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* HEADER DASHBOARD */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">{t('subtitle')}</p>
        </div>

        {/* CONTENT */}
        <main>{children}</main>
      </div>
    </div>
  );
}
