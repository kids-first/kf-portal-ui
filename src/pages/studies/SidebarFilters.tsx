import React from 'react';
import { InfoCircleOutlined, ReadOutlined } from '@ant-design/icons';
import { ISqonGroupFilter } from '@ferlab/ui/core/data/sqon/types';
import { Col, Row, Tooltip } from 'antd';

import { generateFilters } from 'components/Utils/utils';
import { SidebarData, useGetStudiesSearch } from 'store/graphql/studies/actions';

import { STUDIES_QUERY_BUILDER_ID } from './constants';
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
    <div className={style.studyFiltersContainer}>
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
      {generateFilters(STUDIES_QUERY_BUILDER_ID, data, studiesMappingResults)}
    </div>
  );
};

export default SidebarFilters;
