import React from "react";

export function BackgroundOrbs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-[var(--color-primary)] opacity-20 blur-[100px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[var(--color-accent-pink)] opacity-20 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-[40%] left-[60%] w-[30vw] h-[30vw] rounded-full bg-[var(--color-accent-blue)] opacity-15 blur-[90px] animate-pulse" style={{ animationDelay: '4s' }} />
    </div>
  );
}
