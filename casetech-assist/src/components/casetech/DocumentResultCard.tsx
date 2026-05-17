import Link from "next/link";
import { ArrowUpRight, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { SearchResult } from "@/lib/search-types";

export function DocumentResultCard({
  title,
  documentType,
  equipmentType,
  manufacturer,
  model,
  snippet,
  sourceUrl,
  pageNumber,
  relevanceScore,
}: SearchResult) {
  const matchPercent =
    typeof relevanceScore === "number" ? Math.round(relevanceScore * 100) : undefined;

  return (
    <Card className="p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-accent/35 bg-primary/15 text-accent">
            <FileText className="size-5" />
          </span>
          <div>
            <h3 className="text-base font-semibold text-foreground">{title}</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge>{documentType}</Badge>
              <Badge>{equipmentType}</Badge>
              <Badge>{manufacturer}</Badge>
              <Badge>{model}</Badge>
              {typeof pageNumber === "number" && <Badge>Page {pageNumber}</Badge>}
              {typeof matchPercent === "number" && (
                <Badge className="border-success/40 bg-success/10 text-success">
                  {matchPercent}% match
                </Badge>
              )}
            </div>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-muted-foreground">
              {snippet}
            </p>
          </div>
        </div>
        <Link
          href={sourceUrl}
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-[0_0_24px_rgba(30,136,255,0.24)] transition hover:bg-[#3BA7FF] sm:ml-4"
        >
          Source
          <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </Card>
  );
}
