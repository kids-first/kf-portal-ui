import React from 'react';
import { Col, Row, Typography } from 'antd';
import './MemberSearchPage.css';

const { Title } = Typography;

const MemberSearchBorder = props => {
  return (
    <div className={'grid-container'}>
      <Row>
        <Title level={2}>Kids First Membership</Title>
      </Row>
      <Row>
        <Col span={24}>{props.children}</Col>
      </Row>
    </div>
  );
};

export default MemberSearchBorder;
