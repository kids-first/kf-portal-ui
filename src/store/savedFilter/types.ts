import { ISavedFilter } from '@ferlab/ui/core/components/QueryBuilder/types';
import { TUserSavedFilter } from 'services/api/savedFilter/models';

export type initialState = {
  defaultFilter?: ISavedFilter;
  savedFilters: TUserSavedFilter[];
  sharedSavedFilter?: TUserSavedFilter;
  isLoading: boolean;
  isSaving: boolean;
  isUpdating: boolean;
  error?: any;
  fetchingError?: any;
  selectedId?: string;
};
