import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Row, Input, Col, Form } from 'antd';

const AddressEditForm = ({ validateFieldsCB }) => {
  const commonRules = [
    { required: false },
    () => ({
      validator: validateFieldsCB,
    }),
  ];
  return (
    <Fragment>
      <Form.Item name="addressLine1" label="Address Line 1" rules={commonRules}>
        <Input size="small" />
      </Form.Item>
      <Form.Item name="addressLine2" label="Address Line 2" rules={commonRules}>
        <Input size="small" />
      </Form.Item>
      <Form.Item name="city" label="city" rules={commonRules}>
        <Input size="small" />
      </Form.Item>

      <Row type={'flex'} justify={'space-between'}>
        <Col span={11}>
          <Form.Item name="state" label="State/Province" rules={commonRules}>
            <Input size="small" />
          </Form.Item>
        </Col>
        <Col span={11}>
          <Form.Item name="zip" label="Zip/Postal Code" rules={commonRules}>
            <Input size="small" />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Form.Item name="country" label="Country" rules={commonRules}>
          <Input size="small" />
        </Form.Item>
      </Row>
    </Fragment>
  );
};

AddressEditForm.propTypes = {
  validateFieldsCB: PropTypes.func.isRequired,
};

export default AddressEditForm;
