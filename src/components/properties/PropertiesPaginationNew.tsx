import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalResults?: number;
  resultsPerPage?: number;
}

export const PropertiesPaginationNew: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalResults,
  resultsPerPage
}) => {
  // Generate array of page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    
    // Always show first page
    pages.push(1);
    
    // Add ellipsis if needed
    if (currentPage > 3) {
      pages.push('ellipsis1');
    }
    
    // Add pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i > 1 && i < totalPages) {
        pages.push(i);
      }
    }
    
    // Add ellipsis if needed
    if (currentPage < totalPages - 2) {
      pages.push('ellipsis2');
    }
    
    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderPageButton = (page: number | string, index: number) => {
    if (page === 'ellipsis1' || page === 'ellipsis2') {
      return (
        <div key={`ellipsis-${index}`} className="flex items-center justify-center w-10 h-10">
          <MoreHorizontal className="w-5 h-5 text-gray-500" />
        </div>
      );
    }
    
    const pageNum = page as number;
    const isCurrentPage = pageNum === currentPage;
    
    return (
      <Button
        key={pageNum}
        onClick={() => handlePageChange(pageNum)}
        variant={isCurrentPage ? "default" : "outline"}
        className={`w-10 h-10 p-0 ${
          isCurrentPage 
            ? 'bg-black text-white hover:bg-gray-800' 
            : 'border-gray-200 text-gray-700 hover:bg-gray-100'
        }`}
      >
        {pageNum}
      </Button>
    );
  };

  // Don't show pagination if there's only one page
  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between">
      <div className="flex items-center gap-2 mb-4 sm:mb-0">
        {totalResults !== undefined && resultsPerPage !== undefined && (
          <p className="text-sm text-gray-500">
            Показва {Math.min((currentPage - 1) * resultsPerPage + 1, totalResults)} до {Math.min(currentPage * resultsPerPage, totalResults)} от {totalResults} резултата
          </p>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          variant="outline"
          className="h-10 w-10 p-0 border-gray-200 text-gray-700 disabled:opacity-50"
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-2">
          {getPageNumbers().map((page, index) => renderPageButton(page, index))}
        </div>
        
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          variant="outline"
          className="h-10 w-10 p-0 border-gray-200 text-gray-700 disabled:opacity-50"
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PropertiesPaginationNew; 