import type { InputHTMLAttributes } from "react";
import { cn } from "../cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  helperText?: string;
};

export function Input({ label, error, helperText, className, ...props }: InputProps) {
  return (
    <label className="flex flex-col gap-2 text-sm text-[var(--color-brown-800)]">
      <span className="font-medium tracking-[0.02em]">{label}</span>
      <input
        className={cn(
          "flex h-12 w-full rounded-2xl border border-[var(--color-brown-100)] bg-white px-4 py-3 shadow-[0_1px_2px_rgba(16,24,40,0.03)] outline-none transition focus:border-[var(--color-caramel-300)] focus:ring-4 focus:ring-[rgba(224,153,58,0.12)]",
          error && "border-[var(--color-rose-400)] focus:border-[var(--color-rose-400)] focus:ring-[rgba(201,125,114,0.12)]",
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
