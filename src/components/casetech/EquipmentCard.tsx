import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";

export function EquipmentCard({
  title,
  description,
  icon: Icon,
  count,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  count: string;
}) {
  return (
    <Card className="group p-5 transition hover:-translate-y-0.5 hover:border-accent/70 hover:bg-[#0A2340]">
      <div className="flex items-start justify-between gap-4">
        <span className="flex size-12 items-center justify-center rounded-xl border border-accent/35 bg-primary/15 text-accent">
          <Icon className="size-5" />
        </span>
        <ArrowRight className="size-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-accent" />
      </div>
      <h3 className="mt-5 text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">{description}</p>
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-success">
        {count}
      </p>
    </Card>
  );
}
