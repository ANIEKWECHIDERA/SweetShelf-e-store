import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { clsx } from "clsx";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    fullWidth?: boolean;
  }
>;

const variantClassName: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--color-caramel-400)] text-white hover:bg-[var(--color-caramel-500)]",
  secondary:
    "border border-[var(--color-brown-100)] bg-transparent text-[var(--color-brown-800)] hover:bg-[var(--color-brown-50)]",
  ghost: "bg-transparent text-[var(--color-caramel-500)] hover:underline",
};

export function Button({
  children,
  className,
  variant = "primary",
  fullWidth,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "rounded-xl px-5 py-3 text-sm font-medium transition-transform duration-150 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40",
        variantClassName[variant as ButtonVariant],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
