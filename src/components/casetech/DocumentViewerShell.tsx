import { AlertTriangle, FileQuestion, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { DocumentActions } from "@/components/casetech/DocumentActions";
import { DocumentMetadataPanel } from "@/components/casetech/DocumentMetadataPanel";
import { PdfViewer } from "@/components/casetech/PdfViewer";
import { RelatedDocumentsPanel } from "@/components/casetech/RelatedDocumentsPanel";
import type { CaseTechDocument } from "@/lib/mock-documents";

function PreviewUnavailable({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <Card className="flex min-h-[420px] flex-col items-center justify-center p-8 text-center">
      <FileQuestion className="size-12 text-accent" />
      <h2 className="mt-4 text-xl font-semibold text-foreground">{title}</h2>
      <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">{message}</p>
    </Card>
  );
}

export function DocumentViewerShell({
  document,
  relatedDocuments,
  pageNumber,
}: {
  document: CaseTechDocument;
  relatedDocuments: CaseTechDocument[];
  pageNumber?: number;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-5 rounded-2xl border border-border bg-[#061226]/90 p-5 shadow-[0_24px_90px_rgba(0,0,0,0.32)] sm:p-6 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap gap-2">
            <Badge>{document.documentType}</Badge>
            <Badge>{document.equipmentType}</Badge>
            <Badge>{document.manufacturer}</Badge>
            <Badge>{document.model}</Badge>
            <Badge className="border-accent/25 bg-primary/10 text-accent">
              {document.fileType.toUpperCase()}
            </Badge>
            {typeof pageNumber === "number" && <Badge>Page {pageNumber}</Badge>}
          </div>
          <h1 className="mt-4 text-2xl font-bold text-foreground sm:text-3xl">
            {document.title}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
            {document.description}
          </p>
          <p className="mt-3 break-all text-xs text-muted-foreground">
            Source path: {document.bucketPath}
          </p>
        </div>

        <DocumentActions documentId={document.id} fallbackUrl={document.publicUrl} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section className="space-y-4">
          {document.fileType === "pdf" && (
            <PdfViewer
              documentId={document.id}
              fallbackUrl={document.publicUrl}
              initialPage={pageNumber ?? 1}
            />
          )}

          {document.fileType === "docx" && (
            <PreviewUnavailable
              title="Preview not available yet."
              message="DOCX rendering is not enabled in CaseTech Assist yet. Download document to view it in your workstation editor."
            />
          )}

          {document.fileType === "txt" && (
            <Card className="p-5 sm:p-7">
              <div className="mb-5 flex items-center gap-3">
                <FileText className="size-5 text-accent" />
                <h2 className="text-lg font-semibold text-foreground">Text Preview</h2>
              </div>
              <pre className="whitespace-pre-wrap rounded-xl border border-border bg-[#031427] p-5 font-mono text-sm leading-7 text-muted-foreground">
                {document.mockText ?? "No text preview is available for this document."}
              </pre>
            </Card>
          )}

          {document.fileType === "unknown" && (
            <PreviewUnavailable
              title="Download-only document"
              message="This file type is not recognized by the in-app previewer. Use Download to open it with the appropriate service tool or desktop application."
            />
          )}

          <Card className="p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 size-5 shrink-0 text-success" />
              <p className="text-sm leading-6 text-muted-foreground">
                Verify all site safety steps and branch procedures before servicing active
                banking equipment. Private production files should be accessed with temporary
                signed URLs only.
              </p>
            </div>
          </Card>
        </section>

        <aside className="space-y-4">
          <DocumentMetadataPanel document={document} pageNumber={pageNumber} />
          <RelatedDocumentsPanel document={document} relatedDocuments={relatedDocuments} />
        </aside>
      </div>
    </div>
  );
}
