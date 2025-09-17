'use client';

import { useState } from 'react';

import { Card } from '@/components/ui/Card';
import { useAuth } from '@/lib/auth/AuthProvider';

import { DashboardAccountTab } from './DashboardAccountTab';
import { ClockIcon, CreditCardIcon, UserIcon } from './DashboardIcons';
import { DashboardSubscriptionTab } from './DashboardSubscriptionTab';
import { DashboardTabs } from './DashboardTabs';
import { DashboardUsageTab } from './DashboardUsageTab';
import { useDashboardActions } from './hooks/useDashboardActions';
import { useDashboardTranslations } from './hooks/useDashboardTranslations';

interface UserDashboardProps {
  className?: string;
}

interface TabType {
  id: 'account' | 'usage' | 'subscription';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function UserDashboard({ className = '' }: UserDashboardProps): JSX.Element {
  const { user, userData } = useAuth();
  const { t, formatTime } = useDashboardTranslations();
  const { isLoading, handleSignOut, handleManageSubscription, handleDeleteAccount } =
    useDashboardActions();

  const [activeTab, setActiveTab] = useState<'account' | 'usage' | 'subscription'>('account');

  // CONFIGURACIÓN TABS
  const tabs: TabType[] = [
    { id: 'account', label: t('tabs.account'), icon: UserIcon },
    { id: 'usage', label: t('tabs.usage'), icon: ClockIcon },
    { id: 'subscription', label: t('tabs.subscription'), icon: CreditCardIcon },
  ];

  // LOADING STATE
  if (!user || !userData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  const handleDeleteAccountWithConfirm = (): Promise<void> => {
    return handleDeleteAccount(t('account.deleteConfirm'), t('account.deleteConfirmFinal'));
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${className}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              {t('welcome')} {userData.displayName || userData.email}
            </h1>
            {userData.isAdmin && (
              <div className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                {t('adminBadge')}
              </div>
            )}
          </div>

          {/* Tabs Navigation */}
          <DashboardTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Tab Content */}
          <Card className="bg-white shadow dark:bg-gray-800">
            {activeTab === 'account' && (
              <DashboardAccountTab
                userData={userData}
                isLoading={isLoading}
                onSignOut={handleSignOut}
                onDeleteAccount={handleDeleteAccountWithConfirm}
                t={t}
              />
            )}

            {activeTab === 'usage' && (
              <DashboardUsageTab
                usageCreditsInSeconds={userData.usageCreditsInSeconds}
                formatTime={formatTime}
                isLoading={isLoading}
                t={t}
              />
            )}

            {activeTab === 'subscription' && (
              <DashboardSubscriptionTab
                usageCreditsInSeconds={userData.usageCreditsInSeconds}
                isLoading={isLoading}
                onManageSubscription={handleManageSubscription}
                t={t}
              />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
