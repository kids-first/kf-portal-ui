/* eslint-disable react/display-name */
import React, { FC } from 'react';
import history from 'services/history';

import { Input, Tooltip } from 'antd';
import GridCard from '@ferlab/ui/core/view/GridCard';
import { IFilter, IFilterGroup, VisualType } from '@ferlab/ui/core/components/filters/types';
import FilterContainer from '@ferlab/ui/core/components/filters/FilterContainer';
import { getFilterType, getSelectedFilters, updateFilters, updateQueryFilters } from './utils';
import { InfoCircleOutlined } from '@ant-design/icons';
import { TSqonGroupContent } from '@ferlab/ui/core/components/QueryBuilder/types';
import { SidebarData } from '../../store/graphql/studies/actions';

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

const SidebarFilters: FC<SidebarData> = (sidebarData) => {
  const mappingData = sidebarData.studiesMappingResults;
  const data = sidebarData.studiesResults;

  if ((mappingData.loadingMapping || !mappingData.extendedMapping ) || (data.loading || !data.data)) {
    return null;
  }

  return (
    <>
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
      {Object.keys(sidebarData.studiesResults.data.aggregations).map((key) => {
        const found = sidebarData.studiesMappingResults.extendedMapping.find(
          (f: any) => f.field === key,
        );
        const filterGroup = {
          field: found.field,
          title: found.displayName,
          type: getFilterType(found.type),
        };
        // @ts-ignore
        const filters: IFilter[] = sidebarData.studiesResults.data.aggregations[key!].buckets.map(
          (f: any) => ({
            data: {
              count: f.doc_count,
              key: f.key,
            },
            name: f.key === '__missing__' ? 'No Data' : f.key,
            id: f.key,
          }),
        );
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
    </>
  );
};

export default SidebarFilters;
