import "server-only";

import { searchGeminiWithGoogleGrounding } from "@/lib/gemini-search";
import {
  getInternalOnlyNoResultsResponse,
  getMockExternalSearchResponse,
  getMockInternalSearchResponse,
} from "@/lib/search-fallback";
import type { SearchFilters, SearchResponse } from "@/lib/search-types";
import { searchVertexDocuments } from "@/lib/vertex-search";

const LOW_CONFIDENCE_THRESHOLD = 0.65;

export type AiSearchRequest = {
  query: string;
  filters?: SearchFilters;
  allowExternalFallback?: boolean;
};

function saysInsufficientInternalInformation(answer: string) {
  return /insufficient internal|not enough internal|no internal (?:company )?(?:documentation|information|results)|unable to find.*internal/i.test(
    answer,
  );
}

function shouldUseExternalFallback(response: SearchResponse | null) {
  if (!response) {
    return true;
  }

  const highestRelevanceScore = response.documents.reduce(
    (highest, document) => Math.max(highest, document.relevanceScore ?? 0),
    0,
  );

  return (
    response.documents.length === 0 ||
    response.sources.length === 0 ||
    highestRelevanceScore < LOW_CONFIDENCE_THRESHOLD ||
    saysInsufficientInternalInformation(response.answer)
  );
}

async function searchInternal(query: string, filters?: SearchFilters) {
  try {
    const vertexResponse = await searchVertexDocuments(query, filters);
    const mockInternalResponse = getMockInternalSearchResponse(query);

    if (!vertexResponse || (vertexResponse.documents.length === 0 && mockInternalResponse)) {
      return mockInternalResponse;
    }

    return vertexResponse;
  } catch (error) {
    console.error("Vertex AI Search request failed", error);
    return getMockInternalSearchResponse(query);
  }
}

export async function runAiSearch({
  query,
  filters,
  allowExternalFallback = true,
}: AiSearchRequest): Promise<SearchResponse> {
  const trimmedQuery = query.trim() || "NCR 6622 dispenser jam";
  const internalResponse = await searchInternal(trimmedQuery, filters);
  const needsFallback = shouldUseExternalFallback(internalResponse);

  if (!needsFallback && internalResponse) {
    return internalResponse;
  }

  if (!allowExternalFallback) {
    if (!internalResponse || internalResponse.documents.length === 0) {
      return getInternalOnlyNoResultsResponse(trimmedQuery);
    }

    return {
      ...internalResponse,
      warning:
        "Internal results did not meet the confidence threshold, and external fallback was disabled for this search.",
    };
  }

  try {
    return await searchGeminiWithGoogleGrounding(trimmedQuery);
  } catch (error) {
    console.error("Gemini external fallback request failed", error);
    return getMockExternalSearchResponse(trimmedQuery);
  }
}
