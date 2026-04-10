import { cva } from "class-variance-authority";
import { cn } from "../cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
  {
    variants: {
      variant: {
        in_stock:
          "border-[var(--color-sage-100)] bg-[var(--color-sage-50)] text-[var(--color-sage-600)]",
        out_of_stock:
          "border-[var(--color-rose-100)] bg-[var(--color-rose-50)] text-[var(--color-rose-600)]",
        on_sale:
          "border-[var(--color-caramel-100)] bg-[var(--color-caramel-50)] text-[var(--color-caramel-600)]",
        new: "border-[var(--color-brown-100)] bg-[var(--color-brown-50)] text-[var(--color-brown-800)]",
      },
    },
  },
);

export function Badge({
  label,
  variant,
}: {
  label: string;
  variant: "in_stock" | "out_of_stock" | "on_sale" | "new";
}) {
  return (
    <span className={cn(badgeVariants({ variant }))}>
      {label}
    </span>
  );
}
