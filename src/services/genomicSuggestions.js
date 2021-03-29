import { apiInitialized } from './api';
import { kfArrangerApiRoot } from 'common/injectGlobals';

export const getGenomicSuggestions = async (searchText) =>
  await apiInitialized({
    url: `${kfArrangerApiRoot}genomicFeature/suggestions/${searchText}`,
    method: 'GET',
  });
