import { IFileEntity } from 'graphql/files/models';
import { ArrangerResultsTree } from 'graphql/models';
import { IParticipantEntity } from 'graphql/participants/models';

export interface IBiospecimenResultTree {
  biospecimen: ArrangerResultsTree<IBiospecimenEntity>;
}

export interface IBiospecimenEntity {
  key?: string;
  id: string;
  fhir_id: string;
  status: string;
  score: number;
  volume_ul: number;
  volume_unit: string;
  container_id: string;
  age_at_biospecimen_collection: number;
  biospecimen_storage: string;
  study_id: string;
  laboratory_procedure: string;
  collection_sample_id: string;
  collection_sample_type: string;
  parent_sample_id: string;
  parent_sample_type: string;
  sample_id: string;
  sample_type: string;
  files: ArrangerResultsTree<IFileEntity>;
  nb_files: number;
  participant: IParticipantEntity;
}
