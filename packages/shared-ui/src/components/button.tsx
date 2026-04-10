import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "border border-[rgba(166,104,44,0.18)] bg-[var(--color-caramel-400)] text-white shadow-[0_14px_30px_rgba(224,153,58,0.28),inset_0_1px_0_rgba(255,255,255,0.18)] hover:bg-[var(--color-caramel-500)]",
        secondary:
          "bg-[var(--color-brown-900)] text-white hover:bg-[var(--color-brown-800)]",
        outline:
          "border border-[var(--color-brown-100)] bg-white text-[var(--color-brown-800)] hover:border-[var(--color-caramel-200)] hover:bg-[var(--color-caramel-50)]",
        ghost: "bg-transparent text-[var(--color-brown-800)] hover:bg-white/70",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "size-11 rounded-full",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    fullWidth?: boolean;
  } & VariantProps<typeof buttonVariants>
>;

export function Button({
  children,
  className,
  variant = "default",
  size,
  fullWidth = false,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, fullWidth, className }))}
      {...props}
    >
      {children}
    </button>
  );
}
