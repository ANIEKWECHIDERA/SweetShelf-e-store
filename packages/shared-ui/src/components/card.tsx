import type { HTMLAttributes } from "react";
import { cn } from "../cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-white/60 bg-white/90 shadow-[0_18px_60px_rgba(16,24,40,0.08)] backdrop-blur-sm",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1.5 p-3 sm:p-4 lg:p-5", className)} {...props} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-lg font-semibold tracking-tight text-[var(--color-brown-900)] sm:text-xl lg:text-2xl", className)} {...props} />;
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm leading-6 text-[var(--color-muted)] sm:text-base", className)} {...props} />;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-3 pb-3 sm:px-4 sm:pb-4 lg:px-5 lg:pb-5", className)} {...props} />;
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center p-3 pt-0 sm:p-4 sm:pt-0 lg:p-5 lg:pt-0", className)} {...props} />;
}
