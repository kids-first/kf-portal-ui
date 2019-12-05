import React from 'react';
import PropTypes from 'prop-types';
import { Card, Col, Divider, Row, Typography } from 'antd';
import ResearchInterest from './ResearchInterests';
import { bioMsgWhenEmpty, storyMsgWhenEmpty } from 'components/UserProfile/constants';
import './style.css';
import { makeCommonCardPropsReadOnly } from 'components/UserProfile/utils';

const { Title, Text } = Typography;

const ProfileReadOnly = props => {
  const { data, canEdit, onClickEditCb, isProfileUpdating } = props;
  return (
    <Card
      {...makeCommonCardPropsReadOnly({
        isProfileUpdating,
        title: 'Profile',
        onClickEditCb,
        canEdit,
      })}
    >
      <Row>
        <Col span={24}>
          <Title level={3}>My Bio</Title>
          <Text className={'bio-story'}>{data.bio || bioMsgWhenEmpty}</Text>
          <Divider className={'profile-divider'} />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Title level={3}>My Story</Title>
          <Text className={'bio-story'}>{data.story || storyMsgWhenEmpty}</Text>
          <Divider className={'profile-divider'} />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Title level={3}>Research Interests</Title>
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
