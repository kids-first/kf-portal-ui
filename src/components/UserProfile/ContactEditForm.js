import React, { Component, Fragment } from 'react';
import { Button, Card, Col, Form, Row, Typography } from 'antd';
import PropTypes from 'prop-types';
import ContactInformationEditable from 'components/UserProfile/ContactInformationEditable';
import FindMeEditable from './FindMeEditable';
const { Title } = Typography;

const reshapeForProfile = (fields) => {
  if (fields.roles && !Array.isArray(fields.roles)) {
    return ({...fields, roles: [fields.roles]})
  }
  return fields;
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

  state = {};

  render() {
    const { data, onClickCancelCb, form, isProfileUpdating } = this.props;
    return (
      <Form onSubmit={this.handleSubmit} layout={'vertical'}>
        <Card
          loading={isProfileUpdating}
          title={
            <Title
              level={3}
              style={{
                color: 'rgb(43, 56, 143)',
              }}
            >
              Contact Information
            </Title>
          }
          style={{
            width: '1200px',
            borderRadius: '10px',
          }}
          headStyle={{
            color: 'rgb(43, 56, 143)',
            backgroundColor: 'rgb(237,238,241)',
            paddingBottom: '14px',
            paddingTop: '14px',
            paddingLeft: '32px',
            paddingRight: '32px',
          }}
          bodyStyle={{
            padding: '32px',
          }}
          extra={
            <Fragment>
              <Button
                icon="edit"
                shape="round"
                style={{ color: 'white', backgroundColor: '#90278e' }}
                onClick={onClickCancelCb}
              >
                Cancel
              </Button>
              <Button
                icon="edit"
                shape="round"
                style={{ color: 'white', backgroundColor: '#90278e' }}
                htmlType="submit"
              >
                Save
              </Button>
            </Fragment>
          }
        >
          <Row>
            <Col span={16} style={{ paddingRight: '72px' }}>
              <ContactInformationEditable data={data} parentForm={form} />
            </Col>
            <Col
              span={8}
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
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
