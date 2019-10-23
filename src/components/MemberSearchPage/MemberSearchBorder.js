import React from 'react';
import { Col, Row, Typography } from 'antd';
import './MemberSearchPage.css';

const { Title } = Typography;

const MemberSearchBorder = props => {
  return (
    <div className={'grid-container'} style={{marginLeft:130, marginRight:130}}>
      <Row>
        <Title level={1} style={{ margin: 0 }}>
          Kids First Membership
        </Title>
      </Row>
      {props.loggedInUser && !props.loggedInUser.isPublic ? (
        <Row>
          <i> Make your profile public to appear in the list </i>
        </Row>
      ) : (
        ''
      )}
      <Row style={{ marginTop: 20 }}>
        <Col span={24}>{props.children}</Col>
      </Row>
    </div>
  );
};

export default MemberSearchBorder;
