'use client';

import { useTranslations } from 'next-intl';

interface PaginationInfoProps {
  startItem: number;
  endItem: number;
  totalItems: number;
  compact: boolean;
  showItemCount: boolean;
  currentPage: number;
  totalPages: number;
}

export function PaginationInfo({
  startItem,
  endItem,
  totalItems,
  compact,
  showItemCount,
  currentPage,
  totalPages,
}: PaginationInfoProps): JSX.Element | null {
  const t = useTranslations('pagination');

  if (!showItemCount) {
    return null;
  }

  if (compact) {
    return (
      <div className="text-center text-xs text-gray-600 dark:text-gray-400">
        {t('page')} {currentPage} {t('of')} {totalPages}
      </div>
    );
  }

  return (
    <div className="text-center text-sm text-gray-600 dark:text-gray-400">
      {t('showing')} {startItem.toLocaleString()} - {endItem.toLocaleString()} {t('of')}{' '}
      {totalItems.toLocaleString()} {t('items')}
    </div>
  );
}
