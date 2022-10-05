import { IQueryConfig } from 'common/searchPageTypes';

export const SCROLL_WRAPPER_ID = 'variants-scroll-wrapper';

// TODO : still needed, check when api are added
export const VARIANT_REPO_QB_ID = 'kf-variant-repo-key';

export const VARIANT_FILTER_TAG = 'variants-exploration';

export const DEFAULT_PAGE_INDEX = 1;
export const DEFAULT_PAGE_SIZE = 20;

export const DEFAULT_QUERY_CONFIG: IQueryConfig = {
  pageIndex: DEFAULT_PAGE_INDEX,
  size: DEFAULT_PAGE_SIZE,
  sort: [],
};
