import React from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Button, Col, Row, Typography } from 'antd';
import './MemberSearchPage.css';
import { getAllMembers } from 'services/members/search';

const { Title } = Typography;

const MemberSearchBorder = props => (
    <div className={'grid-container'}>
      <Row className={'flex'}>
        <Col span={12}>
          <Title level={2}>Kids First Membership</Title>
        </Col>
        <Col span={12} style={{textAlign:'end'}}>
          {props.isAdmin ? (
            <Button
              value="small"
              shape="round"
              type={'primary'}
              icon={<LegacyIcon type={'download'} />}
              style={{ marginBottom: 14 }}
              onClick={() => getAllMembers(props.loggedInUserToken)}
            >
              All Members
            </Button>
          ) : (
            ''
          )}
        </Col>
      </Row>
      <Row>
        <Col span={24}>{props.children}</Col>
      </Row>
    </div>
  );

export default MemberSearchBorder;
