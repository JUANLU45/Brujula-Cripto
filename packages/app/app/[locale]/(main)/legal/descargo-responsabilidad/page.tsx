import Link from 'next/link';

import type { Metadata, Viewport } from 'next';
import { getTranslations } from 'next-intl/server';

import { Button } from '@/components/ui/Button';

interface DescargoResponsabilidadPageProps {
  params: Promise<{
    locale: 'es' | 'en';
  }>;
}

// CORRECCIÓN: Separar viewport según Next.js 14+
export function generateViewport(): Viewport {
  return {
    width: 'device-width',
    initialScale: 1,
  };
}

// CORRECCIÓN FINAL: Uso directo de traducciones evitando helper problemático
export async function generateMetadata(props: DescargoResponsabilidadPageProps): Promise<Metadata> {
  const params = await props.params;
  const t = await getTranslations('legal_pages.disclaimer');

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://brujulacripto.com';
  const url = `${baseUrl}/${params.locale}/legal/descargo-responsabilidad`;

  return {
    title: t('title'),
    description: t('investment_warning.content'),
    keywords: 'descargo responsabilidad, criptomonedas, advertencia inversión, riesgo cripto',
    openGraph: {
      title: t('title'),
      description: t('investment_warning.content'),
      url,
      siteName: 'Brújula Cripto',
      type: 'website',
      locale: params.locale,
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('investment_warning.content'),
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function DescargoResponsabilidadPage(
  props: DescargoResponsabilidadPageProps,
): Promise<JSX.Element> {
  const params = await props.params;
  const t = await getTranslations('legal_pages');
  const navT = await getTranslations('navigation');

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold text-red-600 dark:text-red-400 md:text-4xl">
            {t('disclaimer.title')}
          </h1>
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
            <p className="text-lg font-semibold text-red-800 dark:text-red-200">
              <span role="img" aria-label="advertencia">
                ⚠️
              </span>{' '}
              {t('disclaimer.header_warning')}
            </p>
          </div>
        </div>
        {/* Content */}
        <div className="space-y-8">
          {/* Company Info */}
          <section className="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
            <h2 className="mb-4 text-2xl font-semibold text-blue-800 dark:text-blue-200">
              {t('disclaimer.company_info.title')}
            </h2>
            <p className="leading-relaxed text-blue-800 dark:text-blue-200">
              {t('disclaimer.company_info.content')}
            </p>
          </section>
          {/* Investment Warning */}
          <section className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
            <h2 className="mb-4 text-2xl font-semibold text-red-800 dark:text-red-200">
              {t('disclaimer.investment_warning.title')}
            </h2>
            <p className="text-lg font-medium leading-relaxed text-red-800 dark:text-red-200">
              {t('disclaimer.investment_warning.content')}
            </p>
          </section>
          {/* Educational Purpose */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
              {t('disclaimer.educational_purpose.title')}
            </h2>
            <p className="leading-relaxed text-gray-700 dark:text-gray-300">
              {t('disclaimer.educational_purpose.content')}
            </p>
          </section>
          {/* No Guarantees */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
              {t('disclaimer.no_guarantees.title')}
            </h2>
            <p className="leading-relaxed text-gray-700 dark:text-gray-300">
              {t('disclaimer.no_guarantees.content')}
            </p>
          </section>
          {/* Tool Limitations */}
          <section className="rounded-lg border border-orange-200 bg-orange-50 p-6 dark:border-orange-800 dark:bg-orange-900/20">
            <h2 className="mb-4 text-2xl font-semibold text-orange-800 dark:text-orange-200">
              {t('disclaimer.tool_limitations.title')}
            </h2>
            <p className="leading-relaxed text-orange-800 dark:text-orange-200">
              {t('disclaimer.tool_limitations.content')}
            </p>
          </section>
          {/* Market Volatility */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
              {t('disclaimer.market_volatility.title')}
            </h2>
            <p className="leading-relaxed text-gray-700 dark:text-gray-300">
              {t('disclaimer.market_volatility.content')}
            </p>
          </section>
          {/* Regulatory Risks */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
              {t('disclaimer.regulatory_risks.title')}
            </h2>
            <p className="leading-relaxed text-gray-700 dark:text-gray-300">
              {t('disclaimer.regulatory_risks.content')}
            </p>
          </section>
          {/* Security Responsibility */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
              {t('disclaimer.security_responsibility.title')}
            </h2>
            <p className="leading-relaxed text-gray-700 dark:text-gray-300">
              {t('disclaimer.security_responsibility.content')}
            </p>
          </section>
          {/* Liability Limitation */}
          <section className="rounded-lg border border-purple-200 bg-purple-50 p-6 dark:border-purple-800 dark:bg-purple-900/20">
            <h2 className="mb-4 text-2xl font-semibold text-purple-800 dark:text-purple-200">
              {t('disclaimer.liability_limitation.title')}
            </h2>
            <p className="leading-relaxed text-purple-800 dark:text-purple-200">
              {t('disclaimer.liability_limitation.content')}
            </p>
          </section>
          {/* User Acknowledgment */}
          <section className="rounded-lg border border-gray-300 bg-gray-100 p-6 dark:border-gray-600 dark:bg-gray-800">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
              {t('disclaimer.user_acknowledgment.title')}
            </h2>
            <p className="font-medium leading-relaxed text-gray-800 dark:text-gray-200">
              {t('disclaimer.user_acknowledgment.content')}
            </p>
          </section>
        </div>
        {/* Final Warning */}
        <div className="mt-12 rounded-lg border-2 border-red-300 bg-red-100 p-8 dark:border-red-700 dark:bg-red-900/30">
          <h3 className="mb-4 text-xl font-bold text-red-800 dark:text-red-200">
            {t('disclaimer.final_warning.title')}
          </h3>
          <p className="font-medium leading-relaxed text-red-800 dark:text-red-200">
            {t('disclaimer.final_warning.content')}
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
