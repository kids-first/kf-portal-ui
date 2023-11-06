import { ReactElement, useEffect, useState } from 'react';
import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { TExtendedMapping } from '@ferlab/ui/core/components/filters/types';
import { resetSearchAfterQueryConfig, tieBreaker } from '@ferlab/ui/core/components/ProTable/utils';
import QueryBuilder from '@ferlab/ui/core/components/QueryBuilder';
import { ISavedFilter } from '@ferlab/ui/core/components/QueryBuilder/types';
import { dotToUnderscore } from '@ferlab/ui/core/data/arranger/formatting';
import { isEmptySqon, resolveSyntheticSqon } from '@ferlab/ui/core/data/sqon/utils';
import { SortDirection } from '@ferlab/ui/core/graphql/constants';
import { IExtendedMappingResults } from '@ferlab/ui/core/graphql/types';
import { Space, Typography } from 'antd';
import copy from 'copy-to-clipboard';
import { useVariant } from 'graphql/variants/actions';
import { IVariantResultTree } from 'graphql/variants/models';
import { GET_VARIANT_COUNT } from 'graphql/variants/queries';
import {
  DEFAULT_OFFSET,
  DEFAULT_PAGE_INDEX,
  DEFAULT_PAGE_SIZE,
  DEFAULT_QUERY_CONFIG,
  DEFAULT_SORT_QUERY,
  VARIANT_REPO_QB_ID,
} from 'views/Variants/utils/constants';

import { SHARED_FILTER_ID_QUERY_PARAM_KEY } from 'common/constants';
import LineStyleIcon from 'components/Icons/LineStyleIcon';
import GenericFilters from 'components/uiKit/FilterList/GenericFilters';
import useQBStateWithSavedFilters from 'hooks/useQBStateWithSavedFilters';
import { ArrangerApi } from 'services/api/arranger';
import { SavedFilterTag } from 'services/api/savedFilter/models';
import { globalActions } from 'store/global';
import {
  createSavedFilter,
  deleteSavedFilter,
  setSavedFilterAsDefault,
  updateSavedFilter,
} from 'store/savedFilter/thunks';
import { useSavedSet } from 'store/savedSet';
import { useUser } from 'store/user';
import { combineExtendedMappings } from 'utils/fieldMapper';
import { getCurrentUrl } from 'utils/helper';
import { getQueryBuilderDictionary } from 'utils/translation';

import VariantsTable from './VariantsTable';

import styles from './index.module.scss';

type OwnProps = {
  variantMapping: IExtendedMappingResults;
};

const addTagToFilter = (filter: ISavedFilter) => ({
  ...filter,
  tag: SavedFilterTag.VariantsExplorationPage,
});

const PageContent = ({ variantMapping }: OwnProps) => {
  const dispatch = useDispatch<any>();
  const { userInfo } = useUser();
  const { savedSets } = useSavedSet();
  const { queryList, activeQuery, selectedSavedFilter, savedFilterList } =
    useQBStateWithSavedFilters(VARIANT_REPO_QB_ID, SavedFilterTag.VariantsExplorationPage);
  const [queryConfig, setQueryConfig] = useState({
    ...DEFAULT_QUERY_CONFIG,
    size: userInfo?.config.variants?.tables?.variants?.viewPerQuery || DEFAULT_PAGE_SIZE,
  });
  const [selectedFilterContent, setSelectedFilterContent] = useState<ReactElement | undefined>(
    undefined,
  );
  const [pageIndex, setPageIndex] = useState(DEFAULT_PAGE_INDEX);

  const variantResolvedSqon = resolveSyntheticSqon(queryList, activeQuery);

  const results = useVariant(
    {
      first: queryConfig.size,
      offset: DEFAULT_OFFSET,
      searchAfter: queryConfig.searchAfter,
      sqon: variantResolvedSqon,
      sort: tieBreaker({
        sort: queryConfig.sort,
        defaultSort: DEFAULT_SORT_QUERY,
        field: 'locus',
        order: queryConfig.operations?.previous ? SortDirection.Desc : SortDirection.Asc,
      }),
    },
    queryConfig.operations,
  );

  useEffect(() => {
    if (queryConfig.firstPageFlag !== undefined || queryConfig.searchAfter === undefined) {
      return;
    }

    setQueryConfig({
      ...queryConfig,
      firstPageFlag: queryConfig.searchAfter,
    });
  }, [queryConfig]);

  useEffect(() => {
    resetSearchAfterQueryConfig(
      {
        ...DEFAULT_QUERY_CONFIG,
        size: userInfo?.config.variants?.tables?.variants?.viewPerQuery || DEFAULT_PAGE_SIZE,
      },
      setQueryConfig,
    );
    setPageIndex(DEFAULT_PAGE_INDEX);
    // eslint-disable-next-line
  }, [JSON.stringify(activeQuery)]);

  const facetTransResolver = (key: string) => {
    const title = intl.get(`facets.${key}`);
    return title
      ? title
      : combineExtendedMappings([variantMapping])?.data?.find(
          (mapping: TExtendedMapping) => key === mapping.field,
        )?.displayName || key;
  };

  const handleOnUpdateFilter = (filter: ISavedFilter) => dispatch(updateSavedFilter(filter));
  const handleOnSaveFilter = (filter: ISavedFilter) =>
    dispatch(createSavedFilter(addTagToFilter(filter)));
  const handleOnDeleteFilter = (id: string) => dispatch(deleteSavedFilter(id));
  const handleOnSaveAsFavorite = (filter: ISavedFilter) =>
    dispatch(setSavedFilterAsDefault(addTagToFilter(filter)));
  const handleOnShareFilter = (filter: ISavedFilter) => {
    copy(`${getCurrentUrl()}?${SHARED_FILTER_ID_QUERY_PARAM_KEY}=${filter.id}`);
    dispatch(
      globalActions.displayMessage({
        content: 'Copied share url',
        type: 'success',
      }),
    );
  };

  return (
    <Space direction="vertical" size={24} className={styles.variantsPageContent}>
      <div className={styles.pageHeader}>
        <Typography.Title className={styles.pageHeaderTitle} level={1}>
          {intl.get('screen.variants.title')}
        </Typography.Title>
      </div>

      <QueryBuilder
        id={VARIANT_REPO_QB_ID}
        className="variants-repo__query-builder"
        headerConfig={{
          showHeader: true,
          showTools: true,
          defaultTitle: intl.get('components.querybuilder.defaultTitle'),
          options: {
            enableEditTitle: true,
            enableDuplicate: true,
            enableFavoriteFilter: false,
            enableShare: true,
            enableUndoChanges: true,
          },
          selectedSavedFilter: selectedSavedFilter,
          savedFilters: savedFilterList,
          onShareFilter: handleOnShareFilter,
          onUpdateFilter: handleOnUpdateFilter,
          onSaveFilter: handleOnSaveFilter,
          onDeleteFilter: handleOnDeleteFilter,
          onSetAsFavorite: handleOnSaveAsFavorite,
        }}
        facetFilterConfig={{
          enable: true,
          onFacetClick: (filter) => {
            const index = filter.content.index!;
            const field = filter.content.field;

            setSelectedFilterContent(
              <GenericFilters
                queryBuilderId={VARIANT_REPO_QB_ID}
                index={index}
                field={dotToUnderscore(field)}
                sqon={variantResolvedSqon}
                extendedMappingResults={variantMapping}
              />,
            );
          },
          selectedFilterContent: selectedFilterContent,
          blacklistedFacets: ['consequences.symbol', 'consequences.symbol_id_1', 'locus'],
        }}
        enableCombine
        enableShowHideLabels
        IconTotal={<LineStyleIcon width={18} height={18} />}
        currentQuery={isEmptySqon(activeQuery) ? {} : activeQuery}
        total={results.total}
        dictionary={getQueryBuilderDictionary(facetTransResolver, savedSets)}
        getResolvedQueryForCount={(sqon) => resolveSyntheticSqon(queryList, sqon)}
        fetchQueryCount={async (sqon) => {
          const { data } = await ArrangerApi.graphqlRequest<{ data: IVariantResultTree }>({
            query: GET_VARIANT_COUNT.loc?.source.body,
            variables: {
              sqon: resolveSyntheticSqon(queryList, sqon),
            },
          });

          return data?.data?.variants?.hits?.total ?? 0;
        }}
      />
      <VariantsTable
        pageIndex={pageIndex}
        sqon={variantResolvedSqon}
        setPageIndex={setPageIndex}
        results={results}
        setQueryConfig={setQueryConfig}
        queryConfig={queryConfig}
      />
    </Space>
  );
};

export default PageContent;
