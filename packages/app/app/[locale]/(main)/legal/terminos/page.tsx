import { Button } from '@/components/ui/Button';
import { generateSEOMetadata } from '@/lib/seo';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

interface TerminosPageProps {
  params: {
    locale: 'es' | 'en';
  };
}

export async function generateMetadata({ params }: TerminosPageProps): Promise<Metadata> {
  return generateSEOMetadata({
    locale: params.locale,
    titleKey: 'legal_pages.terms_conditions.title',
    descriptionKey: 'legal_pages.terms_conditions.acceptance.content',
    path: '/legal/terminos',
  });
}

export default async function TerminosPage({ params }: TerminosPageProps) {
  const t = await getTranslations('legal_pages.terms_conditions');
  const navT = await getTranslations('navigation');

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
            {t('title')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Condiciones de uso de nuestros servicios educativos y herramientas
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Acceptance */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
              {t('acceptance.title')}
            </h2>
            <p className="leading-relaxed text-gray-700 dark:text-gray-300">
              {t('acceptance.content')}
            </p>
          </section>

          {/* Services */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
              {t('services.title')}
            </h2>
            <p className="leading-relaxed text-gray-700 dark:text-gray-300">
              {t('services.content')}
            </p>
          </section>

          {/* User Obligations */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
              {t('user_obligations.title')}
            </h2>
            <p className="leading-relaxed text-gray-700 dark:text-gray-300">
              {t('user_obligations.content')}
            </p>
          </section>

          {/* Prohibited Uses */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
              {t('prohibited_uses.title')}
            </h2>
            <p className="leading-relaxed text-gray-700 dark:text-gray-300">
              {t('prohibited_uses.content')}
            </p>
          </section>

          {/* Subscription Terms */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
              {t('subscription_terms.title')}
            </h2>
            <p className="leading-relaxed text-gray-700 dark:text-gray-300">
              {t('subscription_terms.content')}
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
              {t('limitation_liability.title')}
            </h2>
            <p className="leading-relaxed text-gray-700 dark:text-gray-300">
              {t('limitation_liability.content')}
            </p>
          </section>

          {/* Modifications */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
              {t('modifications.title')}
            </h2>
            <p className="leading-relaxed text-gray-700 dark:text-gray-300">
              {t('modifications.content')}
            </p>
          </section>
        </div>

        {/* Navigation */}
        <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-700">
          <div className="flex flex-col justify-between gap-4 sm:flex-row">
            <Link href={`/${params.locale}`}>
              <Button variant="outline">← {navT('home')}</Button>
            </Link>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link href={`/${params.locale}/legal/aviso-legal`}>
                <Button variant="ghost" size="sm">
                  {navT('legal.legal_notice')}
                </Button>
              </Link>
              <Link href={`/${params.locale}/legal/privacidad`}>
                <Button variant="ghost" size="sm">
                  {navT('legal.privacy_policy')}
                </Button>
              </Link>
              <Link href={`/${params.locale}/legal/descargo-responsabilidad`}>
                <Button variant="ghost" size="sm">
                  {navT('legal.disclaimer')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
