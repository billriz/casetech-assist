import "server-only";

import { SearchServiceClient, protos } from "@google-cloud/discoveryengine";
import type { SearchResponse, SearchResult } from "@/lib/search-types";

type StructLike = {
  fields?: Record<string, unknown> | null;
};

type SearchResultProto = protos.google.cloud.discoveryengine.v1.SearchResponse.ISearchResult;

const FALLBACK_VALUE = "Unspecified";

function getConfig() {
  const {
    GOOGLE_CLOUD_PROJECT_ID: projectId,
    GOOGLE_CLOUD_LOCATION: location,
    GOOGLE_VERTEX_SEARCH_DATA_STORE_ID: dataStoreId,
    GOOGLE_VERTEX_SEARCH_SERVING_CONFIG_ID: servingConfigId,
    GOOGLE_APPLICATION_CREDENTIALS: credentialsPath,
  } = process.env;

  if (!projectId || !location || !dataStoreId || !servingConfigId || !credentialsPath) {
    return null;
  }

  return {
    projectId,
    location,
    dataStoreId,
    servingConfigId,
    credentialsPath,
  };
}

function toPlainValue(value: unknown): unknown {
  if (value === null || value === undefined) {
    return undefined;
  }

  if (typeof value !== "object") {
    return value;
  }

  const record = value as Record<string, unknown>;

  if ("stringValue" in record) return record.stringValue;
  if ("numberValue" in record) return record.numberValue;
  if ("boolValue" in record) return record.boolValue;
  if ("nullValue" in record) return undefined;

  if ("listValue" in record) {
    const listValue = record.listValue as { values?: unknown[] };
    return listValue.values?.map(toPlainValue) ?? [];
  }

  if ("structValue" in record) {
    return structToRecord(record.structValue as StructLike);
  }

  if ("fields" in record) {
    return structToRecord(record as StructLike);
  }

  return value;
}

function structToRecord(struct?: StructLike | null): Record<string, unknown> {
  if (!struct?.fields) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(struct.fields).map(([key, value]) => [key, toPlainValue(value)]),
  );
}

function firstString(...values: unknown[]): string | undefined {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return undefined;
}

function firstNumber(...values: unknown[]): number | undefined {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === "string") {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }

  return undefined;
}

function extractSnippet(data: Record<string, unknown>): string {
  const snippets = data.snippets;

  if (Array.isArray(snippets)) {
    const snippet = snippets
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object") {
          return firstString(
            (item as Record<string, unknown>).snippet,
            (item as Record<string, unknown>).content,
            (item as Record<string, unknown>).text,
          );
        }
        return undefined;
      })
      .find(Boolean);

    if (snippet) return snippet;
  }

  const extractiveAnswers = data.extractive_answers ?? data.extractiveAnswers;
  if (Array.isArray(extractiveAnswers)) {
    const answer = extractiveAnswers
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object") {
          return firstString(
            (item as Record<string, unknown>).content,
            (item as Record<string, unknown>).answer,
            (item as Record<string, unknown>).text,
          );
        }
        return undefined;
      })
      .find(Boolean);

    if (answer) return answer;
  }

  return (
    firstString(data.snippet, data.description, data.summary, data.content, data.text) ??
    "No preview snippet available."
  );
}

function extractRelevanceScore(result: SearchResultProto): number | undefined {
  const relevanceScore = result.modelScores?.relevance_score?.values?.[0];
  const semanticSimilarity = result.modelScores?.semantic_similarity_score?.values?.[0];

  return firstNumber(relevanceScore, semanticSimilarity);
}

function normalizeResult(result: SearchResultProto): SearchResult {
  const document = result.document;
  const structData = structToRecord(document?.structData);
  const derivedStructData = structToRecord(document?.derivedStructData);
  const data = { ...structData, ...derivedStructData };

  const sourceUrl =
    firstString(data.sourceUrl, data.source_url, data.uri, data.link, data.url) ??
    `/documents/${document?.id ?? result.id ?? "unknown"}`;

  return {
    title:
      firstString(data.title, data.name, data.documentTitle, data.document_title, document?.id) ??
      "Untitled document",
    documentType:
      firstString(data.documentType, data.document_type, data.type, data.category) ?? FALLBACK_VALUE,
    equipmentType:
      firstString(data.equipmentType, data.equipment_type, data.equipment, data.assetType) ??
      FALLBACK_VALUE,
    manufacturer: firstString(data.manufacturer, data.make, data.vendor, data.brand) ?? FALLBACK_VALUE,
    model: firstString(data.model, data.modelNumber, data.model_number, data.equipmentModel) ?? FALLBACK_VALUE,
    snippet: extractSnippet(data),
    sourceUrl,
    pageNumber: firstNumber(data.pageNumber, data.page_number, data.page, data.pageIdentifier),
    relevanceScore: extractRelevanceScore(result),
  };
}

function extractRecommendedSteps(summary: string): string[] {
  return summary
    .replace(/\[[^\]]+\]/g, "")
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 24)
    .slice(0, 5);
}

export async function searchVertexDocuments(query: string): Promise<SearchResponse | null> {
  const config = getConfig();

  if (!config) {
    return null;
  }

  const apiEndpoint =
    config.location === "global"
      ? "discoveryengine.googleapis.com"
      : `${config.location}-discoveryengine.googleapis.com`;

  const client = new SearchServiceClient({ apiEndpoint });
  const servingConfig = `projects/${config.projectId}/locations/${config.location}/collections/default_collection/dataStores/${config.dataStoreId}/servingConfigs/${config.servingConfigId}`;

  const [results, , response] = await client.search({
    servingConfig,
    query,
    pageSize: 10,
    contentSearchSpec: {
      snippetSpec: {
        returnSnippet: true,
      },
      extractiveContentSpec: {
        maxExtractiveAnswerCount: 1,
        maxExtractiveSegmentCount: 1,
      },
      summarySpec: {
        summaryResultCount: 5,
        includeCitations: true,
        ignoreAdversarialQuery: true,
        ignoreJailBreakingQuery: true,
      },
    },
    relevanceScoreSpec: {
      returnRelevanceScore: true,
    },
  });

  const aiSummary =
    response?.summary?.summaryText?.trim() ||
    `Found ${results.length} relevant documents for "${query}".`;
  const recommendedSteps = extractRecommendedSteps(aiSummary);

  return {
    source: "google",
    aiSummary,
    recommendedSteps:
      recommendedSteps.length > 0
        ? recommendedSteps
        : ["Review the highest-ranked source documents and verify steps against official manuals."],
    results: results.map(normalizeResult),
  };
}
