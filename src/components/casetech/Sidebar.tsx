import Link from "next/link";
import { CircuitBoard, Menu } from "lucide-react";
import { navigationItems } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function Sidebar({ active = "Home" }: { active?: string }) {
  return (
    <aside className="lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-72 lg:flex-col lg:border-r lg:border-sidebar-border lg:bg-sidebar/95 lg:p-5">
      <div className="flex items-center justify-between border-b border-sidebar-border bg-sidebar px-4 py-4 lg:border-b-0 lg:bg-transparent lg:px-0 lg:py-0">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-xl border border-accent/40 bg-primary/15 text-accent">
            <CircuitBoard className="size-5" />
          </span>
          <span>
            <span className="block text-base font-bold text-foreground">CaseTech Assist</span>
            <span className="block text-xs font-medium text-muted-foreground">
              Technician KB
            </span>
          </span>
        </Link>
        <Menu className="size-5 text-muted-foreground lg:hidden" />
      </div>

      <nav className="flex gap-2 overflow-x-auto border-b border-sidebar-border bg-sidebar px-4 py-3 lg:mt-8 lg:flex-col lg:overflow-visible lg:border-b-0 lg:bg-transparent lg:px-0 lg:py-0">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.label === active;

          return (
            <Link
              href={item.href}
              key={item.label}
              className={cn(
                "flex h-11 shrink-0 items-center gap-3 rounded-lg px-3 text-sm font-semibold text-muted-foreground transition hover:bg-sidebar-accent hover:text-foreground",
                isActive &&
                  "border border-primary/40 bg-primary/15 text-foreground shadow-[inset_3px_0_0_#1E88FF]",
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto hidden rounded-xl border border-sidebar-border bg-[#061A30] p-4 lg:block">
        <p className="text-sm font-semibold text-foreground">Field Support</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          Escalation desk available for priority branch outages and security equipment faults.
        </p>
      </div>
    </aside>
  );
}
