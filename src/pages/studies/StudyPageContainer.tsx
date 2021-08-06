import React from 'react';
import QueryBuilder from '@ferlab/ui/core/components/QueryBuilder';
import { IDictionary } from '@ferlab/ui/core/components/QueryBuilder/types';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';

import StudyIcon from 'icons/StudyIconSvg';
//import history from 'services/history';
import { StudiesPageContainerData } from 'store/graphql/studies/actions';

import StudyTableContainer from './StudyTableContainer';

//import {
//  getQueryBuilderCache,
//  setQueryBuilderCache,
//  updateQueryFilters,
//  updateQueryParam,
//} from './utils';
import styles from './StudiesPageContainer.module.scss';

type StudyPageContainerProps = StudiesPageContainerData;

const StudyPageContainer = ({
  studiesResults,
  studiesMappingResults,
}: //filters,
StudyPageContainerProps) => {
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
        currentQuery={{}}
        enableCombine={true}
        initialState={{
          state: [
            {
              op: 'and',
              content: [
                {
                  content: { value: ['something', 'else', 'more', 'perfect'], field: 'Test' },
                  op: 'in',
                },
                {
                  content: { value: ['something', 'else', 'more', 'perfect'], field: 'More Data' },
                  op: 'in',
                },
                {
                  content: { value: ['something', 'else', 'more', 'perfect'], field: 'Test 2' },
                  op: 'in',
                },
                {
                  content: { value: ['something', 'else', 'more', 'perfect'], field: 'Test 3' },
                  op: 'in',
                },
                {
                  content: { value: [10, 15], field: 'age' },
                  op: 'between',
                },
              ],
              total: 1500,
              id: '1',
            },
            {
              op: 'and',
              content: [
                {
                  content: { value: ['cram'], field: 'Data Type' },
                  op: 'in',
                },
              ],
              total: 1500,
              id: '2',
            },
            {
              op: 'and',
              content: [
                {
                  content: { value: ['cram'], field: 'Data Type' },
                  op: 'in',
                },
              ],
              total: 1500,
              id: '3',
            },
          ],
          active: '1',
        }}
        loading={false}
        onRemoveFacet={() => true}
        onChangeQuery={() => true}
        onUpdate={() => true}
        //onChangeQuery={(_, query) => updateQueryParam(history, 'filters', query)}
        //onRemoveFacet={(query) => updateQueryFilters(history, query.content.field, [])}
        //onUpdate={(state) => {
        //  console.log(JSON.stringify(state));
        //  setQueryBuilderCache('study-repo', state);
        //}}
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
