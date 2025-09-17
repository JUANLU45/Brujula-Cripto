'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface UserData {
  email: string;
  createdAt: Date;
}

interface DashboardAccountTabProps {
  userData: UserData;
  isLoading: boolean;
  onSignOut: () => Promise<void>;
  onDeleteAccount: () => Promise<void>;
  t: (key: string) => string;
}

export function DashboardAccountTab({
  userData,
  isLoading,
  onSignOut,
  onDeleteAccount,
  t,
}: DashboardAccountTabProps): JSX.Element {
  return (
    <div className="p-6">
      <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
        {t('account.title')}
      </h2>

      <div className="space-y-6">
        {/* User Info */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('account.email')}
            </label>
            <Input
              type="email"
              value={userData.email}
              disabled
              className="bg-gray-50 dark:bg-gray-700"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('account.createdAt')}
            </label>
            <Input
              type="text"
              value={userData.createdAt.toLocaleDateString()}
              disabled
              className="bg-gray-50 dark:bg-gray-700"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Button
              onClick={() => void onSignOut()}
              variant="outline"
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {t('account.signOut')}
            </Button>

            <Button
              onClick={() => void onDeleteAccount()}
              variant="outline"
              disabled={isLoading}
              className="w-full border-red-300 text-red-700 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20 sm:w-auto"
            >
              {t('account.deleteAccount')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
