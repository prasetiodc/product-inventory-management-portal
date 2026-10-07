import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Category, Product, ProductsResponse } from "@/types";

export type GetProductsQueryParams = {
  limit?: number;
  skip?: number;
  sortBy?: string;
  order?: "asc" | "desc";
  category?: string;
  search?: string;
};

export function resolveProductsQuery(params: GetProductsQueryParams) {
  const trimmedSearch = params.search?.trim();
  const trimmedCategory = params.category?.trim();
  const hasSearch = Boolean(trimmedSearch);
  const hasCategory = Boolean(trimmedCategory);
  const baseParams = {
    limit: params.limit,
    skip: params.skip,
    sortBy: params.sortBy,
    order: params.order,
  };

  if (hasSearch) {
    return {
      url: "/products/search",
      params: {
        q: trimmedSearch,
        ...baseParams,
      },
    };
  }

  if (hasCategory) {
    return {
      url: `/products/category/${encodeURIComponent(trimmedCategory || '')}`,
      params: baseParams,
    };
  }

  return {
    url: "/products",
    params: baseParams,
  };
}

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://dummyjson.com",
  }),
  tagTypes: ["Products", "Categories", "Product"],
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => "/products/categories",
      providesTags: ["Categories"],
    }),
    getProduct: builder.query<Product, number>({
      query: (id) => `/products/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Product", id }],
    }),
    getProducts: builder.query<ProductsResponse, GetProductsQueryParams>({
      query: (params) => resolveProductsQuery(params),
      providesTags: ["Products"],
    }),
    deleteProduct: builder.mutation<void, number>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
    }),
    updateProduct: builder.mutation<Product, Partial<Product> & { id: number }>({
      query: ({ id, ...patch }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: patch,
      }),
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetProductQuery,
  useGetProductsQuery,
  useDeleteProductMutation,
  useUpdateProductMutation,
} = productsApi;
