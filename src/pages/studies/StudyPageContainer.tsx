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
import StudyTableContainer from './StudyTableContainer';
import styles from './StudiesPageContainer.module.scss';

const StudyPageContainer = ({ data, loading, filters }: any): React.ReactElement => {
  const totalStudies = 10; // data.length || 0;

  return (
    <StackLayout vertical>
      <QueryBuilder
        // IconTotal={<MdAssignment />}
        className="file-repo__query-builder"
        currentQuery={filters}
        initialState={getQueryBuilderCache('study-repo')}
        loading={false}
        onChangeQuery={(_, query) => updateQueryParam(history, 'filters', query)}
        onRemoveFacet={(query) => updateQueryFilters(history, query.content.field, [])}
        onUpdate={(state) => setQueryBuilderCache('study-repo', state)}
        total={totalStudies}
      />
      <StackLayout vertical className={styles.tableContainer}>
        <StudyTableContainer data={data} loading={loading} />
      </StackLayout>
    </StackLayout>
  );
};

export default StudyPageContainer;
