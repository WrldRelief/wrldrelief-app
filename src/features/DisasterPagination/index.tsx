"use client";

import { Button } from "@worldcoin/mini-apps-ui-kit-react";
import { useMemo, useState } from "react";

export interface UsePaginationProps {
  totalItems: number;
  itemsPerPage?: number;
  initialPage?: number;
}

export interface UsePaginationResult {
  currentPage: number;
  totalPages: number;
  paginatedItems: number[];
  setCurrentPage: (page: number) => void;
  handlePageChange: (page: number) => void;
  currentPageItems: number[];
  PaginationControls: React.FC;
}

export const usePagination = <T,>({
  totalItems,
  itemsPerPage = 5,
  initialPage = 1,
}: UsePaginationProps): UsePaginationResult => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Generate array of page numbers
  const paginatedItems = useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [totalPages]);

  // Calculate current page items indices
  const currentPageItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return Array.from({ length: end - start }, (_, i) => start + i);
  }, [currentPage, itemsPerPage]);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(Math.max(1, Math.min(pageNumber, totalPages)));
  };

  // Simplified pagination controls component
  const PaginationControls: React.FC = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-between items-center mt-4 mb-6">
        <Button
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          aria-label="Previous page"
          variant="secondary"
          size="sm"
        >
          Previous
        </Button>
        
        <span className="text-sm font-medium">
          {currentPage} / {totalPages}
        </span>
        
        <Button
          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          variant="secondary"
          size="sm"
        >
          Next
        </Button>
      </div>
    );
  };

  return {
    currentPage,
    totalPages,
    paginatedItems,
    setCurrentPage,
    handlePageChange,
    currentPageItems,
    PaginationControls,
  };
};
