'use client';

import { Button } from '@/components/ui/Button';

import { ClockIcon, CreditCardIcon } from './DashboardIcons';

interface DashboardUsageTabProps {
  usageCreditsInSeconds: number;
  formatTime: (seconds: number) => string;
  isLoading: boolean;
  t: (key: string) => string;
}

export function DashboardUsageTab({
  usageCreditsInSeconds,
  formatTime,
  isLoading,
  t,
}: DashboardUsageTabProps): JSX.Element {
  return (
    <div className="p-6">
      <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
        {t('usage.title')}
      </h2>

      <div className="space-y-6">
        {/* Credits Status */}
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="text-center">
              <ClockIcon className="mx-auto h-8 w-8 text-blue-600 dark:text-blue-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                {t('usage.timeRemaining')}
              </h3>
              <p className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatTime(usageCreditsInSeconds)}
              </p>
            </div>

            <div className="text-center">
              <CreditCardIcon className="mx-auto h-8 w-8 text-green-600 dark:text-green-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                {t('usage.totalCredits')}
              </h3>
              <p className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">
                {formatTime(usageCreditsInSeconds)}
              </p>
            </div>
          </div>

          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            {t('usage.description')}
          </p>
        </div>

        {/* Action */}
        <div className="text-center">
          <Button
            onClick={() => (window.location.href = '/suscripcion')}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {t('usage.buyMore')}
          </Button>
        </div>
      </div>
    </div>
  );
}
