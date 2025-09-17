'use client';

import { usePaginationLogic } from './hooks/usePaginationLogic';
import { PaginationInfo } from './PaginationInfo';
import { PaginationJumpToPage } from './PaginationJumpToPage';
import { PaginationEndButtons, PaginationNavigationButtons } from './PaginationNavigationButtons';
import { PaginationNumbers } from './PaginationNumbers';

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
  const { startItem, endItem, visiblePages, navigateToPage } = usePaginationLogic({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    baseUrl,
    maxVisiblePages,
  });

  // No mostrar paginación si solo hay una página
  if (totalPages <= 1) {
    return <></>;
  }

  return (
    <div className={`flex flex-col ${compact ? 'space-y-2' : 'space-y-4'}`}>
      {/* Información de items */}
      {!compact && (
        <PaginationInfo
          startItem={startItem}
          endItem={endItem}
          totalItems={totalItems}
          compact={compact}
          showItemCount={showItemCount}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      )}

      {/* Controles de navegación */}
      <div className={`flex items-center justify-center ${compact ? 'space-x-1' : 'space-x-2'}`}>
        <PaginationNavigationButtons
          currentPage={currentPage}
          totalPages={totalPages}
          compact={compact}
          navigateToPage={navigateToPage}
        />

        {/* Números de página */}
        {showPageNumbers && (
          <PaginationNumbers
            visiblePages={visiblePages}
            currentPage={currentPage}
            totalPages={totalPages}
            compact={compact}
            navigateToPage={navigateToPage}
          />
        )}

        <PaginationEndButtons
          currentPage={currentPage}
          totalPages={totalPages}
          compact={compact}
          navigateToPage={navigateToPage}
        />
      </div>

      {/* Información compacta para móvil */}
      {compact && (
        <PaginationInfo
          startItem={startItem}
          endItem={endItem}
          totalItems={totalItems}
          compact={compact}
          showItemCount={showItemCount}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      )}

      {/* Salto directo a página (solo en modo no compacto) */}
      {!compact && (
        <PaginationJumpToPage
          currentPage={currentPage}
          totalPages={totalPages}
          navigateToPage={navigateToPage}
        />
      )}
    </div>
  );
}

export default PaginationControls;
