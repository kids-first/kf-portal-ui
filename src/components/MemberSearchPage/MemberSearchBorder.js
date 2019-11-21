import React from 'react';
import { Col, Row, Typography } from 'antd';
import './MemberSearchPage.css';

const { Title } = Typography;

const MemberSearchBorder = props => {
  return (
    //TODO mode style to css class or default ant design theme
    <div className={'grid-container'}>
      <Row>
        <Title
          level={1}
          style={{
            color: 'rgb(43, 56, 143)',
            margin: 0,
            padding: 0,
            fontWeight: 500,
            linHeight: 0.71,
            letterSpacing: 0.4,
            fontFamily: 'Montserrat, sans-serif',
            textDecoration: 'none',
            fontSize: 28,
          }}
        >
          Kids First Membership
        </Title>
      </Row>
      <Row style={{ marginTop: 20 }}>
        <Col span={24}>{props.children}</Col>
      </Row>
    </div>
  );
};

export default MemberSearchBorder;
