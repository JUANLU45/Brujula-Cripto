import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import DeletedFilesRecovery from '@/components/features/recovery/DeletedFilesRecovery';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const t = await getTranslations('recovery.deletedFiles.seo');

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
      locale: params.locale,
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
    alternates: {
      canonical: `/${params.locale}/recuperacion/deleted-files`,
      languages: {
        es: '/es/recuperacion/deleted-files',
        en: '/en/recuperacion/deleted-files',
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function RecuperacionDeletedFilesPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-gray-50 py-12 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <DeletedFilesRecovery />

        {/* Disclaimer Legal */}
        <div className="mt-8 rounded-lg bg-amber-50 p-6 dark:bg-amber-900/20">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">
                Descargo de Responsabilidad
              </h3>
              <p className="mt-2 text-sm text-amber-700 dark:text-amber-300">
                Esta herramienta proporciona guías técnicas sin garantía de recuperación exitosa. 
                El usuario es completamente responsable de su uso y cualquier acción tomada. 
                No ofrecemos garantías de resultados y no somos responsables de pérdidas.{' '}
                <a
                  href="/legal/descargo-responsabilidad"
                  className="font-medium underline hover:no-underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Leer descargo completo
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}