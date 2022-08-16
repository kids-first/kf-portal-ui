import {IUserSetOutput} from 'services/api/savedSet/models';
import { ISqonGroupFilter } from '@ferlab/ui/core/data/sqon/types';

export interface ISavedSet {
  idField: string;
  projectId: string;
  sqon: ISqonGroupFilter;
  tag: string;
  type: string;
  sort: Sort[];
}

export type Sort = {
  field: string;
  order: string;
};

export type initialState = {
  defaultFilter?: ISavedSet;
  savedSets: IUserSetOutput[];
  isLoading: boolean;
  isUpdating: boolean;
  error?: any;
  fetchingError?: any;
  selectedId?: string;
};
