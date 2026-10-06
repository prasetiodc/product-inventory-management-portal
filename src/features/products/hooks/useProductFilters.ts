"use client";

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setSearch as setSearchAction,
  setCategory as setCategoryAction,
  setSort as setSortAction,
  setPage as setPageAction,
  resetFilters as resetFiltersAction,
  filtersHydrated as filtersHydratedAction,
  FiltersState,
  initialFiltersState,
} from "../filtersSlice";
import { ProductSortOption } from "@/types";

export function useProductFilters() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.filters);

  const setSearch = useCallback((value: string) => {
    dispatch(setSearchAction(value));
  }, [dispatch]);

  const setCategory = useCallback((value: string) => {
    dispatch(setCategoryAction(value));
  }, [dispatch]);

  const setSort = useCallback((value: ProductSortOption) => {
    dispatch(setSortAction(value));
  }, [dispatch]);

  const setPage = useCallback((value: number) => {
    dispatch(setPageAction(value));
  }, [dispatch]);

  const resetFilters = useCallback(() => {
    dispatch(resetFiltersAction());
  }, [dispatch]);

  const hydrateFilters = useCallback((newFilters: Partial<FiltersState>) => {
    dispatch(filtersHydratedAction(newFilters));
  }, [dispatch]);

  const isFilterActive =
    filters.search.trim() !== "" ||
    filters.category.trim() !== "" ||
    filters.sort !== initialFiltersState.sort ||
    filters.page !== 1;

  return {
    ...filters,
    filters,
    setSearch,
    setCategory,
    setSort,
    setPage,
    resetFilters,
    hydrateFilters,
    isFilterActive,
  };
}

