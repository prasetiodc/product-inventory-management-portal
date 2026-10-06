import { STATIC_PRODUCTS, STATIC_CATEGORIES } from "@/mocks/staticProducts";
import { ProductsClientWrapper } from "./ProductsClientWrapper";

export const metadata = {
  title: "Daftar Produk | Product & Inventory Portal",
  description: "Kelola inventori, pantau stok, dan ubah data produk.",
};

interface ProductsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  await searchParams;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <ProductsClientWrapper
          initialProducts={STATIC_PRODUCTS}
          categories={STATIC_CATEGORIES}
        />
      </div>
    </div>
  );
}
