import { Suspense } from "react";
import StoreProvider from "@/store/StoreProvider";
import { parseFilters } from "@/lib/url/filtersUrl";
import ProductsLoading from "./loading";
import { ProductsView } from "@/features/products/components";

export const metadata = {
  title: "Daftar Produk | Product & Inventory Portal",
  description: "Kelola inventori, pantau stok, dan ubah data produk secara langsung.",
};

interface ProductsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;
  const initialFilters = parseFilters(resolvedSearchParams);

  return (
    <StoreProvider preloadedState={{ filters: initialFilters }}>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Suspense fallback={<ProductsLoading />}>
            <ProductsView />
          </Suspense>
        </div>
      </div>
    </StoreProvider>
  );
}
