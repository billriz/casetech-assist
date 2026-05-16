import {
  Download,
  FileText,
  Heart,
  Highlighter,
  Printer,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { documentOutline } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function DocumentViewer() {
  return (
    <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
      <Card className="h-fit overflow-hidden">
        <div className="border-b border-border p-5">
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-success">
            Document Outline
          </h2>
        </div>
        <nav className="flex gap-2 overflow-x-auto p-3 xl:flex-col xl:overflow-visible">
          {documentOutline.map((item) => (
            <a
              href="#document-preview"
              key={item}
              className={cn(
                "shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground",
                item === "5.2.1 Dispense Path Jam" &&
                  "border border-primary/40 bg-primary/15 text-foreground",
              )}
            >
              {item}
            </a>
          ))}
        </nav>
      </Card>

      <Card id="document-preview" className="overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-border bg-[#061A30] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge>Service Manual</Badge>
              <Badge>Page 43</Badge>
              <Badge className="border-success/40 bg-success/10 text-success">
                Verified source
              </Badge>
            </div>
            <h1 className="mt-3 text-xl font-bold text-foreground sm:text-2xl">
              NCR 6622 Service Manual
            </h1>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary">
              <Heart className="size-4" />
              Favorite
            </Button>
            <Button>
              <Download className="size-4" />
              Download
            </Button>
          </div>
        </div>

        <div className="grid gap-6 p-5 lg:grid-cols-[minmax(0,1fr)_260px]">
          <article className="rounded-xl border border-border bg-[#031427] p-5 sm:p-7">
            <div className="mb-5 flex items-center gap-2 text-sm font-semibold text-success">
              <Highlighter className="size-4" />
              Matching terms highlighted
            </div>

            <h2 className="text-2xl font-bold text-foreground">5.2.1 Dispense Path Jam</h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              A <mark className="rounded bg-primary/35 px-1 text-foreground">dispense path jam</mark>{" "}
              occurs when media remains between the pick module and presenter transport.
              Common causes include skewed currency, contaminated optical sensors, blocked
              diverter movement, or cassette feed pressure outside tolerance.
            </p>

            <h3 className="mt-7 text-base font-semibold text-foreground">
              Recommended actions
            </h3>
            <ol className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
              <li>
                1. Place the device out of service, open the upper safe door, and verify
                power isolation according to branch procedure.
              </li>
              <li>
                2. Remove cassette 2 and inspect the feed path for folded notes or torn
                fragments near the <mark className="rounded bg-primary/35 px-1 text-foreground">throat sensor</mark>.
              </li>
              <li>
                3. Clean transport sensors S14, S17, and presenter sensor S21 with approved
                lint-free swabs.
              </li>
              <li>
                4. Reseat the purge bin and run a single-note diagnostic dispense from
                cassette 2.
              </li>
            </ol>

            <div className="technical-grid mt-8 min-h-72 rounded-xl border border-accent/35 bg-[#061A30] p-5">
              <div className="flex h-full min-h-60 flex-col justify-between rounded-lg border border-dashed border-accent/35 p-5">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.14em] text-success">
                  <span>Technical Diagram</span>
                  <span>Dispenser Transport</span>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <div className="rounded-lg border border-border bg-card p-4 text-center text-sm text-muted-foreground">
                    Cassette 2
                  </div>
                  <div className="h-3 rounded-full bg-gradient-to-r from-primary to-accent" />
                  <div className="rounded-lg border border-border bg-card p-4 text-center text-sm text-muted-foreground">
                    Presenter
                  </div>
                </div>
                <p className="text-xs leading-5 text-muted-foreground">
                  Placeholder diagram for note path, pick rollers, diverter gate, and
                  presenter sensors.
                </p>
              </div>
            </div>
          </article>

          <aside className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <FileText className="size-5 text-accent" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Document Details</p>
                  <p className="text-xs text-muted-foreground">Revision 24.3</p>
                </div>
              </div>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Manufacturer</dt>
                  <dd className="font-medium text-foreground">NCR</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Model</dt>
                  <dd className="font-medium text-foreground">6622</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Updated</dt>
                  <dd className="font-medium text-foreground">May 2026</dd>
                </div>
              </dl>
            </Card>
            <Card className="p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 size-5 text-success" />
                <p className="text-sm leading-6 text-muted-foreground">
                  Source is approved for internal technician troubleshooting. Verify site
                  safety steps before servicing active banking equipment.
                </p>
              </div>
            </Card>
            <Button variant="outline" className="w-full">
              <Printer className="size-4" />
              Print Page
            </Button>
          </aside>
        </div>
      </Card>
    </div>
  );
}
