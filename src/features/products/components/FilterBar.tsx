"use client";

import { Category, ProductSortOption } from "@/types";
import { Button, Input, Select } from "@/components/ui";

export interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  categories: Category[];
  sort: ProductSortOption;
  onSortChange: (value: ProductSortOption) => void;
  onOpenMobileFilter?: () => void;
  isFilterActive?: boolean;
  onResetFilters?: () => void;
}

export function FilterBar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  categories,
  sort,
  onSortChange,
  onOpenMobileFilter,
  isFilterActive = false,
  onResetFilters,
}: FilterBarProps) {
  const categoryOptions = [
    { value: "", label: "Semua Kategori" },
    ...categories.map((c) => ({
      value: c.slug,
      label: c.name,
    })),
  ];

  const sortOptions = [
    { value: "title_asc", label: "Nama (A - Z)" },
    { value: "title_desc", label: "Nama (Z - A)" },
    { value: "price_asc", label: "Harga: Termurah" },
    { value: "price_desc", label: "Harga: Termahal" },
    { value: "rating_desc", label: "Rating Tertinggi" },
  ];

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search input with left magnifying glass icon */}
        <div className="flex-1 min-w-60">
          <Input
            placeholder="Cari produk berdasarkan nama atau deskripsi..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            }
            rightIcon={
              search ? (
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  className="cursor-pointer text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  aria-label="Hapus teks pencarian"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              ) : undefined
            }
          />
        </div>

        {/* Desktop Filters: Category & Sort */}
        <div className="hidden md:flex items-center gap-2">
          <div className="w-48">
            <Select
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
              options={categoryOptions}
              aria-label="Pilih Kategori"
            />
          </div>

          <div className="w-48">
            <Select
              value={sort}
              onChange={(e) => onSortChange(e.target.value as ProductSortOption)}
              options={sortOptions}
              aria-label="Urutkan Produk"
            />
          </div>
        </div>

        {/* Mobile Filter & Reset Filters button */}
        <div className="flex items-center justify-between md:justify-end gap-2">
          {/* Mobile Filter Button */}
          <div className="md:hidden flex-1">
            <Button
              variant="outline"
              size="md"
              className="w-full"
              onClick={onOpenMobileFilter}
            >
              <div className="flex items-center gap-1">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                <span>Filter {category ? `(1)` : ""}</span>
              </div>
            </Button>
          </div>

          {/* Reset Filters button if filter active */}
          {isFilterActive && onResetFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetFilters}
              className="text-xs text-zinc-500 hover:text-zinc-800"
            >
              Reset
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
