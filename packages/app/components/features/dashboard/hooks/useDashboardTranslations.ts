'use client';

import { useTranslations } from 'next-intl';

interface UseDashboardTranslationsReturn {
  t: (key: string, values?: Record<string, string | number>) => string;
  formatTime: (seconds: number) => string;
}

export function useDashboardTranslations(): UseDashboardTranslationsReturn {
  const t = useTranslations('dashboard.account');

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return t('usage.hoursFormat', { hours, minutes, seconds: remainingSeconds });
  };

  return {
    t,
    formatTime,
  };
}
