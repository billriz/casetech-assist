import type { SearchResponse } from "@/lib/search-types";

export function getMockSearchResponse(query: string): SearchResponse {
  const normalizedQuery = query.trim() || "NCR 6622 dispenser jam";

  return {
    source: "mock",
    aiSummary: `Mock results for "${normalizedQuery}" most closely match service manual guidance for a dispense path jam involving skewed notes, blocked sensors, or a cassette pick issue. Start with safe media removal and sensor inspection before replacing components.`,
    recommendedSteps: [
      "Power down the dispenser module and remove cassette 2 before clearing any trapped media.",
      "Inspect the pick area for curled notes, torn currency, or foreign material near the throat sensor.",
      "Clean transport and presenter sensors with approved swabs, then reseat the purge bin.",
      "Run diagnostic dispense tests from cassette 2 and confirm no repeat 6622-231 jam code appears.",
      "If the fault repeats, compare roller wear against the service manual replacement threshold.",
    ],
    results: [
      {
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
    ],
  };
}
