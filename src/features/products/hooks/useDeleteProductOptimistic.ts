// src/features/products/hooks/useDeleteProductOptimistic.ts
"use client";

import { createElement, useRef, useState } from "react";
import { useDeleteProductMutation } from "@/services/productsApi";
import { useAppDispatch } from "@/store/hooks";
import {
  deleteProductOptimistic,
  addProduct,
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

export function useDeleteProductOptimistic() {
  const dispatch = useAppDispatch();
  const [triggerDelete] = useDeleteProductMutation();
  const toastId = useRef(0);
  const [toastInfo, setToastInfo] = useState<{
    id: number;
    message: string;
    type: "error" | "success";
    retry?: () => void;
  } | null>(null);

  const deleteProduct = async (product: Product) => {
    dispatch(optimisticStarted({ id: product.id, type: "delete", data: product }));
    dispatch(deleteProductOptimistic(product.id));

    try {
      if (randomFail()) throw new Error("Simulated network failure");
      await triggerDelete(product.id).unwrap();

      dispatch(optimisticSettled({ id: product.id }));
      setToastInfo({
        id: ++toastId.current,
        message: "Produk berhasil dihapus",
        type: "success",
      });
    } catch (error) {
      dispatch(addProduct(product));
      dispatch(
        optimisticRolledBack({
          id: product.id,
          type: "delete",
          data: product,
          error: error instanceof Error ? error.message : "Gagal menghapus produk",
        })
      );
      setToastInfo({
        id: ++toastId.current,
        message: "Gagal menghapus produk. Silakan coba lagi.",
        type: "error",
        retry: () => deleteProduct(product),
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

  return { deleteProduct, ToastEl };
}
