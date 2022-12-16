import { PaginationViewPerQuery } from '@ferlab/ui/core/components/ProTable/Pagination/constants';
import { SortDirection } from '@ferlab/ui/core/graphql/constants';
import { IQueryConfig, ISort } from '@ferlab/ui/core/graphql/types';
import { SavedFilterTag } from 'services/api/savedFilter/models';

export const SCROLL_WRAPPER_ID = 'variants-scroll-wrapper';

// TODO : still needed, check when api are added
export const VARIANT_REPO_QB_ID = 'kf-variant-repo-key';

export const VARIANT_FILTER_TAG = SavedFilterTag.VariantsExplorationPage;

export const DEFAULT_OFFSET = 0;
export const DEFAULT_PAGE_INDEX = 1;

export const DEFAULT_PAGE_SIZE = PaginationViewPerQuery.Twenty;

export const DEFAULT_SORT_QUERY = [
  { field: 'max_impact_score', order: SortDirection.Desc },
  { field: 'hgvsg', order: SortDirection.Asc },
] as ISort[];

export const DEFAULT_QUERY_CONFIG: IQueryConfig = {
  pageIndex: DEFAULT_OFFSET,
  size: DEFAULT_PAGE_SIZE,
  sort: DEFAULT_SORT_QUERY,
  searchAfter: undefined,
  firstPageFlag: undefined,
  operations: undefined,
};
