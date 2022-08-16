import { FILTER_ID_QUERY_PARAM_KEY } from 'common/constants';
import useQueryParams from 'hooks/useQueryParams';
import { useSelector } from 'react-redux';
import { savedFilterSelector } from './selector';

export type { initialState as SavedFilterInitialState } from './types';
export { default, SavedFilterState } from './slice';
export const useSavedFilter = (tag?: string) => {
  const savedFilterState = useSelector(savedFilterSelector);
  const params = useQueryParams();

  if (tag) {
    const filters = savedFilterState.savedFilters.filter((savedFilter) => savedFilter.tag === tag);
    const selectedFilterById = filters.find(
      ({ id }) => id === params.get(FILTER_ID_QUERY_PARAM_KEY),
    );
    //const favoriteFilter = filters.find(({ favorite }) => !!favorite); // Disabled right now

    return {
      ...savedFilterState,
      defaultFilter: selectedFilterById,
      savedFilters: filters,
    };
  }

  return savedFilterState;
};
