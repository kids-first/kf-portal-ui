import { IBiospecimenEntity } from 'graphql/biospecimens/models';
import { IFileEntity } from 'graphql/files/models';
import { ArrangerResultsTree } from 'graphql/models';

export interface IParticipantResultTree {
  participant: ArrangerResultsTree<IParticipantEntity>;
}

export interface IParticipantDiagnosis {
  id: string;
  score: number;
  mondo_id_diagnosis: string;
  source_text: string;
}

export interface IParticipantPhenotype {
  id: string;
  score: number;
  hpo_id_phenotype: string;
}

export interface IParticipantMondo {
  id: any;
  name: string;
  is_tagged: boolean;
}

export interface IParticipantObservedPhenotype {
  id: any;
  name: string;
  is_tagged: boolean;
}

export interface IParticipantEntity {
  id: string;
  score: number;
  fhir_id: string;
  age_at_data_collection: number;
  down_syndrome_diagnosis: string;
  ethnicity: string;
  family_type: string;
  is_proband: boolean;
  down_syndrome_status: string;
  kf_id: string;
  external_id: string;
  race: string;
  sex: string;
  study_external_id: string;
  study_id: string;
  nb_files: number;
  nb_biospecimens: number;
  mondo: ArrangerResultsTree<IParticipantMondo>;
  observed_phenotype: ArrangerResultsTree<IParticipantObservedPhenotype>;
  diagnosis: ArrangerResultsTree<IParticipantDiagnosis>;
  files: ArrangerResultsTree<IFileEntity>;
  biospecimen: ArrangerResultsTree<IBiospecimenEntity>;
  phenotype: ArrangerResultsTree<IParticipantPhenotype>;
  participant_id: string;
}

export type ITableParticipantEntity = IParticipantEntity & {
  key: string;
};
