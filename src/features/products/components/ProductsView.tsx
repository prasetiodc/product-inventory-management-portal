"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Product } from "@/types";
import {
  Button,
  Skeleton,
  EmptyState,
  Pagination,
} from "@/components/ui";
import { ProductTable } from "./ProductTable";
import { ProductCard } from "./ProductCard";
import { FilterBar } from "./FilterBar";
import { ProductDetailPanel } from "./ProductDetailPanel";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import EditProductModal from "./EditProductModal";
import FilterDrawer from "./FilterDrawer";
import {
  useProductFilters,
  useSyncFiltersToUrl,
  useProductsList,
} from "../hooks";

export interface ProductsViewProps {
  forcedState?: "normal" | "loading" | "empty" | "error" | "pending";
}

export function ProductsView({ forcedState = "normal" }: ProductsViewProps = {}) {
  // Sync Redux <-> URL query params
  useSyncFiltersToUrl();

  const {
    search,
    category,
    sort,
    page,
    view,
    setSearch,
    setCategory,
    setSort,
    setPage,
    setView,
    resetFilters,
    isFilterActive,
  } = useProductFilters();

  const {
    products,
    totalItems,
    totalPages,
    itemsPerPage,
    isLoading,
    isFetching,
    isError,
    refetch,
    categories,
  } = useProductsList();

  // Handle debounced search without syncing in render/effect bodies.
  const [localSearch, setLocalSearch] = useState(search);
  const [previousSearch, setPreviousSearch] = useState(search);
  if (search !== previousSearch) {
    setPreviousSearch(search);
    setLocalSearch(search);
  }
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleSearchChange = (value: string) => {
    setLocalSearch(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setSearch(value);
    }, 300);
  };

  // Selected product for detail slide-over
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Edit and Delete modals
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState({ title: "", price: 0, stock: 0 });

  // Mobile filter drawer
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setEditForm({ title: p.title, price: p.price, stock: p.stock });
  };

  const handleResetFilters = () => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }

    setLocalSearch("");
    resetFilters();
  };

  const pendingProductIds =
    forcedState === "pending" ? [products[0]?.id].filter(Boolean) : [];

  const showLoading =
    forcedState === "loading" ||
    (forcedState === "normal" && (isLoading || isFetching));
  const showError = forcedState === "error" || (forcedState === "normal" && isError);
  const showEmpty =
    forcedState === "empty" ||
    (!showLoading && !showError && !isLoading && !isFetching && products.length === 0);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Daftar Produk
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Kelola inventori, pantau stok, dan ubah data produk secara langsung.
          </p>
        </div>
        <Link href="/products/new">
          <Button
            variant="primary"
            size="md"
            leftIcon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            Tambah Produk
          </Button>
        </Link>
      </div>

      {/* Filter Bar */}
      <FilterBar
        search={localSearch}
        onSearchChange={handleSearchChange}
        category={category}
        onCategoryChange={setCategory}
        categories={categories}
        sort={sort}
        onSortChange={setSort}
        view={view}
        onViewChange={setView}
        onOpenMobileFilter={() => setIsMobileFilterOpen(true)}
        isFilterActive={isFilterActive}
        onResetFilters={handleResetFilters}
      />

      {/* Content */}
      {showLoading ? (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900 space-y-3">
          <Skeleton variant="text" className="h-8 w-1/4" />
          <div className="space-y-2 pt-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-2">
                <Skeleton variant="circular" width={48} height={48} />
                <div className="flex-1 space-y-2">
                  <Skeleton variant="text" className="h-4 w-1/3" />
                  <Skeleton variant="text" className="h-3 w-1/4" />
                </div>
                <Skeleton variant="rectangular" width={80} height={24} />
                <Skeleton variant="rectangular" width={60} height={24} />
              </div>
            ))}
          </div>
        </div>
      ) : showError ? (
        <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/60 dark:bg-red-950/20 p-8 text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40 text-red-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-red-900 dark:text-red-200">Gagal Memuat Produk</h3>
          <p className="text-sm text-red-700 dark:text-red-400 max-w-md mx-auto">
            Terjadi gangguan saat mengambil data dari server atau koneksi internet Anda terputus.
          </p>
          <Button variant="danger" size="sm" onClick={() => refetch()}>Coba Lagi</Button>
        </div>
      ) : showEmpty ? (
        <EmptyState
          title="Tidak Ada Produk yang Cocok"
          description={
            isFilterActive
              ? "Tidak ditemukan produk dengan kriteria filter yang Anda pilih."
              : "Belum ada produk yang terdaftar di dalam inventori."
          }
          actionText="Reset Filter"
          onAction={handleResetFilters}
        />
      ) : (
        <div className={`space-y-4 transition-opacity duration-200 ${isFetching ? "opacity-70" : "opacity-100"}`}>
          {view === "table" ? (
            <ProductTable
              products={products}
              pendingProductIds={pendingProductIds}
              onSelectProduct={setSelectedProduct}
              onEditProduct={handleOpenEdit}
              onDeleteProduct={setDeletingProduct}
            />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isPending={pendingProductIds.includes(product.id)}
                  onSelect={setSelectedProduct}
                  onEdit={handleOpenEdit}
                  onDelete={setDeletingProduct}
                />
              ))}
            </div>
          )}

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* Overlays */}
      <ProductDetailPanel
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        onEdit={(p) => { setSelectedProduct(null); handleOpenEdit(p); }}
        onDelete={(p) => { setSelectedProduct(null); setDeletingProduct(p); }}
      />

      <FilterDrawer
        isMobileFilterOpen={isMobileFilterOpen}
        setIsMobileFilterOpen={setIsMobileFilterOpen}
        category={category}
        setCategory={setCategory}
        categories={categories}
        sort={sort}
        setSort={setSort}
        handleResetFilters={handleResetFilters}
      />

      <EditProductModal
        editingProduct={editingProduct}
        setEditingProduct={setEditingProduct}
        editForm={editForm}
        setEditForm={setEditForm}
      />

      <DeleteConfirmationModal
        deletingProduct={deletingProduct}
        setDeletingProduct={setDeletingProduct}
      />
    </div>
  );
}
