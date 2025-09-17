// Página de Guías de Seguridad - packages/app/app/[locale]/(main)/seguridad/page.tsx
import type { Metadata } from 'next';

import { SecurityGuides } from '@/components/features/blog/SecurityGuides';
import { generateSEOMetadata } from '@/lib/seo';

interface SeguridadPageProps {
  params: Promise<{
    locale: 'es' | 'en';
  }>;
}

export async function generateMetadata(props: SeguridadPageProps): Promise<Metadata> {
  const params = await props.params;
  return generateSEOMetadata({
    locale: params.locale,
    titleKey: 'security.meta.title',
    descriptionKey: 'security.meta.description',
    keywordsKey: 'security.meta.keywords',
    path: '/seguridad',
  });
}

export default async function SeguridadPage(props: SeguridadPageProps): Promise<JSX.Element> {
  const params = await props.params;
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
