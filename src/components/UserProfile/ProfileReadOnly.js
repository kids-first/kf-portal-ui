import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Col, Divider, Row, Typography } from 'antd';
import ResearchInterest from './ResearchInterests_new';
import { bioMsgWhenEmpty, storyMsgWhenEmpty } from 'components/UserProfile/constants';

const { Title, Text } = Typography;

const ProfileReadOnly = props => {
  const { data, canEdit, onClickEditCb, isProfileUpdating } = props;
  return (
    <Card
      loading={isProfileUpdating}
      title={
        <Title level={1} style={{ marginBottom: 0 }}>
          Profile
        </Title>
      }
      style={{
        width: '1200px',
      }}
      bodyStyle={{
        padding: '32px',
      }}
      extra={
        canEdit ? (
          <Button
            type="primary"
            icon="edit"
            shape="round"
            onClick={onClickEditCb}
          >
            Edit
          </Button>
        ) : null
      }
    >
      <Row>
        <Col span={24}>
          <Title level={4}>My Bio</Title>
          <Text style={{ fontStyle: 'italic', paddingBottom: '24px' }}>
            {data.bio || bioMsgWhenEmpty}
          </Text>
          <Divider style={{ marginBottom: '24px' }} />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Title level={4}>My Story</Title>
          <Text style={{ fontStyle: 'italic', paddingBottom: '24px' }}>
            {data.story || storyMsgWhenEmpty}
          </Text>
          <Divider style={{ marginBottom: '24px' }} />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Title level={4}>Research Interests</Title>
          {Array.isArray(data.interests) && data.interests.length > 0 ? (
            <ResearchInterest interests={data.interests} />
          ) : (
            <Text style={{ fontStyle: 'italic' }}>{'click edit to add interests '}</Text>
          )}
        </Col>
      </Row>
    </Card>
  );
};

ProfileReadOnly.propTypes = {
  data: PropTypes.object.isRequired,
  canEdit: PropTypes.bool.isRequired,
  onClickEditCb: PropTypes.func.isRequired,
  isProfileUpdating: PropTypes.bool.isRequired,
};

export default ProfileReadOnly;
