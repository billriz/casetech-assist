import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { CaseTechDocument } from "@/lib/mock-documents";

export function RelatedDocumentsPanel({
  document,
  relatedDocuments,
}: {
  document: CaseTechDocument;
  relatedDocuments: CaseTechDocument[];
}) {
  return (
    <div className="space-y-4">
      <Card className="p-5">
        <div className="flex items-center gap-3">
          <Sparkles className="size-5 text-success" />
          <h2 className="text-base font-semibold text-foreground">AI Summary</h2>
        </div>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          {document.aiSummary ??
            "AI summary will appear here after this document is indexed and matched against technician search context."}
        </p>
      </Card>

      <Card className="p-5">
        <h2 className="text-base font-semibold text-foreground">Matching Snippet</h2>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">{document.sampleSnippet}</p>
      </Card>

      <Card className="p-5">
        <h2 className="text-base font-semibold text-foreground">Related Documents</h2>
        <div className="mt-4 space-y-3">
          {relatedDocuments.length > 0 ? (
            relatedDocuments.map((related) => (
              <Link
                key={related.id}
                href={`/documents/${related.id}`}
                className="group block rounded-lg border border-border bg-[#061A30] p-3 transition hover:border-accent"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{related.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {related.manufacturer} {related.model}
                    </p>
                  </div>
                  <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition group-hover:text-accent" />
                </div>
              </Link>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              Related documents will appear as the library grows.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
