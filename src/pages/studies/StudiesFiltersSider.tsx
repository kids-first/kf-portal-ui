/* eslint-disable react/display-name */
import React, { FC, useState } from 'react';
import history from 'services/history';

import { Input, Layout, Tooltip } from 'antd';
import { useGetExtendedMappings, useGetStudiesFilterBuckets } from 'store/graphql/studies/actions';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import ScrollView from '@ferlab/ui/core/layout/ScrollView';
import GridCard from '@ferlab/ui/core/view/GridCard';
import { IFilter, IFilterGroup, VisualType } from '@ferlab/ui/core/components/filters/types';
import FilterContainer from '@ferlab/ui/core/components/filters/FilterContainer';
import { getFilterType, getSelectedFilters, updateFilters, updateQueryFilters } from './utils';
import { InfoCircleOutlined } from '@ant-design/icons';
import { TSqonGroupContent } from '@ferlab/ui/core/components/QueryBuilder/types';
import styles from './StudiesFiltersSider.module.scss';

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
  const { loading: loadingBuckets, results: aggs } = useGetStudiesFilterBuckets();
  const { loading: mappingLoading, results: studyMapping } = useGetExtendedMappings('study');
  const [collapsed, setCollapsed] = useState<boolean>(false);

  if (loadingBuckets || mappingLoading || !aggs) {
    return null;
  }

  return (
    <Sider
      trigger={null}
      width={314}
      collapsedWidth={50}
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
    >
      <StackLayout vertical className={styles.siderContainer} center={false} flexContent>
        {collapsed ? (
          <MenuUnfoldOutlined onClick={() => setCollapsed(!collapsed)} />
        ) : (
          <MenuFoldOutlined onClick={() => setCollapsed(!collapsed)} />
        )}

        <ScrollView className={styles.scrollView}>
          {!collapsed && (
            <GridCard title="Search">
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
          )}
          {!collapsed &&
            Object.keys(aggs).map((key) => {
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
        </ScrollView>
      </StackLayout>
    </Sider>
  );
};

export default StudiesFiltersSider;
