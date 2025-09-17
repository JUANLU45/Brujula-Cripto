'use client';

import { useRouter } from 'next/navigation';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

// Iconos SVG inline para evitar dependencias externas - CUMPLE DOCUMENTACIÓN NAVBAR.TSX
const HomeIcon = ({ className }: { className?: string }): JSX.Element => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
);

const SearchIcon = ({ className }: { className?: string }): JSX.Element => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

// Ícono de Brújula con animación CSS centralizada
const BrujulaAnimatedIcon = ({ className }: { className?: string }): JSX.Element => (
  <div className={`relative ${className}`}>
    <svg className="compass-spin h-32 w-32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {/* Círculo exterior */}
      <circle
        cx="12"
        cy="12"
        r="10"
        strokeWidth="1.5"
        className="text-blue-500 dark:text-blue-400"
      />
      {/* Marcas direccionales */}
      <path
        d="M12 2 L12 4 M12 20 L12 22 M2 12 L4 12 M20 12 L22 12"
        strokeWidth="1"
        className="text-gray-400 dark:text-gray-600"
      />
      {/* Aguja principal (N-S) */}
      <path
        d="M12 6 L14 12 L12 18 L10 12 Z"
        fill="currentColor"
        className="compass-needle text-red-500 dark:text-red-400"
      />
      {/* Punto central */}
      <circle
        cx="12"
        cy="12"
        r="1.5"
        fill="currentColor"
        className="text-gray-700 dark:text-gray-300"
      />
    </svg>
  </div>
);

interface NotFoundPageProps {
  locale: 'es' | 'en';
  className?: string;
}

export function NotFoundPage({ locale, className = '' }: NotFoundPageProps): JSX.Element {
  const t = useTranslations('notFound');
  const _tCommon = useTranslations('common');
  const router = useRouter();

  const handleGoHome = (): void => {
    router.push(`/${locale}`);
  };

  const handleGoToBlog = (): void => {
    router.push(`/${locale}/blog`);
  };

  const handleGoToTools = (): void => {
    router.push(`/${locale}/recuperacion`);
  };

  return (
    <div
      className={`flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-900 ${className}`}
    >
      <div className="mx-auto max-w-2xl text-center">
        {/* Brújula Animada */}
        <div className="mb-8 flex justify-center">
          <BrujulaAnimatedIcon className="text-blue-500 dark:text-blue-400" />
        </div>

        {/* Card Principal */}
        <Card className="border-0 bg-white/80 p-8 backdrop-blur-sm dark:bg-gray-800/80">
          {/* Título 404 */}
          <div className="mb-6">
            <h1 className="mb-2 text-8xl font-bold text-blue-600 dark:text-blue-400">404</h1>
            <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">{t('title')}</h2>
            <p className="mx-auto max-w-md text-lg text-gray-600 dark:text-gray-300">
              {t('description')}
            </p>
          </div>

          {/* Acciones */}
          <div className="space-y-4">
            {/* Botón Principal - Volver al inicio */}
            <Button onClick={handleGoHome} variant="default" size="lg" className="w-full sm:w-auto">
              <HomeIcon className="mr-2 h-5 w-5" />
              {t('actions.goHome')}
            </Button>

            {/* Botones Secundarios */}
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                onClick={handleGoToBlog}
                variant="secondary"
                size="default"
                className="w-full sm:w-auto"
              >
                <SearchIcon className="mr-2 h-4 w-4" />
                {t('actions.goToBlog')}
              </Button>

              <Button
                onClick={handleGoToTools}
                variant="secondary"
                size="default"
                className="w-full sm:w-auto"
              >
                {t('actions.goToTools')}
              </Button>
            </div>
          </div>

          {/* Enlaces útiles */}
          <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-700">
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">{t('helpText')}</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <button
                onClick={() => router.push(`/${locale}/seguridad`)}
                className="text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
              >
                {t('links.security')}
              </button>
              <button
                onClick={() => router.push(`/${locale}/chatbot`)}
                className="text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
              >
                {t('links.chatbot')}
              </button>
              <button
                onClick={() => router.push(`/${locale}/contacto`)}
                className="text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
              >
                {t('links.contact')}
              </button>
            </div>
          </div>
        </Card>

        {/* Mensaje adicional */}
        <div className="mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('footerText')}</p>
        </div>
      </div>
    </div>
  );
}
