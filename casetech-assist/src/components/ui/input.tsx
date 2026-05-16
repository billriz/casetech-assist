import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({
  className,
  type = "text",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-lg border border-border bg-[#061A30] px-3 text-sm text-foreground shadow-inner outline-none transition placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-ring/25",
        className,
      )}
      {...props}
    />
  );
}
