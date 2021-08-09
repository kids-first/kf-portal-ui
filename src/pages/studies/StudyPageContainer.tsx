import React from 'react';
import QueryBuilder from '@ferlab/ui/core/components/QueryBuilder';
import { IDictionary } from '@ferlab/ui/core/components/QueryBuilder/types';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';

import StudyIcon from 'icons/StudyIconSvg';
import history from 'services/history';
import { StudiesPageContainerData } from 'store/graphql/studies/actions';

import StudyTableContainer from './StudyTableContainer';
import { getQueryBuilderCache, setQueryBuilderCache, updateQueryParam } from './utils';

import styles from './StudiesPageContainer.module.scss';

type StudyPageContainerProps = StudiesPageContainerData;

const StudyPageContainer = ({
  studiesResults,
  studiesMappingResults,
  filters,
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
        currentQuery={filters?.content?.length ? filters : {}}
        enableCombine={true}
        initialState={getQueryBuilderCache('study-repo')}
        loading={studiesResults?.loading}
        onChangeQuery={(_, query) => {
          //console.log(query);
          updateQueryParam(history, 'filters', query);
        }}
        onUpdate={(state) => {
          //console.log(state);
          setQueryBuilderCache('study-repo', state);
        }}
        total={total}
        IconTotal={<StudyIcon className={styles.queryBuilderIcon} />}
        dictionary={dictionary}
      />
      <StackLayout vertical className={styles.tableContainer}>
        <StudyTableContainer
          data={studiesResults.data}
          loading={studiesResults.loading}
          total={total}
        />
      </StackLayout>
    </StackLayout>
  );
};

export default StudyPageContainer;
