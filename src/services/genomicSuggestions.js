import { arrangerApiRoot } from 'common/injectGlobals';

export const getGenomicSuggestions = async (api, searchText, type) =>
  await api({
    url: `${arrangerApiRoot}${type}Feature/suggestions/${searchText}`,
    method: 'GET',
  });
