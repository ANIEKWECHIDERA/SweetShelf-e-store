import type { PropsWithChildren } from "react";
import { clsx } from "clsx";

export function SectionCard({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={clsx(
        "rounded-[24px] border border-[var(--color-brown-100)] bg-white p-5 shadow-[0_4px_24px_rgba(61,43,31,0.08)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
