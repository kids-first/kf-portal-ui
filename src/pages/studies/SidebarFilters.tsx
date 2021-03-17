/* eslint-disable react/display-name */
import React, { FC } from 'react';
import history from 'services/history';
import { INDEX_EXTENDED_MAPPING, STUDIES_BUCKETS } from 'store/graphql/studies/queries';
import { useQuery } from '@apollo/client';

import { Input, Tooltip } from 'antd';
import GridCard from '@ferlab/ui/core/view/GridCard';
import { IFilter, IFilterGroup, VisualType } from '@ferlab/ui/core/components/filters/types';
import FilterContainer from '@ferlab/ui/core/components/filters/FilterContainer';
import { getFilterType, getSelectedFilters, updateFilters, updateQueryFilters } from './utils';
import { InfoCircleOutlined } from '@ant-design/icons';
import { TSqonGroupContent } from '@ferlab/ui/core/components/QueryBuilder/types';

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
  const { loading: loadingBuckets, data, previousData } = useQuery<any>(STUDIES_BUCKETS, {
    variables: [],
  });
  // const aggs = data?.study.aggregations;

  const {
    loading: mappingLoading,
    data: dataMapping,
    previousData: previousDataMapping,
  } = useQuery<any>(INDEX_EXTENDED_MAPPING('study'), {
    variables: [],
  });
  // const studyMapping = results2?.study.extended;

  let result = previousData;

  let resultMapping = previousDataMapping;

  if ((!previousData && loadingBuckets) || (!previousDataMapping && mappingLoading)) {
    return null;
  }

  if (data) {
    result = data;
  }
  if (dataMapping) {
    resultMapping = dataMapping;
  }
  if (dataMapping) {
    resultMapping = dataMapping;
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
      {Object.keys(result?.study.aggregations).map((key) => {
        const found = resultMapping?.study.extended?.find((f: any) => f.field === key); //TODO rename
        const filterGroup = {
          field: found.field,
          title: found.displayName,
          type: getFilterType(found.type),
        };
        const filters: IFilter[] = result?.study.aggregations[key].buckets.map((f: any) => ({
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
    </>
  );
};

export default StudiesFiltersSider;
