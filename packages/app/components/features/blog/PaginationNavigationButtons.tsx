'use client';

import { Button } from '@/components/ui/Button';
import { useTranslations } from 'next-intl';
import { ChevronLeftIcon, ChevronRightIcon } from './PaginationIcons';

interface PaginationNavigationButtonsProps {
  currentPage: number;
  totalPages: number;
  compact: boolean;
  navigateToPage: (page: number) => void;
}

export function PaginationNavigationButtons({
  currentPage,
  totalPages,
  compact,
  navigateToPage,
}: PaginationNavigationButtonsProps): JSX.Element {
  const t = useTranslations('pagination');

  return (
    <>
      {/* Botón Primera página */}
      {!compact && currentPage > 2 && (
        <Button
          onClick={() => navigateToPage(1)}
          disabled={currentPage === 1}
          variant="outline"
          size={compact ? 'sm' : 'default'}
          className="hidden sm:inline-flex"
        >
          {t('first')}
        </Button>
      )}

      {/* Botón Anterior */}
      <Button
        onClick={() => navigateToPage(currentPage - 1)}
        disabled={currentPage === 1}
        variant="outline"
        size={compact ? 'sm' : 'default'}
        className="flex items-center space-x-1"
      >
        <ChevronLeftIcon />
        {!compact && <span>{t('previous')}</span>}
      </Button>
    </>
  );
}

interface PaginationEndButtonsProps {
  currentPage: number;
  totalPages: number;
  compact: boolean;
  navigateToPage: (page: number) => void;
}

export function PaginationEndButtons({
  currentPage,
  totalPages,
  compact,
  navigateToPage,
}: PaginationEndButtonsProps): JSX.Element {
  const t = useTranslations('pagination');

  return (
    <>
      {/* Botón Siguiente */}
      <Button
        onClick={() => navigateToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        variant="outline"
        size={compact ? 'sm' : 'default'}
        className="flex items-center space-x-1"
      >
        {!compact && <span>{t('next')}</span>}
        <ChevronRightIcon />
      </Button>

      {/* Botón Última página */}
      {!compact && currentPage < totalPages - 1 && (
        <Button
          onClick={() => navigateToPage(totalPages)}
          disabled={currentPage === totalPages}
          variant="outline"
          size={compact ? 'sm' : 'default'}
          className="hidden sm:inline-flex"
        >
          {t('last')}
        </Button>
      )}
    </>
  );
}
