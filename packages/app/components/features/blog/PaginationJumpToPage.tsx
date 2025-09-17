'use client';

import { Button } from '@/components/ui/Button';
import { useTranslations } from 'next-intl';

interface PaginationJumpToPageProps {
  currentPage: number;
  totalPages: number;
  navigateToPage: (page: number) => void;
}

export function PaginationJumpToPage({
  currentPage,
  totalPages,
  navigateToPage,
}: PaginationJumpToPageProps): JSX.Element | null {
  const t = useTranslations('pagination');

  if (totalPages <= 10) {
    return null;
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      const page = parseInt((e.target as HTMLInputElement).value);
      if (page >= 1 && page <= totalPages) {
        navigateToPage(page);
      }
    }
  };

  const handleGoClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    const input = (e.target as HTMLElement).parentElement?.querySelector('input');
    if (input) {
      const page = parseInt(input.value);
      if (page >= 1 && page <= totalPages) {
        navigateToPage(page);
      }
    }
  };

  return (
    <div className="flex items-center justify-center space-x-2 text-sm">
      <span className="text-gray-600 dark:text-gray-400">{t('goToPage')}:</span>
      <input
        type="number"
        min={1}
        max={totalPages}
        placeholder={currentPage.toString()}
        className="w-16 rounded border border-gray-300 bg-white px-2 py-1 text-center text-xs text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        onKeyPress={handleKeyPress}
      />
      <Button size="sm" variant="outline" className="px-2 py-1 text-xs" onClick={handleGoClick}>
        {t('go')}
      </Button>
    </div>
  );
}
