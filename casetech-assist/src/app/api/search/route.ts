import { NextResponse } from "next/server";
import { getMockSearchResponse } from "@/lib/search-fallback";
import { searchVertexDocuments } from "@/lib/vertex-search";

export const runtime = "nodejs";

async function runSearch(query: string) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return getMockSearchResponse("NCR 6622 dispenser jam");
  }

  try {
    const googleResults = await searchVertexDocuments(trimmedQuery);
    return googleResults ?? getMockSearchResponse(trimmedQuery);
  } catch (error) {
    console.error("Vertex AI Search request failed", error);
    return getMockSearchResponse(trimmedQuery);
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? searchParams.get("query") ?? "";
  const response = await runSearch(query);

  return NextResponse.json(response);
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { query?: unknown } | null;
  const response = await runSearch(typeof body?.query === "string" ? body.query : "");

  return NextResponse.json(response);
}
