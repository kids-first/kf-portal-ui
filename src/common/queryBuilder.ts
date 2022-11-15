import { STATIC_ROUTES } from 'utils/routes';
import {
  DATA_EPLORATION_FILTER_TAG,
  DATA_EXPLORATION_QB_ID,
} from 'views/DataExploration/utils/constant';
import { VARIANT_FILTER_TAG, VARIANT_REPO_QB_ID } from 'views/Variants/utils/constants';

export const FILTER_TAG_PAGE_MAPPING: Record<string, string> = {
  [DATA_EPLORATION_FILTER_TAG]: STATIC_ROUTES.DATA_EXPLORATION,
  [VARIANT_FILTER_TAG]: STATIC_ROUTES.VARIANT,
};

export const FILTER_TAG_QB_ID_MAPPING: Record<string, string> = {
  [DATA_EPLORATION_FILTER_TAG]: DATA_EXPLORATION_QB_ID,
  [VARIANT_FILTER_TAG]: VARIANT_REPO_QB_ID,
};
