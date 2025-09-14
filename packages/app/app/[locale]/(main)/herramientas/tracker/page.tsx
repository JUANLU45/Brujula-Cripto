import { TransactionTracker } from '@/components/features/tools/TransactionTracker';
import { generateSEOMetadata } from '@/lib/seo';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

interface TrackerPageProps {
  params: { locale: 'es' | 'en' };
}

export async function generateMetadata({ params }: TrackerPageProps): Promise<Metadata> {
  return generateSEOMetadata({
    locale: params.locale,
    titleKey: 'tools.transactionTracker.title',
    descriptionKey: 'tools.transactionTracker.description',
    path: '/herramientas/tracker',
  });
}

export default async function TrackerPage({ params }: TrackerPageProps) {
  const { locale } = params;
  const t = await getTranslations('tools.transactionTracker');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TransactionTracker />
    </div>
  );
}
