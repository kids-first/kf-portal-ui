export enum Impact {
  High = 'HIGH',
  Moderate = 'MODERATE',
  Low = 'LOW',
  Modifier = 'MODIFIER',
}

type Conservations = {
  phylo_p17way_primate_rankscore: number | null;
};

type Predictions = {
  fathmm_pred: any | null;
  fathmm_converted_rankscore: any | null;
  cadd_rankscore: any | null;
  dann_score: any | null;
  dann_rankscore: any | null;
  lrt_pred: any | null;
  lrt_converted_rankscore: any | null;
  revel_rankscore: any | null;
  sift_converted_rankscore: any | null;
  sift_pred: any | null;
  polyphen2_hvar_score: any | null;
  polyphen2_hvar_pred: any | null;
  polyphen2_hvar_rankscore: any | null;
};

export type Consequence = {
  node: {
    biotype: string;
    symbol: string;
    consequences: string[];
    vep_impact: Impact;
    canonical?: boolean;
    aa_change: string | undefined | null;
    impact_score: number | null;
    strand: number;
    conservations: Conservations;
    ensembl_transcript_id: string;
    predictions: Predictions;
    coding_dna_change: string | null;
    omim_gene_id: string | null;
    [key: string]: any;
  };
  [key: string]: any;
};

type ConsequencesHitsEdges = {
  hits: {
    edges: Consequence[];
  };
};

type ClinVarData = string[] | undefined;

export type ClinVar = {
  clinvar_id: string | undefined;
  inheritance: ClinVarData;
  conditions: ClinVarData;
  clin_sig: ClinVarData;
  interpretations: ClinVarData;
};

export type FreqAll = { ac: number; af: number; an: number };
export type FreqOneThousand = FreqAll & { homozygotes: number };
export type Freqgnomad = FreqAll & { homozygotes: number };
export type FreqCombined = FreqAll & { heterozygotes: number; homozygotes: number };
export type FreqTopmed = FreqAll & { homozygotes: number };

type BoundKfType = {
  ac: number;
  af: number;
  an: number;
  heterozygotes: number;
  homozygotes: number;
};

export type FreqInternal = {
  lower_bound_kf: BoundKfType;
  upper_bound_kf: BoundKfType;
};

export type Frequencies = {
  internal: FreqInternal;
  topmed: FreqTopmed;
  one_thousand_genomes: FreqOneThousand;
  gnomad_exomes_2_1: Freqgnomad;
  gnomad_genomes_2_1: Freqgnomad;
  gnomad_genomes_3_0: Freqgnomad;
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

export type VariantStatsResults = {
  stats: VariantStats;
  loading: boolean;
};

type VariantPageData = {
  aggregations: AggregationResults;
  hits: HitsResults;
};

export type VariantStats = {
  distinctVariantsCount: number;
  occurrencesCount: number;
  participantsCount: number;
  studiesCount: number;
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

type Study = {
  participant_number: number;
  study_id: string;
  frequencies: FreqInternal;
};

export type StudyNode = {
  node: Study;
};

export type StudiesHits = {
  hits: {
    total: number;
    edges: StudyNode[];
  };
};

export type OmimCondition = string[][];
export type HpoCondition = string[][];
export type OrphanetCondition = [string, number][];
export type DddCondition = string[];
export type CosmicCondition = string[];

export type Condition =
  | OmimCondition
  | HpoCondition
  | OrphanetCondition
  | DddCondition
  | CosmicCondition;

export type OrphanetInheritance = string[];

export type OmimInheritance = string[];

export type Inheritance = string | OrphanetInheritance | OmimInheritance;

export type OmimGene = string[][];

export type Ddd = {
  node: {
    disease_name: string;
  };
};

export type Orphanet = {
  node: {
    panel: string;
    inheritance: OrphanetInheritance | null | undefined;
    disorder_id: number;
  };
};

export type Omim = {
  node: {
    omim_id: string;
    name: string;
    inheritance: OmimInheritance | undefined | null;
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

export type GenesHits = {
  hits: {
    edges: Gene[];
  };
};

export type HitsEdges = {
  hits: {
    edges: any[] | null | undefined;
  };
};

export type VariantEntity = {
  alternate: string;
  hash: string;
  chromosome: string;
  hgvsg: string;
  locus: string;
  start: string;
  reference: string;
  participant_number: number;
  variant_class: string;
  rsnumber: string;
  frequencies: Frequencies;
  studies: StudiesHits;
  clinvar: ClinVar;
  genes: GenesHits;
  consequences: ConsequencesHitsEdges;
  [key: string]: any;
};

export type VariantEntityNode = {
  node: VariantEntity;
};

export type VariantEntityHitsEdges = {
  hits: {
    total: number;
    edges: VariantEntity;
  };
};
