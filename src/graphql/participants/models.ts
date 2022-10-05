import { IBiospecimenEntity } from 'graphql/biospecimens/models';
import { IFileEntity } from 'graphql/files/models';
import { ArrangerResultsTree } from 'graphql/models';

export interface IParticipantResultTree {
  participant: ArrangerResultsTree<IParticipantEntity>;
}

export interface IParticipantDiagnosis {
  id: string;
  mondo_id_diagnosis: string;
  source_text: string;
  ncit_id_diagnosis: string;
  affected_status: boolean;
}

export interface IParticipantPhenotype {
  id: string;
  age_at_event_days: number;
  fhir_id: string;
  hpo_phenotype_observed: string;
  is_observed: boolean;
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
  is_leaf: boolean;
  parents: string[];
  age_at_event_days: string[];
}

export interface IParticipantStudy {
  fhir_id: string;
  study_name: string;
  status: string;
  investigator_id: string;
  study_code: string;
  participant_count: number;
  file_count: number;
  biospecimen_count: number;
  family_count: number;
  family_data: boolean;
  study_id: string;
}

export interface IParticipantOutcomes {
  id: string;
  fhir_id: string;
  release_id: string;
  study_id: string;
  participant_fhir_id: string;
  vital_status: string;
  observation_id: string;
  age_at_event_days: {
    value: string;
    units: string;
  };
}

export interface IParticipantEntity {
  id: string; //weird constraint imposed.
  fhir_id: string;
  sex: string;
  external_id: string;
  participant_id: string;
  study: IParticipantStudy;
  down_syndrome_status: string;
  family_type: string;
  is_proband: boolean;
  age_at_data_collection: number;
  nb_files: number;
  files: ArrangerResultsTree<IFileEntity>;
  nb_biospecimens: number;
  study_id: string;
  release_id: string;
  score: number;
  down_syndrome_diagnosis: string;
  ethnicity: string;
  study_external_id: string;
  mondo: ArrangerResultsTree<IParticipantMondo>;
  observed_phenotype: ArrangerResultsTree<IParticipantObservedPhenotype>;
  diagnosis: ArrangerResultsTree<IParticipantDiagnosis>;
  biospecimen: ArrangerResultsTree<IBiospecimenEntity>;
  phenotype: ArrangerResultsTree<IParticipantPhenotype>;
  race: string;
  outcomes: ArrangerResultsTree<IParticipantOutcomes>;
}

export type ITableParticipantEntity = IParticipantEntity & {
  key: string;
};
