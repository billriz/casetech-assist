import { CalendarDays, Database, FileType, Tags } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { CaseTechDocument } from "@/lib/mock-documents";

export function DocumentMetadataPanel({
  document,
  pageNumber,
}: {
  document: CaseTechDocument;
  pageNumber?: number;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-lg border border-accent/35 bg-primary/15 text-accent">
          <FileType className="size-5" />
        </span>
        <div>
          <p className="text-sm font-semibold text-foreground">Document Metadata</p>
          <p className="text-xs text-muted-foreground">{document.fileType.toUpperCase()} source</p>
        </div>
      </div>

      <dl className="mt-5 space-y-3 text-sm">
        {[
          ["Document type", document.documentType],
          ["Equipment type", document.equipmentType],
          ["Manufacturer", document.manufacturer],
          ["Model", document.model],
          ["File type", document.fileType.toUpperCase()],
          ["Page", typeof pageNumber === "number" ? String(pageNumber) : "Not specified"],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="text-right font-medium text-foreground">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-5 space-y-3 border-t border-border pt-5">
        <div className="flex items-start gap-3 text-sm text-muted-foreground">
          <CalendarDays className="mt-0.5 size-4 shrink-0 text-accent" />
          <span>Uploaded {new Date(document.uploadDate).toLocaleDateString()}</span>
        </div>
        <div className="flex items-start gap-3 text-sm text-muted-foreground">
          <Database className="mt-0.5 size-4 shrink-0 text-accent" />
          <span className="break-all">{document.bucketPath}</span>
        </div>
        <div className="flex items-start gap-3">
          <Tags className="mt-1 size-4 shrink-0 text-accent" />
          <div className="flex flex-wrap gap-2">
            {document.tags.map((tag) => (
              <Badge key={tag} className="border-accent/25 bg-primary/10 text-accent">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
