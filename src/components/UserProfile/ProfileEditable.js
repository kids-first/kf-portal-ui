import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Col, Divider, Row, Typography, Form, Input } from 'antd';
import ResearchInterestsEditable from './ResearchInterestsEditable';
import { bioMsgWhenEmpty, storyMsgWhenEmpty } from 'components/UserProfile/constants';
import './style.css';
import { makeCommonCardPropsEditing } from 'components/UserProfile/utils';
import { ERROR_TOO_MANY_CHARACTERS } from './constants';
import { hasFieldInError } from './utils';

const { Text } = Typography;

const { TextArea } = Input;

const MAX_LENGTH_BIO_STORY = 1024;

const validateBioStory = (rule, value, callback) => {
  if (value && value.length > MAX_LENGTH_BIO_STORY) {
    return callback(ERROR_TOO_MANY_CHARACTERS);
  }
  return callback();
};

const retrieveInterestsFromForm = formFields => {
  return Object.entries(formFields).reduce((acc, [key, value]) => {
    if (!key.startsWith('tag')) {
      return acc;
    }
    return [value, ...acc];
  }, []);
};

class ProfileEditable extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    onClickCancelCb: PropTypes.func.isRequired,
    onClickSaveCb: PropTypes.func.isRequired,
    form: PropTypes.object.isRequired,
    updateProfileCb: PropTypes.func.isRequired,
    isProfileUpdating: PropTypes.bool.isRequired,
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form, onClickSaveCb, updateProfileCb } = this.props;

    const fieldsValues = form.getFieldsValue();

    const valuesToUpdate = {
      bio: fieldsValues.bio,
      story: fieldsValues.story,
      interests: retrieveInterestsFromForm(fieldsValues),
    };
    updateProfileCb(valuesToUpdate);
    onClickSaveCb();
  };

  render() {
    const { data, form, onClickCancelCb, isProfileUpdating } = this.props;
    const { getFieldDecorator, getFieldsError } = form;

    const hasFormError = hasFieldInError(getFieldsError(['bio', 'story', 'otherAreasOfInterests']));

    return (
      <Form onSubmit={hasFormError ? undefined : this.handleSubmit}>
        <Card
          {...{
            ...makeCommonCardPropsEditing({
              title: 'Profile',
              onClickCancelCb,
              isProfileUpdating,
              disableSaveButton: hasFormError,
            }),
          }}
        >
          <Row>
            <Col span={24}>
              <Text className={'section-text'}>My Bio</Text>
              <br />
              <Form.Item>
                {getFieldDecorator('bio', {
                  initialValue: data.bio,
                  rules: [{ required: false }, { validator: validateBioStory }],
                })(<TextArea rows={4} placeholder={bioMsgWhenEmpty} />)}
              </Form.Item>
              <Divider className={'profile-divider'} />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Text className={'section-text'}>My Story</Text>
              <br />
              <Form.Item>
                {getFieldDecorator('story', {
                  initialValue: data.story,
                  rules: [{ required: false }, { validator: validateBioStory }],
                })(<TextArea rows={4} placeholder={storyMsgWhenEmpty} />)}
              </Form.Item>
              <Divider className={'profile-divider'} />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Text className={'section-text'}>Research Interests</Text>
              <ResearchInterestsEditable initialInterest={data.interests} parentForm={form} />
            </Col>
          </Row>
        </Card>
      </Form>
    );
  }
}

const ProfileForm = Form.create({ name: 'profile_form' })(ProfileEditable);

export default ProfileForm;
