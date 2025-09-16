'use client';

import Image from 'next/image';

import { useTranslations } from 'next-intl';

interface DiagnosisBannerProps {
  showBackgroundImage?: boolean;
  compactMode?: boolean;
}

export function DiagnosisBanner({
  showBackgroundImage = true,
  compactMode = false,
}: DiagnosisBannerProps): JSX.Element {
  const t = useTranslations('recovery.banner');

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-900">
      {/* Background Image */}
      {showBackgroundImage && (
        <div className="absolute inset-0">
          <Image
            src="/images/recovery/banner-diagnosis.webp"
            alt="Digital compass pointing to a locked vault opening"
            fill
            className="object-cover opacity-20"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-blue-800/80 dark:from-blue-800/90 dark:to-blue-900/90" />
        </div>
      )}

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="text-center">
          <h1
            className={`font-bold text-white ${
              compactMode ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl lg:text-5xl'
            }`}
          >
            {t('title')}
          </h1>

          <p
            className={`mx-auto mt-6 text-blue-100 ${
              compactMode
                ? 'max-w-2xl text-base sm:text-lg'
                : 'max-w-3xl text-lg sm:text-xl lg:text-2xl'
            }`}
          >
            {t('subtitle')}
          </p>

          {/* Comfort Elements */}
          <div className="mt-10 flex items-center justify-center space-x-8">
            <div className="flex items-center space-x-2 text-blue-200">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-medium sm:text-base">{t('features.secure')}</span>
            </div>

            <div className="flex items-center space-x-2 text-blue-200">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-medium sm:text-base">{t('features.private')}</span>
            </div>

            <div className="flex items-center space-x-2 text-blue-200">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-medium sm:text-base">{t('features.stepByStep')}</span>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mt-8 flex justify-center">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-white"></div>
              <div className="h-1 w-8 bg-blue-300"></div>
              <div className="h-2 w-2 rounded-full bg-blue-300"></div>
              <div className="h-1 w-8 bg-blue-300"></div>
              <div className="h-2 w-2 rounded-full bg-blue-300"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="h-6 w-full text-white dark:text-gray-900"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
            fill="currentColor"
          />
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
            fill="currentColor"
          />
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </section>
  );
}

export default DiagnosisBanner;
