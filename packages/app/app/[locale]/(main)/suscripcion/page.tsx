// Página de Suscripción - packages/app/app/[locale]/(main)/suscripcion/page.tsx
import CompetitorComparison from '@/components/features/pricing/CompetitorComparison';
import PricingPage from '@/components/features/pricing/PricingPage';
import { generateSEOMetadata } from '@/lib/seo';

interface SuscripcionPageProps {
  params: {
    locale: 'es' | 'en';
  };
}

export async function generateMetadata({ params }: SuscripcionPageProps) {
  return generateSEOMetadata({
    locale: params.locale,
    titleKey: 'pricing.meta.title',
    descriptionKey: 'pricing.meta.description',
    keywordsKey: 'pricing.meta.keywords',
    path: '/suscripcion',
  });
}

export default function SuscripcionPage({ params }: SuscripcionPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Sección Principal PricingPage.tsx */}
      <section className="relative">
        <PricingPage />
      </section>

      {/* Sección Diferencias Interactivas CompetitorComparison.tsx */}
      <section className="relative py-16 lg:py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-cyan-600/5" />
        <CompetitorComparison />
      </section>
    </div>
  );
}
