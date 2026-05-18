import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "secondary" | "ghost" | "outline";
type ButtonSize = "default" | "sm" | "lg" | "icon" | "icon-sm";

const variants: Record<ButtonVariant, string> = {
  default:
    "bg-primary text-primary-foreground shadow-[0_0_24px_rgba(30,136,255,0.24)] hover:bg-[#3BA7FF]",
  secondary:
    "border border-border bg-secondary text-foreground hover:border-accent hover:bg-[#0E2A4C]",
  ghost: "text-muted-foreground hover:bg-secondary hover:text-foreground",
  outline:
    "border border-border bg-transparent text-foreground hover:border-accent hover:bg-secondary",
};

const sizes: Record<ButtonSize, string> = {
  default: "h-11 px-5 py-2",
  sm: "h-9 px-3 text-sm",
  lg: "h-12 px-6 text-base",
  icon: "size-10",
  "icon-sm": "size-8",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      type = "button",
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
