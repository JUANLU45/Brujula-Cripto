// Página de Error 404 - packages/app/app/[locale]/not-found.tsx
import { NotFoundPage } from '@/components/features/error/NotFoundPage';

interface NotFoundProps {
  params?: {
    locale?: 'es' | 'en';
  };
}

export default function NotFound({ params }: NotFoundProps): JSX.Element {
  // En Next.js 14, not-found.tsx no recibe params directamente
  // Se obtiene el locale del contexto de la aplicación
  const locale = params?.locale || 'es';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <NotFoundPage locale={locale} className="w-full" />
    </div>
  );
}
