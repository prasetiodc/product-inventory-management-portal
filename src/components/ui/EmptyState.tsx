import { HTMLAttributes, ReactNode } from "react";
import { Button } from "./Button";

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  icon?: ReactNode;
  actionText?: string;
  onAction?: () => void;
  action?: ReactNode;
}

export function EmptyState({
  title,
  description,
  icon,
  actionText,
  onAction,
  action,
  className = "",
  ...rest
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/50 ${className}`}
      {...rest}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 mb-4">
        {icon || (
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        )}
      </div>
      <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
        {title}
      </h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
          {description}
        </p>
      )}
      {action ? (
        <div className="mt-4">{action}</div>
      ) : actionText && onAction ? (
        <div className="mt-4">
          <Button variant="outline" size="sm" onClick={onAction}>
            {actionText}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
