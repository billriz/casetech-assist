import { AppShell } from "@/components/casetech/AppShell";
import { DocumentCard } from "@/components/casetech/DocumentCard";
import { DocumentTable } from "@/components/casetech/DocumentTable";
import { getDocuments } from "@/lib/documents";

export default async function DocumentsPage() {
  const documents = await getDocuments();

  return (
    <AppShell active="Documents">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Document Library</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              Browse searchable manuals, bulletins, and field guides staged for technician use.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{documents.length}</span> documents indexed
          </div>
        </div>

        <div className="grid gap-4 lg:hidden">
          {documents.map((document) => (
            <DocumentCard key={document.id} document={document} />
          ))}
        </div>

        <div className="hidden lg:block">
          <DocumentTable documents={documents} />
        </div>
      </div>
    </AppShell>
  );
}
