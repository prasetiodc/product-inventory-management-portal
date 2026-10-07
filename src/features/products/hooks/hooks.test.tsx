import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { ReactNode } from "react";
import { makeStore, AppStore } from "@/store/store";
import type { Product } from "@/types";
import { useProductFilters } from "./useProductFilters";
import { useSyncFiltersToUrl } from "./useSyncFiltersToUrl";
import {
  applyOptimisticProductUpdates,
  filterDeletedProducts,
  filterProductsByCategory,
  getTotalAfterDeletedProducts,
  getProductsDisplayState,
  useProductsList,
} from "./useProductsList";
import {
  deleteProductOptimistic,
  revertProduct,
  updateProductOptimistic,
} from "../optimisticSlice";
import { useDeleteProductOptimistic } from "./useDeleteProductOptimistic";
import { useUpdateProductOptimistic } from "./useUpdateProductOptimistic";

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
      expect(result.current.view).toBe("table");
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
        result.current.setPage(3);
      });

      act(() => {
        result.current.setSort("price_desc");
      });
      expect(result.current.sort).toBe("price_desc");
      expect(result.current.page).toBe(1);

      act(() => {
        result.current.resetFilters();
      });
      expect(result.current.search).toBe("");
      expect(result.current.category).toBe("");
      expect(result.current.sort).toBe("title_asc");
      expect(result.current.page).toBe(1);
      expect(result.current.isFilterActive).toBe(false);
    });

    it("updates product view without marking it as an active filter", () => {
      const { result } = renderHook(() => useProductFilters(), {
        wrapper: createWrapper(store),
      });

      act(() => {
        result.current.setView("card");
      });

      expect(result.current.view).toBe("card");
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

    it("synchronizes the selected view to router.replace", () => {
      const { result } = renderHook(
        () => {
          useSyncFiltersToUrl();
          return useProductFilters();
        },
        { wrapper: createWrapper(store) }
      );

      act(() => {
        result.current.setView("card");
      });

      expect(mockReplace).toHaveBeenCalledWith("/products?view=card", {
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

    it("requests all search results when category filtering is also active", () => {
      const filters = renderHook(() => useProductFilters(), {
        wrapper: createWrapper(store),
      });

      act(() => {
        filters.result.current.setSearch("phone");
        filters.result.current.setCategory("smartphones");
      });

      renderHook(() => useProductsList(), {
        wrapper: createWrapper(store),
      });

      const productsQuery = Object.values(store.getState().productsApi.queries).find(
        (query) => query?.endpointName === "getProducts"
      );

      expect(productsQuery?.originalArgs).toMatchObject({
        search: "phone",
        category: "smartphones",
        skip: 0,
        limit: 0,
      });
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

    it("marks a deleted product so it disappears from the visible list", () => {
      store.dispatch(deleteProductOptimistic(7));

      expect(store.getState().optimistic.deletedProductIds[7]).toBe(true);
      expect(store.getState().optimistic.products[7]).toBeUndefined();
      expect(
        getTotalAfterDeletedProducts(25, [{ id: 7 } as Product], store.getState().optimistic.deletedProductIds)
      ).toBe(24);
    });

    it("hides a product while the delete request is still pending", async () => {
      const product = {
        id: 99,
        title: "Pending deletion",
        description: "Product waiting for delete response",
        category: "smartphones",
        price: 100,
        stock: 1,
      };
      let resolveResponse!: (response: Response) => void;
      const pendingResponse = new Promise<Response>((resolve) => {
        resolveResponse = resolve;
      });
      const fetchMock = vi.fn(() => pendingResponse);
      const randomMock = vi.spyOn(Math, "random").mockReturnValue(0.9);
      vi.stubGlobal("fetch", fetchMock);

      try {
        const { result } = renderHook(() => useDeleteProductOptimistic(), {
          wrapper: createWrapper(store),
        });
        let deletion!: Promise<void>;

        act(() => {
          deletion = result.current.deleteProduct(product);
        });

        await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
        expect(
          filterDeletedProducts([product], store.getState().optimistic.deletedProductIds)
        ).toEqual([]);

        await act(async () => {
          resolveResponse(new Response(null, { status: 200 }));
          await deletion;
        });
      } finally {
        randomMock.mockRestore();
        vi.unstubAllGlobals();
      }
    });

    it("rolls back the optimistic delete when the API returns an error", async () => {
      const product = {
        id: 100,
        title: "Delete failure",
        description: "Product whose delete request fails",
        category: "smartphones",
        price: 100,
        stock: 1,
      };
      const fetchMock = vi.fn(() =>
        Promise.resolve(
          new Response(JSON.stringify({ message: "Delete failed" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          })
        )
      );
      const randomMock = vi.spyOn(Math, "random").mockReturnValue(0.9);
      vi.stubGlobal("fetch", fetchMock);

      try {
        const { result } = renderHook(() => useDeleteProductOptimistic(), {
          wrapper: createWrapper(store),
        });

        await act(async () => {
          await result.current.deleteProduct(product);
        });

        expect(store.getState().optimistic.deletedProductIds[product.id]).toBeUndefined();
        expect(store.getState().optimistic.failedOperations[product.id]).toBeDefined();
      } finally {
        randomMock.mockRestore();
        vi.unstubAllGlobals();
      }
    });

    it("applies optimistic field overrides to fetched products", () => {
      const product = {
        id: 8,
        title: "Original title",
        category: "smartphones",
        description: "A phone",
        price: 100,
        stock: 2,
      };

      store.dispatch(
        updateProductOptimistic({
          id: product.id,
          title: "Updated title",
          price: 125,
        })
      );
      const updated = applyOptimisticProductUpdates(
        [product],
        store.getState().optimistic.products
      );

      expect(updated[0]).toEqual({ ...product, title: "Updated title", price: 125 });

      store.dispatch(revertProduct(product));
      const restored = applyOptimisticProductUpdates(
        [product],
        store.getState().optimistic.products
      );

      expect(restored[0]).toEqual(product);
    });

    it("shows edited product fields while the update request is pending", async () => {
      const original: Product = {
        id: 101,
        title: "Original title",
        description: "Product being updated",
        category: "smartphones",
        price: 100,
        stock: 1,
      };
      const updated: Product = { ...original, title: "Updated title", price: 125 };
      let resolveResponse!: (response: Response) => void;
      const pendingResponse = new Promise<Response>((resolve) => {
        resolveResponse = resolve;
      });
      const fetchMock = vi.fn(() => pendingResponse);
      const randomMock = vi.spyOn(Math, "random").mockReturnValue(0.9);
      vi.stubGlobal("fetch", fetchMock);

      try {
        const { result } = renderHook(() => useUpdateProductOptimistic(), {
          wrapper: createWrapper(store),
        });
        let update!: Promise<void>;

        act(() => {
          update = result.current.updateProduct(original, updated);
        });

        await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
        expect(
          applyOptimisticProductUpdates(
            [original],
            store.getState().optimistic.products
          )[0]
        ).toEqual(updated);

        await act(async () => {
          resolveResponse(
            new Response(JSON.stringify(updated), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            })
          );
          await update;
        });
      } finally {
        randomMock.mockRestore();
        vi.unstubAllGlobals();
      }
    });

    it("restores original product fields when the update API returns an error", async () => {
      const original: Product = {
        id: 102,
        title: "Original title",
        description: "Product whose update fails",
        category: "smartphones",
        price: 100,
        stock: 1,
      };
      const updated: Product = { ...original, title: "Updated title", price: 125 };
      const fetchMock = vi.fn(() =>
        Promise.resolve(
          new Response(JSON.stringify({ message: "Update failed" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          })
        )
      );
      const randomMock = vi.spyOn(Math, "random").mockReturnValue(0.9);
      vi.stubGlobal("fetch", fetchMock);

      try {
        const { result } = renderHook(() => useUpdateProductOptimistic(), {
          wrapper: createWrapper(store),
        });

        await act(async () => {
          await result.current.updateProduct(original, updated);
        });

        expect(
          applyOptimisticProductUpdates(
            [original],
            store.getState().optimistic.products
          )[0]
        ).toEqual(original);
        expect(store.getState().optimistic.failedOperations[original.id]).toBeDefined();
      } finally {
        randomMock.mockRestore();
        vi.unstubAllGlobals();
      }
    });
  });
});
