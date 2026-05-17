export type SearchResult = {
  title: string;
  documentType: string;
  equipmentType: string;
  manufacturer: string;
  model: string;
  snippet: string;
  sourceUrl: string;
  pageNumber?: number;
  relevanceScore?: number;
};

export type SearchResponse = {
  aiSummary: string;
  recommendedSteps: string[];
  results: SearchResult[];
  source: "google" | "mock";
};
