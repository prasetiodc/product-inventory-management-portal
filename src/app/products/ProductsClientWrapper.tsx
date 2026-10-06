"use client";

import { ProductsView } from "@/features/products/components";

export function ProductsClientWrapper() {
  return (
    <div className="w-full space-y-6">
      <ProductsView />
    </div>
  );
}
