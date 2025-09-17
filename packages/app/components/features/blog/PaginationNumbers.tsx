'use client';

import { Button } from '@/components/ui/Button';

interface PaginationNumbersProps {
  visiblePages: number[];
  currentPage: number;
  totalPages: number;
  compact: boolean;
  navigateToPage: (page: number) => void;
}

export function PaginationNumbers({
  visiblePages,
  currentPage,
  totalPages,
  compact,
  navigateToPage,
}: PaginationNumbersProps): JSX.Element {
  return (
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
  );
}
