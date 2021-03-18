import { apiInitialized } from './api';

export const getGenomicSuggestions = async (searchText) =>
  await apiInitialized({
    url: `https://kf-api-arranger-qa.kf-strides.org/genomicFeature/suggestions/${searchText}`, //TODO
    method: 'GET',
  });
