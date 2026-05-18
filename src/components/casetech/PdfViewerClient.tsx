"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, ChevronLeft, ChevronRight, Loader2, Minus, Plus } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Button } from "@/components/ui/button";
import type { PdfViewerProps } from "@/components/casetech/PdfViewer";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

export function PdfViewerClient({
  documentId,
  initialPage = 1,
}: PdfViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(760);
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState(Math.max(1, initialPage));
  const [scale, setScale] = useState(1);
  const fileUrl = `/api/documents/${encodeURIComponent(documentId)}/file`;

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const pageWidth = Math.max(260, Math.min(containerWidth - 24, 900) * scale);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-[#031427]" ref={containerRef}>
      <div className="flex flex-col gap-3 border-b border-border bg-[#061A30] p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="icon-sm"
            aria-label="Previous page"
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber((current) => Math.max(1, current - 1))}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <span className="min-w-28 text-center text-sm font-semibold text-foreground">
            Page {pageNumber}
            {numPages ? ` of ${numPages}` : ""}
          </span>
          <Button
            variant="secondary"
            size="icon-sm"
            aria-label="Next page"
            disabled={Boolean(numPages && pageNumber >= numPages)}
            onClick={() =>
              setPageNumber((current) => (numPages ? Math.min(numPages, current + 1) : current + 1))
            }
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="icon-sm"
            aria-label="Zoom out"
            disabled={scale <= 0.7}
            onClick={() => setScale((current) => Math.max(0.7, Number((current - 0.1).toFixed(1))))}
          >
            <Minus className="size-4" />
          </Button>
          <span className="min-w-14 text-center text-sm font-semibold text-muted-foreground">
            {Math.round(scale * 100)}%
          </span>
          <Button
            variant="secondary"
            size="icon-sm"
            aria-label="Zoom in"
            disabled={scale >= 1.6}
            onClick={() => setScale((current) => Math.min(1.6, Number((current + 0.1).toFixed(1))))}
          >
            <Plus className="size-4" />
          </Button>
        </div>
      </div>

      <div className="min-h-[520px] overflow-auto p-3 sm:p-5">
        <Document
          file={fileUrl}
          loading={
            <div className="flex min-h-[420px] items-center justify-center gap-3 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin text-accent" />
              Loading PDF...
            </div>
          }
          error={
            <div className="flex min-h-[420px] flex-col items-center justify-center gap-3 rounded-lg border border-destructive/40 bg-destructive/10 p-6 text-center">
              <AlertTriangle className="size-8 text-destructive" />
              <p className="text-sm font-semibold text-foreground">PDF preview failed to load.</p>
              <p className="max-w-md text-sm leading-6 text-muted-foreground">
                The document can still be downloaded from the actions above.
              </p>
            </div>
          }
          onLoadSuccess={({ numPages: nextNumPages }) => {
            setNumPages(nextNumPages);
            setPageNumber((current) => Math.min(Math.max(1, current), nextNumPages));
          }}
        >
          <Page
            className="mx-auto overflow-hidden rounded-lg bg-white shadow-[0_24px_80px_rgba(0,0,0,0.42)]"
            pageNumber={pageNumber}
            width={pageWidth}
          />
        </Document>
      </div>
    </div>
  );
}
