import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        success:
          "border-[var(--color-sage-100)] bg-[var(--color-sage-50)] text-[var(--color-sage-600)]",
        destructive:
          "border-[var(--color-rose-100)] bg-[var(--color-rose-50)] text-[var(--color-rose-600)]",
        warning:
          "border-[var(--color-caramel-100)] bg-[var(--color-caramel-50)] text-[var(--color-caramel-600)]",
        secondary: "border-[var(--color-brown-100)] bg-[var(--color-brown-50)] text-[var(--color-brown-800)]",
        outline: "border-[var(--color-brown-100)] bg-white text-[var(--color-brown-800)]",
      },
    },
    defaultVariants: {
      variant: "secondary",
    },
  },
);

type BadgeProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
