'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/Button';
import { createCheckoutSession } from '@/lib/api';
import { useAuth } from '@/lib/auth/AuthProvider';

interface PricingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  features: string[];
  popular?: boolean;
  creditsInSeconds: number;
}

interface PricingTierProps {
  onSelectPlan?: (planId: string) => void;
  showComparison?: boolean;
  compact?: boolean;
}

export function PricingTier({
  onSelectPlan,
  showComparison = true,
  compact = false,
}: PricingTierProps): JSX.Element {
  const t = useTranslations('pricing');
  const { user, userData: _userData } = useAuth();

  const pricingOptions: PricingOption[] = [
    {
      id: 'free',
      name: t('plans.free.name'),
      description: t('plans.free.description'),
      price: 0,
      currency: 'EUR',
      creditsInSeconds: 2700, // 45 minutos
      features: [
        t('plans.free.features.tools'),
        t('plans.free.features.chatbot'),
        t('plans.free.features.articles'),
        t('plans.free.features.support'),
      ],
    },
    {
      id: 'premium-1h',
      name: t('plans.premium1h.name'),
      description: t('plans.premium1h.description'),
      price: 9.99,
      currency: 'EUR',
      creditsInSeconds: 3600, // 1 hora
      popular: true,
      features: [
        t('plans.premium1h.features.fullAccess'),
        t('plans.premium1h.features.unlimitedTools'),
        t('plans.premium1h.features.prioritySupport'),
        t('plans.premium1h.features.noWaitTime'),
      ],
    },
    {
      id: 'premium-5h',
      name: t('plans.premium5h.name'),
      description: t('plans.premium5h.description'),
      price: 39.99,
      currency: 'EUR',
      creditsInSeconds: 18000, // 5 horas
      features: [
        t('plans.premium5h.features.fullAccess'),
        t('plans.premium5h.features.unlimitedTools'),
        t('plans.premium5h.features.prioritySupport'),
        t('plans.premium5h.features.noWaitTime'),
        t('plans.premium5h.features.bestValue'),
      ],
    },
    {
      id: 'premium-10h',
      name: t('plans.premium10h.name'),
      description: t('plans.premium10h.description'),
      price: 69.99,
      currency: 'EUR',
      creditsInSeconds: 36000, // 10 horas
      features: [
        t('plans.premium10h.features.fullAccess'),
        t('plans.premium10h.features.unlimitedTools'),
        t('plans.premium10h.features.prioritySupport'),
        t('plans.premium10h.features.noWaitTime'),
        t('plans.premium10h.features.maxValue'),
      ],
    },
  ];

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`;
    }
    return `${minutes}m`;
  };

  const calculateSavings = (option: PricingOption): number => {
    if (option.id === 'free') {
      return 0;
    }
    const pricePerHour = option.price / (option.creditsInSeconds / 3600);
    const basePrice = 9.99; // Precio por hora del plan básico
    return Math.round(((basePrice - pricePerHour) / basePrice) * 100);
  };

  const handleSelectPlan = async (planId: string): Promise<void> => {
    if (planId === 'free') {
      // Plan gratuito - solo llamar callback si existe
      if (onSelectPlan) {
        onSelectPlan(planId);
      }
      return;
    }

    // Planes premium - integración con Stripe CENTRALIZADA
    try {
      const result = await createCheckoutSession(planId);

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Error en el pago');
      }

      // Redirigir al checkout de Stripe
      window.location.href = result.data.sessionUrl;
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      // Mostrar error al usuario - implementar notificación
      alert(
        t('errors.paymentFailed', {
          defaultValue: 'Error al procesar el pago. Inténtalo de nuevo.',
        }),
      );
    }
  };

  return (
    <div className={`${compact ? 'space-y-4' : 'space-y-8'}`}>
      {!compact && (
        <div className="text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">{t('title')}</h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            {t('subtitle')}
          </p>
        </div>
      )}

      <div
        className={`grid gap-6 ${compact ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}
      >
        {pricingOptions.map((option) => (
          <div
            key={option.id}
            className={`relative rounded-lg border-2 bg-white shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800 ${
              option.popular
                ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800'
                : 'border-gray-200 hover:border-blue-300 dark:border-gray-700'
            }`}
          >
            {option.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 transform">
                <span className="rounded-full bg-blue-500 px-4 py-1 text-sm font-medium text-white">
                  {t('popular')}
                </span>
              </div>
            )}

            <div className="p-6">
              <div className="mb-6 text-center">
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  {option.name}
                </h3>
                <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                  {option.description}
                </p>

                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    {option.price === 0 ? t('free') : `€${option.price}`}
                  </span>
                  {option.price > 0 && (
                    <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {formatTime(option.creditsInSeconds)} {t('ofUsage')}
                    </div>
                  )}
                </div>

                {calculateSavings(option) > 0 && (
                  <div className="mb-4 inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                    {t('save')} {calculateSavings(option)}%
                  </div>
                )}
              </div>

              <ul className="mb-6 space-y-3">
                {option.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => void handleSelectPlan(option.id)}
                disabled={option.id === 'free' && !user}
                className={`w-full py-3 ${
                  option.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
                }`}
              >
                {option.id === 'free'
                  ? user
                    ? t('currentPlan')
                    : t('signUpFree')
                  : t('selectPlan')}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {showComparison && !compact && (
        <div className="mt-12 rounded-lg bg-gray-50 p-6 dark:bg-gray-800">
          <h3 className="mb-4 text-center text-xl font-semibold text-gray-900 dark:text-white">
            {t('comparison.title')}
          </h3>

          <div className="grid grid-cols-1 gap-6 text-sm md:grid-cols-3">
            <div className="text-center">
              <div className="mb-2 font-medium text-red-600 dark:text-red-400">
                {t('comparison.competitors')}
              </div>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>• {t('comparison.competitorFeatures.subscription')}</li>
                <li>• {t('comparison.competitorFeatures.dataSharing')}</li>
                <li>• {t('comparison.competitorFeatures.limitedTools')}</li>
                <li>• {t('comparison.competitorFeatures.noSupport')}</li>
              </ul>
            </div>

            <div className="border-l border-r border-gray-200 px-4 text-center dark:border-gray-700">
              <div className="mb-2 font-medium text-blue-600 dark:text-blue-400">
                {t('comparison.brujulaCripto')}
              </div>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>• {t('comparison.brujulaFeatures.payPerUse')}</li>
                <li>• {t('comparison.brujulaFeatures.privacy')}</li>
                <li>• {t('comparison.brujulaFeatures.fullAccess')}</li>
                <li>• {t('comparison.brujulaFeatures.expertSupport')}</li>
              </ul>
            </div>

            <div className="text-center">
              <div className="mb-2 font-medium text-green-600 dark:text-green-400">
                {t('comparison.savings')}
              </div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {t('comparison.savingsAmount')}
              </div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {t('comparison.savingsDescription')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="text-center text-xs text-gray-500 dark:text-gray-400">
        <p>
          {t('disclaimer')}{' '}
          <a
            href="/legal/descargo-responsabilidad"
            className="text-blue-600 hover:underline dark:text-blue-400"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('readDisclaimer')}
          </a>
        </p>
      </div>
    </div>
  );
}

export default PricingTier;
