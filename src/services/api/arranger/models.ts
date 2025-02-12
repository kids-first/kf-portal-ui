import { ISyntheticSqon } from '@ferlab/ui/core/data/sqon/types';

export interface ISuggestionPayload<T> {
  searchText: string;
  suggestions: T[];
}

export enum SuggestionType {
  VARIANTS = 'variants',
  GENES = 'genes',
  SOMATIC = 'variantsSomatic',
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

export interface IStudiesStatistic {
  data_category: string[];
  description?: string;
  domain: string;
  domains?: string[];
  external_ids?: string[];
  family_count?: number;
  file_count?: number;
  guid?: string;
  is_harmonized?: boolean;
  participant_count: number;
  program: string;
  study_code: string;
  study_id: string;
  study_name: string;
}

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
  studiesStatistics: IStudiesStatistic[];
  genomes: number;
  variants: number;
  transcriptomes: number;
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
