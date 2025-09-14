'use client'

import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

// SVG Inline Icons (NO @heroicons)
const CompassIcon = ({ className = "w-24 h-24" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} />
    <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88 16.24,7.76" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} />
  </svg>
)

const HomeIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
)

const BlogIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
  </svg>
)

const SecurityIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
)

const SearchIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

const BackIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
)

export default function NotFoundPage() {
  const t = useTranslations('notFound')
  const locale = useLocale()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          {/* Ícono de Brújula Perdida */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <CompassIcon className="w-32 h-32 text-blue-400 dark:text-blue-500 animate-spin-slow" />
              {/* Indicador de "perdido" */}
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">?</span>
              </div>
            </div>
          </div>

          {/* Contenido Principal */}
          <Card className="p-8 shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            {/* Código de Error */}
            <div className="mb-6">
              <h1 className="text-8xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                404
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
            </div>

            {/* Título y Descripción */}
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {t('title')}
            </h2>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              {t('description')}
            </p>

            {/* Mensaje de Ayuda */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-8">
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                💡 {t('help')}
              </p>
            </div>

            {/* Acciones Rápidas */}
            <div className="space-y-6">
              {/* Botón Principal - Volver al Inicio */}
              <div>
                <Link href={`/${locale}`}>
                  <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold">
                    <HomeIcon className="w-5 h-5 mr-2" />
                    {t('goHome')}
                  </Button>
                </Link>
              </div>

              {/* Enlaces Útiles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link
                  href={`/${locale}/blog`}
                  className="flex items-center justify-center gap-2 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <BlogIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('links.blog')}
                  </span>
                </Link>

                <Link
                  href={`/${locale}/seguridad`}
                  className="flex items-center justify-center gap-2 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <SecurityIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('links.security')}
                  </span>
                </Link>

                <Link
                  href={`/${locale}/recuperacion`}
                  className="flex items-center justify-center gap-2 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <SearchIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('links.recovery')}
                  </span>
                </Link>
              </div>

              {/* Botón Volver Atrás */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                <Button
                  variant="ghost"
                  onClick={() => window.history.back()}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  <BackIcon className="w-4 h-4 mr-2" />
                  {t('goBack')}
                </Button>
              </div>
            </div>
          </Card>

          {/* Footer de Ayuda */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('contactHelp')}{' '}
              <Link
                href={`/${locale}/contacto`}
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                {t('contactLink')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}