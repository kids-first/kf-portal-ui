import { Divider, Input, Row, Typography } from 'antd';
import React from 'react';
import UserProfilePageBox from 'components/UserProfile/UserProfilePageBox';

const { Title, Text } = Typography;
const { TextArea } = Input;

const h4 = theme => {
  return {
    fontFamily: theme.fonts.details,
    fontSize: 13,
    fontStyle: 'italic',
    lineHeight: 1.85,
    textAlign: 'left',
    color: theme.greyScale9,
    margin: 0,
    padding: 0,
    fontWeight: 'normal',
  };
};

const UserProfilePageAboutMe = props => {
  return (
    <UserProfilePageBox
      title={'Profile'}
      onSave={props.onSave}
      onCancel={props.onCancel}
      onEditClick={props.onEdit}
      isEditingBackgroundInfo={props.isEditingBackgroundInfo}
      canEdit={props.canEdit}
    >
      <Row>
        <Title level={3}>My Bio</Title>
        <Title style={h4(props.theme)} level={4}>
          Share information about your professional background and your research interests.
        </Title>
        {props.isEditingBackgroundInfo ? (
          <TextArea
            placeholder="Autosize height based on content lines"
            onChange={props.onChange('bioTextarea')}
            defaultValue={props.bioTextarea}
            disabled={!props.isEditingBackgroundInfo}
            // value={bioTextarea}
            autoSize={true}
          />
        ) : (
          <Text editable={false} style={{ whiteSpace: 'pre-wrap' }}>
            {props.bioTextarea}
          </Text>
        )}
      </Row>
      <Divider />
      <Row>
        <Title level={3}>My Story</Title>
        <Title level={4} style={h4(props.theme)}>
          Share why you’re a part of the Kids First community.
        </Title>
        {props.isEditingBackgroundInfo ? (
          <TextArea
            placeholder="Autosize height based on content lines"
            onChange={props.onChange('storyTextarea')}
            defaultValue={props.storyTextarea}
            disabled={!props.isEditingBackgroundInfo}
            // value={bioTextarea}
            autoSize={true}
          />
        ) : (
          <Text editable={false} style={{ whiteSpace: 'pre-wrap' }}>
            {props.storyTextarea}
          </Text>
        )}
      </Row>
    </UserProfilePageBox>
  );
};

export default UserProfilePageAboutMe;
