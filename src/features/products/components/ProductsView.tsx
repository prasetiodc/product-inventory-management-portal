"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Product, Category, ProductSortOption } from "@/types";
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

export interface ProductsViewProps {
  initialProducts: Product[];
  categories: Category[];
  forcedState?: "normal" | "loading" | "empty" | "error" | "pending";
}

export function ProductsView({
  initialProducts,
  categories,
  forcedState = "normal",
}: ProductsViewProps) {
  // Local state for UI preview and interaction
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState<ProductSortOption>("title_asc");
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  // Selected product for detail slide-over
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Edit and Delete Modals
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState({ title: "", price: 0, stock: 0 });

  // Mobile Drawer state
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filtered & Sorted products (client-side simulation for Part 2 static view)
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q)
      );
    }

    if (category) {
      result = result.filter((p) => p.category === category);
    }

    result.sort((a, b) => {
      if (sort === "title_asc") return a.title.localeCompare(b.title);
      if (sort === "title_desc") return b.title.localeCompare(a.title);
      if (sort === "price_asc") return a.price - b.price;
      if (sort === "price_desc") return b.price - a.price;
      if (sort === "rating_desc") return (b.rating ?? 0) - (a.rating ?? 0);
      return 0;
    });

    return result;
  }, [initialProducts, search, category, sort]);

  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, page, itemsPerPage]);

  // Handle edit open
  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setEditForm({
      title: p.title,
      price: p.price,
      stock: p.stock,
    });
  };

  const handleResetFilters = () => {
    setSearch("");
    setCategory("");
    setSort("title_asc");
    setPage(1);
  };

  // Simulated pending product id (e.g. product id: 1)
  const pendingProductIds = forcedState === "pending" ? [initialProducts[0]?.id].filter(Boolean) : [];

  return (
    <div className="w-full space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Daftar Produk
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Kelola inventori, pantau stok, dan ubah data produk secara langsung.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/products/new">
            <Button
              variant="primary"
              size="md"
              leftIcon={
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              }
            >
              Tambah Produk
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        search={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        category={category}
        onCategoryChange={(v) => {
          setCategory(v);
          setPage(1);
        }}
        categories={categories}
        sort={sort}
        onSortChange={(v) => {
          setSort(v);
          setPage(1);
        }}
        onOpenMobileFilter={() => setIsMobileFilterOpen(true)}
        isFilterActive={Boolean(search || category)}
        onResetFilters={handleResetFilters}
      />

      {/* CONDITIONAL CONTENT RENDERING */}

      {/* 1. Loading Skeleton State */}
      {forcedState === "loading" ? (
        <div className="space-y-4">
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
        </div>
      ) : forcedState === "error" ? (
        /* 2. Error State */
        <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/60 dark:bg-red-950/20 p-8 text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40 text-red-600">
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-red-900 dark:text-red-200">
            Gagal Memuat Produk
          </h3>
          <p className="text-sm text-red-700 dark:text-red-400 max-w-md mx-auto">
            Terjadi gangguan saat mengambil data dari server atau koneksi internet Anda terputus.
          </p>
          <div className="pt-2">
            <Button
              variant="danger"
              size="sm"
              onClick={() => alert("Refetch query dipicu!")}
            >
              Coba Lagi
            </Button>
          </div>
        </div>
      ) : forcedState === "empty" || filteredProducts.length === 0 ? (
        /* 3. Empty State */
        <EmptyState
          title="Tidak Ada Produk yang Cocok"
          description={
            search || category
              ? `Tidak ditemukan produk dengan kriteria filter yang Anda pilih.`
              : "Belum ada produk yang terdaftar di dalam inventori."
          }
          actionText="Reset Filter"
          onAction={handleResetFilters}
        />
      ) : (
        /* 4. Normal / Success State (Table or Card View) */
        <div className="space-y-4">
          <div className="hidden md:flex">
            <ProductTable
              products={paginatedProducts}
              pendingProductIds={pendingProductIds}
              onSelectProduct={setSelectedProduct}
              onEditProduct={handleOpenEdit}
              onDeleteProduct={setDeletingProduct}
            />
          </div>
            <div className="md:hidden grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {paginatedProducts.map((product) => (
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

          {/* Pagination */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* DETAIL SLIDE-OVER PANEL */}
      <ProductDetailPanel
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        onEdit={(p) => {
          setSelectedProduct(null);
          handleOpenEdit(p);
        }}
        onDelete={(p) => {
          setSelectedProduct(null);
          setDeletingProduct(p);
        }}
      />

      {/* MOBILE FILTER DRAWER */}
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

      {/* EDIT PRODUCT MODAL */}
      <EditProductModal
        editingProduct={editingProduct}
        setEditingProduct={setEditingProduct}
        editForm={editForm}
        setEditForm={setEditForm}
      />

      {/* DELETE CONFIRMATION MODAL */}
      <DeleteConfirmationModal
        deletingProduct={deletingProduct}
        setDeletingProduct={setDeletingProduct}
      />
    </div>
  );
}
