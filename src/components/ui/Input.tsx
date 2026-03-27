import { cn } from "@/lib/utils";
import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, ...props }, ref) => {
    return (
      <div className="relative glow-border rounded-xl">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-base-content)] opacity-50 z-10 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            "flex w-full rounded-xl border border-white/10 bg-[var(--color-base-300)]/50 px-4 py-3 text-sm text-[var(--color-base-content)] placeholder:text-[var(--color-base-content)] opacity-80 focus:opacity-100 focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]/50 transition-all",
            icon && "pl-11",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";
