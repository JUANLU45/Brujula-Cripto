'use client';

import * as React from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useLocale, useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/auth/AuthProvider';
import { cn } from '@/lib/utils';

// Iconos SVG inline para evitar dependencias externas
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

const GlobeAltIcon = ({ className }: { className?: string }): JSX.Element => (
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
      d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3s-4.5 4.03-4.5 9 2.015 9 4.5 9Z"
    />
  </svg>
);

const SunIcon = ({ className }: { className?: string }): JSX.Element => (
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
      d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
    />
  </svg>
);

const MoonIcon = ({ className }: { className?: string }): JSX.Element => (
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
      d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 12.25C3 17.635 7.365 22 12.75 22a9.753 9.753 0 0 0 9.002-5.998Z"
    />
  </svg>
);

const Bars3Icon = ({ className }: { className?: string }): JSX.Element => (
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
      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
    />
  </svg>
);

const XMarkIcon = ({ className }: { className?: string }): JSX.Element => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);

const Navbar = (): JSX.Element => {
  const t = useTranslations('navigation');
  const brandT = useTranslations('brand');
  const authT = useTranslations('auth');
  const locale = useLocale();
  const { theme, setTheme } = useTheme();
  const { user, userData, logout } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = React.useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = React.useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  // Evitar error de hidratación
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Enlaces de navegación principales
  const mainNavLinks = [
    {
      href: `/${locale}`,
      label: t('home'),
      current: pathname === `/${locale}` || pathname === '/',
    },
    {
      href: `/${locale}/blog`,
      label: t('blog'),
      current: pathname.includes('/blog'),
    },
    {
      href: `/${locale}/seguridad`,
      label: t('security_guides'),
      current: pathname.includes('/seguridad'),
    },
    {
      href: `/${locale}/chatbot`,
      label: t('chatbot'),
      current: pathname.includes('/chatbot'),
    },
  ];

  // Enlaces del dropdown de herramientas
  const toolsLinks = [
    {
      href: `/${locale}/recuperacion`,
      label: t('tools.diagnosis_recovery'),
      description: t('tools.diagnosis_recovery_desc'),
    },
    {
      href: `/${locale}/herramientas/tracker`,
      label: t('tools.transaction_tracker'),
      description: t('tools.transaction_tracker_desc'),
    },
    {
      href: `/${locale}/herramientas/servicios`,
      label: t('tools.service_directory'),
      description: t('tools.service_directory_desc'),
    },
  ];

  // Función para cambiar idioma
  const switchLanguage = (newLocale: string): void => {
    const currentPath = pathname.replace(`/${locale}`, '');
    window.location.href = `/${newLocale}${currentPath}`;
  };

  // Función para alternar tema
  const toggleTheme = (): void => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Función para cerrar sesión
  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
      window.location.href = `/${locale}`;
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200/50 bg-gray-50/95 backdrop-blur-lg supports-[backdrop-filter]:bg-gray-50/80 dark:border-gray-700/50 dark:bg-gray-800/95 dark:supports-[backdrop-filter]:bg-gray-800/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href={`/${locale}`} className="flex items-center space-x-2">
              <Image
                src="/images/logo/brujula-logo.svg"
                alt={brandT('logo_alt')}
                width={32}
                height={32}
                className="h-8 w-8"
              />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                {brandT('name')}
              </span>
            </Link>
          </div>

          {/* Navegación Desktop */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {/* Enlaces principales */}
            {mainNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary-600 dark:hover:text-primary-400',
                  link.current
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-700 dark:text-gray-300',
                )}
              >
                {link.label}
              </Link>
            ))}

            {/* Dropdown Herramientas */}
            <div className="relative">
              <button
                onClick={() => setIsToolsDropdownOpen(!isToolsDropdownOpen)}
                className="flex items-center space-x-1 text-sm font-medium text-gray-700 transition-colors hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
              >
                <span>{t('tools.title')}</span>
                <ChevronDownIcon
                  className={cn(
                    'h-4 w-4 transition-transform',
                    isToolsDropdownOpen && 'rotate-180',
                  )}
                />
              </button>

              {isToolsDropdownOpen && (
                <div className="absolute left-0 mt-2 w-80 rounded-md bg-white/90 py-2 shadow-xl ring-1 ring-gray-200/50 backdrop-blur-md dark:bg-gray-800/90 dark:ring-gray-700/50">
                  {toolsLinks.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className="block px-4 py-3 text-sm transition-all duration-200 hover:bg-gray-50/80 hover:backdrop-blur-sm dark:hover:bg-gray-700/80"
                      onClick={() => setIsToolsDropdownOpen(false)}
                    >
                      <div className="font-medium text-gray-900 dark:text-white">{tool.label}</div>
                      <div className="text-gray-500 dark:text-gray-400">{tool.description}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Contacto */}
            <Link
              href={`/${locale}/contacto`}
              className="text-sm font-medium text-gray-700 transition-colors hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
            >
              {t('contact')}
            </Link>
          </div>

          {/* Acciones de la derecha */}
          <div className="flex items-center space-x-4">
            {/* Botones de autenticación / Usuario */}
            {user ? (
              /* Usuario autenticado */
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center space-x-2 rounded-md p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600">
                    <span className="text-sm font-medium text-white">
                      {userData?.displayName?.charAt(0)?.toUpperCase() ||
                        (user.email && user.email.charAt(0).toUpperCase()) ||
                        'U'}
                    </span>
                  </div>
                  <span className="hidden text-sm font-medium md:block">
                    {userData?.displayName || (user.email && user.email.split('@')[0]) || 'Usuario'}
                  </span>
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-md bg-white/90 py-2 shadow-xl ring-1 ring-gray-200/50 backdrop-blur-md dark:bg-gray-800/90 dark:ring-gray-700/50">
                    <Link
                      href={`/${locale}/cuenta`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50/80 dark:text-gray-300 dark:hover:bg-gray-700/80"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      Mi Cuenta
                    </Link>
                    <Link
                      href={`/${locale}/dashboard`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50/80 dark:text-gray-300 dark:hover:bg-gray-700/80"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      Panel de Usuario
                    </Link>
                    <hr className="my-1 border-gray-200 dark:border-gray-600" />
                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        void handleLogout();
                      }}
                      className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50/80 dark:text-red-400 dark:hover:bg-gray-700/80"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Usuario no autenticado */
              <div className="hidden md:flex md:items-center md:space-x-2">
                <Link href={`/${locale}/login`}>
                  <Button variant="ghost" size="sm">
                    {authT('signin.signIn')}
                  </Button>
                </Link>
                <Link href={`/${locale}/registro`}>
                  <Button size="sm">{authT('signup.signUp')}</Button>
                </Link>
              </div>
            )}

            {/* Selector de idioma */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                className="flex items-center space-x-1 rounded-md p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                aria-label={t('language_selector')}
              >
                <GlobeAltIcon className="h-5 w-5" />
                <span className="text-sm font-medium uppercase">{locale}</span>
              </button>

              {isLanguageDropdownOpen && (
                <div className="absolute right-0 mt-2 w-20 rounded-md bg-white/90 py-1 shadow-xl ring-1 ring-gray-200/50 backdrop-blur-md dark:bg-gray-800/90 dark:ring-gray-700/50">
                  <button
                    onClick={() => {
                      switchLanguage('es');
                      setIsLanguageDropdownOpen(false);
                    }}
                    className={cn(
                      'block w-full px-3 py-2 text-left text-sm transition-all duration-200 hover:bg-gray-50/80 dark:hover:bg-gray-700/80',
                      locale === 'es' &&
                        'bg-primary-50 text-primary-600 dark:bg-primary-900 dark:text-primary-400',
                    )}
                  >
                    ES
                  </button>
                  <button
                    onClick={() => {
                      switchLanguage('en');
                      setIsLanguageDropdownOpen(false);
                    }}
                    className={cn(
                      'block w-full px-3 py-2 text-left text-sm transition-all duration-200 hover:bg-gray-50/80 dark:hover:bg-gray-700/80',
                      locale === 'en' &&
                        'bg-primary-50 text-primary-600 dark:bg-primary-900 dark:text-primary-400',
                    )}
                  >
                    EN
                  </button>
                </div>
              )}
            </div>

            {/* Selector de tema */}
            <button
              onClick={toggleTheme}
              className="hover:bg-surface-nav rounded-md p-2 text-gray-700 transition-all duration-200 hover:backdrop-blur-sm dark:text-gray-300 dark:hover:bg-gray-700/80"
              aria-label={t('theme_toggle')}
            >
              {mounted && theme === 'dark' ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>

            {/* Botón menú móvil */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="hover:bg-surface-nav rounded-md p-2 text-gray-700 transition-all duration-200 hover:backdrop-blur-sm dark:text-gray-300 dark:hover:bg-gray-700/80 md:hidden"
              aria-label={t('mobile_menu')}
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {mainNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'block px-3 py-2 text-base font-medium',
                    link.current
                      ? 'bg-primary-50 text-primary-600 dark:bg-primary-900 dark:text-primary-400'
                      : 'hover:bg-surface-nav text-gray-700 dark:text-gray-300 dark:hover:bg-gray-800',
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* Herramientas en móvil */}
              <div className="px-3 py-2">
                <div className="text-base font-medium text-gray-900 dark:text-white">
                  {t('tools.title')}
                </div>
                <div className="mt-2 space-y-1">
                  {toolsLinks.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className="hover:bg-surface-nav block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {tool.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Contacto en móvil */}
              <Link
                href={`/${locale}/contacto`}
                className="hover:bg-surface-nav block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('contact')}
              </Link>

              {/* Enlaces de autenticación en móvil */}
              {user ? (
                <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                  <Link
                    href={`/${locale}/cuenta`}
                    className="hover:bg-surface-nav block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Mi Cuenta
                  </Link>
                  <Link
                    href={`/${locale}/dashboard`}
                    className="hover:bg-surface-nav block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Panel de Usuario
                  </Link>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      void handleLogout();
                    }}
                    className="hover:bg-surface-nav block w-full px-3 py-2 text-left text-base font-medium text-red-600 dark:text-red-400 dark:hover:bg-gray-800"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                  <Link
                    href={`/${locale}/login`}
                    className="hover:bg-surface-nav block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {authT('signin.signIn')}
                  </Link>
                  <Link
                    href={`/${locale}/registro`}
                    className="hover:bg-surface-nav block px-3 py-2 text-base font-medium text-primary-600 dark:text-primary-400 dark:hover:bg-gray-800"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {authT('signup.signUp')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
