import AdminSidebar from '@/components/layout/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }): JSX.Element {
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
