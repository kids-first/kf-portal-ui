import React from 'react';
import { Col, Row } from 'antd';
import FilterTagContent from 'components/MemberSearchPage/FilterTagContent';

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
            title={'Role Filters'}
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
            title={'Interests Filters'}
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
