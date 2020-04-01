import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Row, Input, Col } from 'antd';

const AddressEditForm = props => {
  const {
    parentForm,
    addressLine1,
    addressLine2,
    city,
    country,
    state,
    zip,
    validateFieldsCB,
  } = props;

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
              { validator: validateFieldsCB },
            ],
          })(<Input size={'small'} />)}
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
              { validator: validateFieldsCB },
            ],
          })(<Input size={'small'} />)}
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
              { validator: validateFieldsCB },
            ],
          })(<Input size={'small'} />)}
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
                { validator: validateFieldsCB },
              ],
            })(<Input size={'small'} />)}
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
                { validator: validateFieldsCB },
              ],
            })(<Input size={'small'} />)}
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
              { validator: validateFieldsCB },
            ],
          })(<Input size={'small'} />)}
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
  validateFieldsCB: PropTypes.func.isRequired,
};

export default AddressEditForm;
