import Link from 'next/link';

import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { Button } from '@/components/ui/Button';
import { generateSEOMetadata } from '@/lib/seo';

interface DescargoResponsabilidadPageProps {
  params: Promise<{
    locale: 'es' | 'en';
  }>;
}

export async function generateMetadata(props: DescargoResponsabilidadPageProps): Promise<Metadata> {
  const params = await props.params;
  return generateSEOMetadata({
    locale: params.locale,
    titleKey: 'legal_pages.disclaimer.title',
    descriptionKey: 'legal_pages.disclaimer.investment_warning.content',
    path: '/legal/descargo-responsabilidad',
  });
}

export default async function DescargoResponsabilidadPage(
  props: DescargoResponsabilidadPageProps,
): Promise<JSX.Element> {
  const params = await props.params;
  const t = await getTranslations('legal_pages.disclaimer');
  const navT = await getTranslations('navigation');

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold text-red-600 dark:text-red-400 md:text-4xl">
            {t('title')}
          </h1>
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
            <p className="text-lg font-semibold text-red-800 dark:text-red-200">
              <span role="img" aria-label="advertencia">
                ⚠️
              </span>{' '}
              ADVERTENCIA IMPORTANTE: Las criptomonedas son activos de alto riesgo. Lea todo este
              descargo antes de usar nuestros servicios.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Investment Warning */}
          <section className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 dark:border-yellow-800 dark:bg-yellow-900/20">
            <h2 className="mb-4 text-2xl font-semibold text-yellow-800 dark:text-yellow-200">
              {t('investment_warning.title')}
            </h2>
            <p className="font-medium leading-relaxed text-yellow-800 dark:text-yellow-200">
              {t('investment_warning.content')}
            </p>
          </section>

          {/* Educational Purpose */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
              {t('educational_purpose.title')}
            </h2>
            <p className="leading-relaxed text-gray-700 dark:text-gray-300">
              {t('educational_purpose.content')}
            </p>
          </section>

          {/* No Guarantees */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
              {t('no_guarantees.title')}
            </h2>
            <p className="leading-relaxed text-gray-700 dark:text-gray-300">
              {t('no_guarantees.content')}
            </p>
          </section>

          {/* Tool Limitations */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
              {t('tool_limitations.title')}
            </h2>
            <p className="leading-relaxed text-gray-700 dark:text-gray-300">
              {t('tool_limitations.content')}
            </p>
          </section>

          {/* Market Volatility */}
          <section className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
            <h2 className="mb-4 text-2xl font-semibold text-red-800 dark:text-red-200">
              {t('market_volatility.title')}
            </h2>
            <p className="font-medium leading-relaxed text-red-800 dark:text-red-200">
              {t('market_volatility.content')}
            </p>
          </section>

          {/* Regulatory Risks */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
              {t('regulatory_risks.title')}
            </h2>
            <p className="leading-relaxed text-gray-700 dark:text-gray-300">
              {t('regulatory_risks.content')}
            </p>
          </section>

          {/* Security Responsibility */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
              {t('security_responsibility.title')}
            </h2>
            <p className="leading-relaxed text-gray-700 dark:text-gray-300">
              {t('security_responsibility.content')}
            </p>
          </section>
        </div>

        {/* Final Warning */}
        <div className="mt-12 rounded-lg border-2 border-red-300 bg-red-100 p-8 dark:border-red-700 dark:bg-red-900/30">
          <h3 className="mb-4 text-xl font-bold text-red-800 dark:text-red-200">
            RECORDATORIO FINAL
          </h3>
          <p className="font-medium leading-relaxed text-red-800 dark:text-red-200">
            Al usar cualquier servicio de Brújula Cripto, usted acepta expresamente que comprende
            estos riesgos y asume toda la responsabilidad. Nunca invierta dinero que no puede
            permitirse perder completamente.
          </p>
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
              <Link href={`/${params.locale}/legal/terminos`}>
                <Button variant="ghost" size="sm">
                  {navT('legal.terms_conditions')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
