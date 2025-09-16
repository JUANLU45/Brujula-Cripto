import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { TransactionTracker } from '@/components/features/tools/TransactionTracker';
import { generateSEOMetadata } from '@/lib/seo';

interface TrackerPageProps {
  params: Promise<{ locale: 'es' | 'en' }>;
}

export async function generateMetadata(props: TrackerPageProps): Promise<Metadata> {
  const params = await props.params;
  return generateSEOMetadata({
    locale: params.locale,
    titleKey: 'tools.transactionTracker.title',
    descriptionKey: 'tools.transactionTracker.description',
    path: '/herramientas/tracker',
  });
}

export default async function TrackerPage(props: TrackerPageProps): Promise<JSX.Element> {
  const params = await props.params;
  const { locale: _locale } = params;
  const _t = await getTranslations('tools.transactionTracker');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TransactionTracker />
    </div>
  );
}
