import { ISavedFilter } from '@ferlab/ui/core/components/QueryBuilder/types';
import useQueryBuilderState from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { ISyntheticSqon } from '@ferlab/ui/core/data/sqon/types';
import { useSavedFilter } from 'store/savedFilter';

const getSelectedSavedFilter = (
  savedFilters: ISavedFilter[],
  defaultFilter?: ISavedFilter,
  queryList?: ISyntheticSqon[],
) =>
  defaultFilter ??
  savedFilters.find(({ queries }) =>
    queries.find(({ id }) => queryList?.find((query) => query.id === id)),
  );

const useQBStateWithSavedFilters = (queryBuilderId: string, savedFilterTag: string) => {
  const { queryList, activeQuery, ...qbStateRest } = useQueryBuilderState(queryBuilderId);
  const { savedFilters, defaultFilter } = useSavedFilter(savedFilterTag);

  return {
    queryList,
    activeQuery,
    ...qbStateRest,
    savedFilterList: savedFilters,
    selectedSavedFilter: getSelectedSavedFilter(savedFilters, defaultFilter, queryList),
  };
};

export default useQBStateWithSavedFilters;
