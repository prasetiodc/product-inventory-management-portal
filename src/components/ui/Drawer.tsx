"use client";

import { ReactNode, useEffect, useRef } from "react";

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  position?: "right" | "left";
  ariaLabel?: string;
}

export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  position = "right",
  ariaLabel,
}: DrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    previousActiveElement.current = document.activeElement as HTMLElement | null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    drawerRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previousActiveElement.current?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const positionClasses =
    position === "right"
      ? "right-0 inset-y-0 max-w-md w-full animate-in slide-in-from-right duration-200"
      : "left-0 inset-y-0 max-w-md w-full animate-in slide-in-from-left duration-200";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel || title || "Panel"}
      className="fixed inset-0 z-50 overflow-hidden"
    >
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={drawerRef}
        tabIndex={-1}
        className={`fixed bg-white dark:bg-zinc-900 shadow-xl flex flex-col z-10 outline-none ${positionClasses}`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            {title || "Panel"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup panel"
            className="rounded-lg p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 cursor-pointer"
          >
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}
