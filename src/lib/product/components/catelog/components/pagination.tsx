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
  show?: {
    arrows?: boolean;
    pages?: boolean;
    summary?: boolean;
    pageSize?: boolean;
  }

  /** Custom render overrides */
  customRender?: {
    renderPrev?: React.ReactNode;
    renderNext?: React.ReactNode;
    renderPage?: (page: number, isActive: boolean) => React.ReactNode;
    renderPageSize?: React.ReactNode;
  }
  /** Styling */
  className?: {
    container?: string;
    summary?: string;
    page?: string;
    activePage?: string;
    prevNext?: string;
    pageSizeSelect?: string;
    pageButton?: string;
    disabled?: string;
  }
}

export function Pagination({
  page,
  total,
  pageSize,
  onChange,

  show = {
    arrows: true,
    pages: true,
    summary: true,
    pageSize: false,
  },

  customRender = {
    renderPrev: undefined,
    renderNext: undefined,
    renderPage: undefined,
    renderPageSize: undefined,
  },

  // styling props with sensible defaults
  className = {
    container : "flex items-center justify-center gap-2 p-3",
    summary : "text-sm text-gray-600 mr-3",
    page : "px-3 py-1 border rounded",
    activePage : "bg-gray-200 font-semibold",
    prevNext : "px-3 py-1 border rounded disabled:opacity-40",
    pageSizeSelect : "border rounded px-2 py-1 text-sm mr-3",
    pageButton : "", // extra wrapper for page button if needed
    disabled : "opacity-40",
  }
  
}: PaginationProps) {
  const totalPages = Math.max(0, Math.ceil(total / pageSize));

  const defaultPage = (pageNum: number, isActive: boolean) => (
    <button
      key={pageNum}
      onClick={() => onChange(pageNum)}
      className={`${className.page} ${isActive ? className.activePage : ""} ${className.pageButton}`.trim()}
      aria-current={isActive ? "page" : undefined}
    >
      {pageNum}
    </button>
  );

  return (
    <div className={className.container}>
      {/* Summary */}
      {show?.summary && (
        <span className={className.summary}>
          Showing {(page - 1) * pageSize + 1}–
          {Math.min(page * pageSize, total)} of {total}
        </span>
      )}

      {/* Page-size selector */}
      {show?.pageSize && (
        customRender.renderPageSize || (
          <select
            className={className.pageSizeSelect}
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
      {show?.arrows &&
        (customRender.renderPrev || (
          <button
            className={`${className.prevNext} ${page === 1 ? className.disabled : ""}`.trim()}
            disabled={page === 1}
            onClick={() => onChange(Math.max(1, page - 1))}
            aria-label="Previous page"
          >
            Prev
          </button>
        ))}

      {/* Page numbers */}
      {show?.pages &&
        Array.from({ length: totalPages }, (_, i) => {
          const p = i + 1;
          const isActive = p === page;
          return customRender.renderPage ? customRender.renderPage(p, isActive) : defaultPage(p, isActive);
        })}

      {/* Next button */}
      {show?.arrows &&
        (customRender.renderNext || (
          <button
            className={`${className.prevNext} ${page === totalPages ? className.disabled : ""}`.trim()}
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
