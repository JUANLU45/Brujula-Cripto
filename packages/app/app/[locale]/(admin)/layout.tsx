'use client';

import AdminSidebar from '@/components/layout/AdminSidebar';
import { useTranslations } from 'next-intl';

interface AdminLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default function AdminLayout({ children, params }: AdminLayoutProps) {
  const t = useTranslations('admin.layout');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        {/* SIDEBAR CENTRALIZADO AdminSidebar.tsx */}
        <AdminSidebar />

        {/* Main Content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
