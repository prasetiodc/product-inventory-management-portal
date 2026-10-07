"use client";

import { useEffect } from "react";
import { Product } from "@/types";
import { useGetProductsQuery, useGetCategoriesQuery } from "@/services/productsApi";
import { mapSortOption } from "@/lib/sort/sortMapping";
import { useAppSelector } from "@/store/hooks";
import { useProductFilters } from "./useProductFilters";

export const PRODUCTS_PAGE_SIZE = 10;

export function applyOptimisticProductUpdates(
  products: Product[],
  updates: Record<number, Partial<Product>>
): Product[] {
  return products.map((product) =>
    updates[product.id] ? { ...product, ...updates[product.id] } : product
  );
}

export function filterDeletedProducts(
  products: Product[],
  deletedProductIds: Record<number, boolean>
): Product[] {
  return products.filter((product) => !deletedProductIds[product.id]);
}

export function getTotalAfterDeletedProducts(
  total: number,
  queriedProducts: Product[],
  deletedProductIds: Record<number, boolean>
): number {
  const deletedCount = queriedProducts.filter(
    (product) => deletedProductIds[product.id]
  ).length;
  return Math.max(0, total - deletedCount);
}

export function filterProductsByCategory(
  products: Product[],
  search: string,
  category: string
): Product[] {
  const normalizedSearch = search.trim().toLowerCase();
  const normalizedCategory = category.trim();

  return products.filter((product) => {
    const description = product.description?.toLowerCase() ?? "";
    const title = product.title.toLowerCase();

    const matchesSearch =
      !normalizedSearch ||
      title.includes(normalizedSearch) ||
      description.includes(normalizedSearch);
    const matchesCategory =
      !normalizedCategory || product.category === normalizedCategory;

    return matchesSearch && matchesCategory;
  });
}

export function getProductsDisplayState(
  products: Product[],
  totalFromApi: number,
  search: string,
  category: string,
  skip: number
) {
  const shouldFilterClientSide = Boolean(search.trim() && category.trim());
  const filteredProducts = shouldFilterClientSide
    ? filterProductsByCategory(products, search, category)
    : products;

  const totalItems = shouldFilterClientSide ? filteredProducts.length : totalFromApi;

  if (!shouldFilterClientSide) {
    return {
      products: filteredProducts,
      totalItems,
    };
  }

  const paginatedProducts = filteredProducts.slice(
    skip,
    skip + PRODUCTS_PAGE_SIZE
  );

  return {
    products: paginatedProducts,
    totalItems,
  };
}

export function useProductsList() {
  const {
    search,
    category,
    sort,
    page,
    setPage,
  } = useProductFilters();

  const sortParams = mapSortOption(sort);
  const skip = (page - 1) * PRODUCTS_PAGE_SIZE;
  const hasSearchAndCategory = Boolean(search.trim() && category.trim());

  const deletedProductIds = useAppSelector((state) => state.optimistic.deletedProductIds);
  const optimisticProducts = useAppSelector((state) => state.optimistic.products);

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetProductsQuery({
    search: search.trim() || undefined,
    category: category.trim() || undefined,
    sortBy: sortParams.sortBy,
    order: sortParams.order,
    skip: hasSearchAndCategory ? 0 : skip,
    limit: hasSearchAndCategory ? 0 : PRODUCTS_PAGE_SIZE,
  });

  const {
    data: categories = [],
    isLoading: isCategoriesLoading,
  } = useGetCategoriesQuery();

  const rawProducts = filterDeletedProducts(
    applyOptimisticProductUpdates(data?.products ?? [], optimisticProducts),
    deletedProductIds
  );
  const { products: paginatedProducts, totalItems } = getProductsDisplayState(
    rawProducts,
    getTotalAfterDeletedProducts(
      data?.total ?? 0,
      data?.products ?? [],
      deletedProductIds
    ),
    search,
    category,
    skip
  );
  const totalPages = Math.max(1, Math.ceil(totalItems / PRODUCTS_PAGE_SIZE));

  useEffect(() => {
    if (totalItems > 0 && page > totalPages) {
      setPage(1);
    }
  }, [page, totalPages, totalItems, setPage]);

  return {
    products: paginatedProducts,
    totalItems,
    totalPages,
    itemsPerPage: PRODUCTS_PAGE_SIZE,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    categories,
    isCategoriesLoading,
  };
}

