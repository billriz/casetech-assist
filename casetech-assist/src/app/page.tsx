import { Activity, AlertCircle, Clock3, Search, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/casetech/AppShell";
import { EquipmentCard } from "@/components/casetech/EquipmentCard";
import { InfoCard } from "@/components/casetech/InfoCard";
import { SearchBar } from "@/components/casetech/SearchBar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  announcements,
  equipmentCategories,
  popularSearches,
  quickMetrics,
  recentSearches,
  trustCards,
} from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <AppShell active="Home">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="space-y-6">
          <div className="rounded-2xl border border-border bg-[#061226]/80 p-6 shadow-[0_24px_90px_rgba(0,0,0,0.32)] sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <Badge className="border-accent/40 bg-primary/15 text-accent">
                  Internal troubleshooting knowledge base
                </Badge>
                <h1 className="mt-5 text-3xl font-bold tracking-normal text-foreground sm:text-4xl">
                  Welcome back, Technician
                </h1>
                <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
                  Search knowledge base, manuals, bulletins, and field fixes.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {quickMetrics.map((metric) => {
                  const Icon = metric.icon;
                  return (
                    <div
                      key={metric.label}
                      className="rounded-xl border border-border bg-card px-4 py-3"
                    >
                      <Icon className="size-4 text-accent" />
                      <p className="mt-2 text-xl font-bold text-foreground">{metric.value}</p>
                      <p className="text-xs text-muted-foreground">{metric.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-8">
              <SearchBar />
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {popularSearches.map((search) => (
                <Badge
                  key={search}
                  className="cursor-default border-accent/25 bg-[#061A30] text-foreground"
                >
                  <Search className="mr-1.5 size-3" />
                  {search}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Equipment</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Jump into documents by service category.
                </p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {equipmentCategories.map((category) => (
                <EquipmentCard key={category.title} {...category} />
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {trustCards.map((card) => (
              <InfoCard
                key={card.title}
                title={card.title}
                description={card.description}
                icon={card.icon}
              />
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          <InfoCard title="System Announcements" icon={AlertCircle}>
            <div className="space-y-4">
              {announcements.map((item) => (
                <div key={item.title} className="rounded-lg border border-border bg-[#061A30] p-4">
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.detail}</p>
                </div>
              ))}
            </div>
          </InfoCard>

          <InfoCard title="Recent Searches" icon={Clock3}>
            <div className="space-y-3">
              {recentSearches.map((search) => (
                <div
                  key={search}
                  className="flex items-center gap-3 rounded-lg border border-border bg-[#061A30] p-3"
                >
                  <Activity className="size-4 shrink-0 text-accent" />
                  <span className="text-sm text-muted-foreground">{search}</span>
                </div>
              ))}
            </div>
          </InfoCard>

          <Card className="p-5">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-lg bg-success/10 text-success">
                <ShieldCheck className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">Security Status</p>
                <p className="text-xs text-muted-foreground">All internal services nominal</p>
              </div>
            </div>
          </Card>
        </aside>
      </div>
    </AppShell>
  );
}
