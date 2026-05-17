"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SearchBar({
  compact = false,
  placeholder = "Search by model, error code, symptom, part number, or issue...",
  defaultValue,
  isLoading = false,
  onSearch,
}: {
  compact?: boolean;
  placeholder?: string;
  defaultValue?: string;
  isLoading?: boolean;
  onSearch?: (query: string) => void | Promise<void>;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue ?? "");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      return;
    }

    if (onSearch) {
      await onSearch(trimmedQuery);
      return;
    }

    router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex w-full flex-col gap-3 rounded-xl border border-border bg-card p-3 shadow-[0_22px_80px_rgba(0,0,0,0.32)] sm:flex-row sm:items-center",
        compact && "p-2",
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3 px-2">
        <Search className="size-5 shrink-0 text-accent" />
        <input
          aria-label="Knowledge base search"
          className="h-11 min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
        />
      </div>
      <div className="flex gap-2">
        <Button variant="secondary" size="icon" aria-label="Search filters">
          <SlidersHorizontal className="size-4" />
        </Button>
        <Button className="flex-1 sm:flex-none" type="submit" disabled={isLoading}>
          {isLoading ? "Searching" : "Search"}
        </Button>
      </div>
    </form>
  );
}
