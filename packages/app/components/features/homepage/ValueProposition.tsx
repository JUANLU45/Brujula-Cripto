'use client';

import Image from 'next/image';

import { useTranslations } from 'next-intl';

export function ValueProposition(): JSX.Element {
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
                <Image
                  src="/images/iconos/escudo-proteccion.svg"
                  alt="Protección Proactiva"
                  width={48}
                  height={48}
                  className="h-12 w-12"
                />
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
                <Image
                  src="/images/iconos/herramientas-llaves.svg"
                  alt="Herramientas Reales"
                  width={48}
                  height={48}
                  className="h-12 w-12"
                />
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
                <Image
                  src="/images/iconos/brujula-guia.svg"
                  alt="Guía Experta"
                  width={48}
                  height={48}
                  className="h-12 w-12"
                />
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
