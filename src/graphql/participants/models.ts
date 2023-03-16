import { IArrangerResultsTree } from '@ferlab/ui/core/graphql/types';
import { IBiospecimenEntity } from 'graphql/biospecimens/models';
import { IFileEntity } from 'graphql/files/models';

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
  age_at_event_days: number;
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

export interface IParticipantFamilyRelations {
  id: string;
  related_participant_id: string;
  relation: string;
}

export interface IParticipantFamily {
  family_id: string;
  family_relations: IArrangerResultsTree<IParticipantFamilyRelations>;
}

export interface IParticipantEntity {
  id: string; //weird constraint imposed.
  fhir_id: string;
  sex: string;
  external_id: string;
  participant_id: string;
  study: IParticipantStudy;
  down_syndrome_status: string;
  families_id: string;
  family_type: string;
  family: IParticipantFamily;
  is_proband: boolean;
  age_at_data_collection: number;
  nb_files: number;
  files: IArrangerResultsTree<IFileEntity>;
  nb_biospecimens: number;
  study_id: string;
  release_id: string;
  score: number;
  down_syndrome_diagnosis: string;
  ethnicity: string;
  study_external_id: string;
  mondo: IArrangerResultsTree<IParticipantMondo>;
  observed_phenotype: IArrangerResultsTree<IParticipantObservedPhenotype>;
  diagnosis: IArrangerResultsTree<IParticipantDiagnosis>;
  biospecimens: IArrangerResultsTree<IBiospecimenEntity>;
  phenotype: IArrangerResultsTree<IParticipantPhenotype>;
  race: string;
  outcomes: IArrangerResultsTree<IParticipantOutcomes>;
}

export type ITableParticipantEntity = IParticipantEntity & {
  key: string;
};

export interface IUseParticipantEntityProps {
  field: string;
  values: string[];
}

export interface IUseParticipantEntityReturn {
  loading: boolean;
  data?: IParticipantEntity;
}

export interface IUseParticipantEntityFamilyReturn {
  loading: boolean;
  data?: IParticipantEntity[];
}
