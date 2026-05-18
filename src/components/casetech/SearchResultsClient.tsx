"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUpRight, FileText, FolderOpen, Globe2, TriangleAlert } from "lucide-react";
import { AISummaryCard } from "@/components/casetech/AISummaryCard";
import { DocumentResultCard } from "@/components/casetech/DocumentResultCard";
import { SearchBar } from "@/components/casetech/SearchBar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import type { SearchResponse, SearchSource } from "@/lib/search-types";

const DEFAULT_QUERY = "NCR 6622 dispenser jam";

function SourceCard({ source }: { source: SearchSource }) {
  const isExternal = source.type === "external_web";
  const href =
    !isExternal && typeof source.pageNumber === "number"
      ? `${source.uri}?page=${source.pageNumber}`
      : source.uri;

  return (
    <Card className="p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-accent/35 bg-primary/15 text-accent">
            {isExternal ? <Globe2 className="size-5" /> : <FileText className="size-5" />}
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-foreground">{source.title}</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge>{isExternal ? "External web" : "Internal document"}</Badge>
              {!isExternal && typeof source.pageNumber === "number" && (
                <Badge>Page {source.pageNumber}</Badge>
              )}
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{source.snippet}</p>
            {isExternal && <p className="mt-2 break-all text-xs text-muted-foreground">{source.uri}</p>}
          </div>
        </div>
        <Link
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noreferrer" : undefined}
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-border bg-secondary px-4 text-sm font-semibold text-foreground transition hover:border-accent hover:bg-[#0E2A4C]"
        >
          {isExternal ? <ArrowUpRight className="size-4" /> : <FolderOpen className="size-4" />}
          {isExternal ? "Open Source" : "Open Document"}
        </Link>
      </div>
    </Card>
  );
}

export function SearchResultsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || DEFAULT_QUERY;
  const [data, setData] = useState<SearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [allowExternalFallback, setAllowExternalFallback] = useState(true);

  const fetchSearch = useCallback(async (nextQuery: string, signal?: AbortSignal) => {
    const response = await fetch("/api/ai-search", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: nextQuery,
        allowExternalFallback,
      }),
      signal,
    });

    if (!response.ok) {
      throw new Error("Search request failed");
    }

    return response.json() as Promise<SearchResponse>;
  }, [allowExternalFallback]);

  async function search(nextQuery: string, updateUrl = true) {
    setIsLoading(true);
    setError(null);

    if (updateUrl && nextQuery !== query) {
      router.replace(`/search?q=${encodeURIComponent(nextQuery)}`);
      return;
    }

    try {
      const payload = await fetchSearch(nextQuery);
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

    fetchSearch(query, controller.signal)
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
  }, [query, fetchSearch]);

  return (
    <div className="space-y-6">
      <SearchBar key={query} compact defaultValue={query} isLoading={isLoading} onSearch={search} />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            Search Results for &ldquo;{query}&rdquo;
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Ranked results from manuals, bulletins, technician field fixes, and approved fallback sources.
          </p>
        </div>
        {data && (
          <Badge
            className={
              data.mode === "external_fallback"
                ? "border-amber-400/40 bg-amber-400/10 text-amber-100"
                : "border-success/40 bg-success/10 text-success"
            }
          >
            {data.mode === "external_fallback" ? "External Google AI Search" : "Internal Knowledge Base"}
          </Badge>
        )}
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
                aiSummary={data.answer}
                recommendedSteps={data.recommendedSteps}
                isMock={data.source === "mock"}
                mode={data.mode}
                confidence={data.confidence}
                warning={data.warning}
              />
              {data.mode === "external_fallback" && (
                <div className="flex gap-3 rounded-lg border border-amber-400/30 bg-amber-400/10 p-4 text-sm leading-6 text-amber-100">
                  <TriangleAlert className="mt-0.5 size-4 shrink-0" />
                  <span>
                    No strong internal match was found. These results come from external Google-grounded AI search and may not reflect Case Financial procedures. Verify before performing repairs or ordering parts.
                  </span>
                </div>
              )}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Sources</h2>
                {data.sources.length > 0 ? (
                  data.sources.map((source) => (
                    <SourceCard key={`${source.type}-${source.uri}-${source.pageNumber ?? "source"}`} source={source} />
                  ))
                ) : (
                  <div className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
                    No cited sources were returned for this search.
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Relevant Documents</h2>
                {data.documents.length > 0 ? (
                  data.documents.map((result) => (
                    <DocumentResultCard key={`${result.title}-${result.sourceUrl}`} {...result} />
                  ))
                ) : (
                  <div className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
                    No internal documents were returned.
                  </div>
                )}
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
              <label className="flex items-center gap-3 text-foreground">
                <input
                  type="checkbox"
                  checked={allowExternalFallback}
                  onChange={(event) => {
                    setIsLoading(true);
                    setAllowExternalFallback(event.target.checked);
                  }}
                  className="size-4 accent-[#1E88FF]"
                />
                Allow external Google AI fallback
              </label>
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
