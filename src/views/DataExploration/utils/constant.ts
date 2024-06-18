import { PaginationViewPerQuery } from '@ferlab/ui/core/components/ProTable/Pagination/constants';
import { SortDirection } from '@ferlab/ui/core/graphql/constants';
import { IQueryConfig, ISort } from '@ferlab/ui/core/graphql/types';

import { SavedFilterTag } from 'services/api/savedFilter/models';

export const PARTICIPANTS_SAVED_SETS_FIELD = 'participant_id';
export const DATA_FILES_SAVED_SETS_FIELD = 'file_id';
export const BIOSPECIMENS_SAVED_SETS_FIELD = 'biospecimen_id';

export const DATA_EXPLORATION_QB_ID = 'data-exploration-repo-key';

export const DEFAULT_OFFSET = 0;
export const DEFAULT_PAGE_INDEX = 1;
export const DEFAULT_PAGE_SIZE = PaginationViewPerQuery.Twenty;

export const CAVATICA_FILE_BATCH_SIZE = 10000;

export const DATA_EPLORATION_FILTER_TAG = SavedFilterTag.ParticipantsExplorationPage;

export const DEFAULT_PAGING_CONFIG = {
  index: DEFAULT_PAGE_INDEX,
  size: DEFAULT_PAGE_SIZE,
};

export const DEFAULT_PARTICIPANT_QUERY_SORT = [
  { field: 'participant_id', order: SortDirection.Asc },
] as ISort[];

export const DEFAULT_BIOSPECIMEN_QUERY_SORT = [
  { field: 'sample_id', order: SortDirection.Asc },
] as ISort[];

export const DEFAULT_FILE_QUERY_SORT = [{ field: 'file_id', order: SortDirection.Asc }] as ISort[];

export const DEFAULT_QUERY_CONFIG: IQueryConfig = {
  pageIndex: DEFAULT_PAGE_INDEX,
  size: DEFAULT_PAGE_SIZE,
  sort: [],
  searchAfter: undefined,
  firstPageFlag: undefined,
  operations: undefined,
};

export const SCROLL_WRAPPER_ID = 'data-explore-scroll-wrapper';

export enum TAB_IDS {
  SUMMARY = 'summary',
  PARTICIPANTS = 'participants',
  BIOSPECIMENS = 'biospecimens',
  DATA_FILES = 'datafiles',
}
