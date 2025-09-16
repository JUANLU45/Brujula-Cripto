'use client';

import * as React from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { useLocale, useTranslations } from 'next-intl';

import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

// Usando iconos SVG simples sin dependencias externas
const ChevronUpIcon = ({ className }: { className?: string }): JSX.Element => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
  </svg>
);

const ChevronDownIcon = ({ className }: { className?: string }): JSX.Element => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);

const ArrowUpIcon = ({ className }: { className?: string }): JSX.Element => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
  </svg>
);

const EnvelopeIcon = ({ className }: { className?: string }): JSX.Element => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
    />
  </svg>
);

const Footer = (): JSX.Element => {
  const t = useTranslations();
  const locale = useLocale();
  const [isLegalAccordionOpen, setIsLegalAccordionOpen] = React.useState(false);
  const [isNavigationAccordionOpen, setIsNavigationAccordionOpen] = React.useState(false);

  // Función para subir al inicio
  const scrollToTop = (): void => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Enlaces de navegación
  const navigationLinks = [
    { href: `/${locale}/blog`, label: t('footer.navigation.blog') },
    { href: `/${locale}/recuperacion`, label: t('footer.navigation.tools') },
    { href: `/${locale}/seguridad`, label: t('footer.navigation.security') },
    { href: `/${locale}/contacto`, label: t('footer.navigation.contact') },
    { href: `/${locale}/chatbot`, label: t('footer.navigation.chatbot') },
  ];

  // Enlaces legales
  const legalLinks = [
    { href: `/${locale}/legal/aviso-legal`, label: t('footer.legal.legal_notice') },
    { href: `/${locale}/legal/privacidad`, label: t('footer.legal.privacy_policy') },
    { href: `/${locale}/legal/terminos`, label: t('footer.legal.terms_conditions') },
    {
      href: `/${locale}/legal/descargo-responsabilidad`,
      label: t('footer.legal.disclaimer'),
      important: true,
    },
  ];

  // Enlaces sociales (preparados para futuro)
  const socialLinks = [
    { href: '#', label: 'Twitter', icon: 'twitter' },
    { href: '#', label: 'Telegram', icon: 'telegram' },
    { href: '#', label: 'YouTube', icon: 'youtube' },
  ];

  return (
    <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Contenido principal del footer */}
        <div className="py-8">
          {/* Header del footer con logo y eslogan */}
          <div className="mb-8 text-center">
            <div className="mb-4 flex items-center justify-center space-x-3">
              <Image
                src="/images/logo/brujula-logo.svg"
                alt={t('brand.logo_alt')}
                width={40}
                height={40}
                className="h-10 w-10"
              />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('brand.name')}
              </h2>
            </div>
            <p className="mx-auto max-w-md text-lg font-medium text-blue-600 dark:text-blue-400">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Contenido desktop (3 columnas) */}
          <div className="hidden md:grid md:grid-cols-3 md:gap-8">
            {/* Columna 1: Navegación */}
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
                {t('footer.navigation.title')}
              </h3>
              <ul className="space-y-3">
                {navigationLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Columna 2: Legal */}
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
                {t('footer.legal.title')}
              </h3>
              <ul className="space-y-3">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        'transition-colors',
                        link.important
                          ? 'font-semibold text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300'
                          : 'text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400',
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Columna 3: Contacto */}
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
                {t('footer.contact.title')}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                  <a
                    href={`mailto:${t('brand.emails.support')}`}
                    className="text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                  >
                    {t('footer.contact.support')}
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                  <a
                    href={`mailto:${t('brand.emails.info')}`}
                    className="text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                  >
                    {t('footer.contact.info')}
                  </a>
                </div>

                {/* Redes sociales */}
                <div className="pt-4">
                  <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    {t('footer.contact.social')}
                  </h4>
                  <div className="flex space-x-4">
                    {socialLinks.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        className="text-gray-400 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                        aria-label={social.label}
                      >
                        {/* Icons placeholder - se pueden reemplazar con iconos reales */}
                        <div className="h-5 w-5 rounded bg-gray-400"></div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contenido móvil (acordeones) */}
          <div className="space-y-4 md:hidden">
            {/* Acordeón Navegación */}
            <div className="rounded-lg border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setIsNavigationAccordionOpen(!isNavigationAccordionOpen)}
                className="flex w-full items-center justify-between rounded-lg bg-white px-4 py-3 text-left dark:bg-gray-800"
              >
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {t('footer.navigation.title')}
                </span>
                {isNavigationAccordionOpen ? (
                  <ChevronUpIcon className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                )}
              </button>
              {isNavigationAccordionOpen && (
                <div className="rounded-b-lg bg-white px-4 pb-3 dark:bg-gray-800">
                  <ul className="space-y-2">
                    {navigationLinks.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="block py-1 text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Acordeón Legal */}
            <div className="rounded-lg border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setIsLegalAccordionOpen(!isLegalAccordionOpen)}
                className="flex w-full items-center justify-between rounded-lg bg-white px-4 py-3 text-left dark:bg-gray-800"
              >
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {t('footer.legal.title')}
                </span>
                {isLegalAccordionOpen ? (
                  <ChevronUpIcon className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                )}
              </button>
              {isLegalAccordionOpen && (
                <div className="rounded-b-lg bg-white px-4 pb-3 dark:bg-gray-800">
                  <ul className="space-y-2">
                    {legalLinks.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className={cn(
                            'block py-1 transition-colors',
                            link.important
                              ? 'font-semibold text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300'
                              : 'text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400',
                          )}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Contacto directo en móvil */}
            <div className="space-y-2 text-center">
              <a
                href={`mailto:${t('brand.emails.support')}`}
                className="block text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              >
                {t('footer.contact.support')}
              </a>
              <a
                href={`mailto:${t('brand.emails.info')}`}
                className="block text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              >
                {t('footer.contact.info')}
              </a>
            </div>
          </div>
        </div>

        {/* Línea separadora */}
        <div className="border-t border-gray-200 py-6 dark:border-gray-800">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            {/* Copyright */}
            <div className="mb-4 text-center md:mb-0 md:text-left">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                © 2025 {t('brand.name')}. {t('footer.copyright')}
              </p>
            </div>

            {/* Botón subir y descargo */}
            <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-x-4 md:space-y-0">
              {/* Enlace descargo destacado */}
              <Link
                href={`/${locale}/legal/descargo-responsabilidad`}
                className="text-center text-sm font-semibold text-red-600 transition-colors hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                {t('footer.disclaimer_link')}
              </Link>

              {/* Botón subir */}
              <Button
                onClick={scrollToTop}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2 self-center"
                aria-label={t('footer.scroll_to_top')}
              >
                <ArrowUpIcon className="h-4 w-4" />
                <span className="hidden sm:inline">{t('footer.back_to_top')}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
