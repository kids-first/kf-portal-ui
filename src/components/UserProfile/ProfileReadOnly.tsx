import React from 'react';
import { Card, Col, Divider, Row, Typography } from 'antd';

import { bioMsgWhenEmpty, storyMsgWhenEmpty } from 'components/UserProfile/constants';

import { ProfileTodo } from '../../store/profileTypes';

import CardNoDataReadOnly from './CardNoDataReadOnly';
import ResearchInterest from './ResearchInterests';
import { makeCommonCardPropsReadOnly, showWhenHasDataOrCanEdit } from './utils';

import './style.css';

type Props = {
  data: ProfileTodo;
  canEdit: boolean;
  isProfileUpdating: boolean;
  onClickEditCb: () => void;
};

const hasInterests = (data: ProfileTodo) =>
  Array.isArray(data.interests) && data.interests.length > 0;

const hasData = (data: ProfileTodo) => data.bio || data.story || hasInterests(data);

const { Text, Paragraph } = Typography;

const ProfileReadOnly = ({ data, canEdit, onClickEditCb, isProfileUpdating }: Props) => {
  if (!hasData(data)) {
    return (
      <CardNoDataReadOnly
        title={'Profile'}
        onClickEditCb={onClickEditCb}
        canEdit={canEdit}
        isProfileUpdating={isProfileUpdating}
      />
    );
  }

  const hasInterestBlock = hasInterests(data) || canEdit;

  return (
    <Card
      {...makeCommonCardPropsReadOnly({
        isProfileUpdating,
        title: 'Profile',
        onClickEditCb,
        canEdit,
      })}
    >
      {showWhenHasDataOrCanEdit(data.bio, canEdit) && (
        <Row>
          <Col span={24}>
            <Text className={'section-text'}>My Bio</Text>
            <br />
            <Paragraph className={data.bio ? 'bio-story' : 'bio-story-when-empty'}>
              {data.bio || bioMsgWhenEmpty}
            </Paragraph>
            {(hasInterestBlock || showWhenHasDataOrCanEdit(data.story, canEdit)) && (
              <Divider className={'profile-divider'} />
            )}
          </Col>
        </Row>
      )}
      {showWhenHasDataOrCanEdit(data.story, canEdit) && (
        <Row>
          <Col span={24}>
            <Text className={'section-text'}>My Story</Text>
            <br />
            <Paragraph className={data.story ? 'bio-story' : 'bio-story-when-empty'}>
              {data.story || storyMsgWhenEmpty}
            </Paragraph>
            {hasInterestBlock && <Divider className={'profile-divider'} />}
          </Col>
        </Row>
      )}
      {hasInterestBlock && (
        <Row>
          <Col span={24}>
            <Text className={'section-text'}>Research Interests</Text>
            <br />
            {hasInterests(data) ? (
              <ResearchInterest interests={data.interests!} />
            ) : (
              <Text className={'text-when-no-interests'}>{'click edit to add interests '}</Text>
            )}
          </Col>
        </Row>
      )}
    </Card>
  );
};

export default ProfileReadOnly;
