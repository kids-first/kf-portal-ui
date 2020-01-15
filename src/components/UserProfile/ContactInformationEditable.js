import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Select } from 'antd';
import { ROLES } from 'common/constants';
import ContactEditablePlacesAutoComplete from './ContactEditablePlacesAutoComplete';
import AddressEditForm from 'components/UserProfile/AddressEditForm';
import './style.css';
import { isResearcher, showInstitution } from './utils';
import { ERROR_TOO_MANY_CHARACTERS } from "./constants";

const { Option } = Select;

const MAX_LENGTH_FIELD = 100;

const validateFields = (rule, value, callback) => {
  if (value && value.length > MAX_LENGTH_FIELD) {
    return callback(ERROR_TOO_MANY_CHARACTERS);
  }
  return callback();
};

class ContactInformationEditable extends Component {
  static propTypes = {
    data: PropTypes.shape({
      roles: PropTypes.arrayOf(PropTypes.string),
      title: PropTypes.string,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      phone: PropTypes.string,
      institution: PropTypes.string,
      department: PropTypes.string,
      eraCommonsID: PropTypes.string,
      institutionalEmail: PropTypes.string,
    }).isRequired,
    parentForm: PropTypes.object.isRequired,
  };

  setNewAddress = address => {
    const { parentForm } = this.props;
    const { setFieldsValue } = parentForm;

    const { fromEntries, entries } = Object;
    const addressWithNonEmptyFields = fromEntries(
      entries(address).filter(([, value]) => Boolean(value)),
    );

    setFieldsValue({ ...addressWithNonEmptyFields, addressLine2: undefined });
  };

  render() {
    const { data, parentForm } = this.props;
    const { getFieldDecorator } = parentForm;

    return (
      <div>
        <div>
          <Form.Item label="Title">
            {getFieldDecorator('title', {
              initialValue: data.title,
              rules: [{ required: true }],
            })(
              <Select size={'small'}>
                <Option value="">N/A</Option>
                <Option value="mr">Mr.</Option>
                <Option value="ms">Ms.</Option>
                <Option value="mrs">Mrs.</Option>
                <Option value="dr">Dr.</Option>
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="Profile Type">
            {getFieldDecorator('roles', {
              initialValue: data.roles[0],
              rules: [{ required: true }],
            })(
              <Select size={'small'}>
                {ROLES.map(({ type, displayName }) => (
                  <Option value={type} key={type}>
                    {displayName}
                  </Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Input.Group>
            <Form.Item label="First Name">
              {getFieldDecorator('firstName', {
                initialValue: data.firstName,
                rules: [{ required: true, message: 'first name is required' }, { validator: validateFields }],
              })(<Input size="small" />)}
            </Form.Item>
            <Form.Item label="Last Name">
              {getFieldDecorator('lastName', {
                initialValue: data.lastName,
                rules: [{ required: true, message: 'last name is required' }, { validator: validateFields }],
              })(<Input size="small" />)}
            </Form.Item>
            <Form.Item label="Suborganization/Department">
              {getFieldDecorator('department', {
                initialValue: data.department,
                rules: [{ required: false }, { validator: validateFields }],
              })(<Input size="small" />)}
            </Form.Item>
            {showInstitution(data) && (
              <Fragment>
                <Form.Item label="Institution/Organization">
                  {getFieldDecorator('institution', {
                    initialValue: data.institution,
                    rules: [{ required: false }, { validator: validateFields }],
                  })(<Input size="small" />)}
                </Form.Item>
                <Form.Item label="Institutional Email Address">
                  {getFieldDecorator('institutionalEmail', {
                    initialValue: data.institutionalEmail,
                    rules: [{ required: false }, { validator: validateFields }],
                  })(<Input size="small" />)}
                </Form.Item>
              </Fragment>
            )}
            {isResearcher(data) && (
              <Form.Item label="Job Title">
                {getFieldDecorator('jobTitle', {
                  initialValue: data.jobTitle,
                  rules: [{ required: false }, { validator: validateFields }],
                })(<Input size="small" />)}
              </Form.Item>
            )}
            <Form.Item label="Phone">
              {getFieldDecorator('phone', {
                initialValue: data.phone,
                rules: [{ required: false }, { validator: validateFields }],
              })(<Input size="small" />)}
            </Form.Item>
            <Form.Item label="ERA Commons ID">
              {getFieldDecorator('eraCommonsID', {
                initialValue: data.eraCommonsID,
                rules: [{ required: false }, { validator: validateFields }],
              })(<Input size="small" />)}
            </Form.Item>
          </Input.Group>
        </div>
        <div>
          <Form.Item label={'Search Location'}>
            <ContactEditablePlacesAutoComplete setAddressCb={this.setNewAddress} />
          </Form.Item>
        </div>
        <div className={'contact-edit-address-wrapper'}>
          <AddressEditForm
            parentForm={parentForm}
            validateFieldsCB={validateFields}
            addressLine1={data.addressLine1}
            addressLine2={data.addressLine2}
            city={data.city}
            country={data.country}
            state={data.state}
            zip={data.zip}
          />
        </div>
      </div>
    );
  }
}

export default ContactInformationEditable;
