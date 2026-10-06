import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus-visible:ring-blue-500 shadow-sm",
  secondary:
    "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 active:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 focus-visible:ring-zinc-400",
  outline:
    "border border-zinc-300 bg-transparent text-zinc-700 hover:bg-zinc-50 active:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800 focus-visible:ring-zinc-400",
  danger:
    "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-500 shadow-sm",
  ghost:
    "bg-transparent text-zinc-700 hover:bg-zinc-100 active:bg-zinc-200 dark:text-zinc-300 dark:hover:bg-zinc-800 focus-visible:ring-zinc-400",
};

const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "px-2.5 py-1.5 text-xs font-medium rounded-md gap-1.5",
  md: "px-3.5 py-2 text-sm font-medium rounded-lg gap-2",
  lg: "px-5 py-2.5 text-base font-semibold rounded-lg gap-2.5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      className = "",
      type = "button",
      ...rest
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={isLoading}
        className={`inline-flex items-center justify-center transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...rest}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
