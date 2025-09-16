import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { SignInForm } from '@/components/features/auth/SignInForm';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations('auth.signin');

  return {
    title: `${t('title')} | Brújula Cripto`,
    description: t('subtitle'),
    robots: 'index, follow',
    openGraph: {
      title: `${t('title')} | Brújula Cripto`,
      description: t('subtitle'),
      type: 'website',
    },
  };
}

export default async function LoginPage(props: Props) {
  const params = await props.params;
  const t = await getTranslations('auth.signin');
  const tLegal = await getTranslations('auth.legal');

  return (
    <div className="min-h-screen bg-gray-50 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            {t('title')}
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{t('subtitle')}</p>
        </div>

        {/* Form Container */}
        <div className="mt-8 bg-white px-6 py-8 shadow-sm dark:bg-gray-800 sm:rounded-lg sm:px-10">
          <SignInForm />
        </div>

        {/* Legal Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {tLegal('loginNotice')}{' '}
            <a
              href={`/${params.locale}/legal/terminos`}
              className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {tLegal('terms')}
            </a>{' '}
            {tLegal('and')}{' '}
            <a
              href={`/${params.locale}/legal/privacidad`}
              className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {tLegal('privacy')}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
