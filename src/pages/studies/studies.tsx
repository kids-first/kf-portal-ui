/* eslint-disable react/display-name */
import React, { FC } from 'react';
import history from 'services/history';

import { Layout, Table } from 'antd';
import { studiesColumns } from 'store/graphql/studies/models';
import { getExtendedMappings, getStudiesFilterBuckets, getStudiesPageData } from 'store/graphql/studies/actions';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import { IFilter, IFilterGroup, VisualType } from '@ferlab/ui/core/components/filters/types';
import FilterContainer from '@ferlab/ui/core/components/filters/FilterContainer';
import { getFilterType, updateFilters } from './utils';
import PageContent from '../../components/Layout/PageContent';

const { Sider } = Layout;

interface IBucket {
  doc_count: number;
  key: string;
}

interface IAggregation {
  buckets: IBucket[];
}

interface IAggregations {
  [key: string]: IAggregation;
}

const filterGroup: IFilterGroup = {
  field: 'domain',
  title: 'Domain',
  type: VisualType.Checkbox,
};

const Studies: FC = () => {
  const { loading: loadingData, results: data } = getStudiesPageData()();
  const { loading: loadingBuckets, results: aggs } = getStudiesFilterBuckets()();
  const { loading: mappingLoading, results: studyMapping } = getExtendedMappings()('study');

  if (loadingData) {
    return null;
  }

  return (
    <StackLayout horizontal>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          trigger={null}
          width={314}
          collapsedWidth={37}
          collapsible
          collapsed={false}
          style={{ boxShadow: '0 0 4.9px 0.2px rgba(0,0,0,0.5)' }}
        >
          <StackLayout vertical>
            {Object.keys(aggs).map((key) => {
              const found = studyMapping.find((f: any) => f.field === key);
              const filterGroup = {
                field: found.field,
                title: found.displayName,
                type: getFilterType(found.type),
              };
              const filters: IFilter[] = aggs[key].buckets.map((f: any) => ({
                data: {
                  count: f.doc_count,
                  key: f.key,
                },
                name: f.key === '__missing__' ? 'No Data' : f.key,
                id: f.key,
              }));
              return (
                <FilterContainer
                  key={key}
                  filterGroup={filterGroup}
                  filters={filters}
                  onChange={(fg, f) => updateFilters(history, fg, f)}
                  // selectedFilters={selectedFilters}
                />
              );
            })}
          </StackLayout>
        </Sider>
      </Layout>
      <PageContent title="Studies">
        <Table columns={studiesColumns} dataSource={data} />
      </PageContent>
    </StackLayout>
  );
};

export default Studies;
