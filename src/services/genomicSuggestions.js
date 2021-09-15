import { kfArrangerApiRoot } from 'common/injectGlobals';

export const getGenomicSuggestions = async (api, searchText, type) =>
  await api({
    url: `${kfArrangerApiRoot}${type}Feature/suggestions/${searchText}`,
    method: 'GET',
  });
