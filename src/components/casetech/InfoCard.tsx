import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function InfoCard({
  title,
  description,
  icon: Icon,
  children,
  className,
}: {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-start gap-3">
        {Icon ? (
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-accent">
            <Icon className="size-5" />
          </span>
        ) : null}
        <div>
          <CardTitle>{title}</CardTitle>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </div>
      </CardHeader>
      {children ? <CardContent>{children}</CardContent> : null}
    </Card>
  );
}
