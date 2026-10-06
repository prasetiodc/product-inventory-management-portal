"use client";

import Image from "next/image";
import { Product } from "@/types";
import { Button } from "@/components/ui";

export interface ProductCardProps {
  product: Product;
  isPending?: boolean;
  onSelect?: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

export function ProductCard({
  product,
  isPending = false,
  onSelect,
  onEdit,
  onDelete,
}: ProductCardProps) {
  const discountedPrice = product.discountPercentage
    ? (product.price * (1 - product.discountPercentage / 100)).toFixed(2)
    : null;

  return (
    <div
      onClick={() => !isPending && onSelect?.(product)}
      className={`group relative flex flex-col rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer ${
        isPending ? "opacity-50 pointer-events-none select-none" : ""
      }`}
    >
      {/* Thumbnail Header */}
      <div className="relative aspect-4/3 w-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-zinc-400 text-sm">
            Tidak ada foto
          </div>
        )}

        {/* Category Badge */}
        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-xs font-semibold bg-white/90 dark:bg-zinc-900/90 text-zinc-800 dark:text-zinc-200 backdrop-blur-xs shadow-xs capitalize max-w-[50%] truncate">
          {product.category}
        </span>

        {/* Rating Badge */}
        {product.rating !== undefined && (
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-black/60 text-white backdrop-blur-xs shadow-xs">
            <svg
              className="h-3.5 w-3.5 text-amber-400 fill-amber-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>{product.rating}</span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="flex flex-col flex-1 p-4 justify-between gap-3">
        <div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            Brand: <span className="font-medium text-zinc-700 dark:text-zinc-300">{product.brand || "-"}</span>
          </div>
          <h3 className="font-semibold text-base text-zinc-900 dark:text-zinc-100 line-clamp-2 mt-0.5">
            {product.title}
          </h3>
        </div>

        {/* Footer: Price & Stock & Action buttons */}
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              ${discountedPrice || product.price.toFixed(2)}
            </div>
            <div className="text-xs text-zinc-500">
              Stok: <span className="font-medium">{product.stock}</span>
            </div>
          </div>

          <div
            className="flex items-center gap-1.5"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="outline"
              size="sm"
              disabled={isPending}
              aria-label={`Ubah ${product.title}`}
              onClick={() => onEdit?.(product)}
              className="p-1.5 h-8 w-8 text-zinc-600 hover:text-blue-600"
            >
              <svg
                className="h-3.5 w-3.5"
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
              variant="outline"
              size="sm"
              disabled={isPending}
              aria-label={`Hapus ${product.title}`}
              onClick={() => onDelete?.(product)}
              className="p-1.5 h-8 w-8 text-zinc-600 hover:text-red-600"
            >
              <svg
                className="h-3.5 w-3.5"
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
        </div>
      </div>
    </div>
  );
}
