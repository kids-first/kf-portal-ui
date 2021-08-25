import React from 'react';
import { InfoCircleOutlined, ReadOutlined } from '@ant-design/icons';
import FilterContainer from '@ferlab/ui/core/components/filters/FilterContainer';
import { IFilter } from '@ferlab/ui/core/components/filters/types';
import {
  getFilterType,
  getSelectedFilters,
  updateFilters,
} from '@ferlab/ui/core/data/filters/utils';
import { ISqonGroupFilter } from '@ferlab/ui/core/data/sqon/types';
import { Col, Row, Tooltip } from 'antd';

import history from 'services/history';
import { SidebarData, useGetStudiesSearch } from 'store/graphql/studies/actions';
import { keyEnhance, keyEnhanceBooleanOnly } from 'store/graphql/utils';

import SearchBar from './SearchBar';
import { MAX_NUMBER_STUDIES } from './studies';

import style from './SidebarFilter.module.scss';

type StudiesProps = {
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

const SidebarFilters = ({ studiesResults, studiesMappingResults, filters }: OwnProps) => {
  const data = studiesResults;
  const options: ItemProps[] = [];

  const allStudies = useGetStudiesSearch({
    sqon: sqon,
    first: MAX_NUMBER_STUDIES,
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
                <div className={style.studySearchDropdownCode}>{n.node.code}</div>
                <div className={style.studySearchDropdownName}>{n.node.name}</div>
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
            <div className={style.storySearchTitle}>Search Studies</div>
          </Col>
          <Col>
            <Tooltip placement="topLeft" title={'Search by study code or study name'}>
              <InfoCircleOutlined className={style.storySearchIconsDisabled} />
            </Tooltip>
          </Col>
        </Row>
        {options.length ? <SearchBar filters={filters} options={options} /> : <div />}
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
