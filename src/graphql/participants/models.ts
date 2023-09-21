import { IArrangerResultsTree } from '@ferlab/ui/core/graphql/types';
import { IFileEntity } from 'graphql/files/models';
import { IStudyEntity } from 'graphql/studies/models';

export interface IParticipantResultTree {
  participant: IArrangerResultsTree<IParticipantEntity>;
}

export interface IParticipantDiagnosis {
  id: string;
  mondo_id_diagnosis: string;
  source_text: string;
  ncit_id_diagnosis: string;
  diagnosis_category?: string;
  affected_status: boolean;
  diagnosis_id: string;
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
  age_at_event_days: number[];
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

export interface IFamilyRelationToProband {
  id: string;
  role: string;
  participant_id: string;
}

export interface IParticipantFamily {
  family_id: string;
  relations_to_proband: IArrangerResultsTree<IFamilyRelationToProband>;
}

export type ITableParticipantEntity = IParticipantEntity & {
  key: string;
};

export interface IUseParticipantEntityProps {
  field: string;
  values: string[];
}

export interface IUseParticipantEntityResults {
  loading: boolean;
  data?: IParticipantEntity;
}
//=========

export interface IParticipantResultTree {
  participant: IArrangerResultsTree<IParticipantEntity>;
}

export interface IParticipantDiagnosis {
  id: string;
  diagnosis_id: string;
  mondo_id_diagnosis: string;
  source_text: string;
  age_at_event_days: number;
}

export interface IParticipantPhenotype {
  id: string;
  age_at_event_days: number;
  source_text: string;
  fhir_id: string;
  hpo_phenotype: string;
  hpo_phenotype_observed: string;
  hpo_phenotype_observed_text: string;
  hpo_phenotype_not_observed: string;
  hpo_phenotype_not_observed_text: string;
  observed: boolean;
}

export interface IParticipantBiospecimen {
  id: string;
  age_at_biospecimen_collection: number;
  age_at_biospecimen_collection_years: number;
  age_at_biospecimen_collection_onset: string;
  sample_id: string;
  sample_type: string;
  parent_sample_id: string;
  parent_sample_type: string;
  collection_sample_id: string;
  collection_sample_type: string;
  container_id: string;
  volume: number;
  volume_unit: string;
  laboratory_procedure: string;
  biospecimen_storage: string;
  fhir_id: string;
  biospecimen_facet_ids: {
    biospecimen_fhir_id_1: string;
    biospecimen_fhir_id_2: string;
  };
  status: string;
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

export interface IFamilyRelationToProband {
  id: string;
  role: string;
  participant_id: string;
}

export interface IParticipantFamily {
  family_id: string;
  relations_to_proband: IArrangerResultsTree<IFamilyRelationToProband>;
}

export enum Sex {
  FEMALE = 'female',
  MALE = 'male',
  OTHER = 'other',
  UNKNOWN = 'unknown',
}

export enum FamilyType {
  PROBAND = 'proband-only',
  DUO = 'duo',
  TRIO = 'trio',
  TRIO_PLUS = 'trio+',
  OTHER = 'other',
}
export interface IParticipantEntity {
  id: string;
  score: number;
  fhir_id: string;
  age_at_data_collection: number;
  down_syndrome_diagnosis: string;
  ethnicity: string;
  family_type: FamilyType;
  is_proband: boolean;
  down_syndrome_status: string;
  participant_id: string;
  external_id: string;
  race: string;
  sex: Sex;
  study_external_id: string;
  study_id: string;
  nb_files: number;
  nb_biospecimens: number;
  mondo: IArrangerResultsTree<IParticipantMondo>;
  observed_phenotype: IArrangerResultsTree<IParticipantObservedPhenotype>;
  diagnosis: IArrangerResultsTree<IParticipantDiagnosis>;
  files: IArrangerResultsTree<IFileEntity>;
  phenotype: IArrangerResultsTree<IParticipantPhenotype>;
  study: IStudyEntity;
  family: IParticipantFamily;
  biospecimens: IArrangerResultsTree<IParticipantBiospecimen>;
}

export interface IDataFile {
  data_category: { buckets: [{ key: string }] };
  exp_strategies: { buckets: [{ key: string }] };
}

export interface IDataFileResultTree {
  file: {
    aggregations: IDataFile;
  };
  loading: boolean;
}
