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
  inheritance: string[] | undefined;
  conditions: string[] | undefined;
  clin_sig: string[] | undefined;
  interpretations: string[] | undefined;
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
  topmed: { ac: number; af: number; an: number; homozygotes: number; heterozygotes: number };
  one_thousand_genomes: { ac: number; af: number; an: number };
  gnomad_exomes_2_1: { ac: number; af: number; an: number; homozygotes: number };
  gnomad_genomes_2_1: { ac: number; af: number; an: number; homozygotes: number };
  gnomad_genomes_3_0: { ac: number; af: number; an: number; homozygotes: number };
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
      node: VariantEntity;
    },
  ];
};

type AggregationResults = {
  hgvsg: string;
};

type VariantEntity = {
  alternate: string;
  hash: string;
  chromosome: string;
  hgvsg: string;
  locus: string;
  start: string;
};

export type Ddd = {
  node: {
    disease_name: string;
  };
};

export type Orphanet = {
  node: {
    panel: string;
    inheritance: string[] | null | undefined;
    disorder_id: number;
  };
};

export type Omim = {
  node: {
    omim_id: string;
    name: string;
    inheritance: string[] | undefined | null;
  };
};

export type Hpo = {
  node: {
    hpo_term_label: string;
    hpo_term_id: string;
  };
};

export type Cosmic = {
  node: {
    tumour_types_germline: string[];
  };
};

export type Gene = {
  node: {
    symbol: string;
    omim_gene_id: string;
    orphanet: {
      hits: {
        edges: Orphanet[] | undefined | null;
      };
    };
    omim: {
      hits: {
        edges: Omim[] | undefined | null;
      };
    };
    hpo: {
      hits: {
        edges: Hpo[] | undefined | null;
      };
    };
    ddd: {
      hits: {
        edges: Ddd[] | undefined | null;
      };
    };
    cosmic: {
      hits: {
        edges: Cosmic[];
      };
    };
    [key: string]: any;
  };
};

export type HitsEdges = {
  hits: {
    edges: any[] | null | undefined;
  };
};
