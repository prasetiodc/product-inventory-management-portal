import { ProductSortOption } from "@/types";

export interface SortApiParams {
  sortBy: string;
  order: "asc" | "desc";
}

export function mapSortOption(sort: ProductSortOption): SortApiParams {
  switch (sort) {
    case "price_asc":
      return { sortBy: "price", order: "asc" };
    case "price_desc":
      return { sortBy: "price", order: "desc" };
    case "title_desc":
      return { sortBy: "title", order: "desc" };
    case "rating_desc":
      return { sortBy: "rating", order: "desc" };
    case "title_asc":
    default:
      return { sortBy: "title", order: "asc" };
  }
}
