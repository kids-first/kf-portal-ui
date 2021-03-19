export enum Impact {
  High = 'HIGH',
  Moderate = 'MODERATE',
  Low = 'LOW',
  Modifier = 'MODIFIER',
}

export type Consequence = {
  symbols: string[];
  consequences: string[];
  impact: Impact;
  canonical: boolean;
  [key: string]: any;
};

export type VariantTableResult = {
  [key: string]: any;
};

export enum GenomicFeatureType {
  Variant = 'variant',
  GENE = 'gene',
}

export type SearchText = string;

export type SuggestionId = string;

export type Suggestion = {
  locus: string | undefined;
  type: GenomicFeatureType;
  matchedText: string;
  suggestion_id: string;
  geneSymbol: string | undefined;
};

export type SelectedSuggestion = {
  featureType: GenomicFeatureType;
  suggestionId: SuggestionId;
  geneSymbol: string | undefined;
};