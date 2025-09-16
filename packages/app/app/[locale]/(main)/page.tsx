import { Suspense } from 'react';

import Link from 'next/link';

import { useTranslations } from 'next-intl';

import { FeaturedPostsCarousel } from '@/components/features/homepage/FeaturedPostsCarousel';
import { FeedbackButton } from '@/components/features/homepage/FeedbackButton';
import { HomepageBanner } from '@/components/features/homepage/HomepageBanner';
import { ValueProposition } from '@/components/features/homepage/ValueProposition';
import { generateSEOMetadata } from '@/lib/seo';

interface PageProps {
  params: Promise<{
    locale: 'es' | 'en';
  }>;
}

// Metadatos SEO centralizados
export async function generateMetadata(props: PageProps) {
  const params = await props.params;
  return generateSEOMetadata({
    locale: params.locale,
    titleKey: 'homepage.seo.title',
    descriptionKey: 'homepage.seo.description',
    keywordsKey: 'homepage.seo.keywords',
    path: '',
  });
}

// Componente para sección de herramientas según PAGINAS.MD
function ToolsSection({ locale }: { locale: 'es' | 'en' }) {
  const t = useTranslations('common.navigation');

  const tools = [
    {
      href: `/${locale}/recuperacion`,
      titleKey: 'recovery',
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
    },
    {
      href: `/${locale}/herramientas/tracker`,
      titleKey: 'tools.tracker',
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      ),
    },
    {
      href: `/${locale}/seguridad`,
      titleKey: 'security',
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
    },
    {
      href: `/${locale}/herramientas/servicios`,
      titleKey: 'tools.services',
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
    },
  ];

  return (
    <section className="bg-gray-50 py-16 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
            {t('tools.title', { defaultValue: 'Herramientas Principales' })}
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {tools.map((tool, index) => (
            <Link
              key={index}
              href={tool.href}
              className="group rounded-lg border border-gray-200 bg-white p-6 text-center transition-all duration-300 hover:border-blue-500 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-400"
            >
              <div className="mb-4 flex justify-center text-blue-600 transition-transform duration-300 group-hover:scale-110 dark:text-blue-400">
                {tool.icon}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{t(tool.titleKey)}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// Componente disclaimer según PAGINAS.MD
function DisclaimerSection({ locale }: { locale: 'es' | 'en' }) {
  const t = useTranslations('homepage.disclaimer');

  return (
    <section className="bg-blue-50 py-8 dark:bg-blue-900/20">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t('text')}{' '}
          <Link
            href={`/${locale}${t('linkHref')}`}
            className="font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            {t('linkText')}
          </Link>
        </p>
      </div>
    </section>
  );
}

// Página principal de inicio
export default async function HomePage(props: PageProps) {
  const params = await props.params;
  const { locale } = params;

  return (
    <>
      {/* Banner principal - Imagen editable desde panel */}
      <HomepageBanner />

      {/* Propuesta de valor con 3 columnas (escudo, llave, brújula) */}
      <ValueProposition />

      {/* Carrusel de artículos destacados (4-5 posts) */}
      <Suspense
        fallback={
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          </div>
        }
      >
        <FeaturedPostsCarousel />
      </Suspense>

      {/* Sección de herramientas según PAGINAS.MD */}
      <ToolsSection locale={locale} />

      {/* Descargo de responsabilidad según PAGINAS.MD */}
      <DisclaimerSection locale={locale} />

      {/* Botón flotante de feedback - Solo para premium */}
      <FeedbackButton />
    </>
  );
}
