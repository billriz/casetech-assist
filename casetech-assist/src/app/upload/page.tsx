import { AppShell } from "@/components/casetech/AppShell";
import { UploadForm } from "@/components/casetech/UploadForm";

export default function UploadPage() {
  return (
    <AppShell active="Upload Document">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Upload Document</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
          Add manuals, guides, bulletins, and other resources.
        </p>
      </div>
      <UploadForm />
    </AppShell>
  );
}
