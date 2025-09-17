'use client';

import { useState } from 'react';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: {
    amount: number;
    currency: string;
    period: string;
  };
  features: string[];
  isPopular?: boolean;
  disabled?: boolean;
}

export default function PricingPage(): JSX.Element {
  const t = useTranslations('pricing');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans: PricingPlan[] = [
    {
      id: 'free',
      name: t('plans.free.name'),
      description: t('plans.free.description'),
      price: {
        amount: 0,
        currency: '€',
        period: t('free'),
      },
      features: [
        t('plans.free.features.tools'),
        t('plans.free.features.chatbot'),
        t('plans.free.features.articles'),
        t('plans.free.features.support'),
      ],
      disabled: false,
    },
    {
      id: 'premium1h',
      name: t('plans.premium1h.name'),
      description: t('plans.premium1h.description'),
      price: {
        amount: 4.99,
        currency: '€',
        period: '1h',
      },
      features: [
        t('plans.premium1h.features.fullAccess'),
        t('plans.premium1h.features.unlimitedTools'),
        t('plans.premium1h.features.prioritySupport'),
        t('plans.premium1h.features.noWaitTime'),
      ],
      isPopular: false,
      disabled: false,
    },
    {
      id: 'premium5h',
      name: t('plans.premium5h.name'),
      description: t('plans.premium5h.description'),
      price: {
        amount: 19.95,
        currency: '€',
        period: '5h',
      },
      features: [
        t('plans.premium5h.features.fullAccess'),
        t('plans.premium5h.features.unlimitedTools'),
        t('plans.premium5h.features.prioritySupport'),
        t('plans.premium5h.features.noWaitTime'),
        t('plans.premium5h.features.bestValue'),
      ],
      isPopular: true,
      disabled: false,
    },
    {
      id: 'premium10h',
      name: t('plans.premium10h.name'),
      description: t('plans.premium10h.description'),
      price: {
        amount: 39.9,
        currency: '€',
        period: '10h',
      },
      features: [
        t('plans.premium10h.features.fullAccess'),
        t('plans.premium10h.features.unlimitedTools'),
        t('plans.premium10h.features.prioritySupport'),
        t('plans.premium10h.features.noWaitTime'),
        t('plans.premium10h.features.maxValue'),
      ],
      isPopular: false,
      disabled: false,
    },
  ];

  const handlePlanSelect = async (planId: string): Promise<void> => {
    setSelectedPlan(planId);

    if (planId === 'free') {
      // Redirigir a registro gratuito
      window.location.href = '/registro';
      return;
    }

    try {
      // Integración real con Stripe checkout
      const response = await fetch('/api/payments/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          planType: 'credit_pack',
        }),
      });

      if (!response.ok) {
        throw new Error('Error al crear sesión de pago');
      }

      const result = (await response.json()) as { checkoutUrl: string };
      window.location.href = result.checkoutUrl;
    } catch (_error: unknown) {
      // Mostrar error al usuario
      alert('Error al procesar el pago. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <section className="w-full bg-gradient-to-br from-gray-50 to-gray-100 py-12 dark:from-gray-900 dark:to-gray-800 md:py-16 lg:py-20">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Cabecera */}
        <div className="mb-12 text-center lg:mb-16">
          <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl lg:mb-6 lg:text-5xl">
            {t('title')}
          </h1>
          <p className="mx-auto max-w-4xl text-lg leading-relaxed text-gray-600 dark:text-gray-300 sm:text-xl">
            {t('subtitle')}
          </p>
        </div>

        {/* Tabla de Precios */}
        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative p-6 transition-all duration-300 hover:shadow-lg lg:p-8 ${
                plan.isPopular
                  ? 'scale-105 shadow-xl ring-2 ring-blue-500 lg:scale-110'
                  : 'hover:scale-105'
              } ${
                selectedPlan === plan.id
                  ? 'bg-green-50 ring-2 ring-green-500 dark:bg-green-900/20'
                  : ''
              }`}
            >
              {/* Badge Popular */}
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 transform">
                  <span className="rounded-full bg-blue-500 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                    {t('popular')}
                  </span>
                </div>
              )}

              {/* Precio */}
              <div className="mb-6 text-center">
                <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                  {plan.name}
                </h3>
                <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">{plan.description}</p>
                <div className="mb-4 flex items-end justify-center">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white lg:text-4xl">
                    {plan.price.amount}
                  </span>
                  <span className="ml-1 text-lg text-gray-600 dark:text-gray-400">
                    {plan.price.currency}
                  </span>
                  {plan.price.period !== t('free') && (
                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-500">
                      / {plan.price.period}
                    </span>
                  )}
                </div>
              </div>

              {/* Características */}
              <ul className="mb-8 space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
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

              {/* Botón */}
              <div className="mt-auto">
                <Button
                  variant={plan.isPopular ? 'default' : 'outline'}
                  size="lg"
                  className="w-full"
                  disabled={plan.disabled}
                  onClick={() => void handlePlanSelect(plan.id)}
                >
                  {plan.id === 'free' ? t('signUpFree') : t('selectPlan')}
                </Button>
              </div>

              {/* Indicador Ahorro */}
              {plan.id === 'premium5h' && (
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 transform">
                  <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">
                    {t('save')} 25%
                  </span>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Descargo de Responsabilidad */}
        <div className="text-center">
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">{t('disclaimer')}</p>
          <button
            className="text-sm text-blue-600 hover:underline focus:underline focus:outline-none dark:text-blue-400"
            onClick={() => {
              // Abrir modal con descargo completo
              window.open('/legal/descargo-responsabilidad', '_blank');
            }}
          >
            {t('readDisclaimer')}
          </button>
        </div>
      </div>
    </section>
  );
}
