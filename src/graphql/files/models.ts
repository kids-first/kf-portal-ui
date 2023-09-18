import { IArrangerResultsTree } from '@ferlab/ui/core/graphql/types';
import { IParticipantEntity } from 'graphql/participants/models';

import { IBiospecimenEntity } from '../biospecimens/models';

export interface IFileResultTree {
  file: IArrangerResultsTree<IFileEntity>;
}

export interface IFileStudyEntity {
  id: string;
  study_id: string;
  fhir_id: string;
  study_code: string;
  study_name: string;
  external_id: string;
  experimental_strategy: string[];
  family_count: number;
  participant_count: number;
  biospecimen_count: number;
  data_category: string[];
  family_data: boolean;
  controlled_access: string[];
}

export interface ISequencingExperiment {
  id: string;
  sequencing_experiment_id: string;
  experiment_strategy: string;
  experiment_date?: string;
  center: string;
  library_name: string;
  library_prep: string;
  library_selection: string;
  library_strand: string;
  platform: string;
  instrument_model: string;
  external_id?: string;
  sequencing_center_id: string;
}

export interface IFileEntity {
  key?: string;
  id: string;
  acl: string[];
  biospecimens: IArrangerResultsTree<IBiospecimenEntity>;
  controlled_access: string;
  access_urls: string;
  data_category: string;
  data_type: string;
  external_id: string;
  fhir_document_reference: string;
  fhir_id: string;
  file_format: string;
  file_id: string;
  file_name: string;
  hashes: {
    etag: string;
    md5: string;
  };
  index?: {
    urls: string;
    file_name: string;
  };
  is_harmonized: boolean;
  nb_participants: number;
  nb_biospecimens: number;
  participants: IArrangerResultsTree<IParticipantEntity>;
  repository: string;
  study: IFileStudyEntity;
  score: number;
  sequencing_experiment: IArrangerResultsTree<ISequencingExperiment>;
  size: number;
}

export enum FileAccessType {
  CONTROLLED = 'Controlled',
  REGISTERED = 'Registered',
}

export type ITableFileEntity = IFileEntity & {
  key: string;
};
