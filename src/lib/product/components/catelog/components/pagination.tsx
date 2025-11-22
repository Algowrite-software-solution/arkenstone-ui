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

  /** Styling (new) */
  containerClassName?: string;
  summaryClassName?: string;
  pageClassName?: string;
  activePageClassName?: string;
  prevNextClassName?: string;
  pageSizeSelectClassName?: string;
  pageButtonClassName?: string;
  disabledClassName?: string;
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

  // styling props with sensible defaults
  containerClassName = "flex items-center justify-center gap-2 p-3",
  summaryClassName = "text-sm text-gray-600 mr-3",
  pageClassName = "px-3 py-1 border rounded",
  activePageClassName = "bg-gray-200 font-semibold",
  prevNextClassName = "px-3 py-1 border rounded disabled:opacity-40",
  pageSizeSelectClassName = "border rounded px-2 py-1 text-sm mr-3",
  pageButtonClassName = "", // extra wrapper for page button if needed
  disabledClassName = "opacity-40",
}: PaginationProps) {
  const totalPages = Math.max(0, Math.ceil(total / pageSize));

  const defaultPage = (pageNum: number, isActive: boolean) => (
    <button
      key={pageNum}
      onClick={() => onChange(pageNum)}
      className={`${pageClassName} ${isActive ? activePageClassName : ""} ${pageButtonClassName}`.trim()}
      aria-current={isActive ? "page" : undefined}
    >
      {pageNum}
    </button>
  );

  return (
    <div className={containerClassName}>
      {/* Summary */}
      {showSummary && (
        <span className={summaryClassName}>
          Showing {(page - 1) * pageSize + 1}–
          {Math.min(page * pageSize, total)} of {total}
        </span>
      )}

      {/* Page-size selector */}
      {showPageSize && (
        renderPageSize || (
          <select
            className={pageSizeSelectClassName}
            aria-label="Select page size"
            // NOTE: this is UI only; handle changes externally if you wire up a handler
            onChange={() => {}}
          >
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
            className={`${prevNextClassName} ${page === 1 ? disabledClassName : ""}`.trim()}
            disabled={page === 1}
            onClick={() => onChange(Math.max(1, page - 1))}
            aria-label="Previous page"
          >
            Prev
          </button>
        ))}

      {/* Page numbers */}
      {showPages &&
        Array.from({ length: totalPages }, (_, i) => {
          const p = i + 1;
          const isActive = p === page;
          return renderPage ? renderPage(p, isActive) : defaultPage(p, isActive);
        })}

      {/* Next button */}
      {showArrows &&
        (renderNext || (
          <button
            className={`${prevNextClassName} ${page === totalPages ? disabledClassName : ""}`.trim()}
            disabled={page === totalPages}
            onClick={() => onChange(Math.min(totalPages || 1, page + 1))}
            aria-label="Next page"
          >
            Next
          </button>
        ))}
    </div>
  );
}
