import { ProductSortOption, ProductViewMode } from "@/types";
import { FiltersState, initialFiltersState } from "@/features/products/filtersSlice";

const VALID_SORTS: ReadonlySet<ProductSortOption> = new Set([
  "price_asc",
  "price_desc",
  "title_asc",
  "title_desc",
  "rating_desc",
]);

const VALID_VIEWS: ReadonlySet<ProductViewMode> = new Set(["table", "card"]);

type RawSearchParams =
  | Record<string, string | string[] | undefined>
  | URLSearchParams;

function getParamValue(params: RawSearchParams, key: string): string | undefined {
  if (params instanceof URLSearchParams) {
    const val = params.get(key);
    return val !== null ? val : undefined;
  }
  const val = params[key];
  if (Array.isArray(val)) {
    return val[0];
  }
  return val;
}

export function parseFilters(rawParams: RawSearchParams): FiltersState {
  const searchRaw = getParamValue(rawParams, "search")?.trim() || "";
  const categoryRaw = getParamValue(rawParams, "category")?.trim() || "";
  const sortRaw = getParamValue(rawParams, "sort")?.trim() || "";
  const pageRaw = getParamValue(rawParams, "page");
  const viewRaw = getParamValue(rawParams, "view")?.trim() || "";

  // Normalize sort
  const sort: ProductSortOption = VALID_SORTS.has(sortRaw as ProductSortOption)
    ? (sortRaw as ProductSortOption)
    : initialFiltersState.sort;

  // Normalize page
  const parsedPage = parseInt(pageRaw ?? "1", 10);
  const page = Number.isInteger(parsedPage) && parsedPage >= 1 ? parsedPage : 1;

  // Normalize view
  const view: ProductViewMode = VALID_VIEWS.has(viewRaw as ProductViewMode)
    ? (viewRaw as ProductViewMode)
    : initialFiltersState.view;

  return {
    search: searchRaw,
    category: categoryRaw,
    sort,
    page,
    view,
  };
}

export function serializeFilters(filters: FiltersState): string {
  const params = new URLSearchParams();

  if (filters.search.trim()) {
    params.set("search", filters.search.trim());
  }

  if (filters.category.trim()) {
    params.set("category", filters.category.trim());
  }

  if (filters.sort && filters.sort !== initialFiltersState.sort) {
    params.set("sort", filters.sort);
  }

  if (filters.page > 1) {
    params.set("page", filters.page.toString());
  }

  if (filters.view && filters.view !== initialFiltersState.view) {
    params.set("view", filters.view);
  }

  return params.toString();
}
