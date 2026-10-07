"use client";

import { useEffect, useState } from "react";
import { XIcon } from "lucide-react";

export interface ToastProps {
  message: string;
  type?: "success" | "error";
  onRetry?: () => void;
  onClose?: () => void;
  durationMs?: number;
}

export function Toast({
  message,
  type = "success",
  onRetry,
  onClose,
  durationMs = 4000,
}: ToastProps) {
  const [visible, setVisible] = useState(true);

  // Auto‑dismiss after the timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, durationMs);
    return () => clearTimeout(timer);
  }, [durationMs, onClose]);

  if (!visible) return null;

  const bg = type === "error" ? "bg-red-600" : "bg-emerald-600";

  return (
    <div className={`fixed inset-x-0 top-8 mx-auto max-w-md ${bg} text-white rounded-md shadow-lg flex items-center p-3 space-x-3 z-50`}>
      <span className="flex-1">{message}</span>
      {onRetry && (
        <button
          className="underline underline-offset-2 mr-2"
          onClick={() => {
            onRetry();
            onClose?.();
          }}
        >
          Retry
        </button>
      )}
      <button onClick={() => { setVisible(false); onClose?.(); }}>
        <XIcon className="w-4 h-4" />
      </button>
    </div>
  );
}
