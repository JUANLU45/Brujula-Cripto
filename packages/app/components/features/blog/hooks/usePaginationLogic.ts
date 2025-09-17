'use client';

import { useMemo } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

interface UsePaginationLogicProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  baseUrl: string;
  maxVisiblePages: number;
}

interface UsePaginationLogicReturn {
  startItem: number;
  endItem: number;
  visiblePages: number[];
  navigateToPage: (page: number) => void;
}

export function usePaginationLogic({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  baseUrl,
  maxVisiblePages,
}: UsePaginationLogicProps): UsePaginationLogicReturn {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { startItem, endItem } = useMemo(
    () => ({
      startItem: (currentPage - 1) * itemsPerPage + 1,
      endItem: Math.min(currentPage * itemsPerPage, totalItems),
    }),
    [currentPage, itemsPerPage, totalItems],
  );

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

  const visiblePages = useMemo(() => {
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
  }, [currentPage, totalPages, maxVisiblePages]);

  return {
    startItem,
    endItem,
    visiblePages,
    navigateToPage,
  };
}
