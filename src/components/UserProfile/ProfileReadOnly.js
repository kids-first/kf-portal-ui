import React from 'react';
import PropTypes from 'prop-types';
import { Card, Col, Divider, Row, Typography } from 'antd';
import ResearchInterest from './ResearchInterests';
import {
  bioMsgWhenEmpty,
  storyMsgWhenEmpty,
  EDIT_CARD_TO_ADD_DETAILS,
} from 'components/UserProfile/constants';
import './style.css';
import { makeCommonCardPropsReadOnly, showWhenHasDataOrCanEdit } from './utils';

const { Text } = Typography;

const hasInterests = data => Array.isArray(data.interests) && data.interests.length > 0;

const hasData = data => {
  return Boolean(data.bio) || Boolean(data.story) || hasInterests(data);
};

const ProfileReadOnly = props => {
  const { data, canEdit, onClickEditCb, isProfileUpdating } = props;

  if (!hasData(data)) {
    return (
      <Card
        {...makeCommonCardPropsReadOnly({
          isProfileUpdating,
          title: 'Profile',
          onClickEditCb,
          canEdit,
        })}
      >
        <Text className={'contact-info-value'}>
          {canEdit ? EDIT_CARD_TO_ADD_DETAILS : 'No Data'}
        </Text>
      </Card>
    );
  }

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
            <br />
            <Text className={'bio-story'}>{data.bio || bioMsgWhenEmpty}</Text>
            <Divider className={'profile-divider'} />
          </Col>
        </Row>
      )}
      {showWhenHasDataOrCanEdit(data.story, canEdit) && (
        <Row>
          <Col span={24}>
            <Text className={'section-text'}>My Story</Text>
            <br />
            <br />
            <Text className={'bio-story'}>{data.story || storyMsgWhenEmpty}</Text>
            <Divider className={'profile-divider'} />
          </Col>
        </Row>
      )}
      {(hasInterests(data) || canEdit) && (
        <Row>
          <Col span={24}>
            <Text className={'section-text'}>Research Interests</Text>
            <br />
            <br />
            {hasInterests(data) ? (
              <ResearchInterest interests={data.interests} />
            ) : (
              <Text className={'text-when-no-interests'}>{'click edit to add interests '}</Text>
            )}
          </Col>
        </Row>
      )}
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
