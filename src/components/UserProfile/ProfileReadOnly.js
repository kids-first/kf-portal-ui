import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Col, Divider, Row, Typography } from 'antd';
import ResearchInterest from './ResearchInterests';
import { bioMsgWhenEmpty, storyMsgWhenEmpty } from 'components/UserProfile/constants';
import './style.css';
import style from './style';

const { Title, Text } = Typography;

const ProfileReadOnly = props => {
  const { data, canEdit, onClickEditCb, isProfileUpdating } = props;
  return (
    <Card
      loading={isProfileUpdating}
      title={
        <Title level={1} className={'card-title'}>
          Profile
        </Title>
      }
      className={'card'}
      bodyStyle={style.cardBodyStyle}
      extra={
        canEdit ? (
          <Button type="primary" icon="edit" shape="round" onClick={onClickEditCb}>
            Edit
          </Button>
        ) : null
      }
    >
      <Row>
        <Col span={24}>
          <Title level={4}>My Bio</Title>
          <Text className={'bio-story'}>{data.bio || bioMsgWhenEmpty}</Text>
          <Divider className={'profile-divider'} />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Title level={4}>My Story</Title>
          <Text className={'bio-story'}>{data.story || storyMsgWhenEmpty}</Text>
          <Divider className={'profile-divider'} />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Title level={4}>Research Interests</Title>
          {Array.isArray(data.interests) && data.interests.length > 0 ? (
            <ResearchInterest interests={data.interests} />
          ) : (
            <Text className={'text-when-no-interests'}>{'click edit to add interests '}</Text>
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
