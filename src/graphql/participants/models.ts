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
}

export type ITableParticipantEntity = IParticipantEntity & {
  key: string;
};
