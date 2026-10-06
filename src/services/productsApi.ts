import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Category, Product, ProductsResponse } from "@/types";

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
    getProducts: builder.query<
      ProductsResponse,
      {
        limit?: number;
        skip?: number;
        sortBy?: string;
        order?: "asc" | "desc";
        category?: string;
        search?: string;
      }
    >({
      query: (params) => {
        if (params.search) {
          return {
            url: "/products/search",
            params: {
              q: params.search,
              limit: params.limit,
              skip: params.skip,
              sortBy: params.sortBy,
              order: params.order,
            },
          };
        }
        if (params.category) {
          return {
            url: `/products/category/${encodeURIComponent(params.category)}`,
            params: {
              limit: params.limit,
              skip: params.skip,
              sortBy: params.sortBy,
              order: params.order,
            },
          };
        }
        return {
          url: "/products",
          params: {
            limit: params.limit,
            skip: params.skip,
            sortBy: params.sortBy,
            order: params.order,
          },
        };
      },
      providesTags: ["Products"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetProductQuery,
  useGetProductsQuery,
} = productsApi;
