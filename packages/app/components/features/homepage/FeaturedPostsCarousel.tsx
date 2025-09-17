'use client';

import { useEffect, useState } from 'react';

import { usePathname } from 'next/navigation';

import type { IArticle } from '@brujula-cripto/types';
import { useTranslations } from 'next-intl';

import { ArticleCard } from '@/components/features/blog/ArticleCard';

interface FeaturedPostsCarouselProps {
  articles?: IArticle[];
}

export function FeaturedPostsCarousel({ articles = [] }: FeaturedPostsCarouselProps): JSX.Element {
  const t = useTranslations('homepage.featuredPosts');
  const pathname = usePathname();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleArticles, setVisibleArticles] = useState(3);

  // Obtener artículos destacados (máximo 5)
  const featuredArticles = articles
    .filter((article) => article.isFeatured && article.status === 'published')
    .slice(0, 5);

  // Determinar locale actual desde la URL
  const currentLocale = pathname.startsWith('/en') ? 'en' : 'es';

  // Responsive: ajustar número de artículos visibles
  useEffect(() => {
    const handleResize = (): void => {
      if (window.innerWidth < 640) {
        setVisibleArticles(1);
      } else if (window.innerWidth < 1024) {
        setVisibleArticles(2);
      } else {
        setVisibleArticles(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = (): void => {
    if (featuredArticles.length > 0) {
      setCurrentIndex(
        (prev) => (prev + 1) % Math.max(1, featuredArticles.length - visibleArticles + 1),
      );
    }
  };

  const prevSlide = (): void => {
    if (featuredArticles.length > 0) {
      setCurrentIndex((prev) =>
        prev === 0 ? Math.max(0, featuredArticles.length - visibleArticles) : prev - 1,
      );
    }
  };

  // Si no hay artículos destacados, mostrar mensaje
  if (featuredArticles.length === 0) {
    return (
      <section className="bg-gray-50 py-16 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
              {t('title', { defaultValue: 'Artículos Destacados' })}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {t('noArticles', { defaultValue: 'No hay artículos destacados disponibles.' })}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 py-16 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Título de la sección */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
            {t('title', { defaultValue: 'Artículos Destacados' })}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            {t('subtitle', {
              defaultValue: 'Descubre nuestras últimas guías y análisis expertos en criptomonedas.',
            })}
          </p>
        </div>

        {/* Carrusel */}
        <div className="relative">
          {/* Contenedor de artículos */}
          <div className="overflow-hidden">
            <div
              className={`flex transform gap-6 transition-transform duration-500 ease-in-out -translate-x-[${(currentIndex * 100) / visibleArticles}%]`}
            >
              {featuredArticles.map((article) => (
                <div
                  key={article.slug}
                  className={`flex-shrink-0 ${
                    visibleArticles === 1 ? 'w-full' : visibleArticles === 2 ? 'w-1/2' : 'w-1/3'
                  }`}
                >
                  <ArticleCard
                    article={article}
                    locale={currentLocale}
                    showAuthor={true}
                    showExcerpt={true}
                    showTags={false}
                    showSharing={false}
                    showInteractions={false}
                    compact={true}
                    className="h-full"
                  />
                </div>
              ))}
            </div>
          </div>
          {/* Controles de navegación */}
          {featuredArticles.length > visibleArticles && (
            <>
              {/* Botón anterior */}
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 z-10 -translate-x-4 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl dark:bg-gray-800"
                aria-label={t('prevSlide', { defaultValue: 'Artículo anterior' })}
              >
                <svg
                  className="h-6 w-6 text-gray-600 dark:text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              {/* Botón siguiente */}
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-4 rounded-full bg-white p-2 shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl dark:bg-gray-800"
                aria-label={t('nextSlide', { defaultValue: 'Siguiente artículo' })}
              >
                <svg
                  className="h-6 w-6 text-gray-600 dark:text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Indicadores de puntos */}
        {featuredArticles.length > visibleArticles && (
          <div className="mt-8 flex justify-center space-x-2">
            {Array.from({ length: Math.max(1, featuredArticles.length - visibleArticles + 1) }).map(
              (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-3 w-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'scale-125 bg-blue-600'
                      : 'bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500'
                  }`}
                  aria-label={t('goToSlide', {
                    number: index + 1,
                    defaultValue: `Ir al slide ${index + 1}`,
                  })}
                />
              ),
            )}
          </div>
        )}
      </div>
    </section>
  );
}
