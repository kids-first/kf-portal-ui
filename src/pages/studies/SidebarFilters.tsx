/* eslint-disable react/display-name */
import React from 'react';
import { InfoCircleOutlined, ReadOutlined } from '@ant-design/icons';
import FilterContainer from '@ferlab/ui/core/components/filters/FilterContainer';
import { IFilter } from '@ferlab/ui/core/components/filters/types';
import { ISqonGroupFilter } from '@ferlab/ui/core/components/QueryBuilder/types';
import { Col, Row, Tooltip } from 'antd';

import history from 'services/history';
import { SidebarData, useGetStudiesSearch } from 'store/graphql/studies/actions';

import SearchBar from './SearchBar';
import { getFilterType, getSelectedFilters, updateFilters } from './utils';

import style from './SidebarFilter.module.scss';

const keyEnhance = (key: string, s: string = ' No Data') => {
  switch (key) {
    case '__missing__':
      return s;
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

type StudiesProps = {
  onChange: () => void;
  filters: ISqonGroupFilter;
};
type OwnProps = SidebarData & StudiesProps;

export interface ItemProps {
  label: React.ReactElement;
  value: string;
}

const sqon = {
  content: [],
  op: 'and',
};

const SidebarFilters = ({ studiesResults, studiesMappingResults, onChange, filters }: OwnProps) => {
  const data = studiesResults;
  const options: ItemProps[] = [];

  let allStudies = useGetStudiesSearch({
    sqon: sqon,
    first: 10,
    offset: 0,
  });

  if (allStudies && allStudies.data) {
    allStudies.data.hits.edges.forEach((n) =>
      options.push({
        label: (
          <>
            <Row>
              <Col span={2}>
                <ReadOutlined />
              </Col>
              <Col span={22}>
                <div style={{ fontSize: '1.4rem', color: '#383F72' }}>{n.node.code}</div>
                <div style={{ fontSize: '1.2rem', color: '#6E7190' }}>{n.node.name}</div>
              </Col>
            </Row>
          </>
        ),
        value: `${n.node.code}|${n.node.name}`,
      }),
    );
  }

  return (
    <>
      <div id={'anchor-search-bar'}>
        <Row gutter={5}>
          <Col>
            <div className={style.storySearchIcons}>Search Studies</div>
          </Col>
          <Col>
            <Tooltip placement="topLeft" title={'Search by study code or study name'}>
              <InfoCircleOutlined style={{ color: '#8A8DA8' }} />
            </Tooltip>
          </Col>
        </Row>
        {options.length > 0 ? <SearchBar filters={filters} options={options} /> : <div />}
      </div>
      {Object.keys(data.data?.aggregations || []).map((key) => {
        const found = (studiesMappingResults?.extendedMapping || []).find(
          (f: any) => f.field === key,
        );
        const filterGroup = {
          field: found?.field || '',
          title: found?.displayName || '',
          type: getFilterType(found?.type || ''),
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
