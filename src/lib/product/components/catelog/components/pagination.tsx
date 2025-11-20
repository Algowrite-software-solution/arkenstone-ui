import React from "react";

export interface PaginationProps {
  /** Current page number (1-indexed) */
  page: number;

  /** Total items available */
  total: number;

  /** Page size (items per page) */
  pageSize: number;

  /** Change handler */
  onChange: (page: number) => void;

  /** Optional customizations */
  showArrows?: boolean;
  showPages?: boolean;
  showSummary?: boolean;
  showPageSize?: boolean;

  /** Custom render overrides */
  renderPrev?: React.ReactNode;
  renderNext?: React.ReactNode;
  renderPage?: (page: number, isActive: boolean) => React.ReactNode;
  renderPageSize?: React.ReactNode;

  /** Styling */
  className?: string;
}

export function Pagination({
  page,
  total,
  pageSize,
  onChange,

  showArrows = true,
  showPages = true,
  showSummary = false,
  showPageSize = false,

  renderPrev,
  renderNext,
  renderPage,
  renderPageSize,

  className,
}: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize);

  const defaultPage = (pageNum: number, isActive: boolean) => (
    <button
      key={pageNum}
      onClick={() => onChange(pageNum)}
      className={`px-3 py-1 border rounded ${
        isActive ? "bg-gray-200 font-semibold" : ""
      }`}
    >
      {pageNum}
    </button>
  );

  return (
    <div
      className={`flex items-center justify-center gap-2 p-3 ${className || ""}`}
    >
      {/* Summary */}
      {showSummary && (
        <span className="text-sm text-gray-600 mr-3">
          Showing {(page - 1) * pageSize + 1}–
          {Math.min(page * pageSize, total)} of {total}
        </span>
      )}

      {/* Page-size selector */}
      {showPageSize && (
        renderPageSize || (
          <select className="border rounded px-2 py-1 text-sm mr-3">
            <option>10</option>
            <option>25</option>
            <option>50</option>
            <option>100</option>
          </select>
        )
      )}

      {/* Prev button */}
      {showArrows &&
        (renderPrev || (
          <button
            className="px-3 py-1 border rounded disabled:opacity-40"
            disabled={page === 1}
            onClick={() => onChange(page - 1)}
          >
            Prev
          </button>
        ))}

      {/* Page numbers */}
      {showPages &&
        Array.from({ length: totalPages }, (_, i) => {
          const p = i + 1;
          const isActive = p === page;
          return renderPage
            ? renderPage(p, isActive)
            : defaultPage(p, isActive);
        })}

      {/* Next button */}
      {showArrows &&
        (renderNext || (
          <button
            className="px-3 py-1 border rounded disabled:opacity-40"
            disabled={page === totalPages}
            onClick={() => onChange(page + 1)}
          >
            Next
          </button>
        ))}
    </div>
  );
}
