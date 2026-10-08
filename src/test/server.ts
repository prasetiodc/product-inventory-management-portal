import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

export const server = setupServer(
  http.get("https://dummyjson.com/products/categories", () =>
    HttpResponse.json([
      { slug: "smartphones", name: "Smartphones", url: "https://dummyjson.com/products/category/smartphones" },
    ])
  )
);
