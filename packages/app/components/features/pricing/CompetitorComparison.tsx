'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface ComparisonTab {
  id: string;
  label: string;
  brujulaFeature: string;
  competitorFeature: string;
}

interface CalculatorResult {
  amount: number;
  brujulaCost: number;
  competitorCost: number;
  savings: number;
  savingsPercentage: number;
}

export default function CompetitorComparison() {
  const t = useTranslations('pricing.comparison');
  const [activeTab, setActiveTab] = useState<string>('pricing');
  const [calculatorAmount, setCalculatorAmount] = useState<number>(500);
  const [calculatorResult, setCalculatorResult] = useState<CalculatorResult | null>(null);

  const tabs: ComparisonTab[] = [
    {
      id: 'pricing',
      label: 'Modelo de Precios',
      brujulaFeature: t('brujulaFeatures.payPerUse'),
      competitorFeature: t('competitorFeatures.subscription'),
    },
    {
      id: 'privacy',
      label: 'Privacidad',
      brujulaFeature: t('brujulaFeatures.privacy'),
      competitorFeature: t('competitorFeatures.dataSharing'),
    },
    {
      id: 'ecosystem',
      label: 'Ecosistema',
      brujulaFeature: t('brujulaFeatures.fullAccess'),
      competitorFeature: t('competitorFeatures.limitedTools'),
    },
    {
      id: 'support',
      label: 'Soporte',
      brujulaFeature: t('brujulaFeatures.expertSupport'),
      competitorFeature: t('competitorFeatures.noSupport'),
    },
  ];

  const calculateSavings = (amount: number): CalculatorResult => {
    // Modelo escalonado Brújula Cripto (4.99€ primeras 2h, 3.99€ resto)
    // Asumimos 1€ recuperado = 1 minuto de trabajo aproximadamente
    const hoursNeeded = Math.max(1, amount / 60); // Mínimo 1 hora

    let brujulaCost = 0;
    if (hoursNeeded <= 2) {
      brujulaCost = hoursNeeded * 4.99;
    } else {
      brujulaCost = 2 * 4.99 + (hoursNeeded - 2) * 3.99;
    }

    // Competidores: 20% del monto recuperado
    const competitorCost = amount * 0.2;

    const savings = Math.max(0, competitorCost - brujulaCost);
    const savingsPercentage = competitorCost > 0 ? (savings / competitorCost) * 100 : 0;

    return {
      amount,
      brujulaCost: Math.round(brujulaCost * 100) / 100,
      competitorCost: Math.round(competitorCost * 100) / 100,
      savings: Math.round(savings * 100) / 100,
      savingsPercentage: Math.round(savingsPercentage * 100) / 100,
    };
  };

  const handleCalculate = () => {
    const result = calculateSavings(calculatorAmount);
    setCalculatorResult(result);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  return (
    <section className="w-full bg-white py-12 dark:bg-gray-900 md:py-16 lg:py-20">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Título */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl lg:text-4xl">
            {t('title')}
          </h2>
          <div className="flex items-center justify-center space-x-4 text-lg">
            <span className="font-semibold text-green-600 dark:text-green-400">
              {t('savingsAmount')}
            </span>
            <span className="text-gray-500 dark:text-gray-400">{t('savingsDescription')}</span>
          </div>
        </div>

        {/* Calculadora Interactiva */}
        <Card className="mb-12 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 dark:from-blue-900/20 dark:to-indigo-900/20 lg:p-8">
          <div className="mb-6 text-center">
            <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              Calculadora de Ahorros
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Descubre cuánto puedes ahorrar con nuestro modelo de precios
            </p>
          </div>

          <div className="mb-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <div className="flex flex-col">
              <label
                htmlFor="amount"
                className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Monto a recuperar
              </label>
              <div className="relative">
                <input
                  id="amount"
                  type="number"
                  min="100"
                  max="100000"
                  step="100"
                  value={calculatorAmount}
                  onChange={(e) => setCalculatorAmount(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white sm:w-48"
                  placeholder="500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-500 dark:text-gray-400">
                  €
                </span>
              </div>
            </div>
            <Button onClick={handleCalculate} size="lg" className="mt-6 sm:mt-8">
              Calcular Ahorro
            </Button>
          </div>

          {/* Resultados */}
          {calculatorResult && (
            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              <Card className="border-red-200 bg-red-50 p-4 text-center dark:border-red-800 dark:bg-red-900/20">
                <h4 className="mb-2 font-semibold text-red-800 dark:text-red-200">
                  {t('competitors')}
                </h4>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {formatCurrency(calculatorResult.competitorCost)}
                </p>
                <p className="text-sm text-red-600 dark:text-red-400">20% del monto</p>
              </Card>

              <Card className="border-blue-200 bg-blue-50 p-4 text-center dark:border-blue-800 dark:bg-blue-900/20">
                <h4 className="mb-2 font-semibold text-blue-800 dark:text-blue-200">
                  {t('brujulaCripto')}
                </h4>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(calculatorResult.brujulaCost)}
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-400">Pago por tiempo real</p>
              </Card>

              <Card className="border-green-200 bg-green-50 p-4 text-center dark:border-green-800 dark:bg-green-900/20">
                <h4 className="mb-2 font-semibold text-green-800 dark:text-green-200">
                  {t('savings')}
                </h4>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(calculatorResult.savings)}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  Ahorras {calculatorResult.savingsPercentage.toFixed(1)}%
                </p>
              </Card>
            </div>
          )}
        </Card>

        {/* Tabs de Comparación */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center border-b border-gray-200 dark:border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium transition-colors duration-200 sm:px-6 sm:py-3 sm:text-base ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contenido del Tab Activo */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Competidores */}
          <Card className="border-red-200 p-6 dark:border-red-800 lg:p-8">
            <div className="mb-4 flex items-center">
              <div className="mr-3 h-3 w-3 rounded-full bg-red-500"></div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t('competitors')}
              </h3>
            </div>
            <div className="space-y-3">
              {tabs
                .find((tab) => tab.id === activeTab)
                ?.competitorFeature.split(', ')
                .map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <svg
                      className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </div>
                ))}
            </div>
          </Card>

          {/* Brújula Cripto */}
          <Card className="border-green-200 bg-green-50 p-6 dark:border-green-800 dark:bg-green-900/10 lg:p-8">
            <div className="mb-4 flex items-center">
              <div className="mr-3 h-3 w-3 rounded-full bg-green-500"></div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t('brujulaCripto')}
              </h3>
            </div>
            <div className="space-y-3">
              {tabs
                .find((tab) => tab.id === activeTab)
                ?.brujulaFeature.split(', ')
                .map((feature, index) => (
                  <div key={index} className="flex items-start">
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
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </div>
                ))}
            </div>
          </Card>
        </div>

        {/* Conclusión */}
        <div className="mt-12 text-center">
          <p className="mb-6 text-lg text-gray-600 dark:text-gray-300">
            Con Brújula Cripto, pagas solo por el tiempo que necesitas y mantienes el control total
            de tus datos.
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            Comenzar Ahora
          </Button>
        </div>
      </div>
    </section>
  );
}
