"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const PdfViewerClient = dynamic(
  () => import("@/components/casetech/PdfViewerClient").then((mod) => mod.PdfViewerClient),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[520px] items-center justify-center gap-3 rounded-xl border border-border bg-[#031427] text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin text-accent" />
        Loading PDF viewer...
      </div>
    ),
  },
);

export type PdfViewerProps = {
  documentId: string;
  initialPage?: number;
  fallbackUrl?: string;
};

export function PdfViewer(props: PdfViewerProps) {
  return <PdfViewerClient {...props} />;
}
