import { ArrangerResultsTree } from 'graphql/models';
import { IParticipantEntity } from 'graphql/participants/models';
import { IStudyEntity } from 'graphql/studies/models';
import { IBiospecimenEntity } from '../biospecimens/models';

export interface IFileResultTree {
  file: ArrangerResultsTree<IFileEntity>;
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
  study: IStudyEntity;
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
}

export enum FileAccessType {
  CONTROLLED = 'Controlled',
  REGISTERED = 'Registered',
}

export type ITableFileEntity = IFileEntity & {
  key: string;
};
