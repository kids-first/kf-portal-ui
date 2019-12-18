import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Input, Col } from 'antd';

const AddressEditForm = props => {
  const { parentForm, addressLine1, addressLine2, city, country, state, zip } = props;
  const { getFieldDecorator } = parentForm;

  return (
    <Fragment>
      <Row>
        <Form.Item label="Address Line 1">
          {getFieldDecorator('addressLine1', {
            initialValue: addressLine1,
            rules: [
              {
                required: false,
              },
            ],
          })(<Input size={'large'} />)}
        </Form.Item>
      </Row>
      <Row>
        <Form.Item label="Address Line 2">
          {getFieldDecorator('addressLine2', {
            initialValue: addressLine2,
            rules: [
              {
                required: false,
              },
            ],
          })(<Input size={'large'} />)}
        </Form.Item>
      </Row>
      <Row>
        <Form.Item label="City">
          {getFieldDecorator('city', {
            initialValue: city,
            rules: [
              {
                required: false,
              },
            ],
          })(<Input size={'large'} />)}
        </Form.Item>
      </Row>
      <Row type={'flex'} justify={'space-between'}>
        <Col span={11}>
          <Form.Item label="State/Province">
            {getFieldDecorator('state', {
              initialValue: state,
              rules: [
                {
                  required: false,
                },
              ],
            })(<Input size={'large'} />)}
          </Form.Item>
        </Col>
        <Col span={11}>
          <Form.Item label="Zip/Postal Code">
            {getFieldDecorator('zip', {
              initialValue: zip,
              rules: [
                {
                  required: false,
                },
              ],
            })(<Input size={'large'} />)}
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Form.Item label="Country">
          {getFieldDecorator('country', {
            initialValue: country,
            rules: [
              {
                required: false,
              },
            ],
          })(<Input size={'large'} />)}
        </Form.Item>
      </Row>
    </Fragment>
  );
};

AddressEditForm.propTypes = {
  parentForm: PropTypes.object.isRequired,
  addressLine1: PropTypes.string,
  addressLine2: PropTypes.string,
  city: PropTypes.string,
  state: PropTypes.string,
  zip: PropTypes.string,
  country: PropTypes.string,
};

export default AddressEditForm;
