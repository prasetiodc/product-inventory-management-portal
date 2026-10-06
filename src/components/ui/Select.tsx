import { forwardRef, ReactNode, SelectHTMLAttributes, useId } from "react";

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: SelectOption[];
  children?: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      children,
      id,
      className = "",
      disabled,
      ...rest
    },
    ref
  ) => {
    const generatedId = useId();
    const selectId = id || generatedId;
    const errorId = `${selectId}-error`;
    const helperId = `${selectId}-helper`;

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
            htmlFor={selectId}
            className="text-sm font-medium text-zinc-800 dark:text-zinc-200 select-none"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy || undefined}
            className={`w-full appearance-none rounded-lg border bg-white dark:bg-zinc-900 py-2 pl-3 pr-9 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:bg-zinc-100 dark:disabled:bg-zinc-800 disabled:opacity-60 transition-colors ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-400"
                : "border-zinc-300 dark:border-zinc-700 focus:border-blue-500 focus:ring-blue-500"
            } ${className}`}
            {...rest}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <span className="absolute right-3 pointer-events-none text-zinc-400 flex items-center">
            <svg
              className="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </span>
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

Select.displayName = "Select";
