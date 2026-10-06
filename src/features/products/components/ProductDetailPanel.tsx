"use client";

import Image from "next/image";
import { Product } from "@/types";
import { Drawer, Button } from "@/components/ui";

export interface ProductDetailPanelProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

export function ProductDetailPanel({
  product,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: ProductDetailPanelProps) {
  if (!product) return null;

  const discountedPrice = product.discountPercentage
    ? (product.price * (1 - product.discountPercentage / 100)).toFixed(2)
    : null;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Detail Produk"
      ariaLabel={`Detail untuk ${product.title}`}
    >
      <div className="space-y-6 text-sm text-zinc-600 dark:text-zinc-400">
        {/* Main Image */}
        <div className="relative aspect-4/3 w-full rounded-xl bg-zinc-100 dark:bg-zinc-800 overflow-hidden border border-zinc-200 dark:border-zinc-700">
          {product.thumbnail ? (
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover"
              priority
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-zinc-400 text-sm">
              Tidak ada foto
            </div>
          )}
        </div>

        {/* Header Info */}
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 uppercase tracking-wide">
              {product.category}
            </span>
            {product.rating !== undefined && (
              <div className="flex items-center gap-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                <svg
                  className="h-4 w-4 text-amber-400 fill-amber-400"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>{product.rating}</span>
                <span className="text-xs text-zinc-400 font-normal">/ 5.0</span>
              </div>
            )}
          </div>

          <h2 className="mt-2 text-xl font-bold text-zinc-900 dark:text-zinc-50">
            {product.title}
          </h2>

          <div className="mt-1 text-xs text-zinc-500">
            Brand: <span className="font-medium text-zinc-700 dark:text-zinc-300">{product.brand || "-"}</span>
            {product.sku && (
              <span className="ml-3 font-mono text-[11px] text-zinc-400">
                SKU: {product.sku}
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Stock Card */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80">
          <div>
            <div className="text-2xl font-black text-zinc-900 dark:text-zinc-50">
              ${discountedPrice || product.price.toFixed(2)}
            </div>
            {discountedPrice && (
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-zinc-400 line-through">
                  ${product.price.toFixed(2)}
                </span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  Hemat {product.discountPercentage}%
                </span>
              </div>
            )}
          </div>

          <div className="text-right">
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                product.stock > 10
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                  : product.stock > 0
                  ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
              }`}
            >
              {product.stock > 0 ? `Tersedia (${product.stock})` : "Stok Habis"}
            </span>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
            Deskripsi
          </h3>
          <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
            {product.description}
          </p>
        </div>

        {/* Specifications / Dimensions */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Spesifikasi &amp; Dimensi
          </h3>
          <dl className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5">
              <dt className="text-zinc-400">Berat</dt>
              <dd className="font-medium text-zinc-900 dark:text-zinc-100 mt-0.5">
                {product.weight ? `${product.weight} kg` : "-"}
              </dd>
            </div>
            <div className="p-2.5">
              <dt className="text-zinc-400">Dimensi (P x L x T)</dt>
              <dd className="font-medium text-zinc-900 dark:text-zinc-100 mt-0.5">
                {product.dimensions
                  ? `${product.dimensions.width} x ${product.dimensions.height} x ${product.dimensions.depth} cm`
                  : "-"}
              </dd>
            </div>
            <div className="p-2.5">
              <dt className="text-zinc-400">Garansi</dt>
              <dd className="font-medium text-zinc-900 dark:text-zinc-100 mt-0.5">
                {product.warrantyInformation || "-"}
              </dd>
            </div>
            <div className="p-2.5">
              <dt className="text-zinc-400">Kebijakan Retur</dt>
              <dd className="font-medium text-zinc-900 dark:text-zinc-100 mt-0.5">
                {product.returnPolicy || "-"}
              </dd>
            </div>
          </dl>
        </div>

        {/* Reviews List */}
        {product.reviews && product.reviews.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Ulasan Pengguna ({product.reviews.length})
            </h3>
            <div className="space-y-2">
              {product.reviews.map((rev, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {rev.reviewerName}
                    </span>
                    <span className="text-amber-500 font-medium">
                      ★ {rev.rating}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 italic">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                  <span className="text-[10px] text-zinc-400 block">
                    {new Date(rev.date).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex gap-3">
          <Button
            variant="primary"
            className="flex-1"
            onClick={() => {
              onClose();
              onEdit?.(product);
            }}
          >
            Ubah Produk
          </Button>

          <Button
            variant="danger"
            onClick={() => {
              onClose();
              onDelete?.(product);
            }}
          >
            Hapus
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
