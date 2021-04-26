import React from 'react';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import QueryBuilder from '@ferlab/ui/core/components/QueryBuilder';
import {
  getQueryBuilderCache,
  setQueryBuilderCache,
  updateQueryFilters,
  updateQueryParam,
} from './utils';
import history from 'services/history';
import StudyTableContainer, { PaginationType } from './StudyTableContainer';
import { StudiesPageContainerData } from '../../store/graphql/studies/actions';
import StudyIcon from 'icons/StudyIconSvg';

import styles from './StudiesPageContainer.module.scss';
import { IDictionary } from '@ferlab/ui/core/components/QueryBuilder/types';

type StudyPageContainerProps = StudiesPageContainerData & PaginationType;

const StudyPageContainer = ({
  studiesResults,
  studiesMappingResults,
  filters,
  pagination,
}: StudyPageContainerProps) => {
  const total = studiesResults?.data?.hits?.total || 0;

  const dictionary: IDictionary = {
    query: {
      facet: (key) =>
        studiesMappingResults?.extendedMapping?.find((mapping: any) => key === mapping.field)
          ?.displayName || key,
    },
  };

  return (
    <StackLayout vertical>
      <QueryBuilder
        className="file-repo__query-builder"
        currentQuery={filters.content.length > 0 ? filters : {}}
        initialState={getQueryBuilderCache('study-repo')}
        loading={false}
        onChangeQuery={(_, query) => updateQueryParam(history, 'filters', query)}
        onRemoveFacet={(query) => updateQueryFilters(history, query.content.field, [])}
        onUpdate={(state) => setQueryBuilderCache('study-repo', state)}
        total={total}
        IconTotal={<StudyIcon className={styles.queryBuilderIcon} />}
        dictionary={dictionary}
      />
      <StackLayout vertical className={styles.tableContainer}>
        <StudyTableContainer
          data={studiesResults.data}
          loading={studiesResults.loading}
          pagination={pagination}
        />
      </StackLayout>
    </StackLayout>
  );
};

export default StudyPageContainer;
