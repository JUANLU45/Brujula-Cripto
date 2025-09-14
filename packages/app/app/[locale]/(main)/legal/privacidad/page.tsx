import { Button } from '@/components/ui/Button';
import { generateSEOMetadata } from '@/lib/seo';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

interface PrivacidadPageProps {
  params: {
    locale: 'es' | 'en';
  };
}

export async function generateMetadata({ params }: PrivacidadPageProps): Promise<Metadata> {
  return generateSEOMetadata({
    locale: params.locale,
    titleKey: 'legal_pages.privacy_policy.title',
    descriptionKey: 'legal_pages.privacy_policy.data_collection.content',
    path: '/legal/privacidad',
  });
}

export default async function PrivacidadPage({ params }: PrivacidadPageProps) {
  const t = await getTranslations('legal_pages.privacy_policy');
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
            Protegemos su privacidad con medidas técnicas y organizativas avanzadas
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Data Collection */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
              {t('data_collection.title')}
            </h2>
            <p className="leading-relaxed text-gray-700 dark:text-gray-300">
              {t('data_collection.content')}
            </p>
          </section>

          {/* Data Usage */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
              {t('data_usage.title')}
            </h2>
            <p className="leading-relaxed text-gray-700 dark:text-gray-300">
              {t('data_usage.content')}
            </p>
          </section>

          {/* Data Protection */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
              {t('data_protection.title')}
            </h2>
            <p className="leading-relaxed text-gray-700 dark:text-gray-300">
              {t('data_protection.content')}
            </p>
          </section>

          {/* Third Parties */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
              {t('third_parties.title')}
            </h2>
            <p className="leading-relaxed text-gray-700 dark:text-gray-300">
              {t('third_parties.content')}
            </p>
          </section>

          {/* User Rights */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
              {t('user_rights.title')}
            </h2>
            <p className="leading-relaxed text-gray-700 dark:text-gray-300">
              {t('user_rights.content')}
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
              {t('cookies.title')}
            </h2>
            <p className="leading-relaxed text-gray-700 dark:text-gray-300">
              {t('cookies.content')}
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
              <Link href={`/${params.locale}/legal/terminos`}>
                <Button variant="ghost" size="sm">
                  {navT('legal.terms_conditions')}
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
