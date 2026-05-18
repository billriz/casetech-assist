import Link from "next/link";
import { Download, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { CaseTechDocument } from "@/lib/mock-documents";

export function DocumentCard({ document }: { document: CaseTechDocument }) {
  return (
    <Card className="flex h-full flex-col p-5">
      <div className="flex items-start gap-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-accent/35 bg-primary/15 text-accent">
          <FileText className="size-5" />
        </span>
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-foreground">{document.title}</h2>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
            {document.description}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Badge>{document.documentType}</Badge>
        <Badge>{document.equipmentType}</Badge>
        <Badge>{document.manufacturer}</Badge>
        <Badge>{document.model}</Badge>
        <Badge className="border-accent/25 bg-primary/10 text-accent">
          {document.fileType.toUpperCase()}
        </Badge>
      </div>

      <dl className="mt-5 space-y-2 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Upload date</dt>
          <dd className="font-medium text-foreground">
            {new Date(document.uploadDate).toLocaleDateString()}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Source path</dt>
          <dd className="max-w-[12rem] truncate text-right font-medium text-foreground">
            {document.bucketPath}
          </dd>
        </div>
      </dl>

      <div className="mt-auto flex flex-wrap gap-2 pt-5">
        <Link
          href={`/documents/${document.id}`}
          className="inline-flex h-10 flex-1 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-[0_0_24px_rgba(30,136,255,0.24)] transition hover:bg-[#3BA7FF]"
        >
          View
        </Link>
        <a
          href={`/api/documents/${document.id}/signed-url?download=1`}
          className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-secondary px-4 text-sm font-semibold text-foreground transition hover:border-accent hover:bg-[#0E2A4C]"
        >
          <Download className="size-4" />
          Download
        </a>
      </div>
    </Card>
  );
}
