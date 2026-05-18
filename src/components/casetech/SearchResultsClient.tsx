"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AISummaryCard } from "@/components/casetech/AISummaryCard";
import { DocumentResultCard } from "@/components/casetech/DocumentResultCard";
import { SearchBar } from "@/components/casetech/SearchBar";
import { Tabs } from "@/components/ui/tabs";
import type { SearchResponse } from "@/lib/search-types";

const DEFAULT_QUERY = "NCR 6622 dispenser jam";

export function SearchResultsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || DEFAULT_QUERY;
  const [data, setData] = useState<SearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function search(nextQuery: string, updateUrl = true) {
    setIsLoading(true);
    setError(null);

    if (updateUrl && nextQuery !== query) {
      router.replace(`/search?q=${encodeURIComponent(nextQuery)}`);
      return;
    }

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(nextQuery)}`, {
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Search request failed");
      }

      const payload = (await response.json()) as SearchResponse;
      setData(payload);
    } catch {
      setError("Search is temporarily unavailable. Please try again.");
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/search?q=${encodeURIComponent(query)}`, {
      headers: {
        Accept: "application/json",
      },
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Search request failed");
        }

        return response.json() as Promise<SearchResponse>;
      })
      .then((payload) => {
        setData(payload);
        setError(null);
      })
      .catch((fetchError: unknown) => {
        if (fetchError instanceof DOMException && fetchError.name === "AbortError") {
          return;
        }

        setError("Search is temporarily unavailable. Please try again.");
        setData(null);
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [query]);

  return (
    <div className="space-y-6">
      <SearchBar key={query} compact defaultValue={query} isLoading={isLoading} onSearch={search} />

      <div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          Search Results for &ldquo;{query}&rdquo;
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Ranked results from manuals, bulletins, and technician field fixes.
        </p>
      </div>

      <Tabs items={["AI Summary", "Documents", "Field Fixes"]} active="AI Summary" />

      {error && (
        <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-rose-100">
          {error}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="space-y-4">
          {data ? (
            <>
              <AISummaryCard
                aiSummary={data.aiSummary}
                recommendedSteps={data.recommendedSteps}
                isMock={data.source === "mock"}
              />
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Relevant Documents</h2>
                {data.results.map((result) => (
                  <DocumentResultCard key={`${result.title}-${result.sourceUrl}`} {...result} />
                ))}
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
              {isLoading ? "Searching knowledge base..." : "No results to display."}
            </div>
          )}
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
  );
}
