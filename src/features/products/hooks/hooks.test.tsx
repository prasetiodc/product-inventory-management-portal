import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { ReactNode } from "react";
import { makeStore, AppStore } from "@/store/store";
import { useProductFilters } from "./useProductFilters";
import { useSyncFiltersToUrl } from "./useSyncFiltersToUrl";
import {
  filterProductsByCategory,
  getProductsDisplayState,
  useProductsList,
} from "./useProductsList";

const mockReplace = vi.fn();
const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
    push: mockPush,
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => "/products",
  useSearchParams: () => new URLSearchParams(),
}));

describe("Products Hooks", () => {
  let store: AppStore;

  const createWrapper = (testStore: AppStore) => {
    return function TestProvider({ children }: { children: ReactNode }) {
      return <Provider store={testStore}>{children}</Provider>;
    };
  };

  beforeEach(() => {
    store = makeStore();
    vi.clearAllMocks();
  });

  describe("useProductFilters", () => {
    it("returns default filters and isFilterActive false", () => {
      const { result } = renderHook(() => useProductFilters(), {
        wrapper: createWrapper(store),
      });

      expect(result.current.search).toBe("");
      expect(result.current.category).toBe("");
      expect(result.current.sort).toBe("title_asc");
      expect(result.current.page).toBe(1);
      expect(result.current.isFilterActive).toBe(false);
    });

    it("updates search, resets page, and sets isFilterActive to true", () => {
      const { result } = renderHook(() => useProductFilters(), {
        wrapper: createWrapper(store),
      });

      act(() => {
        result.current.setPage(3);
      });
      expect(result.current.page).toBe(3);

      act(() => {
        result.current.setSearch("laptop");
      });
      expect(result.current.search).toBe("laptop");
      expect(result.current.page).toBe(1);
      expect(result.current.isFilterActive).toBe(true);
    });

    it("updates category, sort, and resets properly", () => {
      const { result } = renderHook(() => useProductFilters(), {
        wrapper: createWrapper(store),
      });

      act(() => {
        result.current.setCategory("smartphones");
      });
      expect(result.current.category).toBe("smartphones");

      act(() => {
        result.current.setSort("price_desc");
      });
      expect(result.current.sort).toBe("price_desc");

      act(() => {
        result.current.resetFilters();
      });
      expect(result.current.search).toBe("");
      expect(result.current.category).toBe("");
      expect(result.current.sort).toBe("title_asc");
      expect(result.current.page).toBe(1);
      expect(result.current.isFilterActive).toBe(false);
    });
  });

  describe("useSyncFiltersToUrl", () => {
    it("synchronizes filter changes to router.replace", () => {
      const { result } = renderHook(
        () => {
          useSyncFiltersToUrl();
          return useProductFilters();
        },
        { wrapper: createWrapper(store) }
      );

      act(() => {
        result.current.setCategory("laptops");
      });

      expect(mockReplace).toHaveBeenCalledWith("/products?category=laptops", {
        scroll: false,
      });
    });

    it("synchronizes page change to router.push for pagination history", () => {
      const { result } = renderHook(
        () => {
          useSyncFiltersToUrl();
          return useProductFilters();
        },
        { wrapper: createWrapper(store) }
      );

      act(() => {
        result.current.setPage(2);
      });

      expect(mockPush).toHaveBeenCalledWith("/products?page=2", {
        scroll: false,
      });
    });
  });

  describe("useProductsList", () => {
    it("returns initial query state with products and pagination structure", () => {
      const { result } = renderHook(() => useProductsList(), {
        wrapper: createWrapper(store),
      });

      expect(result.current.products).toEqual([]);
      expect(result.current.totalItems).toBe(0);
      expect(result.current.totalPages).toBe(1);
      expect(result.current.itemsPerPage).toBe(10);
      expect(typeof result.current.refetch).toBe("function");
    });

    it("uses API total when no filters are active", () => {
      const result = getProductsDisplayState(
        [
          { id: 1, title: "Phone X", category: "smartphones", description: "A great phone", price: 100, stock: 1 },
          { id: 2, title: "Tablet", category: "tablets", description: "A great tablet", price: 200, stock: 2 },
        ],
        42,
        "",
        "",
        0
      );

      expect(result.totalItems).toBe(42);
      expect(result.products).toHaveLength(2);
    });

    it("does not re-slice API page data on page 2", () => {
      const page2Products = Array.from({ length: 10 }, (_, index) => ({
        id: index + 11,
        title: `Phone ${index + 11}`,
        category: "smartphones",
        description: `Description for Phone ${index + 11}`,
        price: 100 + index,
        stock: 1,
      }));

      const state = getProductsDisplayState(page2Products, 30, "", "", 10);

      expect(state.totalItems).toBe(30);
      expect(state.products).toHaveLength(10);
      expect(state.products[0].title).toBe("Phone 11");
    });

    it("filters search results by category when both filters are active", () => {
      const products = [
        { id: 1, title: "Phone X", category: "smartphones", description: "A great phone", price: 100, stock: 1 },
        { id: 2, title: "Laptop Pro", category: "laptops", description: "A great laptop", price: 200, stock: 2 },
        { id: 3, title: "Phone Y", category: "smartphones", description: "Another great phone", price: 150, stock: 3 },
      ];

      const filtered = filterProductsByCategory(products, "phone", "smartphones");

      expect(filtered).toHaveLength(2);
      expect(filtered.every((product) => product.category === "smartphones")).toBe(true);
      expect(filtered.every((product) => product.title.toLowerCase().includes("phone"))).toBe(true);
    });

    it("keeps page 2 populated when search and category are combined", () => {
      const products = Array.from({ length: 22 }, (_, index) => ({
        id: index + 1,
        title: index % 2 === 0 ? `Phone ${index + 1}` : `Laptop ${index + 1}`,
        category: index % 2 === 0 ? "smartphones" : "laptops",
        description: `Description for ${index % 2 === 0 ? "Phone" : "Laptop"} ${index + 1}`,
        price: 100 + index,
        stock: 1,
      }));

      const state = getProductsDisplayState(products, products.length, "phone", "smartphones", 10);

      expect(state.totalItems).toBe(11);
      expect(state.products).toHaveLength(1);
      expect(state.products[0].title).toBe("Phone 21");
    });
  });
});
