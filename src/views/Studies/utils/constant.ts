import { IQueryConfig } from '@ferlab/ui/core/graphql/types';

export const STUDIES_REPO_QB_ID = 'studies-repo-key';

export const DEFAULT_PAGE_INDEX = 0;
export const DEFAULT_PAGE_SIZE = 20;

export const CAVATICA_FILE_BATCH_SIZE = 10000;

export const STUDIES_FILTER_TAG = 'study';

export const DEFAULT_PAGING_CONFIG = {
  index: DEFAULT_PAGE_INDEX,
  size: DEFAULT_PAGE_SIZE,
};

export const DEFAULT_QUERY_CONFIG: IQueryConfig = {
  pageIndex: DEFAULT_PAGE_INDEX,
  size: DEFAULT_PAGE_SIZE,
  sort: [],
};

export const SCROLL_WRAPPER_ID = 'studies-scroll-wrapper';
