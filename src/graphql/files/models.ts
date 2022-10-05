import { ArrangerResultsTree } from 'graphql/models';
import { IParticipantEntity } from 'graphql/participants/models';
import { IBiospecimenEntity } from '../biospecimens/models';

export interface IFileResultTree {
  files: ArrangerResultsTree<IFileEntity>;
}

export interface IFileStudyEntity {
  id: string;
  study_id: string;
  fhir_id: string;
  study_code: string;
  study_name: string;
  investigator_id: string;
  experimental_strategy: string[];
  family_count: number;
  participant_count: number;
  biospecimen_count: number;
  data_category: string[];
  family_data: boolean;
  controlled_access: string[];
}

export interface IFileEntity {
  key?: string;
  id: string;
  fhir_id: string;
  score: number;
  acl: string[];
  controlled_access: string;
  access_urls: string;
  data_category: string;
  data_type: string;
  file_format: string;
  file_id: string;
  size: number;
  file_name: string;
  repository: string;
  study: IFileStudyEntity;
  nb_participants: number;
  nb_biospecimens: number;
  fhir_document_reference: string;
  index?: {
    urls: string;
    file_name: string;
  };
  sequencing_experiment: {
    experiment_strategy: string;
  };
  participant: ArrangerResultsTree<IParticipantEntity>;
  biospecimens: ArrangerResultsTree<IBiospecimenEntity>;
  external_id: string;
}

export enum FileAccessType {
  CONTROLLED = 'Controlled',
  REGISTERED = 'Registered',
}

export type ITableFileEntity = IFileEntity & {
  key: string;
};
