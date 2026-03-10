import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalItems, limit = 5, onPageChange }) => {
  // Use Math.ceil to ensure any remainder items get their own final page
  const totalPages = Math.ceil(totalItems / limit) || 1;

  // Don't render pagination if there's only 1 page (or 0 items)
  if (totalPages <= 1) return null;

  return (
    <div id='Pagination' className="flex flex-col sm:flex-row items-center justify-between py-4 text-sm text-gray-700 mt-4 border-t border-gray-100">

      {/* Simple Text Info */}
      <div className="mb-4 sm:mb-0">
        Showing page <span className="font-medium text-black">{currentPage}</span> of <span className="font-medium text-black">{totalPages}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="flex items-center px-3 py-1.5 rounded-md hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors font-medium"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Previous
        </button>

        <span className="font-bold text-black px-3 py-1 bg-gray-100 rounded-md">
          {currentPage}
        </span>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="flex items-center px-3 py-1.5 rounded-md hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors font-medium"
        >
          Next <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>

    </div>
  );
};

export default Pagination;