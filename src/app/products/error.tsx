"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui";

export default function ProductsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected route errors
    console.error("Products Route Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8 text-center space-y-4 shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40 text-red-600">
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          Terjadi Kesalahan
        </h2>

        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Halaman produk tidak dapat dimuat karena terjadi kesalahan tak terduga.
        </p>

        <div className="pt-2 flex justify-center gap-3">
          <Button variant="primary" size="md" onClick={() => reset()}>
            Coba Lagi
          </Button>
        </div>
      </div>
    </div>
  );
}
