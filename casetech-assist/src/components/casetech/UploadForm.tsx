import { FileUp, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { uploadOptions } from "@/lib/mock-data";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-semibold text-foreground">{label}</span>
      {children}
    </label>
  );
}

export function UploadForm() {
  return (
    <Card className="p-5 sm:p-6">
      <div className="rounded-xl border border-dashed border-accent/55 bg-primary/10 p-8 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-xl border border-accent/40 bg-[#061A30] text-accent">
          <FileUp className="size-7" />
        </div>
        <h2 className="mt-4 text-lg font-semibold text-foreground">
          Drop document here or browse files
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">Supported files: PDF, DOCX, TXT</p>
        <Button className="mt-5" variant="secondary">
          Select File
        </Button>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <Field label="Title">
          <Input placeholder="NCR 6622 Service Manual" />
        </Field>
        <Field label="Document Type">
          <Select options={uploadOptions.documentTypes} />
        </Field>
        <Field label="Equipment Type">
          <Select options={uploadOptions.equipmentTypes} />
        </Field>
        <Field label="Manufacturer">
          <Select options={uploadOptions.manufacturers} />
        </Field>
        <Field label="Model">
          <Input placeholder="6622" />
        </Field>
        <Field label="Tags">
          <div className="relative">
            <Tags className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="dispenser, jam, cassette, presenter" />
          </div>
        </Field>
        <div className="md:col-span-2">
          <Field label="Description">
            <Textarea placeholder="Briefly describe the document scope, covered models, and troubleshooting topics." />
          </Field>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Documents are staged for review before they become searchable.
        </p>
        <Button size="lg">
          <FileUp className="size-4" />
          Upload & Process
        </Button>
      </div>
    </Card>
  );
}
