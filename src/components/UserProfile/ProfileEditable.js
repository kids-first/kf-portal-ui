import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Col, Divider, Row, Typography, Form, Input } from 'antd';
import ResearchInterestsEditable from './ResearchInterestsEditable';
import { bioMsgWhenEmpty, storyMsgWhenEmpty } from 'components/UserProfile/constants';
import './style.css';
import { makeCommonCardPropsEditing } from 'components/UserProfile/utils';

const { Title } = Typography;

const { TextArea } = Input;

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
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSubmit}>
        <Card
          {...{
            ...makeCommonCardPropsEditing({
              title: 'Profile',
              onClickCancelCb,
              isProfileUpdating,
            }),
          }}
        >
          <Row>
            <Col span={24}>
              <Title level={3}>My Bio</Title>
              <Form.Item>
                {getFieldDecorator('bio', {
                  initialValue: data.bio,
                })(<TextArea rows={4} placeholder={bioMsgWhenEmpty} />)}
              </Form.Item>
              <Divider className={'profile-divider'} />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Title level={3}>My Story</Title>
              <Form.Item>
                {getFieldDecorator('story', {
                  initialValue: data.story,
                })(<TextArea rows={4} placeholder={storyMsgWhenEmpty} />)}
              </Form.Item>
              <Divider className={'profile-divider'} />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Title level={3}>Research Interests</Title>
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
