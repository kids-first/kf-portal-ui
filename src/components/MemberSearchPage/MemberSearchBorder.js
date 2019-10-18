import React from 'react';
import { Col, Row } from 'antd';
import './MemberSearchPage.css';

const MemberSearchBorder = props => {
  return (
    <div className={'grid-container'}>
      <Row>
        <Col span={24}>
          {props.children}
        </Col>
      </Row>
    </div>
  );
};

export default MemberSearchBorder;
