/* eslint-disable react/display-name */
import React from 'react';
import FilterContainer from '@ferlab/ui/core/components/filters/FilterContainer';
import { IFilter } from '@ferlab/ui/core/components/filters/types';

import history from 'services/history';
import { SidebarData } from 'store/graphql/studies/actions';
import { Input, Tooltip } from 'antd';
import { InfoCircleOutlined, SearchOutlined } from '@ant-design/icons';
import colors from 'style/themes/default/_colors.scss';

import { getFilterType, getSelectedFilters, updateFilters } from './utils';

const keyEnhance = (key: string) => {
  switch (key) {
    case '__missing__':
      return ' No Data';
    case '1':
      return 'True';
    case '0':
      return 'False';
    default:
      return key;
  }
};

const keyEnhanceBooleanOnly = (key: string) => {
  switch (key) {
    case '1':
      return 'true';
    case '0':
      return 'false';
    default:
      return key;
  }
};

const onSearch = (search: string) => {
  const searchFields = ['name', 'code'];
  searchFields.forEach((f) =>
    updateQueryFilters(
      history,
      f,
      [
        {
          content: {
            field: f,
            value: [search.toLowerCase()],
          },
          op: 'in',
        },
      ],
      'or',
    ),
  );
};

type StudiesProps = {
  onChange: () => void;
};
type OwnProps = SidebarData & StudiesProps;

const SidebarFilters = ({ studiesResults, studiesMappingResults, onChange }: OwnProps) => {
  const mappingData = studiesMappingResults;
  const data = studiesResults;

  if (mappingData?.loadingMapping || !mappingData?.extendedMapping || data.loading || !data.data) {
    return null;
  }

  return (
    <>
      <div style={{ color: colors.iconColor }}>Search</div>
      <Input
        prefix={<SearchOutlined style={{ color: colors.iconColorDisabled }} />}
        placeholder="Search..."
        onPressEnter={(e: any) => {
          e.preventDefault();
          const value = e.target.value;
          if (value && value.trim()) {
            onSearch(e.target.value);
          }
        }}
        suffix={
          <Tooltip title="Search Story by Code or Name">
            <InfoCircleOutlined style={{ color: colors.iconColorDisabled }} />
          </Tooltip>
        }
      />
      {Object.keys(data.data.aggregations).map((key) => {
        const found = studiesMappingResults.extendedMapping.find((f: any) => f.field === key);
        const filterGroup = {
          field: found!.field,
          title: found!.displayName,
          type: getFilterType(found!.type),
        };
        // @ts-ignore
        const filters: IFilter[] = studiesResults.data.aggregations[key!].buckets.map((f: any) => ({
          data: {
            count: f.doc_count,
            key: keyEnhanceBooleanOnly(f.key),
          },
          name: keyEnhance(f.key),
          id: f.key,
        }));
        const selectedFilters = getSelectedFilters(filters, filterGroup);
        return (
          <FilterContainer
            key={key}
            filterGroup={filterGroup}
            filters={filters}
            onChange={(fg, f) => {
              onChange();
              updateFilters(history, fg, f);
            }}
            selectedFilters={selectedFilters}
          />
        );
      })}
    </>
  );
};

export default SidebarFilters;
