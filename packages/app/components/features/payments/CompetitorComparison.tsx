'use client';

import { useState } from 'react';

import { useTranslations } from 'next-intl';

interface Competitor {
  id: string;
  name: string;
  logo?: string;
  pricing: {
    monthly: number;
    annual: number;
  };
  features: {
    dataPrivacy: boolean;
    fullAccess: boolean;
    expertSupport: boolean;
    noSubscription: boolean;
    unlimitedTools: boolean;
    secureProcessing: boolean;
  };
  limitations: string[];
  rating: number;
}

interface CompetitorComparisonProps {
  showCalculator?: boolean;
  compactMode?: boolean;
}

export function CompetitorComparison({
  showCalculator = true,
  compactMode: _compactMode = false,
}: CompetitorComparisonProps): JSX.Element {
  const t = useTranslations('comparison');

  const [activeTab, setActiveTab] = useState<'features' | 'pricing' | 'calculator'>('features');
  const [calculatorValues, setCalculatorValues] = useState({
    monthlyAmount: 1000,
    hoursPerMonth: 10,
  });

  const competitors: Competitor[] = [
    {
      id: 'competitor-a',
      name: 'Servicios Competidores',
      pricing: { monthly: 0, annual: 0 }, // Cobran 20% de lo recuperado según documentación
      features: {
        dataPrivacy: false,
        fullAccess: false,
        expertSupport: false,
        noSubscription: false,
        unlimitedTools: false,
        secureProcessing: false,
      },
      limitations: [
        'Cobran 20% de lo que encuentran',
        'Datos compartidos con terceros',
        'Acceso limitado a herramientas',
        'Sin soporte directo',
        'Solo pagan si recuperan',
      ],
      rating: 3.2,
    },
    {
      id: 'brujula-cripto',
      name: 'Brújula Cripto',
      pricing: { monthly: 0, annual: 0 }, // Pago por uso: 4.99€/h primeras 2h, 3.99€/h siguientes
      features: {
        dataPrivacy: true,
        fullAccess: true,
        expertSupport: true,
        noSubscription: true,
        unlimitedTools: true,
        secureProcessing: true,
      },
      limitations: [],
      rating: 4.9,
    },
  ];

  const brujulaCripto = competitors.find((c) => c.id === 'brujula-cripto')!;
  const otherCompetitors = competitors.filter((c) => c.id !== 'brujula-cripto');

  const calculateSavings = () => {
    // Comparación real basada en documentación: 20% competidores vs pago por uso Brújula Cripto
    const competitorPercentage = 20; // 20% de lo recuperado según documentación
    const brujulaCostHourly = calculatorValues.hoursPerMonth <= 2 ? 4.99 : 3.99; // Tarifas reales documentadas
    const brujulaCost = calculatorValues.hoursPerMonth * brujulaCostHourly;
    const competitorCost = (calculatorValues.monthlyAmount * competitorPercentage) / 100; // 20% del monto recuperado
    const monthlySavings = competitorCost - brujulaCost;
    const annualSavings = monthlySavings * 12;
    const savingsPercentage = competitorCost > 0 ? (monthlySavings / competitorCost) * 100 : 0;

    return {
      monthly: Math.max(0, monthlySavings),
      annual: Math.max(0, annualSavings),
      percentage: Math.max(0, savingsPercentage),
    };
  };

  const renderFeatureCell = (hasFeature: boolean, isHighlight?: boolean) => (
    <div className={`flex justify-center ${isHighlight ? 'bg-green-50 dark:bg-green-900/20' : ''}`}>
      {hasFeature ? (
        <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </div>
  );

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={i} className="h-4 w-4 fill-current text-yellow-400" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>,
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="h-4 w-4 fill-current text-yellow-400" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="half">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path
            fill="url(#half)"
            d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
          />
        </svg>,
      );
    }

    return stars;
  };

  const savings = calculateSavings();

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        <div className="mb-8 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">{t('title')}</h2>
          <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-400">{t('subtitle')}</p>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex flex-wrap justify-center border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('features')}
            className={`border-b-2 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'features'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            {t('tabs.features')}
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`border-b-2 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'pricing'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            {t('tabs.pricing')}
          </button>
          {showCalculator && (
            <button
              onClick={() => setActiveTab('calculator')}
              className={`border-b-2 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'calculator'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {t('tabs.calculator')}
            </button>
          )}
        </div>

        {/* Features Tab */}
        {activeTab === 'features' && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-4 text-left font-medium text-gray-900 dark:text-white">
                    {t('features.feature')}
                  </th>
                  {competitors.map((competitor) => (
                    <th
                      key={competitor.id}
                      className={`px-4 py-4 text-center font-medium ${
                        competitor.id === 'brujula-cripto'
                          ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                          : 'text-gray-900 dark:text-white'
                      }`}
                    >
                      <div className="space-y-2">
                        <div>{competitor.name}</div>
                        <div className="flex justify-center">{renderStars(competitor.rating)}</div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-4 text-gray-900 dark:text-white">
                    {t('features.dataPrivacy')}
                  </td>
                  {competitors.map((competitor) => (
                    <td
                      key={`${competitor.id}-privacy`}
                      className={`px-4 py-4 ${
                        competitor.id === 'brujula-cripto' ? 'bg-green-50 dark:bg-green-900/20' : ''
                      }`}
                    >
                      {renderFeatureCell(
                        competitor.features.dataPrivacy,
                        competitor.id === 'brujula-cripto',
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-4 text-gray-900 dark:text-white">
                    {t('features.fullAccess')}
                  </td>
                  {competitors.map((competitor) => (
                    <td
                      key={`${competitor.id}-access`}
                      className={`px-4 py-4 ${
                        competitor.id === 'brujula-cripto' ? 'bg-green-50 dark:bg-green-900/20' : ''
                      }`}
                    >
                      {renderFeatureCell(
                        competitor.features.fullAccess,
                        competitor.id === 'brujula-cripto',
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-4 text-gray-900 dark:text-white">
                    {t('features.expertSupport')}
                  </td>
                  {competitors.map((competitor) => (
                    <td
                      key={`${competitor.id}-support`}
                      className={`px-4 py-4 ${
                        competitor.id === 'brujula-cripto' ? 'bg-green-50 dark:bg-green-900/20' : ''
                      }`}
                    >
                      {renderFeatureCell(
                        competitor.features.expertSupport,
                        competitor.id === 'brujula-cripto',
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-4 text-gray-900 dark:text-white">
                    {t('features.noSubscription')}
                  </td>
                  {competitors.map((competitor) => (
                    <td
                      key={`${competitor.id}-subscription`}
                      className={`px-4 py-4 ${
                        competitor.id === 'brujula-cripto' ? 'bg-green-50 dark:bg-green-900/20' : ''
                      }`}
                    >
                      {renderFeatureCell(
                        competitor.features.noSubscription,
                        competitor.id === 'brujula-cripto',
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Pricing Tab */}
        {activeTab === 'pricing' && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {competitors.map((competitor) => (
              <div
                key={competitor.id}
                className={`rounded-lg border-2 p-6 ${
                  competitor.id === 'brujula-cripto'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-700'
                }`}
              >
                <h3
                  className={`mb-4 text-xl font-semibold ${
                    competitor.id === 'brujula-cripto'
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {competitor.name}
                </h3>

                <div className="space-y-4">
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {competitor.id === 'brujula-cripto'
                        ? t('pricing.payPerUse')
                        : '20% de lo recuperado'}
                    </div>
                    {competitor.id !== 'brujula-cripto' && (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Solo pagan si encuentran fondos
                      </div>
                    )}
                  </div>

                  {competitor.limitations.length > 0 && (
                    <div>
                      <h4 className="mb-2 font-medium text-gray-900 dark:text-white">
                        {t('pricing.limitations')}
                      </h4>
                      <ul className="space-y-1">
                        {competitor.limitations.map((limitation, index) => (
                          <li
                            key={index}
                            className="flex items-start text-sm text-red-600 dark:text-red-400"
                          >
                            <span className="mr-2">•</span>
                            {limitation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {competitor.id === 'brujula-cripto' && (
                    <div className="space-y-2">
                      <div className="flex items-start text-sm text-green-600 dark:text-green-400">
                        <span className="mr-2">✓</span>
                        {t('pricing.advantages.noMonthlyFees')}
                      </div>
                      <div className="flex items-start text-sm text-green-600 dark:text-green-400">
                        <span className="mr-2">✓</span>
                        {t('pricing.advantages.fullPrivacy')}
                      </div>
                      <div className="flex items-start text-sm text-green-600 dark:text-green-400">
                        <span className="mr-2">✓</span>
                        {t('pricing.advantages.expertSupport')}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Calculator Tab */}
        {activeTab === 'calculator' && showCalculator && (
          <div className="mx-auto max-w-4xl">
            <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-700">
              <h3 className="mb-6 text-center text-xl font-semibold text-gray-900 dark:text-white">
                {t('calculator.title')}
              </h3>

              <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('calculator.monthlyAmount')}
                  </label>
                  <input
                    type="number"
                    value={calculatorValues.monthlyAmount}
                    onChange={(e) =>
                      setCalculatorValues((prev) => ({
                        ...prev,
                        monthlyAmount: Number(e.target.value),
                      }))
                    }
                    placeholder={t('calculator.monthlyAmountPlaceholder')}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('calculator.hoursPerMonth')}
                  </label>
                  <input
                    type="number"
                    value={calculatorValues.hoursPerMonth}
                    onChange={(e) =>
                      setCalculatorValues((prev) => ({
                        ...prev,
                        hoursPerMonth: Number(e.target.value),
                      }))
                    }
                    placeholder={t('calculator.hoursPerMonthPlaceholder')}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="rounded-lg border-2 border-green-500 bg-white p-6 dark:bg-gray-800">
                <h4 className="mb-4 text-center text-lg font-semibold text-green-600 dark:text-green-400">
                  {t('calculator.results.title')}
                </h4>

                <div className="grid grid-cols-1 gap-4 text-center md:grid-cols-3">
                  <div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      €{savings.monthly.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {t('calculator.results.monthlyDifference')}
                    </div>
                  </div>

                  <div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      €{savings.annual.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {t('calculator.results.annualSavings')}
                    </div>
                  </div>

                  <div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {savings.percentage.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {t('calculator.results.percentageSavings')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="mt-8 rounded-lg bg-blue-50 p-6 dark:bg-blue-900/20">
          <h3 className="mb-4 text-center text-lg font-semibold text-blue-900 dark:text-blue-100">
            {t('summary.title')}
          </h3>
          <p className="text-center text-blue-700 dark:text-blue-300">{t('summary.description')}</p>
        </div>
      </div>
    </div>
  );
}

export default CompetitorComparison;
