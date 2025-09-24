import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { SignInForm } from '@/components/features/auth/SignInForm';
import { generateSEOMetadata } from '@/lib/seo';

interface LoginPageProps {
  params: Promise<{ locale: 'es' | 'en' }>;
}

export async function generateMetadata(props: LoginPageProps): Promise<Metadata> {
  const params = await props.params;
  return generateSEOMetadata({
    locale: params.locale,
    titleKey: 'auth.signin.title',
    descriptionKey: 'auth.signin.subtitle',
    path: '/login',
  });
}

export default async function LoginPage(props: LoginPageProps): Promise<JSX.Element> {
  const params = await props.params;
  const { locale } = params;
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
              href={`/${locale}/legal/terminos`}
              className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {tLegal('terms')}
            </a>{' '}
            {tLegal('and')}{' '}
            <a
              href={`/${locale}/legal/privacidad`}
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
