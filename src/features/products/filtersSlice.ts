import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductSortOption, ProductViewMode } from "@/types";

export interface FiltersState {
  search: string;
  category: string;
  sort: ProductSortOption;
  page: number;
  view: ProductViewMode;
}

export const initialFiltersState: FiltersState = {
  search: "",
  category: "",
  sort: "title_asc",
  page: 1,
  view: "table",
};

export const filtersSlice = createSlice({
  name: "filters",
  initialState: initialFiltersState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
      state.page = 1;
    },
    setCategory(state, action: PayloadAction<string>) {
      state.category = action.payload;
      state.page = 1;
    },
    setSort(state, action: PayloadAction<ProductSortOption>) {
      state.sort = action.payload;
      state.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setView(state, action: PayloadAction<ProductViewMode>) {
      state.view = action.payload;
    },
    resetFilters(state) {
      state.search = "";
      state.category = "";
      state.sort = "title_asc";
      state.page = 1;
    },
    filtersHydrated(state, action: PayloadAction<Partial<FiltersState>>) {
      return { ...state, ...action.payload };
    },
  },
});

export const {
  setSearch,
  setCategory,
  setSort,
  setPage,
  setView,
  resetFilters,
  filtersHydrated,
} = filtersSlice.actions;

export default filtersSlice.reducer;
