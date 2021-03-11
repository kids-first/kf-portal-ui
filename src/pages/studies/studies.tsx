/* eslint-disable react/display-name */
import React, { FC } from 'react';
import { getStudiesPageData } from 'store/graphql/studies/actions';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import PageContent from '../../components/Layout/PageContent';
import StudiesFiltersSider from './StudiesFiltersSider';
import { Table } from 'antd';
import { studiesColumns } from '../../store/graphql/studies/models';
import QueryBuilder from '@ferlab/ui/core/components/QueryBuilder';
import {
  IValueFilter,
  TCallbackRemoveAction,
  TOnChange,
} from '@ferlab/ui/core/components/QueryBuilder/types';
import {
  getQueryBuilderCache,
  setQueryBuilderCache,
  updateQueryFilters,
  updateQueryParam,
  useFilters,
} from './utils';
import history from 'services/history';

interface IBucket {
  doc_count: number;
  key: string;
}

const totalStudies = 0; //get(result, `Study.${Hits.ITEM}.total`, 0);

const Studies: FC = () => {
  const { filters, mappedFilters } = useFilters();
  console.log(filters, 'FILTERS');
  const { loading: loadingData, results: data } = getStudiesPageData()();

  if (loadingData) {
    return null;
  }

  return (
    <StackLayout horizontal>
      <StudiesFiltersSider />
      <PageContent title="Studies">
        <StackLayout vertical>
          <QueryBuilder
            // IconTotal={<MdAssignment />}
            className="file-repo__query-builder"
            currentQuery={filters}
            initialState={getQueryBuilderCache('study-repo')}
            // initialState={{ state: [], active: 'ndfbehbde' }}
            loading={loadingData}
            onChangeQuery={(_, query) => updateQueryParam(history, 'filters', query)}
            onRemoveFacet={(query) => updateQueryFilters(history, query.content.field, [])}
            onUpdate={(state) => setQueryBuilderCache('study-repo', state)}
            total={totalStudies}
          />

          <Table columns={studiesColumns} dataSource={data} />
        </StackLayout>
      </PageContent>
    </StackLayout>
  );
};

export default Studies;
