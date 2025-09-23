'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/Button';

interface HomepageBannerProps {
  bannerImageUrl?: string;
  bannerTitle?: string;
  bannerSubtitle?: string;
  bannerButtonText?: string;
  bannerButtonLink?: string;
}

export function HomepageBanner({
  bannerImageUrl,
  bannerTitle,
  bannerSubtitle,
  bannerButtonText,
  bannerButtonLink,
}: HomepageBannerProps): JSX.Element {
  const t = useTranslations('homepage.banner');
  const router = useRouter();

  // Usar valores de la documentación como fallback
  const imageUrl = bannerImageUrl || '/images/home/banner-hero.webp';
  const title = bannerTitle || t('title');
  const subtitle = bannerSubtitle || t('subtitle');
  const buttonText = bannerButtonText || t('button');
  const buttonLink = bannerButtonLink || '/recuperacion';

  const handleButtonClick = (): void => {
    router.push(buttonLink);
  };

  return (
    <section className="relative flex h-screen w-full items-center justify-center overflow-hidden">
      {/* Imagen de fondo */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imageUrl}
          alt="Banner hero background"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Overlay mejorado - Gradiente dinámico para máxima legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
      </div>

      {/* Contenido del banner */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center text-white sm:px-6 lg:px-8">
        <h1 className="mb-6 text-4xl font-bold leading-tight text-white drop-shadow-2xl [text-shadow:_2px_2px_4px_rgb(0_0_0_/_80%)] sm:text-5xl md:text-6xl lg:text-7xl">
          {title}
        </h1>

        <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-white/95 drop-shadow-xl [text-shadow:_1px_1px_3px_rgb(0_0_0_/_70%)] sm:text-xl md:text-2xl">
          {subtitle}
        </p>

        <Button
          onClick={handleButtonClick}
          size="lg"
          className="transform rounded-lg bg-primary-600 px-8 py-4 text-lg font-semibold text-white shadow-2xl ring-2 ring-primary-400/50 transition-all duration-300 hover:scale-105 hover:bg-primary-700 hover:shadow-2xl"
        >
          {buttonText}
        </Button>
      </div>

      {/* Indicador de scroll */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 transform">
        <div className="animate-bounce">
          <svg
            className="h-6 w-6 text-white opacity-75"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}
