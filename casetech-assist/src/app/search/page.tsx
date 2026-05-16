import { AISummaryCard } from "@/components/casetech/AISummaryCard";
import { AppShell } from "@/components/casetech/AppShell";
import { DocumentResultCard } from "@/components/casetech/DocumentResultCard";
import { SearchBar } from "@/components/casetech/SearchBar";
import { Tabs } from "@/components/ui/tabs";
import { documentResults } from "@/lib/mock-data";

export default function SearchResultsPage() {
  return (
    <AppShell active="Search">
      <div className="space-y-6">
        <SearchBar compact defaultValue="NCR 6622 dispenser jam" />

        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            Search Results for “NCR 6622 dispenser jam”
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Ranked results from manuals, bulletins, and technician field fixes.
          </p>
        </div>

        <Tabs items={["AI Summary", "Documents", "Field Fixes"]} active="AI Summary" />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="space-y-4">
            <AISummaryCard />
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Relevant Documents</h2>
              {documentResults.map((result) => (
                <DocumentResultCard key={result.title} {...result} />
              ))}
            </div>
          </section>

          <aside className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="text-base font-semibold text-foreground">Result Filters</h2>
              <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="size-4 accent-[#1E88FF]" />
                  Service manuals
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="size-4 accent-[#1E88FF]" />
                  Field bulletins
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="size-4 accent-[#1E88FF]" />
                  Exact model only
                </label>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="text-base font-semibold text-foreground">Related Error Codes</h2>
              <div className="mt-4 flex flex-wrap gap-2 text-sm">
                {["6622-231", "S2-PRES-04", "JAM-TR-17", "PICK-LOW"].map((code) => (
                  <span
                    key={code}
                    className="rounded-full border border-accent/25 bg-primary/10 px-3 py-1 text-accent"
                  >
                    {code}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}
