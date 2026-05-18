import { Bot, CheckCircle2, Globe2, Library, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { SearchResponse } from "@/lib/search-types";

export function AISummaryCard({
  aiSummary,
  recommendedSteps,
  isMock = false,
  mode = "internal",
  confidence,
  warning,
}: {
  aiSummary: string;
  recommendedSteps: string[];
  isMock?: boolean;
  mode?: SearchResponse["mode"];
  confidence?: number;
  warning?: string;
}) {
  const isExternal = mode === "external_fallback";

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-border bg-primary/10 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Bot className="size-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-foreground">AI Summary</h2>
              <p className="text-sm text-muted-foreground">
                {isExternal
                  ? "Generated from external Google-grounded search"
                  : "Generated from your indexed knowledge base"}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge
              className={
                isExternal
                  ? "border-amber-400/40 bg-amber-400/10 text-amber-100"
                  : "border-success/40 bg-success/10 text-success"
              }
            >
              {isExternal ? <Globe2 className="mr-1.5 size-3" /> : <Library className="mr-1.5 size-3" />}
              {isExternal ? "External Google AI Search" : "Internal Knowledge Base"}
            </Badge>
            {typeof confidence === "number" && (
              <Badge>{Math.round(confidence * 100)}% confidence</Badge>
            )}
          </div>
        </div>
      </div>
      <div className="p-5">
        <p className="text-sm leading-6 text-muted-foreground">{aiSummary}</p>

        <h3 className="mt-6 text-sm font-semibold uppercase tracking-[0.14em] text-success">
          Recommended Steps
        </h3>
        <ol className="mt-4 space-y-3">
          {recommendedSteps.map((step) => (
            <li key={step} className="flex gap-3 text-sm leading-6 text-foreground">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
              <span>{step}</span>
            </li>
          ))}
        </ol>

        <div className="mt-6 flex gap-3 rounded-lg border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-100">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" />
          <span>
            {warning ??
            (isExternal
              ? "External results are not company-approved fixes. Verify with Case Financial procedures and official manufacturer documentation."
              : isMock
              ? "Using mock results because Google Vertex AI Search is not configured."
              : "AI generated. Please verify with official manuals.")}
          </span>
        </div>
      </div>
    </Card>
  );
}
