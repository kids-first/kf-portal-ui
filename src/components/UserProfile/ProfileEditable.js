import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Col, Divider, Row, Typography, Input, Form } from 'antd';
import ResearchInterestsEditable from './ResearchInterestsEditable';
import { bioMsgWhenEmpty, storyMsgWhenEmpty } from 'components/UserProfile/constants';
import './style.css';
import { makeCommonCardPropsEditing } from 'components/UserProfile/utils';
import { ERROR_TOO_MANY_CHARACTERS } from './constants';

const { Text } = Typography;

const { TextArea } = Input;

const { entries } = Object;

const MAX_LENGTH_BIO_STORY = 2000;

const retrieveInterestsFromForm = formFields =>
  entries(formFields).reduce((acc, [key, value]) => {
    if (!key.startsWith('tag')) {
      return acc;
    }
    return [value, ...acc];
  }, []);

const ProfileForm = props => {
  const [form] = Form.useForm();
  const { onClickSaveCb, updateProfileCb, data, onClickCancelCb, isProfileUpdating } = props;

  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(false);

  const charactersLengthValidator = maxLength => (rule, value) => {
    if (value && value.length > maxLength) {
      setIsSaveButtonDisabled(true);
      // eslint-disable-next-line no-undef
      return Promise.reject(`${ERROR_TOO_MANY_CHARACTERS} ( max: ${maxLength} ) `);
    }
    setIsSaveButtonDisabled(false);
    // eslint-disable-next-line no-undef
    return Promise.resolve();
  };

  const validateBioStory = charactersLengthValidator(MAX_LENGTH_BIO_STORY);

  const handleSubmit = formFields => {
    const valuesToUpdate = {
      bio: formFields.bio,
      story: formFields.story,
      interests: retrieveInterestsFromForm(formFields),
    };

    updateProfileCb(valuesToUpdate);
    onClickSaveCb();
  };

  return (
    <Form
      onFinish={handleSubmit}
      name={'profile_form'}
      form={form}
      layout={'vertical'}
      initialValues={{
        bio: data.bio,
        story: data.story,
      }}
      className={'form-card'}
    >
      <Card
        {...{
          ...makeCommonCardPropsEditing({
            title: 'Profile',
            onClickCancelCb,
            isProfileUpdating,
            disableSaveButton: isSaveButtonDisabled,
          }),
        }}
      >
        <Row>
          <Col span={24}>
            <Text className={'section-text'}>My Bio</Text>
            <br />
            <Form.Item
              name="bio"
              rules={[
                { required: false },
                () => ({
                  validator: validateBioStory,
                }),
              ]}
            >
              <TextArea rows={4} placeholder={bioMsgWhenEmpty} />
            </Form.Item>
            <Divider className={'profile-divider'} />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Text className={'section-text'}>My Story</Text>
            <br />
            <Form.Item
              name="story"
              rules={[
                { required: false },
                () => ({
                  validator: validateBioStory,
                }),
              ]}
            >
              <TextArea rows={4} placeholder={storyMsgWhenEmpty} />
            </Form.Item>
            <Divider className={'profile-divider'} />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Text className={'section-text'}>Research Interests</Text>
            <ResearchInterestsEditable
              parentForm={form}
              charactersLengthValidator={charactersLengthValidator}
              initialInterests={data.interests}
            />
          </Col>
        </Row>
      </Card>
    </Form>
  );
};

ProfileForm.propTypes = {
  data: PropTypes.object.isRequired,
  onClickCancelCb: PropTypes.func.isRequired,
  onClickSaveCb: PropTypes.func.isRequired,
  updateProfileCb: PropTypes.func.isRequired,
  isProfileUpdating: PropTypes.bool.isRequired,
  loggedInUser: PropTypes.object.isRequired,
};

export default ProfileForm;
