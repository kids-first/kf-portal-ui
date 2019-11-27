import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Col, Divider, Row, Typography, Form, Input } from 'antd';
import ResearchInterestsEditable from './ResearchInterestsEditable';
import { bioMsgWhenEmpty, storyMsgWhenEmpty } from 'components/UserProfile/constants';

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
          loading={isProfileUpdating}
          title={
            <Title
              level={1}
              style={{
                marginBottom: 0,
                marginTop: 0,
              }}
            >
              Profile
            </Title>
          }
          style={{
            width: '1200px',
            borderRadius: '10px',
          }}
          headStyle={{
            backgroundColor: 'rgb(237,238,241)',
            marginBottom: 0,
          }}
          bodyStyle={{
            padding: '32px',
          }}
          extra={
            <Fragment>
              <Button
                icon="edit"
                shape="round"
                onClick={onClickCancelCb}
              >
                Cancel
              </Button>
              <Button
                icon="edit"
                shape="round"
                htmlType="submit"
              >
                Save
              </Button>
            </Fragment>
          }
        >
          <Row>
            <Col span={24}>
              <Title
                level={4}
              >
                My Bio
              </Title>
              <Form.Item>
                {getFieldDecorator('bio', {
                  initialValue: data.bio,
                })(<TextArea rows={4} placeholder={bioMsgWhenEmpty} />)}
              </Form.Item>
              <Divider style={{ marginBottom: '24px' }} />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Title
                level={4}
              >
                My Story
              </Title>
              <Form.Item>
                {getFieldDecorator('story', {
                  initialValue: data.story,
                })(<TextArea rows={4} placeholder={storyMsgWhenEmpty} />)}
              </Form.Item>
              <Divider style={{ marginBottom: '24px' }} />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Title
                level={4}
              >
                Research Interests
              </Title>
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
