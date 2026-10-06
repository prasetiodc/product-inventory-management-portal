"use client";

import Image from "next/image";
import { Product } from "@/types";
import { Button } from "@/components/ui";

export interface ProductTableProps {
  products: Product[];
  pendingProductIds?: number[];
  onSelectProduct?: (product: Product) => void;
  onEditProduct?: (product: Product) => void;
  onDeleteProduct?: (product: Product) => void;
}

export function ProductTable({
  products,
  pendingProductIds = [],
  onSelectProduct,
  onEditProduct,
  onDeleteProduct,
}: ProductTableProps) {
  const getStockBadge = (stock: number) => {
    if (stock <= 0) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
          Habis (0)
        </span>
      );
    }
    if (stock <= 10) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
          Sisa {stock}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
        {stock} unit
      </span>
    );
  };

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
      <table className="w-full text-left text-sm text-zinc-600 dark:text-zinc-400">
        <thead className="bg-zinc-50 dark:bg-zinc-800/60 text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
          <tr>
            <th scope="col" className="px-4 py-3.5 w-16">
              Foto
            </th>
            <th scope="col" className="px-4 py-3.5">
              Produk &amp; Brand
            </th>
            <th scope="col" className="px-4 py-3.5">
              Kategori
            </th>
            <th scope="col" className="px-4 py-3.5">
              Harga
            </th>
            <th scope="col" className="px-4 py-3.5">
              Stok
            </th>
            <th scope="col" className="px-4 py-3.5">
              Rating
            </th>
            <th scope="col" className="px-4 py-3.5 text-right w-28">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {products.map((product) => {
            const isPending = pendingProductIds.includes(product.id);
            const discountedPrice = product.discountPercentage
              ? (
                  product.price *
                  (1 - product.discountPercentage / 100)
                ).toFixed(2)
              : null;

            return (
              <tr
                key={product.id}
                onClick={() => !isPending && onSelectProduct?.(product)}
                className={`transition-colors hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 cursor-pointer ${
                  isPending ? "opacity-50 pointer-events-none select-none" : ""
                }`}
              >
                {/* Thumbnail */}
                <td className="px-4 py-3">
                  <div className="relative h-12 w-12 rounded-lg bg-zinc-100 dark:bg-zinc-800 overflow-hidden flex-shrink-0 border border-zinc-200/60 dark:border-zinc-700/60">
                    {product.thumbnail ? (
                      <Image
                        src={product.thumbnail}
                        alt={product.title}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-zinc-400 text-xs">
                        No Img
                      </div>
                    )}
                  </div>
                </td>

                {/* Title & Brand */}
                <td className="px-4 py-3">
                  <div className="font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-1">
                    {product.title}
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Brand: <span className="font-medium text-zinc-700 dark:text-zinc-300">{product.brand || "-"}</span>
                    {product.sku && (
                      <span className="ml-2 font-mono text-[11px] text-zinc-400">
                        ({product.sku})
                      </span>
                    )}
                  </div>
                </td>

                {/* Category */}
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 capitalize">
                    {product.category}
                  </span>
                </td>

                {/* Price */}
                <td className="px-4 py-3">
                  <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                    ${discountedPrice || product.price.toFixed(2)}
                  </div>
                  {discountedPrice && (
                    <div className="text-xs text-zinc-400 line-through">
                      ${product.price.toFixed(2)}
                    </div>
                  )}
                </td>

                {/* Stock */}
                <td className="px-4 py-3">{getStockBadge(product.stock)}</td>

                {/* Rating */}
                <td className="px-4 py-3">
                  <div className="inline-flex items-center gap-1 font-medium text-zinc-800 dark:text-zinc-200">
                    <svg
                      className="h-4 w-4 text-amber-400 fill-amber-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span>{product.rating ?? "-"}</span>
                  </div>
                </td>

                {/* Actions */}
                <td className="px-4 py-3 text-right">
                  <div
                    className="inline-flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={isPending}
                      aria-label={`Ubah ${product.title}`}
                      onClick={() => onEditProduct?.(product)}
                      className="p-1.5 h-8 w-8 text-zinc-600 hover:text-blue-600"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={isPending}
                      aria-label={`Hapus ${product.title}`}
                      onClick={() => onDeleteProduct?.(product)}
                      className="p-1.5 h-8 w-8 text-zinc-600 hover:text-red-600"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
