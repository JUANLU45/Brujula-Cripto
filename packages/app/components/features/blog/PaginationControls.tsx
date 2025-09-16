'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/Button';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  baseUrl?: string;
  showItemCount?: boolean;
  showPageNumbers?: boolean;
  maxVisiblePages?: number;
  compact?: boolean;
}

export function PaginationControls({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  baseUrl = '',
  showItemCount = true,
  showPageNumbers = true,
  maxVisiblePages = 5,
  compact = false,
}: PaginationControlsProps): JSX.Element {
  const t = useTranslations('pagination');
  const router = useRouter();
  const searchParams = useSearchParams();

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const createPageUrl = (page: number): string => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  const navigateToPage = (page: number): void => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      router.push(createPageUrl(page));
    }
  };

  const getVisiblePages = (): number[] => {
    const halfVisible = Math.floor(maxVisiblePages / 2);
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);

    // Ajustar si estamos cerca del inicio o final
    if (endPage - startPage + 1 < maxVisiblePages) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      } else if (endPage === totalPages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  // No mostrar paginación si solo hay una página
  if (totalPages <= 1) {
    return <></>;
  }

  const visiblePages = getVisiblePages();

  return (
    <div className={`flex flex-col ${compact ? 'space-y-2' : 'space-y-4'}`}>
      {/* Información de items */}
      {showItemCount && !compact && (
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          {t('showing')} {startItem.toLocaleString()} - {endItem.toLocaleString()} {t('of')}{' '}
          {totalItems.toLocaleString()} {t('items')}
        </div>
      )}

      {/* Controles de navegación */}
      <div className={`flex items-center justify-center ${compact ? 'space-x-1' : 'space-x-2'}`}>
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
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          {!compact && <span>{t('previous')}</span>}
        </Button>

        {/* Números de página */}
        {showPageNumbers && (
          <div className="flex items-center space-x-1">
            {/* Elipsis inicial */}
            {visiblePages[0] > 1 && (
              <>
                <Button
                  onClick={() => navigateToPage(1)}
                  variant="outline"
                  size={compact ? 'sm' : 'default'}
                  className={`${compact ? 'h-8 w-8' : 'h-10 w-10'} p-0`}
                >
                  1
                </Button>
                {visiblePages[0] > 2 && (
                  <span className="px-2 text-gray-500 dark:text-gray-400">...</span>
                )}
              </>
            )}

            {/* Páginas visibles */}
            {visiblePages.map((page) => (
              <Button
                key={page}
                onClick={() => navigateToPage(page)}
                variant={page === currentPage ? 'default' : 'outline'}
                size={compact ? 'sm' : 'default'}
                className={`${compact ? 'h-8 w-8' : 'h-10 w-10'} p-0 ${
                  page === currentPage
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {page}
              </Button>
            ))}

            {/* Elipsis final */}
            {visiblePages[visiblePages.length - 1] < totalPages && (
              <>
                {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                  <span className="px-2 text-gray-500 dark:text-gray-400">...</span>
                )}
                <Button
                  onClick={() => navigateToPage(totalPages)}
                  variant="outline"
                  size={compact ? 'sm' : 'default'}
                  className={`${compact ? 'h-8 w-8' : 'h-10 w-10'} p-0`}
                >
                  {totalPages}
                </Button>
              </>
            )}
          </div>
        )}

        {/* Botón Siguiente */}
        <Button
          onClick={() => navigateToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          variant="outline"
          size={compact ? 'sm' : 'default'}
          className="flex items-center space-x-1"
        >
          {!compact && <span>{t('next')}</span>}
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
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
      </div>

      {/* Información compacta para móvil */}
      {compact && showItemCount && (
        <div className="text-center text-xs text-gray-600 dark:text-gray-400">
          {t('page')} {currentPage} {t('of')} {totalPages}
        </div>
      )}

      {/* Salto directo a página (solo en modo no compacto) */}
      {!compact && totalPages > 10 && (
        <div className="flex items-center justify-center space-x-2 text-sm">
          <span className="text-gray-600 dark:text-gray-400">{t('goToPage')}:</span>
          <input
            type="number"
            min={1}
            max={totalPages}
            placeholder={currentPage.toString()}
            className="w-16 rounded border border-gray-300 bg-white px-2 py-1 text-center text-xs text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                const page = parseInt((e.target as HTMLInputElement).value);
                if (page >= 1 && page <= totalPages) {
                  navigateToPage(page);
                }
              }
            }}
          />
          <Button
            size="sm"
            variant="outline"
            className="px-2 py-1 text-xs"
            onClick={(e) => {
              const input = (e.target as HTMLElement).parentElement?.querySelector('input');
              if (input) {
                const page = parseInt(input.value);
                if (page >= 1 && page <= totalPages) {
                  navigateToPage(page);
                }
              }
            }}
          >
            {t('go')}
          </Button>
        </div>
      )}
    </div>
  );
}

export default PaginationControls;
