'use client';

import { Button } from '@/components/ui/Button';

interface DashboardSubscriptionTabProps {
  usageCreditsInSeconds: number;
  isLoading: boolean;
  onManageSubscription: () => Promise<void>;
  t: (key: string) => string;
}

export function DashboardSubscriptionTab({
  usageCreditsInSeconds,
  isLoading,
  onManageSubscription,
  t,
}: DashboardSubscriptionTabProps): JSX.Element {
  const hasActiveSubscription = usageCreditsInSeconds > 0;

  return (
    <div className="p-6">
      <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
        {t('subscription.title')}
      </h2>

      <div className="space-y-6">
        {/* Subscription Status */}
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {hasActiveSubscription ? t('subscription.premium') : t('subscription.free')}
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {hasActiveSubscription
                  ? t('subscription.premiumDescription')
                  : t('subscription.freeDescription')}
              </p>
            </div>
            <div
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                hasActiveSubscription
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
              }`}
            >
              {hasActiveSubscription ? t('subscription.active') : t('subscription.inactive')}
            </div>
          </div>
        </div>

        {/* Actions */}
        {hasActiveSubscription ? (
          <Button
            onClick={() => void onManageSubscription()}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {t('subscription.manageSubscription')}
          </Button>
        ) : (
          <Button
            onClick={() => (window.location.href = '/suscripcion')}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {t('subscription.upgrade')}
          </Button>
        )}
      </div>
    </div>
  );
}
