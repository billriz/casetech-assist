export type SearchResult = {
  id?: string;
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

export type SearchSource = {
  title: string;
  type: "internal_document" | "external_web";
  uri: string;
  pageNumber?: number;
  snippet: string;
};

export type SearchFilters = {
  equipmentType?: string;
  manufacturer?: string;
  model?: string;
  documentType?: string;
};

export type SearchResponse = {
  mode: "internal" | "external_fallback";
  answer: string;
  confidence: number;
  followUpQuestions: string[];
  warning?: string;
  sources: SearchSource[];
  documents: SearchResult[];
  aiSummary: string;
  recommendedSteps: string[];
  results: SearchResult[];
  source: "google" | "gemini" | "mock";
};
