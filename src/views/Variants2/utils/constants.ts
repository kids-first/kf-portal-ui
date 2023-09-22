import { SortDirection } from '@ferlab/ui/core/graphql/constants';
import { IQueryConfig, ISort } from '@ferlab/ui/core/graphql/types';

export const VARIANT_SAVED_SETS_FIELD = 'locus';

export const SCROLL_WRAPPER_ID = 'variants-scroll-wrapper';

export const VARIANT_REPO_QB_ID = 'variant-repo-key';

export const VARIANT_FILTER_TAG = 'variants';

export const DEFAULT_OFFSET = 0;
export const DEFAULT_PAGE_INDEX = 1;
export const DEFAULT_PAGE_SIZE = 20;

export const DEFAULT_SORT_QUERY = [
  { field: 'max_impact_score', order: SortDirection.Desc },
  { field: 'hgvsg', order: SortDirection.Asc },
] as ISort[];

export enum TAB_IDS {
  SUMMARY = 'summary',
  VARIANTS = 'variants',
}

export const DEFAULT_QUERY_CONFIG: IQueryConfig = {
  pageIndex: DEFAULT_OFFSET,
  size: DEFAULT_PAGE_SIZE,
  sort: DEFAULT_SORT_QUERY,
  searchAfter: undefined,
  firstPageFlag: undefined,
  operations: undefined,
};
