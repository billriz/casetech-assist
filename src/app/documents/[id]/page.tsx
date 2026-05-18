import { notFound } from "next/navigation";
import { AppShell } from "@/components/casetech/AppShell";
import { DocumentViewerShell } from "@/components/casetech/DocumentViewerShell";
import { getDocumentById, getRelatedDocuments } from "@/lib/documents";

type DocumentPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
};

function parsePageNumber(value?: string) {
  if (!value) return undefined;

  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : undefined;
}

export default async function DocumentPage({ params, searchParams }: DocumentPageProps) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const document = await getDocumentById(id);

  if (!document) {
    notFound();
  }

  return (
    <AppShell active="Documents">
      <DocumentViewerShell
        document={document}
        pageNumber={parsePageNumber(query.page)}
        relatedDocuments={await getRelatedDocuments(document)}
      />
    </AppShell>
  );
}
