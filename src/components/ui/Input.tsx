import { forwardRef, InputHTMLAttributes, ReactNode, useId } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      id,
      className = "",
      disabled,
      ...rest
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    const describedBy = [
      error ? errorId : null,
      helperText && !error ? helperId : null,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-zinc-800 dark:text-zinc-200 select-none"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 text-zinc-400 pointer-events-none flex items-center justify-center">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy || undefined}
            className={`w-full rounded-lg border bg-white dark:bg-zinc-900 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:bg-zinc-100 dark:disabled:bg-zinc-800 disabled:opacity-60 transition-colors ${
              leftIcon ? "pl-9" : "pl-3"
            } ${rightIcon ? "pr-9" : "pr-3"} ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-400"
                : "border-zinc-300 dark:border-zinc-700 focus:border-blue-500 focus:ring-blue-500"
            } ${className}`}
            {...rest}
          />
          {rightIcon && (
            <span className="absolute right-3 text-zinc-400 flex items-center justify-center">
              {rightIcon}
            </span>
          )}
        </div>
        {error ? (
          <p id={errorId} role="alert" className="text-xs text-red-600 dark:text-red-400">
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="text-xs text-zinc-500 dark:text-zinc-400">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
