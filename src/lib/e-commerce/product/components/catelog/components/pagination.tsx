import { cn } from "@/lib/utils";

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
  classNames?: {
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
  classNames = {},
}: PaginationProps) {
  const totalPages = Math.max(0, Math.ceil(total / pageSize));

  const defaultPage = (pageNum: number, isActive: boolean) => (
    <button
      key={pageNum}
      onClick={() => onChange(pageNum)}
      className={cn("px-3 py-1 rounded",classNames.page, isActive ? cn(`bg-gray-200 font-semibold`, classNames.activePage) : "", cn("px-3 py-1 rounded disabled:opacity-40", classNames.pageButton))}
      aria-current={isActive ? "page" : undefined}
    >
      {pageNum}
    </button>
  );

  return (
    <div className={cn("flex items-center justify-center gap-2 p-3", classNames.container)}>
      {/* Summary */}
      {show?.summary && (
        <span className={cn(classNames.summary, "text-sm text-gray-600 mr-3")}>
          Showing {(page - 1) * pageSize + 1}–
          {Math.min(page * pageSize, total)} of {total}
        </span>
      )}

      {/* Page-size selector */}
      {show?.pageSize && (
        customRender.renderPageSize || (
          <select
            className={cn("rounded px-2 py-1 text-sm mr-3", classNames.pageSizeSelect)}
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
            className={cn(`${classNames.prevNext} ${page === 1 ? cn("opacity-40", classNames.disabled) : ""}`.trim())}
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
            className={`${classNames.prevNext} ${page === totalPages ? classNames.disabled : ""}`.trim()}
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
