import React from 'react';
import { DownloadOutlined } from '@ant-design/icons';
import { Button, Col, Row, Typography } from 'antd';
import PropTypes from 'prop-types';

import { getAllMembers } from 'services/members/search';

import './MemberSearchPage.css';

const { Title } = Typography;

const MemberSearchBorder = (props) => (
  <div className={'grid-container-members'}>
    <Row className={'flex'}>
      <Col span={12}>
        <Title level={2}>Kids First Membership</Title>
      </Col>
      <Col span={12} style={{ textAlign: 'end' }}>
        {props.isAdmin ? (
          <Button
            value="small"
            shape="round"
            type={'primary'}
            icon={<DownloadOutlined />}
            style={{ marginBottom: 14 }}
            onClick={() => getAllMembers()}
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

MemberSearchBorder.propTypes = {
  isAdmin: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default MemberSearchBorder;
