import { cn } from "@/lib/utils";

export function GlassCard({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("glass-panel rounded-2xl p-8 w-full max-w-md animate-in fade-in zoom-in-95 duration-500 relative", className)}
      {...props}
    >
      {children}
    </div>
  );
}
