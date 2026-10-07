// src/features/products/hooks/useUpdateProductOptimistic.ts
"use client";

import { createElement, useRef, useState } from "react";
import { useUpdateProductMutation } from "@/services/productsApi";
import { useAppDispatch } from "@/store/hooks";
import {
  updateProductOptimistic,
  revertProduct,
  optimisticStarted,
  optimisticSettled,
  optimisticRolledBack,
} from "@/features/products/optimisticSlice";
import { Toast } from "@/components/ui";
import type { Product } from "@/types";

/** Simulate a 20 % chance of network failure */
function randomFail(): boolean {
  return Math.random() < 0.2;
}

/**
 * Hook that performs an optimistic update with rollback on error.
 * It returns `updateProduct` and a `ToastEl` for UI feedback.
 */
export function useUpdateProductOptimistic() {
  const dispatch = useAppDispatch();
  const [triggerUpdate] = useUpdateProductMutation();
  const toastId = useRef(0);
  const [toastInfo, setToastInfo] = useState<{
    id: number;
    message: string;
    type: "error" | "success";
    retry?: () => void;
  } | null>(null);

  const updateProduct = async (original: Product, updated: Product) => {
    dispatch(optimisticStarted({ id: updated.id, type: "update", data: original }));
    dispatch(updateProductOptimistic(updated));

    try {
      if (randomFail()) throw new Error("Simulated network failure");
      await triggerUpdate(updated).unwrap();
      dispatch(optimisticSettled({ id: updated.id }));
      setToastInfo({
        id: ++toastId.current,
        message: "Produk berhasil diperbarui",
        type: "success",
      });
    } catch (error) {
      dispatch(revertProduct(original));
      dispatch(
        optimisticRolledBack({
          id: updated.id,
          type: "update",
          data: original,
          error: error instanceof Error ? error.message : "Gagal memperbarui produk",
        })
      );
      setToastInfo({
        id: ++toastId.current,
        message: "Gagal memperbarui produk. Silakan coba lagi.",
        type: "error",
        retry: () => updateProduct(original, updated),
      });
    }
  };

  const ToastEl = toastInfo
    ? createElement(Toast, {
        key: toastInfo.id,
        message: toastInfo.message,
        type: toastInfo.type,
        onRetry: toastInfo.retry,
        onClose: () => setToastInfo(null),
      })
    : null;

  return { updateProduct, ToastEl };
}
