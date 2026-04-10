import type { PropsWithChildren } from "react";
import { cn } from "../cn";

export function SectionCard({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_18px_60px_rgba(16,24,40,0.08)] backdrop-blur-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}
