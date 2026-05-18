import Link from "next/link";
import { ArrowUpRight, FileText, FolderOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { findMockDocumentForSearchResult, getDocumentIdFromPath } from "@/lib/mock-documents";
import type { SearchResult } from "@/lib/search-types";

export function DocumentResultCard({
  id,
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
  const matchedDocument = findMockDocumentForSearchResult({ id, title, sourceUrl });
  const sourceDocumentId = getDocumentIdFromPath(sourceUrl);
  const documentHref = new URLSearchParams();

  if (typeof pageNumber === "number") {
    documentHref.set("page", String(pageNumber));
  }

  const openDocumentPath =
    matchedDocument || sourceDocumentId
      ? `/documents/${matchedDocument?.id ?? sourceDocumentId}`
      : "/documents";
  const openDocumentQuery = documentHref.toString();
  const openDocumentHref = openDocumentQuery
    ? `${openDocumentPath}?${openDocumentQuery}`
    : openDocumentPath;

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
        <div className="flex shrink-0 flex-wrap gap-2 sm:ml-4 sm:flex-col">
          <Link
            href={openDocumentHref}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-[0_0_24px_rgba(30,136,255,0.24)] transition hover:bg-[#3BA7FF]"
          >
            <FolderOpen className="size-4" />
            Open Document
          </Link>
          <Link
            href={sourceUrl}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-secondary px-5 text-sm font-semibold text-foreground transition hover:border-accent hover:bg-[#0E2A4C]"
          >
            Source
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </div>
    </Card>
  );
}
