import type { SearchResponse } from "@/lib/search-types";

const EXTERNAL_WARNING =
  "No strong internal match was found. These results come from external Google-grounded AI search and may not reflect Case Financial procedures. Verify before performing repairs or ordering parts.";

function isKnownInternalQuery(query: string) {
  return /ncr\s*6622|6622.*dispenser|dispenser.*jam/i.test(query);
}

export function getMockInternalSearchResponse(query: string): SearchResponse | null {
  const normalizedQuery = query.trim() || "NCR 6622 dispenser jam";

  if (!isKnownInternalQuery(normalizedQuery)) {
    return null;
  }

  const documents = [
    {
      id: "ncr-6622-service-manual",
      title: "NCR 6622 Service Manual",
      documentType: "Service Manual",
      equipmentType: "ATM",
      manufacturer: "NCR",
      model: "6622",
      snippet:
        "Dispense path jam conditions are typically caused by note skew, transport sensor contamination, or cassette pick failure.",
      sourceUrl: "/documents/ncr-6622-service-manual",
      pageNumber: 43,
      relevanceScore: 0.96,
    },
    {
      id: "ncr-6622-service-manual",
      title: "NCR S2 Dispenser Field Bulletin FB-2217",
      documentType: "Field Bulletin",
      equipmentType: "ATM",
      manufacturer: "NCR",
      model: "S2 Dispenser",
      snippet:
        "For recurring jams at the presenter, inspect throat rollers and verify purge bin seating before replacing the pick module.",
      sourceUrl: "/documents/ncr-6622-service-manual",
      pageNumber: 3,
      relevanceScore: 0.91,
    },
    {
      id: "ncr-6622-service-manual",
      title: "ATM Cash Module Quick Reference",
      documentType: "Quick Guide",
      equipmentType: "ATM",
      manufacturer: "CaseTech",
      model: "Cash Module",
      snippet:
        "Run presenter clear, remove residual media, clean dispense sensors, then execute single-note test dispense.",
      sourceUrl: "/documents/ncr-6622-service-manual",
      pageNumber: 12,
      relevanceScore: 0.87,
    },
  ];
  const answer = `Internal mock results for "${normalizedQuery}" most closely match service manual guidance for a dispense path jam involving skewed notes, blocked sensors, or a cassette pick issue. Start with safe media removal and sensor inspection before replacing components.`;
  const recommendedSteps = [
    "Power down the dispenser module and remove cassette 2 before clearing any trapped media.",
    "Inspect the pick area for curled notes, torn currency, or foreign material near the throat sensor.",
    "Clean transport and presenter sensors with approved swabs, then reseat the purge bin.",
    "Run diagnostic dispense tests from cassette 2 and confirm no repeat 6622-231 jam code appears.",
    "If the fault repeats, compare roller wear against the service manual replacement threshold.",
  ];

  return {
    mode: "internal",
    answer,
    confidence: 0.96,
    followUpQuestions: [
      "Which cassette reported the jam?",
      "Does the jam repeat after cleaning the transport and presenter sensors?",
      "Is the purge bin fully seated?",
    ],
    sources: documents.map((document) => ({
      title: document.title,
      type: "internal_document" as const,
      uri: document.sourceUrl,
      pageNumber: document.pageNumber,
      snippet: document.snippet,
    })),
    documents,
    source: "mock",
    aiSummary: answer,
    recommendedSteps,
    results: documents,
  };
}

export function getMockExternalSearchResponse(query: string): SearchResponse {
  const normalizedQuery = query.trim() || "random uncommon equipment error";
  const answer = `External Google AI Search mock results for "${normalizedQuery}" found no strong internal company match. Treat this as general web-grounded troubleshooting guidance: identify the exact equipment model and error text, check the manufacturer service portal for current bulletins, verify power and communications basics, and avoid ordering parts until the issue is confirmed against Case Financial procedures.`;
  const recommendedSteps = [
    "Record the full error code, equipment model, firmware version, and symptoms before taking corrective action.",
    "Check official manufacturer documentation or service bulletins for the exact error wording.",
    "Verify basic power, network, cabling, and consumable conditions before replacing assemblies.",
    "Escalate to Case Financial support if no approved internal procedure exists for the condition.",
  ];
  const sources = [
    {
      title: "NCR Support and Service Resources",
      type: "external_web" as const,
      uri: "https://www.ncr.com/support",
      snippet: "External support resource for manufacturer documentation and service channels.",
    },
    {
      title: "Diebold Nixdorf Support",
      type: "external_web" as const,
      uri: "https://www.dieboldnixdorf.com/en-us/support/",
      snippet: "External manufacturer support resource for banking equipment service information.",
    },
  ];

  return {
    mode: "external_fallback",
    answer,
    confidence: 0.48,
    warning: EXTERNAL_WARNING,
    recommendedSteps,
    followUpQuestions: [
      "What is the exact equipment manufacturer and model?",
      "What error code or event log entry appears?",
      "Has an internal bulletin been issued for this customer site?",
    ],
    sources,
    documents: [],
    source: "mock",
    aiSummary: answer,
    results: [],
  };
}

export function getInternalOnlyNoResultsResponse(query: string): SearchResponse {
  const normalizedQuery = query.trim() || "your search";
  const answer = `No internal results found for "${normalizedQuery}". External Google AI fallback is disabled, so this response is limited to CaseTech internal documentation.`;

  return {
    mode: "internal",
    answer,
    confidence: 0,
    warning: "No internal results found. External fallback was disabled for this search.",
    recommendedSteps: [
      "Try a more specific model, error code, symptom, or part number.",
      "Check whether the relevant manual or bulletin has been uploaded to the internal knowledge base.",
    ],
    followUpQuestions: [
      "What manufacturer and model should be included?",
      "Is there an error code from the device event log?",
    ],
    sources: [],
    documents: [],
    source: "mock",
    aiSummary: answer,
    results: [],
  };
}

export function getMockSearchResponse(query: string): SearchResponse {
  return getMockInternalSearchResponse(query) ?? getMockExternalSearchResponse(query);
}
