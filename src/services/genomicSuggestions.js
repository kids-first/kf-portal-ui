import { kfArrangerApiRoot } from 'common/injectGlobals';

export const getGenomicSuggestions = async (api, searchText) =>
  await api({
    url: `${kfArrangerApiRoot}genomicFeature/suggestions/${searchText}`,
    method: 'GET',
  });
