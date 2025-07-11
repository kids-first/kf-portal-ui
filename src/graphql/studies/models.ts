import { IArrangerResultsTree } from '@ferlab/ui/core/graphql/types';

export interface IStudyResultTree {
  study: IArrangerResultsTree<IStudyEntity>;
}

export interface IStudyEntity {
  id: string;
  domain: string;
  study_id: string;
  study_code: string;
  study_name: string;
  program: string;
  external_id: string;
  family_count: number;
  participant_count: number;
  biospecimen_count: number;
  file_count: number;
  data_category: string[];
  website: string;
}
