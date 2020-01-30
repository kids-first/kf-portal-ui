import React from 'react';
import { Button, Col, Row, Typography } from 'antd';
import './MemberSearchPage.css';
import {getAllMembers} from 'services/members/search';

const { Title } = Typography;

const MemberSearchBorder = props => {
  return (
    <div className={'grid-container'}>
      <Row className={'flex'}>
        <Title level={2}>Kids First Membership</Title>
        {props.isAdmin ? (
          <Button
            value="small"
            type={'primary'}
            icon={'download'}
            style={{ marginBottom: 14 }}
            onClick={() => getAllMembers("toto")}
          >
            Download
          </Button>
        ) : (
          ''
        )}
      </Row>
      <Row>
        <Col span={24}>{props.children}</Col>
      </Row>
    </div>
  );
};

export default MemberSearchBorder;
