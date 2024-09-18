import { ISyntheticSqon } from '@ferlab/ui/core/data/sqon/types';

export interface ISuggestionPayload<T> {
  searchText: string;
  suggestions: T[];
}

export enum SuggestionType {
  VARIANTS = 'variants',
  GENES = 'genes',
}

export enum GenomicFeatureType {
  Variant = 'variant',
  GENE = 'gene',
}

export type Suggestion = {
  locus: string | undefined;
  type: GenomicFeatureType;
  matchedText: string;
  suggestion_id: string;
  symbol?: string;
  rsnumber?: string;
  ensembl_gene_id?: string;
};

export interface IDiagnosis {
  mondo_id: string;
  count: number;
}

export interface IStatistics {
  sex: Record<string, number>;
  race: Record<string, number>;
  ethnicity: Record<string, number>;
  downSyndromeStatus: Record<string, number>;
  diagnosis: IDiagnosis[];
  families: number;
  fileSize: string;
  files: number;
  participants: number;
  samples: number;
  studies: number;
  studiesStatistics: Record<string, Omit<IStudiesStatistics, 'study_code'>>;
  genomes: number;
  variants: number;
  transcriptomes: number;
}

export interface IStudiesStatistics {
  participant_count: number;
  domain: string;
  study_code: string;
}

export interface ArrangerSingleColumnState {
  accessor: string;
  canChangeShow: boolean;
  field: string;
  jsonPath: string | null;
  query: string | null;
  show: boolean;
  sortable: boolean;
  type: string;
}

export interface ArrangerColumnStateResults {
  data: {
    [index: string]: {
      columnsState: {
        state: {
          columns: ArrangerSingleColumnState[];
          keyField?: string;
          type: string;
        };
      };
    };
  };
}

export interface ArrangerPhenotypes {
  sqon: ISyntheticSqon;
  type: string;
  aggregations_filter_themselves: boolean;
}
