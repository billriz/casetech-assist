import Link from "next/link";
import { Download, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { CaseTechDocument } from "@/lib/mock-documents";

export function DocumentTable({ documents }: { documents: CaseTechDocument[] }) {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] text-left text-sm">
          <thead className="border-b border-border bg-[#061A30] text-xs uppercase tracking-[0.12em] text-muted-foreground">
            <tr>
              <th className="px-5 py-4 font-semibold">Document</th>
              <th className="px-5 py-4 font-semibold">Type</th>
              <th className="px-5 py-4 font-semibold">Equipment</th>
              <th className="px-5 py-4 font-semibold">Manufacturer</th>
              <th className="px-5 py-4 font-semibold">Model</th>
              <th className="px-5 py-4 font-semibold">File</th>
              <th className="px-5 py-4 font-semibold">Uploaded</th>
              <th className="px-5 py-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {documents.map((document) => (
              <tr key={document.id} className="transition hover:bg-secondary/45">
                <td className="max-w-[18rem] px-5 py-4">
                  <p className="font-semibold text-foreground">{document.title}</p>
                  <p className="mt-1 truncate text-xs text-muted-foreground">{document.bucketPath}</p>
                </td>
                <td className="px-5 py-4 text-muted-foreground">{document.documentType}</td>
                <td className="px-5 py-4 text-muted-foreground">{document.equipmentType}</td>
                <td className="px-5 py-4 text-muted-foreground">{document.manufacturer}</td>
                <td className="px-5 py-4 text-muted-foreground">{document.model}</td>
                <td className="px-5 py-4">
                  <Badge className="border-accent/25 bg-primary/10 text-accent">
                    {document.fileType.toUpperCase()}
                  </Badge>
                </td>
                <td className="px-5 py-4 text-muted-foreground">
                  {new Date(document.uploadDate).toLocaleDateString()}
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    <Link
                      href={`/documents/${document.id}`}
                      className="inline-flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground transition hover:bg-[#3BA7FF]"
                      aria-label={`View ${document.title}`}
                    >
                      <Eye className="size-4" />
                    </Link>
                    <a
                      href={`/api/documents/${document.id}/signed-url?download=1`}
                      className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-secondary text-foreground transition hover:border-accent hover:bg-[#0E2A4C]"
                      aria-label={`Download ${document.title}`}
                    >
                      <Download className="size-4" />
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
