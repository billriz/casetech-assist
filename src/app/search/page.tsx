import { Suspense } from "react";
import { AppShell } from "@/components/casetech/AppShell";
import { SearchResultsClient } from "@/components/casetech/SearchResultsClient";

export default function SearchResultsPage() {
  return (
    <AppShell active="Search">
      <Suspense fallback={<div className="text-sm text-muted-foreground">Loading search...</div>}>
        <SearchResultsClient />
      </Suspense>
    </AppShell>
  );
}
