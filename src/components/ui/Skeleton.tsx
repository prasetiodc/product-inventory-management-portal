import { HTMLAttributes, forwardRef } from "react";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      variant = "rectangular",
      width,
      height,
      className = "",
      style,
      ...rest
    },
    ref
  ) => {
    const variantClass =
      variant === "circular"
        ? "rounded-full"
        : variant === "text"
        ? "rounded h-4 w-full"
        : "rounded-lg";

    const customStyle = {
      ...(width !== undefined ? { width } : {}),
      ...(height !== undefined ? { height } : {}),
      ...style,
    };

    return (
      <div
        ref={ref}
        aria-hidden="true"
        style={customStyle}
        className={`animate-pulse bg-zinc-200 dark:bg-zinc-800 ${variantClass} ${className}`}
        {...rest}
      />
    );
  }
);

Skeleton.displayName = "Skeleton";
