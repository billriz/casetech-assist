import { NextResponse } from "next/server";
import { runAiSearch } from "@/lib/ai-search";
import type { SearchFilters } from "@/lib/search-types";

export const runtime = "nodejs";

type AiSearchBody = {
  query?: unknown;
  filters?: Partial<Record<keyof SearchFilters, unknown>>;
  allowExternalFallback?: unknown;
};

function normalizeFilters(filters: AiSearchBody["filters"]): SearchFilters | undefined {
  if (!filters || typeof filters !== "object") {
    return undefined;
  }

  const normalized: SearchFilters = {};

  (["equipmentType", "manufacturer", "model", "documentType"] as const).forEach((key) => {
    const value = filters[key];

    if (typeof value === "string" && value.trim()) {
      normalized[key] = value.trim();
    }
  });

  return Object.keys(normalized).length > 0 ? normalized : undefined;
}

function queryFromBody(body: AiSearchBody | null) {
  return typeof body?.query === "string" ? body.query : "";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? searchParams.get("query") ?? "";
  const allowExternalFallback = searchParams.get("allowExternalFallback") !== "false";

  const response = await runAiSearch({ query, allowExternalFallback });

  return NextResponse.json(response);
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as AiSearchBody | null;
  const response = await runAiSearch({
    query: queryFromBody(body),
    filters: normalizeFilters(body?.filters),
    allowExternalFallback:
      typeof body?.allowExternalFallback === "boolean" ? body.allowExternalFallback : true,
  });

  return NextResponse.json(response);
}
