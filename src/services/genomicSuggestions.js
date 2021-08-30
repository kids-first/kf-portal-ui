import { kfArrangerApiRoot } from 'common/injectGlobals';

import { apiInitialized } from './api';

export const getGenomicSuggestions = async (searchText, type) =>
  await apiInitialized({
    url: `${kfArrangerApiRoot}${type}Feature/suggestions/${searchText}`,
    method: 'GET',
  });
