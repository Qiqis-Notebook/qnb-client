// Icons
import {
  ChevronLeftIcon,
  ChevronsLeftIcon,
  ChevronRightIcon,
  ChevronsRightIcon,
} from "lucide-react";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

function Pagination({
  totalPages,
  currentPage,
  onPageChange,
}: PaginationProps) {
  const upperTotal = Math.ceil(totalPages);
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === upperTotal;

  const renderPageNumbers = () => {
    const pageNumbers = [];

    // Calculate the range of page numbers to display
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(upperTotal, currentPage + 2);

    // Adjust the range if there are fewer pages available
    if (upperTotal <= 5) {
      startPage = 1;
      endPage = upperTotal;
    } else if (currentPage <= 2) {
      endPage = 5;
    } else if (currentPage >= upperTotal - 2) {
      startPage = upperTotal - 4;
    }

    for (let i = startPage; i <= endPage; i++) {
      const isActive = i === currentPage;
      pageNumbers.push(
        <li key={i}>
          <button
            className={`btn-primary btn-square btn-sm btn ${
              isActive ? "bg-primary" : "btn-ghost"
            }`}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </button>
        </li>
      );
    }

    return pageNumbers;
  };

  const handlePageChange = (page: number) => {
    if (page <= upperTotal && page >= 1 && page !== currentPage) {
      onPageChange(page);
    }
  };

  if (upperTotal <= 1) return <></>;

  return (
    <div className="flex flex-col items-center justify-center">
      <nav className="mt-8 flex items-center justify-center">
        <ul className="flex space-x-2">
          <li>
            <button
              className={`btn-square btn-sm btn ${
                isFirstPage ? "btn-disabled" : "btn-ghost"
              }`}
              disabled={isFirstPage}
              onClick={() => handlePageChange(1)}
            >
              <ChevronsLeftIcon className="h-6 w-6" />
            </button>
          </li>
          <li>
            <button
              className={`btn-square btn-sm btn ${
                isFirstPage ? "btn-disabled" : "btn-ghost"
              }`}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </button>
          </li>
          {renderPageNumbers()}
          <li>
            <button
              className={`btn-square btn-sm btn ${
                isLastPage ? "btn-disabled" : "btn-ghost"
              }`}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <ChevronRightIcon className="h-6 w-6" />
            </button>
          </li>
          <li>
            <button
              className={`btn-square btn-sm btn ${
                isLastPage ? "btn-disabled" : "btn-ghost"
              }`}
              disabled={isLastPage}
              onClick={() => handlePageChange(upperTotal)}
            >
              <ChevronsRightIcon className="h-6 w-6" />
            </button>
          </li>
        </ul>
      </nav>
      <p className="mb-8">
        Page {currentPage} of {upperTotal}
      </p>
    </div>
  );
}

export default Pagination;
