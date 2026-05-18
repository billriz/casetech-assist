import "server-only";

import { GoogleGenAI } from "@google/genai";
import { getMockExternalSearchResponse } from "@/lib/search-fallback";
import type { SearchResponse, SearchSource } from "@/lib/search-types";

const EXTERNAL_WARNING =
  "No strong internal match was found. These results come from external Google-grounded AI search and may not reflect Case Financial procedures. Verify before performing repairs or ordering parts.";

const SYSTEM_INSTRUCTION =
  "You are assisting a banking equipment technician. If internal company documentation is unavailable, provide general troubleshooting guidance using web-grounded sources. Clearly state that this is external information and should be verified against company procedures and official manufacturer documentation. Do not present external results as company-approved fixes.";

type GeminiJsonPayload = {
  answer?: unknown;
  recommendedSteps?: unknown;
  followUpQuestions?: unknown;
  confidence?: unknown;
};

function parseJsonPayload(text?: string): GeminiJsonPayload {
  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text) as GeminiJsonPayload;
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      return { answer: text };
    }

    try {
      return JSON.parse(match[0]) as GeminiJsonPayload;
    } catch {
      return { answer: text };
    }
  }
}

function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function numberValue(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(0, Math.min(1, value));
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return Math.max(0, Math.min(1, parsed));
    }
  }

  return undefined;
}

function groundedSources(response: Awaited<ReturnType<GoogleGenAI["models"]["generateContent"]>>) {
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
  const sources = new Map<string, SearchSource>();

  chunks.forEach((chunk) => {
    const web = chunk.web;

    if (!web?.uri) {
      return;
    }

    sources.set(web.uri, {
      title: web.title || web.uri,
      type: "external_web",
      uri: web.uri,
      snippet: web.domain ? `External Google-grounded source from ${web.domain}.` : web.uri,
    });
  });

  return Array.from(sources.values());
}

function groundedConfidence(
  response: Awaited<ReturnType<GoogleGenAI["models"]["generateContent"]>>,
  fallbackConfidence?: number,
) {
  const scores =
    response.candidates?.[0]?.groundingMetadata?.groundingSupports
      ?.flatMap((support) => support.confidenceScores ?? [])
      .filter((score): score is number => typeof score === "number" && Number.isFinite(score)) ?? [];

  if (scores.length > 0) {
    return Math.max(0, Math.min(1, Math.max(...scores)));
  }

  return fallbackConfidence ?? 0.55;
}

export async function searchGeminiWithGoogleGrounding(query: string): Promise<SearchResponse> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return getMockExternalSearchResponse(query);
  }

  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL ?? "gemini-2.0-flash",
    contents: `Search the public web for general troubleshooting guidance for this banking equipment technician query: ${query}

Return only JSON with this shape:
{
  "answer": "string",
  "recommendedSteps": ["string"],
  "followUpQuestions": ["string"],
  "confidence": 0.0
}`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      tools: [{ googleSearch: {} }],
      temperature: 0.2,
      responseMimeType: "application/json",
    },
  });

  const payload = parseJsonPayload(response.text);
  const answer =
    typeof payload.answer === "string" && payload.answer.trim()
      ? payload.answer.trim()
      : response.text?.trim() || getMockExternalSearchResponse(query).answer;
  const recommendedSteps = stringArray(payload.recommendedSteps);
  const followUpQuestions = stringArray(payload.followUpQuestions);
  const sources = groundedSources(response);

  return {
    mode: "external_fallback",
    answer,
    confidence: groundedConfidence(response, numberValue(payload.confidence)),
    warning: EXTERNAL_WARNING,
    sources,
    documents: [],
    source: "gemini",
    aiSummary: answer,
    recommendedSteps:
      recommendedSteps.length > 0
        ? recommendedSteps
        : [
            "Verify the exact model, error code, and firmware version before acting on external guidance.",
            "Cross-check the result against Case Financial procedures and official manufacturer documentation.",
          ],
    followUpQuestions:
      followUpQuestions.length > 0
        ? followUpQuestions
        : [
            "What is the exact equipment manufacturer and model?",
            "What error code or device event appears?",
          ],
    results: [],
  };
}
