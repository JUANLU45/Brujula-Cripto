'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/Button';

interface RecoveryOption {
  id: string;
  icon: string;
  title: string;
  description: string;
  link: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
  isPremium?: boolean;
}

interface RecoveryWizardProps {
  showProgress?: boolean;
  compactMode?: boolean;
}

export function RecoveryWizard({
  showProgress = true,
  compactMode = false,
}: RecoveryWizardProps): JSX.Element {
  const t = useTranslations('recovery.wizard');
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const recoveryOptions: RecoveryOption[] = [
    {
      id: 'forgotten-password',
      icon: '🔑',
      title: t('options.password.title'),
      description: t('options.password.description'),
      link: '/recuperacion/password',
      difficulty: 'medium',
      estimatedTime: t('options.password.time'),
      isPremium: false,
    },
    {
      id: 'lost-seed-phrase',
      icon: '📝',
      title: t('options.seedPhrase.title'),
      description: t('options.seedPhrase.description'),
      link: '/recuperacion/seed',
      difficulty: 'hard',
      estimatedTime: t('options.seedPhrase.time'),
      isPremium: true,
    },
    {
      id: 'hardware-wallet',
      icon: '💾',
      title: t('options.hardware.title'),
      description: t('options.hardware.description'),
      link: '/recuperacion/hardware',
      difficulty: 'medium',
      estimatedTime: t('options.hardware.time'),
      isPremium: false,
    },
    {
      id: 'corrupted-wallet',
      icon: '🔧',
      title: t('options.corrupted.title'),
      description: t('options.corrupted.description'),
      link: '/recuperacion/corrupted',
      difficulty: 'hard',
      estimatedTime: t('options.corrupted.time'),
      isPremium: true,
    },
    {
      id: 'deleted-files',
      icon: '🗂️',
      title: t('options.deleted.title'),
      description: t('options.deleted.description'),
      link: '/recuperacion/deleted',
      difficulty: 'easy',
      estimatedTime: t('options.deleted.time'),
      isPremium: false,
    },
    {
      id: 'transaction-stuck',
      icon: '⏱️',
      title: t('options.transaction.title'),
      description: t('options.transaction.description'),
      link: '/herramientas/tracker',
      difficulty: 'easy',
      estimatedTime: t('options.transaction.time'),
      isPremium: false,
    },
  ];

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'easy':
        return 'success-badge';
      case 'medium':
        return 'warning-badge';
      case 'hard':
        return 'error-badge';
      default:
        return 'neutral-badge';
    }
  };

  const handleOptionSelect = (option: RecoveryOption): void => {
    setSelectedOption(option.id);
    // Pequeño delay para mostrar la selección antes de navegar
    setTimeout(() => {
      router.push(option.link);
    }, 200);
  };

  return (
    <div className={`mx-auto max-w-6xl ${compactMode ? 'p-4' : 'p-6'}`}>
      <div className="card-primary">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className={`${compactMode ? 'text-2xl' : 'text-3xl'} text-primary mb-4 font-bold`}>
            {t('title')}
          </h1>
          <p className="text-secondary mx-auto max-w-2xl">{t('subtitle')}</p>
        </div>

        {/* Progress indicator */}
        {showProgress && !compactMode && (
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center">
                <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium">
                  1
                </div>
                <span className="text-primary ml-2 text-sm font-medium">{t('steps.identify')}</span>
              </div>
              <div className="bg-border h-0.5 w-16"></div>
              <div className="flex items-center">
                <div className="bg-muted text-muted-foreground flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium">
                  2
                </div>
                <span className="text-muted-foreground ml-2 text-sm">{t('steps.diagnose')}</span>
              </div>
              <div className="bg-border h-0.5 w-16"></div>
              <div className="flex items-center">
                <div className="bg-muted text-muted-foreground flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium">
                  3
                </div>
                <span className="text-muted-foreground ml-2 text-sm">{t('steps.recover')}</span>
              </div>
            </div>
          </div>
        )}

        {/* Recovery options */}
        <div
          className={`grid gap-6 ${compactMode ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}
        >
          {recoveryOptions.map((option) => (
            <div
              key={option.id}
              className={`group relative transform cursor-pointer transition-all duration-300 hover:scale-105 ${
                selectedOption === option.id ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
              }`}
              onClick={() => handleOptionSelect(option)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleOptionSelect(option);
                }
              }}
              tabIndex={0}
              role="button"
            >
              <div className="h-full rounded-lg bg-gray-50 p-6 transition-shadow hover:shadow-lg dark:bg-gray-700">
                {/* Premium badge */}
                {option.isPremium && (
                  <div className="absolute right-3 top-3">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {t('premium')}
                    </span>
                  </div>
                )}

                {/* Icon */}
                <div className="mb-4 text-center text-4xl">
                  <span role="img" aria-label={option.title}>
                    {option.icon}
                  </span>
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                    {option.title}
                  </h3>

                  <p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    {option.description}
                  </p>

                  {/* Metadata */}
                  <div className="mb-4 flex items-center justify-center space-x-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getDifficultyColor(option.difficulty)}`}
                    >
                      {t(`difficulty.${option.difficulty}`)}
                    </span>

                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      <span role="img" aria-label="reloj">
                        ⏱️
                      </span>{' '}
                      {option.estimatedTime}
                    </span>
                  </div>

                  {/* Action button */}
                  <Button
                    className="w-full bg-blue-600 py-2 text-sm text-white hover:bg-blue-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOptionSelect(option);
                    }}
                  >
                    {t('startDiagnosis')}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Help section */}
        <div className="mt-8 rounded-lg bg-blue-50 p-6 dark:bg-blue-900/20">
          <div className="text-center">
            <h3 className="mb-2 text-lg font-semibold text-blue-900 dark:text-blue-100">
              {t('help.title')}
            </h3>
            <p className="mb-4 text-sm text-blue-700 dark:text-blue-300">{t('help.description')}</p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                onClick={() => router.push('/contacto')}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                {t('help.contact')}
              </Button>

              <Button
                onClick={() => router.push('/chatbot')}
                className="border border-blue-600 bg-white text-blue-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700"
              >
                {t('help.chatbot')}
              </Button>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
          <p>
            {t('disclaimer.text')}{' '}
            <a
              href="/legal/descargo-responsabilidad"
              className="text-blue-600 hover:underline dark:text-blue-400"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('disclaimer.link')}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RecoveryWizard;
