// @TODO: Update and sync getResolvedQueryForCount and fetchQueryCount to keep filter
// While updating to ferlab ui 3.x, there was some breakings changes
// @see https://d3b.atlassian.net/browse/SKFP-353
import React from 'react';
import QueryBuilder from '@ferlab/ui/core/components/QueryBuilder';
import { IDictionary } from '@ferlab/ui/core/components/QueryBuilder/types';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';

import StudyIcon from 'icons/StudyIconSvg';
import { StudiesPageContainerData } from 'store/graphql/studies/actions';

import { STUDIES_QUERY_BUILDER_ID } from './constants';
import StudyTableContainer from './StudyTableContainer';

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
        id={STUDIES_QUERY_BUILDER_ID}
        className="file-repo__query-builder"
        currentQuery={filters?.content?.length ? filters : {}}
        enableCombine={true}
        total={total}
        IconTotal={<StudyIcon className={styles.queryBuilderIcon} />}
        dictionary={dictionary}
        getResolvedQueryForCount={() => ({ op: 'and', content: [] })}
        fetchQueryCount={async () =>
          new Promise((resolve) => {
            resolve(1);
          })
        }
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
