import { Suspense } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';

import { FeaturedPostsCarousel } from '@/components/features/homepage/FeaturedPostsCarousel';
import { FeedbackButton } from '@/components/features/homepage/FeedbackButton';
import { HomepageBanner } from '@/components/features/homepage/HomepageBanner';
import { ValueProposition } from '@/components/features/homepage/ValueProposition';
import { DiagnosticIcon, ServiceIcon, TransactionIcon } from '@/components/ui/Icons';
import { InteractiveCard } from '@/components/ui/InteractiveCard';
import { generateSEOMetadata } from '@/lib/seo';

interface PageProps {
  params: Promise<{
    locale: 'es' | 'en';
  }>;
}

// Metadatos SEO centralizados
export async function generateMetadata(props: PageProps): Promise<Metadata> {
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
function ToolsSection({ locale }: { locale: 'es' | 'en' }): JSX.Element {
  const t = useTranslations('navigation');

  const tools = [
    {
      href: `/${locale}/recuperacion`,
      titleKey: 'tools.diagnosis_recovery',
      icon: <DiagnosticIcon className="h-8 w-8" />,
    },
    {
      href: `/${locale}/herramientas/tracker`,
      titleKey: 'tools.transaction_tracker',
      icon: <TransactionIcon className="h-8 w-8" />,
    },
    {
      href: `/${locale}/seguridad`,
      titleKey: 'security_guides',
      icon: <DiagnosticIcon className="h-8 w-8" />,
    },
    {
      href: `/${locale}/herramientas/servicios`,
      titleKey: 'tools.service_directory',
      icon: <ServiceIcon className="h-8 w-8" />,
    },
    {
      href: `/${locale}/chatbot`,
      titleKey: 'chatbot',
      icon: (
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-primary-200 bg-primary-600 p-1.5 shadow-md dark:border-primary-400">
          <Image
            src="/images/chatbot/chatbot-logo.svg"
            alt="Chatbot"
            width={20}
            height={20}
            className="h-5 w-5"
          />
        </div>
      ),
    },
  ];

  return (
    <section className="bg-surface-footer dark:bg-surface-footer py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
            {t('tools.title', { defaultValue: 'Herramientas Principales' })}
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {tools.map((tool, index) => (
            <Link key={index} href={tool.href} className="group">
              <InteractiveCard
                variant="primary"
                enableHover={true}
                icon={tool.icon}
                title={t(tool.titleKey)}
                className="h-full text-center transition-all duration-300"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// Componente disclaimer según PAGINAS.MD
function DisclaimerSection({ locale }: { locale: 'es' | 'en' }): JSX.Element {
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
export default async function HomePage(props: PageProps): Promise<JSX.Element> {
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
