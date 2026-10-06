import { describe, it, expect } from "vitest";
import { mapSortOption } from "./sort/sortMapping";
import { parseFilters, serializeFilters } from "./url/filtersUrl";
import { FiltersState } from "@/features/products/filtersSlice";

describe("Sort Mapping (mapSortOption)", () => {
  it("maps sort options correctly", () => {
    expect(mapSortOption("price_asc")).toEqual({ sortBy: "price", order: "asc" });
    expect(mapSortOption("price_desc")).toEqual({ sortBy: "price", order: "desc" });
    expect(mapSortOption("title_asc")).toEqual({ sortBy: "title", order: "asc" });
    expect(mapSortOption("title_desc")).toEqual({ sortBy: "title", order: "desc" });
    expect(mapSortOption("rating_desc")).toEqual({ sortBy: "rating", order: "desc" });
  });
});

describe("URL Filters (parseFilters & serializeFilters)", () => {
  it("parses valid URL search parameters into FiltersState", () => {
    const raw = {
      search: "phone",
      category: "smartphones",
      sort: "price_desc",
      page: "2",
      view: "card",
    };
    const parsed = parseFilters(raw);
    expect(parsed).toEqual({
      search: "phone",
      category: "smartphones",
      sort: "price_desc",
      page: 2,
      view: "card",
    });
  });

  it("sanitizes invalid or garbage parameters to defaults", () => {
    const raw = {
      search: "   ",
      category: "",
      sort: "garbage_sort",
      page: "not-a-number",
      view: "invalid_view",
    };
    const parsed = parseFilters(raw);
    expect(parsed).toEqual({
      search: "",
      category: "",
      sort: "title_asc",
      page: 1,
      view: "table",
    });
  });

  it("handles negative or zero pages by clamping to 1", () => {
    const raw = { page: "-5" };
    expect(parseFilters(raw).page).toBe(1);

    const zero = { page: "0" };
    expect(parseFilters(zero).page).toBe(1);
  });

  it("serializes FiltersState into query string omitting defaults", () => {
    const filters: FiltersState = {
      search: "laptop",
      category: "laptops",
      sort: "price_desc",
      page: 3,
      view: "card",
    };
    const serialized = serializeFilters(filters);
    expect(serialized).toBe(
      "search=laptop&category=laptops&sort=price_desc&page=3&view=card"
    );
  });

  it("omits empty or default fields in serializeFilters", () => {
    const defaultFilters: FiltersState = {
      search: "",
      category: "",
      sort: "title_asc",
      page: 1,
      view: "table",
    };
    expect(serializeFilters(defaultFilters)).toBe("");
  });
});
