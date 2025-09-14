import { Button } from '@/components/ui/Button';
import { generateSEOMetadata } from '@/lib/seo';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

interface AvisoLegalPageProps {
  params: {
    locale: 'es' | 'en';
  };
}

export async function generateMetadata({ params }: AvisoLegalPageProps): Promise<Metadata> {
  return generateSEOMetadata({
    locale: params.locale,
    titleKey: 'legal_pages.legal_notice.title',
    descriptionKey: 'legal_pages.legal_notice.company_info.description',
    path: '/legal/aviso-legal',
  });
}

export default async function AvisoLegalPage({ params }: AvisoLegalPageProps) {
  const t = await getTranslations('legal_pages.legal_notice');
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
            {t('company_info.description')}
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Company Information */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
              {t('company_info.title')}
            </h2>
            <div className="space-y-2 rounded-lg bg-gray-50 p-6 dark:bg-gray-800">
              <p className="text-gray-700 dark:text-gray-300">
                <strong>{t('company_info.name')}</strong>
              </p>
              <p className="text-gray-700 dark:text-gray-300">{t('company_info.address')}</p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Email:</strong> {t('company_info.contact')}
              </p>
            </div>
          </section>

          {/* Website Purpose */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
              {t('purpose.title')}
            </h2>
            <p className="leading-relaxed text-gray-700 dark:text-gray-300">
              {t('purpose.content')}
            </p>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
              {t('intellectual_property.title')}
            </h2>
            <p className="leading-relaxed text-gray-700 dark:text-gray-300">
              {t('intellectual_property.content')}
            </p>
          </section>

          {/* Liability */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
              {t('liability.title')}
            </h2>
            <p className="leading-relaxed text-gray-700 dark:text-gray-300">
              {t('liability.content')}
            </p>
          </section>

          {/* Applicable Law */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
              {t('applicable_law.title')}
            </h2>
            <p className="leading-relaxed text-gray-700 dark:text-gray-300">
              {t('applicable_law.content')}
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
