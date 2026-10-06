import { Button } from "./Button";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  disabled?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage = 10,
  disabled = false,
}: PaginationProps) {
  if (totalPages <= 1 && !totalItems) return null;

  const startItem = totalItems !== undefined ? (currentPage - 1) * itemsPerPage + 1 : undefined;
  const endItem =
    totalItems !== undefined
      ? Math.min(currentPage * itemsPerPage, totalItems)
      : undefined;

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-1"
    >
      <div className="text-sm text-zinc-600 dark:text-zinc-400">
        {totalItems !== undefined && startItem !== undefined && endItem !== undefined ? (
          <span>
            Menampilkan <span className="font-semibold text-zinc-900 dark:text-zinc-100">{startItem}</span> sampai{" "}
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">{endItem}</span> dari{" "}
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">{totalItems}</span> hasil
          </span>
        ) : (
          <span>
            Halaman <span className="font-semibold text-zinc-900 dark:text-zinc-100">{currentPage}</span> dari{" "}
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">{totalPages || 1}</span>
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={disabled || currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Halaman sebelumnya"
          leftIcon={
            <svg
              className="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          }
        >
          Sebelumnya
        </Button>

        <span className="px-2 text-xs font-medium text-zinc-500">
          {currentPage} / {Math.max(totalPages, 1)}
        </span>

        <Button
          variant="outline"
          size="sm"
          disabled={disabled || currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Halaman berikutnya"
          rightIcon={
            <svg
              className="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          }
        >
          Berikutnya
        </Button>
      </div>
    </nav>
  );
}
