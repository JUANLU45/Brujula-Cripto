import { DiagnosisBanner } from '@/components/features/recovery/DiagnosisBanner';
import { RecoveryWizard } from '@/components/features/recovery/RecoveryWizard';
import { generateSEOMetadata } from '@/lib/seo';
import { Metadata } from 'next';

interface RecuperacionPageProps {
  params: Promise<{
    locale: 'es' | 'en';
  }>;
}

export async function generateMetadata(props: RecuperacionPageProps): Promise<Metadata> {
  const params = await props.params;
  return generateSEOMetadata({
    locale: params.locale,
    titleKey: 'recovery.seo.title',
    descriptionKey: 'recovery.seo.description',
    keywordsKey: 'recovery.seo.keywords',
    path: '/recuperacion',
  });
}

export default function RecuperacionPage() {
  return (
    <div className="min-h-screen">
      <DiagnosisBanner />
      <div className="py-12">
        <RecoveryWizard />
      </div>
    </div>
  );
}
