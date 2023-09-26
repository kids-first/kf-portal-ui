import { IFileEntity } from 'graphql/files/models';
import { ArrangerResultsTree } from 'graphql/models';
import { IParticipantEntity } from 'graphql/participants/models';
import { IStudyEntity } from 'graphql/studies/models';

export interface IBiospecimenResultTree {
  biospecimen: ArrangerResultsTree<IBiospecimenEntity>;
}

export enum Status {
  AVAILABLE = 'available',
  UNAVAILABLE = 'unavailable',
}

export interface IBiospecimenEntity {
  key?: string;
  id: string;
  fhir_id: string;
  status: Status;
  score: number;
  volume: number;
  volume_unit: string;
  container_id: string;
  age_at_biospecimen_collection: number;
  biospecimen_storage: string;
  study_id: string;
  study: IStudyEntity;
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
  ncit_anatomy_site_id: string;
  anatomy_site: string;
  ncit_id_tissue_type: string;
  tissue_type_source_text: string;
  source_text_tumor_location: string;
  dbgap_consent_code: string;
  consent_type: string;
}
