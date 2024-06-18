import { ISqonGroupFilter } from '@ferlab/ui/core/data/sqon/types';

import { IUserSetOutput, SetType, TBiospecimenRequest } from 'services/api/savedSet/models';

export interface ISavedSet {
  idField: string;
  projectId: string;
  sqon: ISqonGroupFilter;
  tag: string;
  type: SetType;
  sort: Sort[];
}

export type Sort = {
  field: string;
  order: string;
};

export type initialState = {
  defaultFilter?: ISavedSet;
  savedSets: IUserSetOutput[];
  sharedBiospecimenRequest?: TBiospecimenRequest;
  isLoading: boolean;
  isUpdating: boolean;
  error?: any;
  fetchingError?: any;
  selectedId?: string;
};
