"use client";

import { Product, Category } from "@/types";
import { ProductsView } from "@/features/products/components";

export interface ProductsClientWrapperProps {
  initialProducts: Product[];
  categories: Category[];
}

export function ProductsClientWrapper({
  initialProducts,
  categories,
}: ProductsClientWrapperProps) {
  return (
    <div className="w-full space-y-6">
      <ProductsView
        initialProducts={initialProducts}
        categories={categories}
        forcedState={"normal"}
      />
    </div>
  );
}
