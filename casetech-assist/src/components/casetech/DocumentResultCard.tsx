import Link from "next/link";
import { ArrowUpRight, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function DocumentResultCard({
  title,
  type,
  page,
  snippet,
  match,
}: {
  title: string;
  type: string;
  page: string;
  snippet: string;
  match: number;
}) {
  return (
    <Card className="p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-accent/35 bg-primary/15 text-accent">
            <FileText className="size-5" />
          </span>
          <div>
            <h3 className="text-base font-semibold text-foreground">{title}</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge>{type}</Badge>
              <Badge>{page}</Badge>
              <Badge className="border-success/40 bg-success/10 text-success">
                {match}% match
              </Badge>
            </div>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-muted-foreground">
              {snippet}
            </p>
          </div>
        </div>
        <Link
          href="/documents/ncr-6622-service-manual"
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-[0_0_24px_rgba(30,136,255,0.24)] transition hover:bg-[#3BA7FF] sm:ml-4"
        >
          View
          <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </Card>
  );
}
