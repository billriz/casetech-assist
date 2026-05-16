import { Bot, CheckCircle2, TriangleAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
import { aiSteps } from "@/lib/mock-data";

export function AISummaryCard() {
  return (
    <Card className="overflow-hidden">
      <div className="border-b border-border bg-primary/10 p-5">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Bot className="size-5" />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-foreground">AI Summary</h2>
            <p className="text-sm text-muted-foreground">
              Likely dispense-path jam on NCR 6622 cash dispenser.
            </p>
          </div>
        </div>
      </div>
      <div className="p-5">
        <p className="text-sm leading-6 text-muted-foreground">
          The query most closely matches service manual guidance for a dispense path jam
          involving skewed notes, blocked sensors, or a cassette pick issue. Start with
          safe media removal and sensor inspection before replacing components.
        </p>

        <h3 className="mt-6 text-sm font-semibold uppercase tracking-[0.14em] text-success">
          Recommended Steps
        </h3>
        <ol className="mt-4 space-y-3">
          {aiSteps.map((step) => (
            <li key={step} className="flex gap-3 text-sm leading-6 text-foreground">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
              <span>{step}</span>
            </li>
          ))}
        </ol>

        <div className="mt-6 flex gap-3 rounded-lg border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-100">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" />
          <span>AI generated. Please verify with official manuals.</span>
        </div>
      </div>
    </Card>
  );
}
