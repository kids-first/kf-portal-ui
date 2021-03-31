export enum Impact {
  High = 'HIGH',
  Moderate = 'MODERATE',
  Low = 'LOW',
  Modifier = 'MODIFIER',
}

export type Consequence = {
  node: {
    symbol: string;
    consequences: string[];
    vep_impact: Impact;
    canonical?: boolean;
    aa_change: string | undefined | null;
    impact_score: number | null;
    [key: string]: any;
  };
  [key: string]: any;
};

export type ClinVar = {
  clinvar_id: string | undefined;
  clin_sig: string | undefined;
};

export type Frequencies = {
  internal: {
    combined: {
      homozygotes: number;
      af: number;
      an: number;
      ac: number;
    };
  };
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
  displayName: string;
};

export type VariantEntityResults = {
  data: VariantPageData | null;
  loading: boolean;
};

type VariantPageData = {
  aggregations: AggregationResults;
  hits: HitsResults;
};

type HitsResults = {
  edges: [
    {
      node: any; //FIXME: to be expanded further when needed
    },
  ];
};

type AggregationResults = {
  hgvsg: string;
};
