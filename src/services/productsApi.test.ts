import { describe, it, expect } from "vitest";
import { productsApi, resolveProductsQuery } from "./productsApi";
import { makeStore } from "@/store/store";

describe("productsApi Endpoints & Redux Integration", () => {
  it("initializes API state properly in Redux store", () => {
    const store = makeStore();
    const state = store.getState();

    expect(state.productsApi).toBeDefined();
    expect(state.productsApi.queries).toEqual({});
    expect(state.productsApi.mutations).toEqual({});
  });

  it("creates initiate actions for getProducts endpoint", () => {
    const action = productsApi.endpoints.getProducts.initiate({
      search: "phone",
      limit: 10,
      skip: 0,
      sortBy: "price",
      order: "desc",
    });

    expect(action).toBeDefined();
    expect(typeof action).toBe("function");
  });

  it("creates initiate actions for getCategories endpoint", () => {
    const action = productsApi.endpoints.getCategories.initiate();
    expect(action).toBeDefined();
    expect(typeof action).toBe("function");
  });

  it("creates initiate actions for getProduct endpoint", () => {
    const action = productsApi.endpoints.getProduct.initiate(1);
    expect(action).toBeDefined();
    expect(typeof action).toBe("function");
  });

  it("uses the search endpoint for combined search and category filters", () => {
    const result = resolveProductsQuery({
      search: "phone",
      category: "smartphones",
      limit: 0,
      skip: 0,
      sortBy: "title",
      order: "asc",
    });

    expect(result).toEqual({
      url: "/products/search",
      params: {
        q: "phone",
        limit: 0,
        skip: 0,
        sortBy: "title",
        order: "asc",
      },
    });
  });
});

