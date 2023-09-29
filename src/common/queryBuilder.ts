import {
  DATA_EPLORATION_FILTER_TAG,
  DATA_EXPLORATION_QB_ID,
} from 'views/DataExploration/utils/constant';
import { VARIANT_FILTER_TAG, VARIANT_REPO_QB_ID } from '../views/Variants/utils/constants';

import { STATIC_ROUTES } from 'utils/routes';

export const FILTER_TAG_PAGE_MAPPING: Record<string, string> = {
  [DATA_EPLORATION_FILTER_TAG]: STATIC_ROUTES.DATA_EXPLORATION_PARTICIPANTS,
  [VARIANT_FILTER_TAG]: STATIC_ROUTES.VARIANTS,
};

export const FILTER_TAG_QB_ID_MAPPING: Record<string, string> = {
  [DATA_EPLORATION_FILTER_TAG]: DATA_EXPLORATION_QB_ID,
  [VARIANT_FILTER_TAG]: VARIANT_REPO_QB_ID,
};
