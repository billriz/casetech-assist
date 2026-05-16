import { AppShell } from "@/components/casetech/AppShell";
import { DocumentViewer } from "@/components/casetech/DocumentViewer";

export default function DocumentViewerPage() {
  return (
    <AppShell active="Search">
      <DocumentViewer />
    </AppShell>
  );
}
