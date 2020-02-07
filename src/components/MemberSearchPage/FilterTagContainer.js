import React from 'react';
import { Col, Row } from 'antd';
import FilterTagContent from 'components/MemberSearchPage/FilterTagContent';

const FilterTagContainer = ({ filters, clearTag }) => {
  return (
    <Row className={'flex'} gutter={16} style={{ paddingTop: 32, marginLeft: 0, marginRight: 0 }}>
      {filters.roles.length > 0 ? (
        <Col style={{ padding: 0 }}>
          <FilterTagContent filters={filters.roles} type={'role'} clearTag={clearTag} />
        </Col>
      ) : (
        ''
      )}
      {filters.interests.length > 0 ? (
        <Col style={{ padding: 0 }}>
          <FilterTagContent filters={filters.interests} type={'interest'} clearTag={clearTag} />
        </Col>
      ) : (
        ''
      )}
      {filters.adminMemberOptions.length > 0 ? (
        <Col style={{ padding: 0 }}>
          <FilterTagContent
            filters={filters.adminMemberOptions}
            type={'adminMemberOptions'}
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
