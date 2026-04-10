import type { InputHTMLAttributes } from "react";
import { cn } from "../cn";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "flex h-10 w-full rounded-md border border-[var(--color-brown-100)] bg-white px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[var(--color-muted)] focus-visible:border-[var(--color-caramel-300)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(224,153,58,0.18)] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
