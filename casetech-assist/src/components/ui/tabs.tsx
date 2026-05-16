import * as React from "react";
import { cn } from "@/lib/utils";

export function Tabs({
  items,
  active,
  className,
}: {
  items: string[];
  active: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full gap-1 overflow-x-auto rounded-xl border border-border bg-[#04162A] p-1",
        className,
      )}
      role="tablist"
      aria-label="Search result sections"
    >
      {items.map((item) => (
        <button
          key={item}
          className={cn(
            "h-10 shrink-0 rounded-lg px-4 text-sm font-semibold text-muted-foreground transition",
            item === active && "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(30,136,255,0.28)]",
          )}
          role="tab"
          aria-selected={item === active}
          type="button"
        >
          {item}
        </button>
      ))}
    </div>
  );
}
