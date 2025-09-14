'use client';

import { useTranslations } from 'next-intl';

export function ValueProposition() {
  const t = useTranslations('homepage.valueProposition');

  return (
    <section className="bg-white py-16 dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Título principal */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
            {t('title')}
          </h2>
        </div>

        {/* Grid de características */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12">
          {/* Columna 1: Protección Proactiva */}
          <div className="group text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-blue-100 p-4 transition-transform duration-300 group-hover:scale-110 dark:bg-blue-900/30">
                {/* Icono de escudo */}
                <svg
                  className="h-12 w-12 text-blue-600 dark:text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              {t('column1.title')}
            </h3>
            <p className="leading-relaxed text-gray-600 dark:text-gray-400">
              {t('column1.description')}
            </p>
          </div>

          {/* Columna 2: Herramientas Reales */}
          <div className="group text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-green-100 p-4 transition-transform duration-300 group-hover:scale-110 dark:bg-green-900/30">
                {/* Icono de llave inglesa (wrench) */}
                <svg
                  className="h-12 w-12 text-green-600 dark:text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 100-4H7a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              {t('column2.title')}
            </h3>
            <p className="leading-relaxed text-gray-600 dark:text-gray-400">
              {t('column2.description')}
            </p>
          </div>

          {/* Columna 3: Guía Experta */}
          <div className="group text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-purple-100 p-4 transition-transform duration-300 group-hover:scale-110 dark:bg-purple-900/30">
                {/* Icono de brújula */}
                <svg
                  className="h-12 w-12 text-purple-600 dark:text-purple-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9a9 9 0 00-9 9m9-9v9m0-9a9 9 0 019 9M3 12a9 9 0 009 9"
                  />
                  <circle cx="12" cy="12" r="2" />
                </svg>
              </div>
            </div>
            <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              {t('column3.title')}
            </h3>
            <p className="leading-relaxed text-gray-600 dark:text-gray-400">
              {t('column3.description')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
