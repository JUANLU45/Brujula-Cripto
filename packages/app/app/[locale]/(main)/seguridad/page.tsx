// Página de Guías de Seguridad - packages/app/app/[locale]/(main)/seguridad/page.tsx
import { SecurityGuides } from '@/components/features/blog/SecurityGuides';
import { generateSEOMetadata } from '@/lib/seo';

interface SeguridadPageProps {
  params: {
    locale: 'es' | 'en';
  };
}

export async function generateMetadata({ params }: SeguridadPageProps) {
  return generateSEOMetadata({
    locale: params.locale,
    titleKey: 'security.meta.title',
    descriptionKey: 'security.meta.description',
    keywordsKey: 'security.meta.keywords',
    path: '/seguridad',
  });
}

export default function SeguridadPage({ params }: SeguridadPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Sección Principal SecurityGuides.tsx */}
      <section className="relative py-8 lg:py-12">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SecurityGuides locale={params.locale} className="w-full" />
        </div>
      </section>
    </div>
  );
}
