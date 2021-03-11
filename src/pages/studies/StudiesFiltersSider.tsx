/* eslint-disable react/display-name */
import React, { FC } from 'react';
import history from 'services/history';

import { Input, Layout, Tooltip } from 'antd';
import { getExtendedMappings, getStudiesFilterBuckets } from 'store/graphql/studies/actions';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import GridCard from '@ferlab/ui/core/view/GridCard';
import { IFilter, IFilterGroup, VisualType } from '@ferlab/ui/core/components/filters/types';
import FilterContainer from '@ferlab/ui/core/components/filters/FilterContainer';
import { getFilterType, getSelectedFilters, updateFilters, updateQueryFilters } from './utils';
import { InfoCircleOutlined } from '@ant-design/icons';
import { TSqonGroupContent } from '@ferlab/ui/core/components/QueryBuilder/types';

const { Sider } = Layout;

// @ts-ignore
const searchStoryNameCode = (e: KeyboardEvent<HTMLInputElement>) => {
  e.preventDefault();

  const filterGroup: IFilterGroup = {
    field: 'name',
    title: 'Name',
    type: VisualType.Toggle,
  };

  const sqon: TSqonGroupContent = [
    {
      content: {
        field: 'name',
        value: [e.target.value],
      },
      op: 'in',
    },
  ];

  updateQueryFilters(history, filterGroup.field, sqon);
};

const StudiesFiltersSider: FC = () => {
  const { loading: loadingBuckets, results: aggs } = getStudiesFilterBuckets()();
  const { loading: mappingLoading, results: studyMapping } = getExtendedMappings()('study');

  if (loadingBuckets || mappingLoading || !aggs) {
    return null;
  }

  return (
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
          <GridCard title="Search" style={{ display: 'contents' }}>
            <Input
              placeholder="Search..."
              suffix={
                <Tooltip title="Search by Study Code or Name ">
                  <InfoCircleOutlined />
                </Tooltip>
              }
              onPressEnter={searchStoryNameCode}
            />
          </GridCard>

          {Object.keys(aggs).map((key) => {
            const found = studyMapping.find((f: any) => f.field === key); //TODO rename
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
            const selectedFilters = getSelectedFilters(filters, filterGroup);
            return (
              <FilterContainer
                key={key}
                filterGroup={filterGroup}
                filters={filters}
                onChange={(fg, f) => updateFilters(history, fg, f)}
                selectedFilters={selectedFilters}
              />
            );
          })}
        </StackLayout>
      </Sider>
    </Layout>
  );
};

export default StudiesFiltersSider;
