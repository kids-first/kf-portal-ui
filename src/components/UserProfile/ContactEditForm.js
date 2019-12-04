import React, { Component, Fragment } from 'react';
import { Button, Card, Col, Form, Row, Typography } from 'antd';
import PropTypes from 'prop-types';
import ContactInformationEditable from 'components/UserProfile/ContactInformationEditable';
import FindMeEditable from './FindMeEditable';
import './style.css';
import style from './style';
import { findMeFields } from './constants';

const { Title } = Typography;

const reshapeForProfile = fields => {
  const { entries } = Object;
  return entries(fields).reduce(
    (acc, [key, value]) => {
      if (key === 'roles' && !Array.isArray(value)) {
        return {
          ...acc,
          roles: [value],
        };
      }
      if (findMeFields.includes(key)) {
        return {
          ...acc,
          [key]: (value || {}).inputVal,
        };
      }
      return acc;
    },
    { ...fields },
  );
};

class ContactEditForm extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    onClickCancelCb: PropTypes.func.isRequired,
    onClickSaveCb: PropTypes.func.isRequired,
    form: PropTypes.object.isRequired,
    isProfileUpdating: PropTypes.bool.isRequired,
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form, onClickSaveCb, updateProfileCb } = this.props;

    const fieldsValues = form.getFieldsValue();
    updateProfileCb(reshapeForProfile(fieldsValues));
    onClickSaveCb();
  };

  render() {
    const { data, onClickCancelCb, form, isProfileUpdating } = this.props;
    return (
      <Form onSubmit={this.handleSubmit} layout={'vertical'}>
        <Card
          loading={isProfileUpdating}
          title={<Title level={3}>Contact Information</Title>}
          className={'card'}
          bodyStyle={style.cardHeadStyleWhenEditing}
          extra={
            <Fragment>
              <Button className={'extra-button'} shape="round" onClick={onClickCancelCb}>
                Cancel
              </Button>
              <Button
                className={'extra-button'}
                type="primary"
                icon="check"
                shape="round"
                htmlType="submit"
              >
                Save
              </Button>
            </Fragment>
          }
        >
          <Row>
            <Col span={12} className={'main-left-col'}>
              <ContactInformationEditable data={data} parentForm={form} />
            </Col>
            <Col span={12} className={'find-me-col'}>
              <FindMeEditable parentForm={form} data={data} />
            </Col>
          </Row>
        </Card>
      </Form>
    );
  }
}

const ContactForm = Form.create({ name: 'contact_form' })(ContactEditForm);

export default ContactForm;
