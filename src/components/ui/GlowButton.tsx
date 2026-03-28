import { cn } from "@/lib/utils";
import React from "react";

export interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
  isLoading?: boolean;
}

export const GlowButton = React.forwardRef<HTMLButtonElement, GlowButtonProps>(
  ({ className, variant = "primary", isLoading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={isLoading || props.disabled}
        className={cn(
          "relative inline-flex items-center justify-center rounded-xl px-4 py-3 font-medium transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none",
          variant === "primary" &&
            "bg-[linear-gradient(to_right,var(--color-primary),var(--color-accent-pink),var(--color-primary))] bg-[length:200%_auto] text-[var(--color-primary-content)] hover:bg-[position:right_center] shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_25px_rgba(236,72,153,0.5)]",
          variant === "ghost" &&
            "bg-transparent text-[var(--color-base-content)] hover:bg-white/5 border border-transparent hover:border-white/10",
          className
        )}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Cargando...</span>
          </div>
        ) : children}
      </button>
    );
  }
);

GlowButton.displayName = "GlowButton";
