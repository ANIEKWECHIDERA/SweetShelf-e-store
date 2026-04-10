import type { InputHTMLAttributes } from "react";
import { clsx } from "clsx";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  helperText?: string;
};

export function Input({ label, error, helperText, className, ...props }: InputProps) {
  return (
    <label className="flex flex-col gap-2 text-sm text-[var(--color-brown-800)]">
      <span className="font-medium">{label}</span>
      <input
        className={clsx(
          "rounded-xl border border-[var(--color-brown-200)] bg-[var(--color-cream)] px-4 py-3 outline-none transition focus:border-transparent focus:ring-2 focus:ring-[var(--color-caramel-400)]",
          error && "border-[var(--color-rose-400)] focus:ring-[var(--color-rose-400)]",
          className,
        )}
        {...props}
      />
      {error ? (
        <span className="text-xs text-[var(--color-rose-600)]">{error}</span>
      ) : helperText ? (
        <span className="text-xs text-[var(--color-muted)]">{helperText}</span>
      ) : null}
    </label>
  );
}
