import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../cn";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-4 py-2 text-center text-sm font-semibold leading-none transition-colors shadow-sm before:inline-block before:size-2 before:rounded-full before:content-['']",
  {
    variants: {
      variant: {
        success:
          "border-[rgba(86,99,80,0.14)] bg-[#e9f7ef] text-[#157347] before:bg-[#157347]",
        destructive:
          "border-[rgba(168,90,81,0.14)] bg-[#fff1f1] text-[#c2410c] before:bg-[#c2410c]",
        warning:
          "border-[rgba(166,104,44,0.14)] bg-[#fff3dc] text-[#c67d1c] before:bg-[#c67d1c]",
        secondary:
          "border-[rgba(61,43,31,0.1)] bg-[#f6efe8] text-[var(--color-brown-800)] before:bg-[var(--color-brown-800)]",
        outline:
          "border-[rgba(61,43,31,0.08)] bg-[#f9f7f4] text-[var(--color-brown-800)] before:bg-[var(--color-brown-800)]",
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
