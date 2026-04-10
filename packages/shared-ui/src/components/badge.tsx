import { clsx } from "clsx";

const badgeClasses = {
  in_stock:
    "border border-[var(--color-sage-100)] bg-[var(--color-sage-50)] text-[var(--color-sage-600)]",
  out_of_stock:
    "border border-[var(--color-rose-100)] bg-[var(--color-rose-50)] text-[var(--color-rose-600)]",
  on_sale:
    "border border-[var(--color-caramel-100)] bg-[var(--color-caramel-50)] text-[var(--color-caramel-600)]",
  new: "border border-[var(--color-brown-100)] bg-[var(--color-brown-50)] text-[var(--color-brown-600)]",
} as const;

export function Badge({
  label,
  variant,
}: {
  label: string;
  variant: keyof typeof badgeClasses;
}) {
  return (
    <span
      className={clsx(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize",
        badgeClasses[variant],
      )}
    >
      {label}
    </span>
  );
}
