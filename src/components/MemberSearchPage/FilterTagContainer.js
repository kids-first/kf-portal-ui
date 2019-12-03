import React from 'react';
import { Col, Row, Typography } from 'antd';
import FilterTagContent from 'components/MemberSearchPage/FilterTagContent';

const { Title } = Typography;

const FilterTagContainer = ({ filters, clearTag }) => {
  return (
    <Row
      gutter={16}
      className={'background-container member-list-container'}
      style={{ marginLeft: 0, marginRight: 0 }}
    >
      {filters.roles.length > 0 ? (
        <Col span={6}>
          <FilterTagContent
            filters={filters.roles}
            title={<Title level={3}>Role Filter</Title>}
            type={'role'}
            clearTag={clearTag}
          />
        </Col>
      ) : (
        ''
      )}
      {filters.interests.length > 0 ? (
        <Col span={18}>
          <FilterTagContent
            filters={filters.interests}
            title={<Title level={3}>Interests Filters</Title>}
            type={'interest'}
            clearTag={clearTag}
          />
        </Col>
      ) : (
        ''
      )}
    </Row>
  );
};

export default FilterTagContainer;
